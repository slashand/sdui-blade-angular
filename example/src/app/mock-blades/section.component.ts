import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SduiElement } from '@slashand/sdui-blade-core';
import { SduiRendererComponent } from '../../../../src/public-api';

@Component({
  selector: 'app-mock-section',
  standalone: true,
  imports: [CommonModule, SduiRendererComponent],
  template: `
    <div class="mb-8">
      <h2 class="text-lg font-semibold border-b border-zinc-800 pb-2 mb-4">{{ node().props?.['title'] }}</h2>
      <div class="flex flex-col gap-4">
        @for (child of node().props?.['children']; track $index) {
          <app-sdui-renderer [node]="child" />
        }
      </div>
    </div>
  `
})
export class SectionComponent {
  public readonly node = input.required<SduiElement>();
}
