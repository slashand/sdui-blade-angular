import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'sdui-blade-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sdui-blade-header sticky top-0 bg-[var(--th-panel-bg)]/90 backdrop-blur z-10 border-b border-[var(--th-border)] min-h-[64px] px-[20px] shrink-0 flex items-center justify-between">
      <div class="sdui-blade-title flex items-center gap-3">
        <!-- ICON SLOT -->
        <ng-content select="[icon]"></ng-content>
        <div class="sdui-blade-title-text-group flex flex-col">
          <h2 class="sdui-blade-title-text text-lg font-bold tracking-tight text-[var(--th-text-primary)] leading-tight">{{ title() }}</h2>
          @if (subtitle()) {
            <p class="sdui-blade-subtitle-text text-xs text-[var(--th-text-secondary)] mt-0.5">{{ subtitle() }}</p>
          }
        </div>
      </div>
      
      <div class="sdui-blade-actions flex items-center gap-3">
        <!-- COMMANDS SHELF -->
        <div class="sdui-blade-commands flex items-center gap-2 border-r border-[var(--th-border)] pr-3 mr-1 empty:hidden">
            <ng-content select="[commands]"></ng-content>
        </div>
        
        <ng-content></ng-content>
        
        @if (showClose()) {
          <button 
            (click)="close.emit()"
            class="sdui-blade-close p-1.5 rounded-md hover:bg-[var(--th-element-bg)] text-[var(--th-text-secondary)] hover:text-[var(--th-text-primary)] transition-colors cursor-pointer"
            aria-label="Close Blade">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
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
