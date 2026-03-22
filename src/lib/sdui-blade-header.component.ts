import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'sdui-blade-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sdui-blade-header sticky top-0 bg-[var(--th-panel-bg)]/95 backdrop-blur z-20 pt-[24px] px-[28px] pb-[16px] shrink-0 relative">
      <div class="sdui-blade-title flex flex-col">
        <!-- ICON SLOT -->
        <ng-content select="[icon]"></ng-content>
        <div class="sdui-blade-title-text-group flex flex-col">
          <h2 class="sdui-blade-title-text text-[22px] font-semibold tracking-normal text-[var(--th-text-primary)] leading-tight">{{ title() }}</h2>
          @if (subtitle()) {
            <p class="sdui-blade-subtitle-text text-[13px] text-[var(--th-text-secondary)] mt-1">{{ subtitle() }}</p>
          }
        </div>
      </div>
      
      <div class="sdui-blade-actions mt-4 flex items-center gap-4 text-[13px]">
        <!-- COMMANDS SHELF (AZURE COMMAND BAR) -->
        <ng-content select="[commands]"></ng-content>
        <ng-content></ng-content>
      </div>

      <!-- ABSOLUTE CLOSE BUTTON (AZURE SPEC) -->
      @if (showClose()) {
        <button 
          (click)="close.emit()"
          class="sdui-blade-close absolute top-[20px] right-[20px] p-2 rounded-sm hover:bg-[var(--th-element-bg)] text-[var(--th-text-secondary)] hover:text-[var(--th-text-primary)] transition-colors cursor-pointer"
          aria-label="Close Blade">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      }
    </div>
  `
})
export class SduiBladeHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly showClose = input<boolean>(true);
  readonly close = output<void>();
}
