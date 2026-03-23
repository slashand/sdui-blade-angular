import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sdui-blade-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sdui-blade-footer-container flex-shrink-0 bg-[var(--th-panel-bg,#1e293b)] border-t border-[var(--th-border,#334155)] px-[20px] py-[15px] flex items-center justify-end z-10 w-full shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
      <ng-content></ng-content>
    </div>
  `
})
export class SduiBladeFooterComponent {}
