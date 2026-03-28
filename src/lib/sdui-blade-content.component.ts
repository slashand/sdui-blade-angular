import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'sdui-blade-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClass()'
  },
  template: `<ng-content></ng-content>`
})
export class SduiBladeContentComponent {
  readonly customClass = input<string>('');
  readonly computedClass = computed(() => {
    return `sdui-blade-content-container ${this.customClass()}`;
  });
}
