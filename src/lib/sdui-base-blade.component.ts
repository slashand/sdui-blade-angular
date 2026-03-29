import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { BladeSize, bladeSizeClasses } from './sdui-blade.types';

/**
 * The visual HTML container for an individual Blade. 
 * Note: This is NOT the orchestrator. This is merely a presentation-layer wrapper to enforce 
 * the CSS box-model, shadow, and structural properties for whatever content is injected into it.
 * 
 * CORE RESPONSIBILITIES:
 * 1. Enforce strict mathematical bounding boxes (widths, max-widths, shrink values).
 * 2. Accept mapped generic dimensions and apply local CSS Custom Properties.
 */
@Component({
  selector: 'sdui-base-blade',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col flex-1 min-h-0' },
  template: `
    <div [class]="computedClass()">
      <ng-content></ng-content>
    </div>
  `
})
export class SduiBaseBladeComponent {
  /**
   * Resolves the final string of CSS classes combining the layout size boundaries and any custom overrides.
   * Functionality: Maps the `BladeSize` to the `bladeSizeClasses` lookup table.
   * Impact on others: Direct application of visual boundaries logic.
   */
  readonly computedClass = computed(() => {
    const sizeClass = bladeSizeClasses[this.size()];
    return `sdui-base-blade-container ${sizeClass} ${this.customClass()}`;
  });

  /**
   * Accepts optional exterior CSS utilities.
   * Functionality: Appends user-defined classes directly to the outermost wrapper.
   * Impact on others: Can be used to override shadow or border constants, though largely discouraged in the core protocol.
   */
  readonly customClass = input<string>('');

  /**
   * Defines the structural width and maximum expansion of the blade.
   * Functionality: Accepts a strictly typed `BladeSize` token (e.g. 'full', 'menu', 'large').
   * Impact on others: Alters the `sdui-base-blade-container` CSS which mathematically dictates the flexible sliding grid calculation in `sdui-blade-host`.
   */
  readonly size = input<BladeSize>('full');
}
