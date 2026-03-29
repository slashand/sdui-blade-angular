import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BladeAlertType = 'error' | 'warning' | 'info' | 'success';

/**
 * Renders an inline contextual alert block within the SDUI layout.
 * 
 * CORE RESPONSIBILITIES:
 * 1. Present warnings, errors, or informational messages natively using the SDUI color palette.
*/
@Component({
  selector: 'sdui-blade-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass()">
      <div class="sdui-blade-alert-content flex flex-col">
        @if (title()) {
          <h4 class="sdui-blade-alert-title font-semibold text-sm mb-0.5">{{ title() }}</h4>
        }
        <div class="sdui-blade-alert-message text-sm opacity-90"><ng-content></ng-content></div>
      </div>
    </div>
  `
})
export class SduiBladeAlertComponent {
  /**
   * Defines the optional heading text of the alert.
   * Functionality: Conditionally renders a strongly formatted `h4` tag inside the alert block.
   * Impact on others: Pushes the primary inner content (`ng-content`) downwards.
   */
  readonly title = input<string>();

  /**
   * Sets the semantic tone of the alert, determining its color profile.
   * Functionality: Drives the `computedClass` signal to switch background and border utilities.
   * Impact on others: N/A (Self-contained styling).
   */
  readonly type = input<BladeAlertType>('info');

  /**
   * Resolves the final Tailwind string for the wrapper element.
   * Functionality: Maps the `type` input to its respective error/warning/info/success classes.
   * Impact on others: Dictates the visual border constraint and text coloring of the alert body.
   */
  readonly computedClass = computed(() => {
    const bgClasses = {
      error: 'bg-red-500/10 border-red-500/20 text-red-400',
      warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    };
    return `sdui-blade-alert flex items-start p-3 mb-4 rounded-md border ${bgClasses[this.type()]}`;
  });
}
