import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'sdui-blade-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass()">
      <ng-content></ng-content>
    </div>
  `
})
export class SduiBladeFooterComponent {
  /** Alignment of footer contents. Defaults to 'left'. */
  readonly align = input<'left' | 'right' | 'center' | 'between'>('left');
  
  /** Escape hatch for custom utility classes. */
  readonly customClass = input<string>('');

  readonly computedClass = computed(() => {
    let alignClass = '';
    switch (this.align()) {
      case 'left': alignClass = 'sdui-align-left'; break;
      case 'right': alignClass = 'sdui-align-right'; break;
      case 'center': alignClass = 'sdui-align-center'; break;
      case 'between': alignClass = 'sdui-align-between'; break;
    }
    return `sdui-blade-footer-container ${alignClass} ${this.customClass()}`;
  });
}
