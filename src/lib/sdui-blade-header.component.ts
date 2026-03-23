import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'sdui-blade-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sdui-blade-header sticky top-0 bg-[var(--th-panel-bg,#1e293b)]/90 backdrop-blur z-10 border-b border-[var(--th-border,#334155)] min-h-[64px] px-[20px] shrink-0 flex items-center justify-between">
      <div class="sdui-blade-title flex items-center gap-3">
        <!-- ICON SLOT -->
        <ng-content select="[icon]"></ng-content>
        <div class="sdui-blade-title-text-group flex flex-col">
          <h2 class="sdui-blade-title-text text-lg font-bold tracking-tight text-[var(--th-text-primary,#f8fafc)] leading-tight">{{ title() }}</h2>
          @if (subtitle()) {
            <p class="sdui-blade-subtitle-text text-xs text-[var(--th-text-secondary,#94a3b8)] mt-0.5">{{ subtitle() }}</p>
          }
        </div>
      </div>
      
      <div class="sdui-blade-actions flex items-center gap-3">
        <!-- COMMANDS SHELF -->
        <div class="sdui-blade-commands flex items-center gap-2 border-r border-[var(--th-border,#334155)] pr-3 mr-1 empty:hidden">
            <ng-content select="[commands]"></ng-content>
        </div>
        
        <ng-content></ng-content>
        
        @if (showClose()) {
          <button 
            (click)="close.emit()"
            class="sdui-blade-close p-1.5 rounded-md hover:bg-[var(--th-element-bg,#475569)] text-[var(--th-text-secondary,#94a3b8)] hover:text-[var(--th-text-primary,#f8fafc)] transition-colors cursor-pointer"
            aria-label="Close Blade">
              <svg class="sdui-blade-close-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="sdui-blade-close-icon-path-1" d="M18 6 6 18"/><path class="sdui-blade-close-icon-path-2" d="m6 6 12 12"/></svg>
          </button>
        }
      </div>
    </div>
  `
})
export class SduiBladeHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly showClose = input<boolean>(true);
  readonly close = output<void>();
}
