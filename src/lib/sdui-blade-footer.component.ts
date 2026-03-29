import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * The default, sticky action shelf positioned at the bottom of any Blade.
 * 
 * CORE RESPONSIBILITIES:
 * 1. Pin critical commands (Save, Cancel, Submit) to the bottom of the viewport so they never scroll out of view.
 * 2. Abstract away flexbox justification logic via strict semantic alignment parameters.
 */
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
  /** 
   * Alignment mapping constraint. Defaults to 'left'. 
   * Functionality: Accepts union strings mapping to flex layouts.
   * Impact on others: Triggers CSS utility classes to shift children logically.
   */
  readonly align = input<'left' | 'right' | 'center' | 'between'>('left');

  /**
   * Resolves the final CSS string incorporating the specific flex layout logic.
   * Functionality: Maps the alignment string to structural CSS grid classes.
   * Impact on others: Updates the direct bounding box of the footer's projected elements.
   */
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

  /** 
   * Escape hatch for custom utility classes. 
   * Functionality: Applies styles directly to the internal tracking wrapper.
   * Impact on others: Allows consumers to inject background colors or non-breaking stylistic overrides.
   */
  readonly customClass = input<string>('');
}
