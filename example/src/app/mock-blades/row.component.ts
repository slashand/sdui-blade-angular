import { Component, input } from '@angular/core';
import { SduiNode } from '@slashand/sdui-blade-core';
import { SduiRendererComponent } from '@slashand/sdui-blade-angular';

/**
 * Mathematical horizontal flex distributor for composite children.
 * Impact on others: Flattens its child node layout into an equidistant horizontal flex container.
 */
@Component({
  selector: 'app-mock-row',
  standalone: true,
  imports: [SduiRendererComponent],
  template: `
    <div class="sdui-mock-row-container flex flex-row items-center gap-2">
      @for (child of node().children; track child.id) {
        <app-sdui-renderer class="flex-1" [node]="child" />
      }
    </div>
  `
})
export class RowComponent {
  /** Node pipeline containing deeply nested recursive topological layouts. */
  public readonly node = input.required<SduiNode>();
}
