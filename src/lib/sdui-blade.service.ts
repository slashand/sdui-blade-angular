import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, PlatformLocation } from '@angular/common';
import { SduiBladeNode } from '@slashand/sdui-blade-core';

/**
 * Native Angular v21 Signal-based service orchestrating the SDUI JSON logic.
 * (We avoid Zustand in Angular in favor of native reactive primitives).
 */
@Injectable({
  providedIn: 'root'
})
export class SduiBladeService {
  private readonly _activeBlades = signal<Required<SduiBladeNode>[]>([]);
  public readonly activeBlades = this._activeBlades.asReadonly();
  public readonly hasActiveBlades = computed(() => this._activeBlades().length > 0);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly platformLocation = inject(PlatformLocation);
  private isProgrammaticBack = false;

  private serializeToHash(nodes: Required<SduiBladeNode>[]): string {
    if (nodes.length === 0) return '';
    const segments = nodes.map(b => {
      let seg = String(b.type);
      if (b.properties && Object.keys(b.properties).length > 0) {
          const pairs: string[] = [];
          for (const [k, v] of Object.entries(b.properties)) {
              if (typeof v !== 'object' && v !== undefined && v !== null) {
                  pairs.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
              }
          }
          if (pairs.length > 0) seg += `(${pairs.join(',')})`;
      }
      return seg;
    });
    return '#' + segments.join('/');
  }

  private deserializeFromHash(hash: string): Required<SduiBladeNode>[] {
    const cleanHash = hash.replace(/^#/, '');
    if (!cleanHash) return [];
    return cleanHash.split('/').map(seg => {
        let type = seg;
        const properties: Record<string, any> = {};
        const paren = seg.indexOf('(');
        if (paren > -1 && seg.endsWith(')')) {
            type = seg.substring(0, paren);
            const pairsStr = seg.substring(paren + 1, seg.length - 1);
            pairsStr.split(',').forEach(p => {
                const [k, v] = p.split('=');
                if (k && v !== undefined) properties[decodeURIComponent(k)] = decodeURIComponent(v);
            });
        }
        return {
            id: `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            type,
            properties,
            children: []
        } as unknown as Required<SduiBladeNode>;
    });
  }

  private updateURLHash(nodes: Required<SduiBladeNode>[], replace = false) {
      if (!isPlatformBrowser(this.platformId)) return;
      const newHash = this.serializeToHash(nodes);
      const url = this.platformLocation.pathname + this.platformLocation.search + newHash;
      
      if (replace) {
          this.platformLocation.replaceState(null, '', url);
      } else {
          this.platformLocation.pushState(null, '', url);
      }
  }

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Hydrate from #hash on initial load
      const initialHash = this.platformLocation.hash;
      if (initialHash) {
          this._activeBlades.set(this.deserializeFromHash(initialHash));
      }

      this.platformLocation.onPopState(() => {
        if (this.isProgrammaticBack) {
          this.isProgrammaticBack = false;
          return;
        }
        
        // Browser back/forward triggered. Match app state to the URL.
        const hash = this.platformLocation.hash;
        const currentHash = this.serializeToHash(this._activeBlades());
        
        if (hash !== currentHash) {
            const hydrated = this.deserializeFromHash(hash);
            const currentBlades = this._activeBlades();
            
            // Re-hydrate while preserving complex objects that won't survive a URL roundtrip
            const merged = hydrated.map((hydratedNode, index) => {
                const existing = currentBlades[index];
                if (existing && existing.type === hydratedNode.type) {
                    return existing;
                }
                return hydratedNode;
            });
            
            this._activeBlades.set(merged);
        }
      });
    }
  }

  /**
   * Pushes a new blade onto the stack or updates the topmost blade in-place.
   * Impact on others: Triggers `updateURLHash` which writes the exact topological hierarchy into the browser History.
   */
  openBlade(node: SduiBladeNode): void {
    const id = node.id || `${node.type}-${Date.now()}`;
    
    this._activeBlades.update((blades: Required<SduiBladeNode>[]) => {
      const lastBlade = blades[blades.length - 1];
      // Prevent stacking the EXACT SAME IDENTIFIER consecutively
      if (lastBlade && lastBlade.id === id) {
        // Safe update in place, don't flood history
        const newBlades = [...blades];
        newBlades[newBlades.length - 1] = { ...lastBlade, properties: node.properties || {}, children: node.children || lastBlade.children } as unknown as Required<SduiBladeNode>;
        this.updateURLHash(newBlades, true);
        return newBlades;
      }
      
      const newBlades = [...blades, { id, type: node.type, properties: node.properties || {}, children: node.children || [] } as unknown as Required<SduiBladeNode>];
      this.updateURLHash(newBlades, false);
      return newBlades;
    });
  }

  closeBlade(id: string): void {
    const blades = this._activeBlades();
    const index = blades.findIndex(b => b.id === id);
    if (index > -1) {
       const newBlades = blades.slice(0, index);
       if (isPlatformBrowser(this.platformId)) {
           const bladesClosed = blades.length - index;
           this.isProgrammaticBack = true;
           history.go(-bladesClosed);
       }
       this._activeBlades.set(newBlades);
    }
  }

  closeTopBlade(): void {
    const blades = this._activeBlades();
    if (blades.length > 0) {
      if (isPlatformBrowser(this.platformId)) {
        this.isProgrammaticBack = true;
        this.platformLocation.back();
      }
      this._activeBlades.set(blades.slice(0, -1));
    }
  }

  closeAllBlades(): void {
    const count = this._activeBlades().length;
    if (count > 0) {
      if (isPlatformBrowser(this.platformId)) {
        this.isProgrammaticBack = true;
        history.go(-count);
      }
      this._activeBlades.set([]);
    }
  }

  /**
   * Instantly overrides the entire active blade pipeline with a hardcoded topological array.
   * Impact: This clears all existing DOM portals and replaces the History state deterministically.
   */
  setBlades(blades: SduiBladeNode[]): void {
    const typed = blades as Required<SduiBladeNode>[];
    this._activeBlades.set(typed);
    this.updateURLHash(typed, true);
  }

  /**
   * Formally resets the blade stack and drops a new root domain into the initial pipeline index.
   * Impact on others: Required whenever switching Core Pillar applications (e.g., leaving Logistics for Cybersecurity).
   */
  setAppBlade(blade: SduiBladeNode): void {
    const id = blade.id || `${blade.type}-${Date.now()}`;
    const parsedBlade = { ...blade, id, properties: blade.properties || {} } as Required<SduiBladeNode>;
    this._activeBlades.set([parsedBlade]);
    this.updateURLHash([parsedBlade], true);
  }

  updateBladeProperties(id: string, properties: Partial<SduiBladeNode['properties']>): void {
    this._activeBlades.update((blades: Required<SduiBladeNode>[]) => {
      const index = blades.findIndex(b => b.id === id);
      if (index > -1) {
        const newBlades = [...blades];
        const existingNode = newBlades[index];
        newBlades[index] = {
           ...existingNode,
           properties: { ...(existingNode.properties || {}), ...properties }
        } as unknown as Required<SduiBladeNode>;
        // Use replace = true so partial layout tweaks don't flood the browser Back navigation stack
        this.updateURLHash(newBlades, true);
        return newBlades;
      }
      return blades;
    });
  }
}
