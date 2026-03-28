import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, PlatformLocation } from '@angular/common';
import { SduiBladeNode } from '@slashand/sdui-blade-core';

/**
 * [SERVICE]
 * SduiBladeService
 * 
 * Native Angular v21 Signal-based service orchestrating the SDUI JSON logic and Blade Stack pipeline.
 * (We avoid Zustand in Angular in favor of native reactive primitives).
 * 
 * CORE RESPONSIBILITIES:
 * 1. Maintain the `activeBlades` Signal, identifying the precise deterministic layout state of the Journey Protocol.
 * 2. Handle programmatic push, pop, and reset methods for transient layout elements.
 * 
 * DESIGN PATTERN: SINGLETON
 * 
 * file: src/lib/sdui-blade.service.ts
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
    // Transient blades or sidebars should not pollute the shareable URL
    const validNodes = nodes.filter(bladeNode => {
      const props = bladeNode.properties as Record<string, unknown> | undefined;
      return !props?.['isTransient'] && !props?.['skipUrl'];
    });
    if (validNodes.length === 0) return '';
    
    const segments = validNodes.map(bladeNode => {
      let segment = String(bladeNode.type);
      if (bladeNode.properties && Object.keys(bladeNode.properties).length > 0) {
          const pairs: string[] = [];
          for (const [propertyKey, propertyValue] of Object.entries(bladeNode.properties)) {
              if (propertyKey !== 'isTransient' && propertyKey !== 'skipUrl' && typeof propertyValue !== 'object' && propertyValue !== undefined && propertyValue !== null) {
                  pairs.push(`${encodeURIComponent(propertyKey)}=${encodeURIComponent(String(propertyValue))}`);
              }
          }
          if (pairs.length > 0) segment += `(${pairs.join(',')})`;
      }
      return segment;
    });
    return '#' + segments.join('/');
  }

  private deserializeFromHash(hash: string): Required<SduiBladeNode>[] {
    const cleanHash = hash.replace(/^#/, '');
    if (!cleanHash) return [];
    return cleanHash.split('/').map(segment => {
        let type = segment;
        const properties: Record<string, any> = {};
        const paren = segment.indexOf('(');
        if (paren > -1 && segment.endsWith(')')) {
            type = segment.substring(0, paren);
            const pairsStr = segment.substring(paren + 1, segment.length - 1);
            pairsStr.split(',').forEach(pairString => {
                const [propertyKey, propertyValue] = pairString.split('=');
                if (propertyKey && propertyValue !== undefined) properties[decodeURIComponent(propertyKey)] = decodeURIComponent(propertyValue);
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

  constructor() {
    // History Tracking logic removed.
    // Abstract systems should avoid interacting with `window.history` as host frameworks (React/Angular) handle this synchronously.
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
        return newBlades;
      }
      
      const newBlades = [...blades, { id, type: node.type, properties: node.properties || {}, children: node.children || [] } as unknown as Required<SduiBladeNode>];
      return newBlades;
    });
  }

  closeBlade(id: string): void {
    const blades = this._activeBlades();
    const index = blades.findIndex(bladeNode => bladeNode.id === id);
    if (index > -1) {
       const newBlades = blades.slice(0, index);
       this._activeBlades.set(newBlades);
    }
  }

  closeTopBlade(): void {
    const blades = this._activeBlades();
    if (blades.length > 0) {
      const newBlades = blades.slice(0, -1);
      this._activeBlades.set(newBlades);
    }
  }

  closeAllBlades(): void {
    if (this._activeBlades().length > 0) {
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
  }

  /**
   * Formally resets the blade stack and drops a new root domain into the initial pipeline index.
   * Impact on others: Required whenever switching Core Pillar applications (e.g., leaving Logistics for Cybersecurity).
   */
  setAppBlade(blade: SduiBladeNode): void {
    const id = blade.id || `${blade.type}-${Date.now()}`;
    const parsedBlade = { ...blade, id, properties: blade.properties || {} } as Required<SduiBladeNode>;
    this._activeBlades.set([parsedBlade]);
  }

  updateBladeProperties(id: string, properties: Partial<SduiBladeNode['properties']>): void {
    this._activeBlades.update((blades: Required<SduiBladeNode>[]) => {
      const index = blades.findIndex(bladeNode => bladeNode.id === id);
      if (index > -1) {
        const newBlades = [...blades];
        const existingNode = newBlades[index];
        newBlades[index] = {
           ...existingNode,
           properties: { ...(existingNode.properties || {}), ...properties }
        } as unknown as Required<SduiBladeNode>;
        // Use replace = true so partial layout tweaks don't flood the browser Back navigation stack
        return newBlades;
      }
      return blades;
    });
  }
}
