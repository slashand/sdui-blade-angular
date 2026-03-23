import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'sdui-blade-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex-1 min-h-0 flex flex-col'
  },
  template: `
    <div [class]="computedClass()">
      <ng-content></ng-content>
    </div>
  `
})
export class SduiBladeContentComponent {
  readonly customClass = input<string>('');
  readonly computedClass = computed(() => {
    return `flex-1 overflow-y-auto no-scrollbar py-[16px] px-[24px] flex flex-col gap-[20px] ${this.customClass()}`;
  });
}
