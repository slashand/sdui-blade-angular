import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface BladePivotTab {
  id: string;
  label: string;
}

/**
 * A horizontal tabbed navigation interface adapted from Microsoft's Fluent UI "Pivot" pattern.
 * 
 * CORE RESPONSIBILITIES:
 * 1. Allow structural navigation between internal data contexts within the same Blade instance without generating new blade contexts.
 * 2. Ensure CSS classes apply correctly for the active state via pure bindings.
 */
@Component({
  selector: 'sdui-blade-pivot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sdui-blade-pivot flex items-center border-b border-[var(--th-border,#334155)] mb-4 w-full overflow-x-auto no-scrollbar">
      @for (tab of tabs(); track tab.id) {
        <button
            (click)="activeIdChange.emit(tab.id)"
            [class]="getTabClass(tab.id)">
            {{ tab.label }}
        </button>
      }
    </div>
  `
})
export class SduiBladePivotComponent {
  /**
   * The currently active tab ID. Must match one of the tokens inside the `tabs` array.
   * Functionality: Compared internally during the `getTabClass` rendering phase.
   * Impact on others: Drives the active border and text color rendering for the highlighted tab.
   */
  readonly activeId = input.required<string>();

  /**
   * Emitted when the user explicitly clicks a non-active tab button.
   * Functionality: Dispatches the underlying string ID up to the parent controller.
   * Impact on others: Parent components typically bind this to `($event) => activeId.set($event)` to drive the view layout.
   */
  readonly activeIdChange = output<string>();

  /**
   * The array of structural tab definitions.
   * Functionality: Unwinds into the `@for` loop to build the physical DOM buttons.
   * Impact on others: N/A
   */
  readonly tabs = input.required<BladePivotTab[]>();

  /**
   * Derives the required Tailwind CSS utilities for a specific tab button.
   * Functionality: Combines base transitions with conditional active/inactive colors.
   * Impact on others: Overrides the visual default browser styles for native HTML `<button>` elements.
   * @param tabId The specific ID being evaluated.
   */
  getTabClass(tabId: string): string {
    const base = "sdui-blade-pivot-tab px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer";
    if (tabId === this.activeId()) {
      return `${base} border-[var(--th-text-primary,#f8fafc)] text-[var(--th-text-primary,#f8fafc)]`;
    }
    return `${base} border-transparent text-[var(--th-text-secondary,#94a3b8)] hover:text-[var(--th-text-primary,#f8fafc)] hover:border-[var(--th-text-secondary,#94a3b8)]`;
  }
}
