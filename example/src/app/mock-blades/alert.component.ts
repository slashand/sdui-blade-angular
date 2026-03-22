import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SduiBladeNode } from '@slashand/sdui-blade-core';

@Component({
  selector: 'app-mock-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 rounded border text-sm" [class]="computedClass()">
      {{ node().props?.['message'] }}
    </div>
  `
})
export class AlertComponent {
  public readonly node = input.required<SduiBladeNode>();
  
  intent() {
    return this.node().props?.['intent'] || 'info';
  }

  computedClass() {
    switch(this.intent()) {
      case 'warning': return 'bg-amber-500/10 border-amber-500/50 text-amber-500';
      case 'error': return 'bg-red-500/10 border-red-500/50 text-red-500';
      default: return 'bg-blue-500/10 border-blue-500/50 text-blue-500';
    }
  }
}
