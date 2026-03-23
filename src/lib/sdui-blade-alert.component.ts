import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BladeAlertType = 'error' | 'warning' | 'info' | 'success';

@Component({
  selector: 'sdui-blade-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass()">
      <div class="flex flex-col">
        @if (title()) {
          <h4 class="font-semibold text-sm mb-0.5">{{ title() }}</h4>
        }
        <div class="text-sm opacity-90"><ng-content></ng-content></div>
      </div>
    </div>
  `
})
export class SduiBladeAlertComponent {
  readonly type = input<BladeAlertType>('info');
  readonly title = input<string>();
  
  readonly computedClass = computed(() => {
    const bgClasses = {
      error: 'bg-[var(--sdui-error-bg)] border-[var(--sdui-error-border)] text-[var(--sdui-error-text)]',
      warning: 'bg-[var(--sdui-warning-bg)] border-[var(--sdui-warning-border)] text-[var(--sdui-warning-text)]',
      info: 'bg-[var(--sdui-info-bg)] border-[var(--sdui-info-border)] text-[var(--sdui-info-text)]',
      success: 'bg-[var(--sdui-success-bg)] border-[var(--sdui-success-border)] text-[var(--sdui-success-text)]'
    };
    return `sdui-blade-alert flex items-start p-3 mb-4 rounded-md border ${bgClasses[this.type()]}`;
  });
}
