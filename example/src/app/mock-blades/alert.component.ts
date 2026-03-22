import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SduiAlert } from '@slashand/sdui-blade-core';

@Component({
  selector: 'app-mock-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 rounded border text-sm" [class]="computedClass()">
      {{ node().properties.message }}
    </div>
  `
})
export class AlertComponent {
  public readonly node = input.required<SduiAlert>();
  
  intent() {
    return this.node().properties.type || 'info';
  }

  computedClass() {
    switch(this.intent()) {
      case 'warning': return 'bg-[var(--sdui-warning-bg)] border-[var(--sdui-warning-border)] text-[var(--sdui-warning-text)]';
      case 'error': return 'bg-[var(--sdui-error-bg)] border-[var(--sdui-error-border)] text-[var(--sdui-error-text)]';
      default: return 'bg-[var(--sdui-info-bg)] border-[var(--sdui-info-border)] text-[var(--sdui-info-text)]';
    }
  }
}
