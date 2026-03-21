import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface BladePivotTab {
  id: string;
  label: string;
}

@Component({
  selector: 'sdui-blade-pivot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sdui-blade-pivot flex items-center border-b border-[var(--th-border)] mb-4 w-full overflow-x-auto no-scrollbar">
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
  readonly tabs = input.required<BladePivotTab[]>();
  readonly activeId = input.required<string>();
  readonly activeIdChange = output<string>();

  getTabClass(tabId: string): string {
    const base = "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer";
    if (tabId === this.activeId()) {
      return `${base} border-[var(--th-text-primary)] text-[var(--th-text-primary)]`;
    }
    return `${base} border-transparent text-[var(--th-text-secondary)] hover:text-[var(--th-text-primary)] hover:border-[var(--th-text-secondary)]`;
  }
}
