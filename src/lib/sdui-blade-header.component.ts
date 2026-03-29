import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * The default, accessible title bar and action shelf for any Blade.
 * 
 * CORE RESPONSIBILITIES:
 * 1. Render spatial titles and subtitles based on the SduiBlade properties.
 * 2. Manage the close action emitting back to the blade service.
 * 3. Provide strict content projection slots allowing developers to nest arbitrary 
 *    commands, icons, and status badges without breaking layout constraints.
 */
@Component({
  selector: 'sdui-blade-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'sdui-blade-header-host block' },
  template: `
    <div class="sdui-blade-header">
      <div class="sdui-blade-title">
        <!-- ICON START SLOT -->
        <ng-content select="[icon], [icon-left]"></ng-content>
        <div class="sdui-blade-title-text-group">
          <!-- The Title Row -->
          <div class="sdui-blade-title-row flex flex-wrap items-center gap-[4px] min-w-0">
            <ng-content select="[title-left]"></ng-content>
            @if (title()) {
              <h2 class="sdui-blade-title-text">{{ title() }}</h2>
            }
            <ng-content select="[custom-title-text]"></ng-content>
            <ng-content select="[title-right]"></ng-content>
          </div>
          
          <!-- The Subtitle Row -->
          <div class="sdui-blade-subtitle-row">
            <ng-content select="[subtitle-left]"></ng-content>
            @if (subtitle()) {
              <p class="sdui-blade-subtitle-text">{{ subtitle() }}</p>
            }
            <ng-content select="[custom-subtitle]"></ng-content>
            <ng-content select="[subtitle-right]"></ng-content>
          </div>
          <!-- CUSTOM TITLE SLOT -->
          <ng-content select="[custom-title]"></ng-content>
        </div>
        <!-- ICON END SLOT -->
        <ng-content select="[icon-right]"></ng-content>
      </div><!-- TITLE GROUP END -->
      
      <div class="sdui-blade-actions">
        <!-- COMMANDS SHELF -->
        <div class="sdui-blade-commands">
            <ng-content select="[commands]"></ng-content>
        </div>
        
        <ng-content></ng-content>
        
        @if (showClose()) {
          <button type="button"
            (click)="onClose()"
            class="sdui-blade-close"
            aria-label="Close Blade">
              <svg class="sdui-blade-close-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="sdui-blade-close-icon-path-1" d="M18 6 6 18"/><path class="sdui-blade-close-icon-path-2" d="m6 6 12 12"/></svg>
          </button>
        }
      </div>
    </div>
  `
})
export class SduiBladeHeaderComponent {
  /**
   * Synthetic event fired when the native close button is pressed.
   * Functionality: Gives host mock blades control over closing operations independently.
   * Impact on others: Forces the developer using this `<sdui-blade-header>` to manually call the `SduiBladeService.closeBlade()` method.
   */
  readonly close = output<void>();

  /**
   * Forwards the GUI click out to the component's output binding.
   * Functionality: Emits the `close` event without internally interacting with the Blade Service directly.
   * Impact on others: Maintains pure, dumb component status for the header itself.
   */
  onClose() {
    this.close.emit();
  }

  /**
   * Toggles the rendering of the default native Close button ('X').
   * Functionality: Controls whether the user can manually dismiss the blade from the header.
   * Impact on others: If false, the blade must be closed programmatically by the application via `close` emitter or `closeBlade()`.
   */
  readonly showClose = input<boolean>(true);

  /**
   * Defines the secondary contextual text of the blade.
   * Functionality: Displays directly beneath the title in a smaller font.
   * Impact on others: Often used to show entity IDs or active sub-paths without polluting the main title.
   */
  readonly subtitle = input<string>();

  /**
   * Defines the primary display text of the blade.
   * Functionality: Automatically maps to a specifically styled `h2` element.
   * Impact on others: Visually anchors the spatial context of the blade for the user.
   */
  readonly title = input<string>();
}
