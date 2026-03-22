import { Component, input, inject } from '@angular/core';
import { SduiNode, SduiBladeNode } from '@slashand/sdui-blade-core';
import { SduiBladeService } from '../../../../src/public-api';

@Component({
  selector: 'app-mock-button',
  standalone: true,
  template: `
    <button 
      (click)="onClick()"
      class="mt-4 px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md shadow-sm cursor-pointer hover:opacity-90 transition-opacity font-medium text-sm">
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
