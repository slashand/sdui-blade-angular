import { CommonModule } from '@angular/common';
import { Component, input, inject } from '@angular/core';
import { SduiBladeNode } from '@slashand/sdui-blade-core';
import { SduiBladeContentComponent, SduiBladeHeaderComponent, SduiBladeService, SduiRendererComponent } from '../../../../src/public-api';

@Component({
  selector: 'app-mock-form-blade',
  standalone: true,
  imports: [CommonModule, SduiBladeHeaderComponent, SduiBladeContentComponent, SduiRendererComponent],
  host: {
    class: 'block w-full h-full flex flex-col'
  },
  template: `
    <div class="flex flex-col flex-1 h-full min-h-0 w-full text-[var(--sdui-text)]">
      <sdui-blade-header 
        [title]="$any(node().properties['title'] || 'Unknown')" 
        [subtitle]="$any(node().properties['subtitle'])"
        (close)="bladeService.closeBlade(node().id)" />
        
      <sdui-blade-content customClass="p-[20px]">
        @for (child of node().children; track child.id) {
          <app-sdui-renderer [node]="child" />
        }
      </sdui-blade-content>
    </div>
  `
})
export class FormBladeComponent {
  public readonly node = input.required<SduiBladeNode>();
  public readonly bladeService = inject(SduiBladeService);
}
