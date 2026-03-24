/**
 * [RENDERER]
 * [SduiRendererComponent]
 * 
 * Recursive Server-Driven UI component parser. Ingests raw SDUI JSON nodes
 * and maps them to physical Angular components natively mounted via dynamic outlets.
 * 
 * CORE RESPONSIBILITIES:
 * 1. Read the `node.type` and map it against the static BLADE_REGISTRY.
 * 2. Unpack lazy-loaded promises into native Angular Types.
 * 3. Mount the physical component and pass the raw JSON node back into its properties.
 * 
 * DESIGN PATTERN: RECURSIVE ENGINE
 *
 * file: src/lib/sdui-renderer.component.ts
 */
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Type, effect, input, signal } from '@angular/core';
import { SduiNode } from '@slashand/sdui-blade-core';
import { BLADE_REGISTRY } from './sdui-blade-registry';

@Component({
  selector: 'app-sdui-renderer',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (resolvedComponent()) {
      <ng-container *ngComponentOutlet="resolvedComponent()!; inputs: getComponentInputs(node())"></ng-container>
    } @else {
      <!-- Fallback gracefully into an error boundary for unmapped JSON nodes -->
      <div class="w-full text-xs text-[var(--sdui-error-text)] border border-dashed border-[var(--sdui-error-border)] p-2">
        <span class="font-bold">Missing Registry Loader:</span> {{ node().type }}
      </div>
    }
  `
})
export class SduiRendererComponent {
  /** The direct JSON payload chunk fed from the orchestrator */
  public readonly node = input.required<SduiNode>();
  
  /** The actively resolved native Angular Class representing the node type */
  protected readonly resolvedComponent = signal<Type<unknown> | null>(null);

  protected getComponentInputs(node: SduiNode): Record<string, unknown> {
    return {
      bladeId: node.id,
      ...(node.properties || {})
    };
  }

  constructor() {
    // Whenever the input node updates (e.g. from parent state changes), re-evaluate the registry
    effect(() => {
      const currentType = this.node().type;
      const loader = BLADE_REGISTRY.getLoader(currentType);
      
      if (loader) {
        loader().then(componentClass => {
          this.resolvedComponent.set(componentClass);
        });
      } else {
        this.resolvedComponent.set(null);
        console.warn(`[SDUI Renderer Engine] Node Type not mapped in registry: '${currentType}'`);
      }
    });
  }
}
