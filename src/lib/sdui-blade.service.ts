import { Injectable, signal, computed } from '@angular/core';
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

  openBlade(node: SduiBladeNode): void {
    const id = node.id || `${node.type}-${Date.now()}`;
    
    this._activeBlades.update(blades => {
      const lastBlade = blades[blades.length - 1];
      // Prevent consecutive duplicates by updating props instead
      if (lastBlade && lastBlade.id === id) {
        const newBlades = [...blades];
        newBlades[newBlades.length - 1] = { ...lastBlade, properties: node.properties, children: node.children || [] } as Required<SduiBladeNode>;
        return newBlades;
      }
      return [...blades, { ...node, id, properties: node.properties, children: node.children || [] } as Required<SduiBladeNode>];
    });
  }

  closeBlade(id: string): void {
    this._activeBlades.update(blades => {
      const index = blades.findIndex(b => b.id === id);
      if (index === -1) return blades;
      // Journey Protocol: Closing a parent implicitly closes all subsequent child blades spawned from it.
      return blades.slice(0, index);
    });
  }

  closeTopBlade(): void {
    this._activeBlades.update(blades => blades.slice(0, -1));
  }

  closeAllBlades(): void {
    this._activeBlades.set([]);
  }

  /**
   * Declaratively overwrites the entire memory array.
   * Required for pristine URL hydration when the user clicks a root Sidenav entry 
   * to instantly destroy the previous journey. 
   */
  setBlades(nodes: SduiBladeNode[]): void {
    const formatted = nodes.map(n => ({ ...n, id: n.id || `${n.type}-${Date.now()}`, properties: n.properties, children: n.children || [] } as Required<SduiBladeNode>));
    this._activeBlades.set(formatted);
  }
}
