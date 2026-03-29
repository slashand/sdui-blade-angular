import { Component, input, inject, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SduiBladeNode } from '@slashand/sdui-blade-core';
import { SduiBladeContentComponent, SduiBladeFooterComponent, SduiBladeHeaderComponent, SduiBladeService, SduiRendererComponent } from '@slashand/sdui-blade-angular';

/**
 * Root form blade renderer for the demonstrator.
 * Impact on others: Captures core Azure DOM bindings and wires them visually into the shell layout. 
 */
@Component({
  selector: 'app-mock-form-blade',
  standalone: true,
  imports: [SduiBladeHeaderComponent, SduiBladeContentComponent, SduiBladeFooterComponent, SduiRendererComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'sdui-mock-form-blade-host block w-full h-full flex flex-col'
  },
  template: `
    <div class="sdui-mock-blade-container flex flex-col flex-1 h-full min-h-0 w-full bg-[var(--sdui-panel-bg)] border-l border-[var(--sdui-border)] shadow-2xl text-[var(--sdui-text)]">
      <sdui-blade-header 
        [title]="props().title || 'Unknown'" 
        [subtitle]="props().subtitle || ''"
        (close)="bladeService.closeBlade(node().id)">
        
        <!-- MOCK AZURE SVG ICON -->
        <div icon class="sdui-mock-azure-icon w-[18px] h-[18px] text-[var(--sdui-primary)]">

          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
        </div>

        @if (!['small', 'menu'].includes(props().width || 'full')) {
          <!-- MOCK AZURE RIGHT TOOLBAR (e.g. Pin) -->
          <div toolbar class="sdui-mock-toolbar flex gap-2">
             <button aria-label="Pin blade" class="sdui-mock-toolbar-btn p-1 text-[var(--sdui-muted)] hover:text-[var(--sdui-text)] transition-colors cursor-pointer rounded-[2px]"><svg class="sdui-mock-toolbar-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></button>
          </div>

          <!-- MOCK AZURE PRIMARY ACTION BAR -->
          <div action-bar class="sdui-mock-action-bar flex items-center gap-1">
            <button aria-label="Refresh blade data" class="sdui-mock-action-btn flex items-center gap-1.5 px-[8px] py-[4px] text-[13px] font-medium text-[var(--sdui-text)] hover:bg-[var(--sdui-border)] rounded-[2px] transition-colors cursor-pointer"><svg class="sdui-mock-action-icon text-[var(--sdui-primary)]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
            <button aria-label="Delete blade item" class="sdui-mock-delete-btn flex items-center gap-1.5 px-[8px] py-[4px] text-[13px] font-medium text-[var(--sdui-text)] hover:bg-[var(--sdui-border)] rounded-[2px] transition-colors cursor-pointer"><svg class="sdui-mock-delete-icon text-[var(--sdui-primary)]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Delete</button>
          </div>
        }
      </sdui-blade-header>
        
      <sdui-blade-content customClass="p-[20px]">
        @for (child of node().children; track child.id) {
          <app-sdui-renderer [node]="child" />
        }
      </sdui-blade-content>

      @if ((props().width || 'full') !== 'full') {
        <sdui-blade-footer>
          <!-- Azure Disabled Primary Button Mock (Save) -->
          <button aria-label="Save changes" class="sdui-mock-save-btn bg-[var(--sdui-border)]/30 text-[var(--sdui-muted)] px-[18px] py-[6px] rounded-[2px] text-[13px] font-semibold flex items-center justify-center cursor-not-allowed border border-[var(--sdui-border)]">Save</button>
          <!-- Azure Active Secondary Button Mock (Cancel) -->
          <button aria-label="Discard changes" class="sdui-mock-discard-btn bg-transparent text-[var(--sdui-primary)] px-[18px] py-[6px] rounded-[2px] text-[13px] font-semibold transition-colors hover:bg-[var(--sdui-primary)]/10 border border-[var(--sdui-primary)] flex items-center justify-center cursor-pointer" (click)="bladeService.closeBlade(node().id)">Discard</button>
        </sdui-blade-footer>
      }
    </div>
  `
})
export class FormBladeComponent {
  /** Bound state machine orchestrator for dismissing this panel structurally. */
  public readonly bladeService = inject(SduiBladeService);
  /** The ingested core json properties for the blade context. */
  public readonly node = input.required<SduiBladeNode>();

  protected readonly props = computed(() => {
    return this.node().properties as unknown as { title?: string; subtitle?: string; width?: string };
  });
}
