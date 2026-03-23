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

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.platformLocation.onPopState(() => {
        if (this.isProgrammaticBack) {
          this.isProgrammaticBack = false;
          return;
        }
        
        // User clicked Browser Back button.
        // Pop the top blade without firing another back navigation.
        if (this._activeBlades().length > 0) {
           this._activeBlades.update((blades: Required<SduiBladeNode>[]) => blades.slice(0, -1));
        }
      });
    }
  }

  openBlade(node: SduiBladeNode): void {
    const id = node.id || `${node.type}-${Date.now()}`;
    
    this._activeBlades.update((blades: Required<SduiBladeNode>[]) => {
      const lastBlade = blades[blades.length - 1];
      if (lastBlade && lastBlade.type === node.type) {
        const newBlades = [...blades];
        newBlades[newBlades.length - 1] = { ...lastBlade, properties: node.properties };
        return newBlades;
      }
      
      if (isPlatformBrowser(this.platformId)) {
        // Push a dummy state so the browser back button can be intercepted
        this.platformLocation.pushState({ sduiBladeOpen: id }, '', this.platformLocation.href);
      }
      return [...blades, { id, type: node.type, properties: node.properties, children: node.children || [] } as Required<SduiBladeNode>];
    });
  }

  closeBlade(id: string): void {
    const count = this._activeBlades().length;
    // Note: Targeted internal blade closures break linear history,
    // so we simply do a programmatic back for the single step if we are on top
    if (isPlatformBrowser(this.platformId) && count > 0) {
      const blades = this._activeBlades();
      if (blades[blades.length - 1].id === id) {
        this.isProgrammaticBack = true;
        this.platformLocation.back();
      }
    }
    this._activeBlades.update((blades: Required<SduiBladeNode>[]) => blades.filter(bladeNode => bladeNode.id !== id));
  }

  closeTopBlade(): void {
    if (isPlatformBrowser(this.platformId) && this._activeBlades().length > 0) {
      this.isProgrammaticBack = true;
      this.platformLocation.back();
    }
    this._activeBlades.update((blades: Required<SduiBladeNode>[]) => blades.slice(0, -1));
  }

  closeAllBlades(): void {
    const count = this._activeBlades().length;
    if (isPlatformBrowser(this.platformId) && count > 0) {
      this.isProgrammaticBack = true;
      history.go(-count);
    }
    this._activeBlades.set([]);
  }
}
