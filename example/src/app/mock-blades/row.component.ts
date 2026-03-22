import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SduiNode } from '@slashand/sdui-blade-core';
import { SduiRendererComponent } from '../../../../src/public-api';

@Component({
  selector: 'app-mock-row',
  standalone: true,
  imports: [CommonModule, SduiRendererComponent],
  template: `
    <div class="flex flex-row items-center gap-2">
      @for (child of node().children; track child.id) {
        <app-sdui-renderer class="flex-1" [node]="child" />
      }
    </div>
  `
})
export class RowComponent {
  public readonly node = input.required<SduiNode>();
}
