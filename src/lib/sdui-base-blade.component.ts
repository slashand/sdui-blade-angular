import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type BladeSize = 'menu' | 'small' | 'medium' | 'large' | 'xlarge' | 'full';

const bladeSizeClasses: Record<BladeSize, string> = {
    menu: 'w-full max-w-[265px] shrink',
    small: 'w-full max-w-[315px] shrink',
    medium: 'w-full max-w-[585px] shrink',
    large: 'w-full max-w-[855px] shrink',
    xlarge: 'w-full max-w-[1125px] shrink',
    full: 'w-full flex-1 shrink',
};

// -------------------------------------------------------------------------------------------------
// 1. BASE BLADE
// -------------------------------------------------------------------------------------------------
@Component({
  selector: 'sdui-base-blade',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass()">
      <ng-content></ng-content>
    </div>
  `
})
export class SduiBaseBladeComponent {
  readonly size = input<BladeSize>('large');
  readonly customClass = input<string>('');

  readonly computedClass = computed(() => {
    const sizeClass = bladeSizeClasses[this.size()];
    return `flex flex-col h-full bg-[var(--th-panel-bg)] text-[var(--th-text-primary)] shadow-2xl border-l border-[var(--th-border)] ml-auto overflow-hidden ${sizeClass} ${this.customClass()}`;
  });
}
