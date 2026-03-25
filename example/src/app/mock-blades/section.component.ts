import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SduiSection } from '@slashand/sdui-blade-core';
import { SduiRendererComponent } from '../../../../src/public-api';

/**
 * Structural container for rendering vertically stacked sub-layouts.
 * Impact on others: Creates a designated grouping boundary with explicit bottom margins for visual separation.
 */
@Component({
  selector: 'app-mock-section',
  standalone: true,
  imports: [CommonModule, SduiRendererComponent],
  template: `
    <div class="sdui-mock-section-container mb-[24px]">
      <h2 class="sdui-mock-section-title text-[13px] font-semibold text-[var(--sdui-text)] mb-3">{{ node().properties?.title }}</h2>
      <div class="sdui-mock-section-content flex flex-col gap-[16px]">
        @for (child of node().children; track child.id) {
          <app-sdui-renderer [node]="child" />
        }
      </div>
    </div>
  `
})
export class SectionComponent {
  /** Node pipeline containing child topological arrays. */
  public readonly node = input.required<SduiSection>();
}
