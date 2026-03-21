import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sdui-blade-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex-shrink-0 bg-[var(--th-panel-bg)] border-t border-[var(--th-border)] px-[20px] py-[15px] flex items-center justify-end z-10 w-full shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
      <ng-content></ng-content>
    </div>
  `
})
export class SduiBladeFooterComponent {}
