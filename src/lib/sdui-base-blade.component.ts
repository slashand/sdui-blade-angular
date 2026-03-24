import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type BladeSize = 'menu' | 'small' | 'medium' | 'large' | 'xlarge' | 'full';

const bladeSizeClasses: Record<BladeSize, string> = {
    menu: 'w-full max-w-[var(--sdui-blade-w-menu,265px)] shrink',
    small: 'w-full max-w-[var(--sdui-blade-w-small,315px)] shrink',
    medium: 'w-full max-w-[var(--sdui-blade-w-medium,585px)] shrink',
    large: 'w-full max-w-[var(--sdui-blade-w-large,855px)] shrink',
    xlarge: 'w-full max-w-[var(--sdui-blade-w-xlarge,1125px)] shrink',
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
  readonly size = input<BladeSize>('full');
  readonly customClass = input<string>('');

  readonly computedClass = computed(() => {
    const sizeClass = bladeSizeClasses[this.size()];
    return `sdui-base-blade-container flex flex-col h-full bg-[var(--th-panel-bg,#1f2937)] text-[var(--th-text-primary,#f9fafb)] shadow-2xl border-l border-[var(--th-border,#374151)] ml-auto overflow-hidden ${sizeClass} ${this.customClass()}`;
  });
}
