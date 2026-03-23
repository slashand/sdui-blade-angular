import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'sdui-blade-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sdui-blade-header sticky top-0 bg-[var(--sdui-panel-bg)] z-20 pt-[11px] px-[16px] pb-[11px] shrink-0 border-b border-[var(--sdui-border)] relative flex flex-col gap-[11px]">
      <!-- ROW 1: Title & Toolbar -->
      <div class="sdui-blade-title-row flex items-start justify-between">
        <div class="sdui-blade-title-group flex items-center gap-[8px]">
          <!-- ICON SLOT -->
          <ng-content select="[icon]"></ng-content>
          <div class="sdui-blade-text flex flex-col">
            <h2 class="text-[17px] font-semibold tracking-normal text-[var(--sdui-text)] leading-none">{{ title() }}</h2>
            @if (subtitle()) {
              <p class="text-[12px] text-[var(--sdui-muted)] mt-1 leading-none">{{ subtitle() }}</p>
            }
          </div>
        </div>
        
        <div class="sdui-blade-toolbar flex items-center gap-2 pr-[24px]">
          <!-- COMMANDS SHELF (AZURE RIGHT TOOLBAR: Pin, Feedback) -->
          <ng-content select="[toolbar]"></ng-content>
        </div>
      </div>
      
      <!-- ROW 2: Primary Action Bar -->
      <div class="sdui-blade-actions flex items-center gap-4 text-[13px]">
        <!-- AZURE COMMAND BAR (Refresh, Delete, Add tags) -->
        <ng-content select="[action-bar]"></ng-content>
        <ng-content></ng-content>
      </div>

      <!-- ABSOLUTE CLOSE BUTTON (AZURE SPEC) -->
      @if (showClose()) {
        <button 
          (click)="close.emit()"
          class="sdui-blade-close absolute top-[11px] right-[11px] p-[2px] rounded-[2px] text-[var(--sdui-muted)] hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] transition-colors cursor-pointer"
          aria-label="Close Blade">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
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
