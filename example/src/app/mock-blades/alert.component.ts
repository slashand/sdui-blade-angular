import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SduiElement } from '@slashand/sdui-blade-core';

@Component({
  selector: 'app-mock-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 rounded border text-sm"
         [ngClass]="{
           'bg-amber-500/10 border-amber-500/50 text-amber-500': intent() === 'warning',
           'bg-red-500/10 border-red-500/50 text-red-500': intent() === 'error',
           'bg-blue-500/10 border-blue-500/50 text-blue-500': intent() === 'info'
         }">
      {{ node().props?.['message'] }}
    </div>
  `
})
export class AlertComponent {
  public readonly node = input.required<SduiElement>();
  
  intent() {
    return this.node().props?.['intent'] || 'info';
  }
}
