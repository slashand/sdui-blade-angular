import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SduiBladeNode } from '@slashand/sdui-blade-core';
import { SduiBladeHeaderComponent, SduiBladeContentComponent, SduiRendererComponent, SduiBladeService } from '../../../../src/public-api';

@Component({
  selector: 'app-mock-form-blade',
  standalone: true,
  imports: [CommonModule, SduiBladeHeaderComponent, SduiBladeContentComponent, SduiRendererComponent],
  template: `
    <div class="flex flex-col h-full bg-zinc-950 text-white shadow-2xl border-l border-zinc-800">
      <app-sdui-blade-header 
        [title]="node().props?.['title'] || 'Untitled Blade'" 
        [subtitle]="node().props?.['subtitle']"
        (close)="bladeService.closeBlade(node().id!)" />
        
      <app-sdui-blade-content class="p-6">
        @for (child of node().props?.['children']; track $index) {
          <app-sdui-renderer [node]="child" />
        }
      </app-sdui-blade-content>
    </div>
  `
})
export class FormBladeComponent {
  public readonly node = input.required<SduiBladeNode>();
  public readonly bladeService = inject(SduiBladeService);
}
