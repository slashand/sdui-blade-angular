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
    return `sdui-blade-content-container flex-1 overflow-y-auto no-scrollbar pt-[10px] px-[20px] pb-[20px] flex flex-col gap-4 ${this.customClass()}`;
  });
}
