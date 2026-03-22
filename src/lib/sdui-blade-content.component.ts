import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'sdui-blade-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass()">
      <ng-content></ng-content>
    </div>
  `
})
export class SduiBladeContentComponent {
  readonly customClass = input<string>('');
  readonly computedClass = computed(() => {
    return `flex-1 overflow-y-auto no-scrollbar pt-[8px] px-[28px] pb-[28px] flex flex-col gap-[20px] ${this.customClass()}`;
  });
}
