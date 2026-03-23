import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'sdui-blade-loading',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isLoading()) {
      <div class="sdui-blade-loading absolute inset-0 z-50 bg-[var(--th-panel-bg)]/60 backdrop-blur-sm flex flex-col items-center justify-center">
          <svg class="sdui-blade-loading-spinner animate-spin h-8 w-8 text-[var(--th-text-primary)] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="sdui-blade-loading-spinner-circle opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="sdui-blade-loading-spinner-path opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          @if (text()) {
            <span class="sdui-blade-loading-text text-sm font-medium text-[var(--th-text-primary)]">{{ text() }}</span>
          }
      </div>
    }
  `
})
export class SduiBladeLoadingComponent {
  readonly isLoading = input<boolean>(false);
  readonly text = input<string>();
}
