import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BladeAlertType = 'error' | 'warning' | 'info' | 'success';

@Component({
  selector: 'sdui-blade-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass()">
      <div class="sdui-blade-alert-content flex flex-col">
        @if (title()) {
          <h4 class="sdui-blade-alert-title font-semibold text-sm mb-0.5">{{ title() }}</h4>
        }
        <div class="sdui-blade-alert-message text-sm opacity-90"><ng-content></ng-content></div>
      </div>
    </div>
  `
})
export class SduiBladeAlertComponent {
  readonly type = input<BladeAlertType>('info');
  readonly title = input<string>();

  readonly computedClass = computed(() => {
    const bgClasses = {
      error: 'bg-red-500/10 border-red-500/20 text-red-400',
      warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    };
    return `sdui-blade-alert flex items-start p-3 mb-4 rounded-md border ${bgClasses[this.type()]}`;
  });
}
