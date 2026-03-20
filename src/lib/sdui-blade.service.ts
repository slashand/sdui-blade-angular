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
      if (lastBlade && lastBlade.type === node.type) {
        const newBlades = [...blades];
        newBlades[newBlades.length - 1] = { ...lastBlade, props: node.props || {} };
        return newBlades;
      }
      return [...blades, { id, type: node.type, props: node.props || {} }];
    });
  }

  closeBlade(id: string): void {
    this._activeBlades.update(blades => blades.filter(b => b.id !== id));
  }

  closeTopBlade(): void {
    this._activeBlades.update(blades => blades.slice(0, -1));
  }

  closeAllBlades(): void {
    this._activeBlades.set([]);
  }
}
