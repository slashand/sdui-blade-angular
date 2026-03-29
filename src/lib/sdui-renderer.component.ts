/**
 * Recursive Server-Driven UI component parser. Ingests raw SDUI JSON nodes
 * and maps them to physical Angular components natively mounted via dynamic outlets.
 * 
 * CORE RESPONSIBILITIES:
 * 1. Read the `node.type` and map it against the static BLADE_REGISTRY.
 * 2. Unpack lazy-loaded promises into native Angular Types.
 * 3. Mount the physical component and pass the raw JSON node back into its properties.
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
  /**
   * The direct JSON payload chunk fed from the orchestrator.
   * Functionality: The core reactive string evaluated by the registry effect listener.
   * Impact on others: Drives the component mounting. Can cause recursive mounts if children are present.
   */
  public readonly node = input.required<SduiNode>();

  /**
   * The actively resolved native Angular Class representing the node type.
   * Functionality: A reactive signal resolving when the asynchronous `BLADE_REGISTRY.getLoader` promise returns.
   * Impact on others: Serves as the dynamic Component type inside the `*ngComponentOutlet`.
   */
  protected readonly resolvedComponent = signal<Type<unknown> | null>(null);

  /**
   * Formats the extracted mapped properties back out into the native Angular `@input()`.
   * Functionality: Isolates the inputs needed for `*ngComponentOutlet`.
   * Impact on others: Determines which arguments the dynamic child wrapper will receive.
   */
  protected getComponentInputs(node: SduiNode): Record<string, unknown> {
    return {
      node: node
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
