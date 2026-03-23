import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SduiSection } from '@slashand/sdui-blade-core';
import { SduiRendererComponent } from '../../../../src/public-api';

@Component({
  selector: 'app-mock-section',
  standalone: true,
  imports: [CommonModule, SduiRendererComponent],
  template: `
    <div class="mb-[24px]">
      <h2 class="text-[13px] font-semibold text-[var(--sdui-text)] mb-3">{{ node().properties?.title }}</h2>
      <div class="flex flex-col gap-[16px]">
        @for (child of node().children; track child.id) {
          <app-sdui-renderer [node]="child" />
        }
      </div>
    </div>
  `
})
export class SectionComponent {
  public readonly node = input.required<SduiSection>();
}
