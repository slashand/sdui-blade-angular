import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * The dedicated scrollable viewport inside a generic Blade structure.
 * 
 * CORE RESPONSIBILITIES:
 * 1. Isolate the CSS `overflow-y: auto` boundary away from the blade host, ensuring headers and footers remain sticky.
 * 2. Serve as the default injection zone for all standard form, text, or list content.
 */
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
  /**
   * Resolves the final string of CSS classes combining the foundational `sdui-blade-content-container` and custom styles.
   * Functionality: Joins internal strict SDK styles with consumer styles.
   * Impact on others: Binds directly to the Angular host element.
   */
  readonly computedClass = computed(() => {
    return `sdui-blade-content-container ${this.customClass()}`;
  });

  /**
   * Accepts optional exterior CSS utilities.
   * Functionality: Appends user-defined classes to the inner scrolling container.
   * Impact on others: Essential for adding padding, gap, or flex direction without breaking the structural bounds.
   */
  readonly customClass = input<string>('');
}
