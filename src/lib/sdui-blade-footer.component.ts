import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'sdui-blade-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex-shrink-0 bg-[var(--sdui-panel-bg)] px-[24px] py-[16px] flex items-center justify-start gap-2 z-10 w-full"
      [class.border-t]="showBorder()"
      [class.border-[var(--sdui-border)]]="showBorder()"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class SduiBladeFooterComponent {
  readonly showBorder = input<boolean>(false);
}
