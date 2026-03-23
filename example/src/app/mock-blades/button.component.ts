import { Component, input, inject } from '@angular/core';
import { SduiNode, SduiBladeNode } from '@slashand/sdui-blade-core';
import { SduiBladeService } from '../../../../src/public-api';

@Component({
  selector: 'app-mock-button',
  standalone: true,
  template: `
    <button 
      (click)="onClick()"
      class="mt-2 flex items-center gap-[6px] px-[16px] py-[6px] bg-transparent text-[13px] text-[var(--sdui-text)] font-medium rounded-[2px] border border-[var(--sdui-border)] hover:bg-[var(--sdui-border)] transition-colors cursor-pointer w-fit">
      <!-- MOCK AZURE SVG ICON -->
      <svg class="text-[var(--sdui-primary)]" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      {{ $any(node().properties?.['label']) || 'Action' }}
    </button>
  `
})
export class ButtonComponent {
  public readonly node = input.required<SduiNode>();
  private readonly bladeService = inject(SduiBladeService);

  onClick() {
    const action = this.node().properties?.['actionPayload'] as SduiBladeNode | undefined;
    if (action) {
      this.bladeService.openBlade(action);
    }
  }
}
