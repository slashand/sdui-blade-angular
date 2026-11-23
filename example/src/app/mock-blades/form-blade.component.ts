import { Component, input, inject, computed, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SduiBladeNode } from '@slashand/sdui-blade-core';
import {
  SduiBaseBladeComponent,
  SduiBladeContentComponent,
  SduiBladeFooterComponent,
  SduiBladeHeaderComponent,
  SduiBladeService,
  SduiRendererComponent,
} from '@slashand/sdui-blade-angular';
import { OmniverseBladeComponent } from '../omniverse-blade.component';

/**
 * Root form blade renderer for the demonstrator.
 * Impact on others: Captures core Azure DOM bindings and wires them visually into the shell layout.
 */
@Component({
  selector: 'app-mock-form-blade',
  standalone: true,
  imports: [SduiBaseBladeComponent, SduiBladeHeaderComponent, SduiBladeContentComponent, SduiBladeFooterComponent, SduiRendererComponent, OmniverseBladeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'sdui-mock-form-blade-host block w-full h-full flex flex-col',
  },
  template: `
    @if (props().omniverse) {
      <app-omniverse-blade [node]="node()" />
    } @else {
    <sdui-base-blade size="full">
      <sdui-blade-header
        [title]="props().title || 'Unknown'"
        [subtitle]="props().subtitle || ''"
      >
        <!-- MOCK AZURE SVG ICON -->
        <div icon class="sdui-mock-azure-icon w-[18px] h-[18px] text-[var(--sdui-primary)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
            />
          </svg>
        </div>

        @if (!['small', 'menu'].includes(props().width || 'full')) {
          <!-- MOCK AZURE RIGHT TOOLBAR (e.g. Pin) -->
          <div toolbar class="sdui-mock-toolbar flex gap-2">
            <button
              type="button"
              [attr.aria-label]="pinned() ? 'Unpin blade' : 'Pin blade'"
              [attr.aria-pressed]="pinned()"
              (click)="pinned.set(!pinned())"
              class="sdui-mock-toolbar-btn p-1 text-[var(--sdui-muted)] hover:text-[var(--sdui-text)] transition-colors cursor-pointer rounded-[2px]"
            >
              <svg
                class="sdui-mock-toolbar-svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </button>
          </div>

          <!-- MOCK AZURE PRIMARY ACTION BAR -->
          <div action-bar class="sdui-mock-action-bar flex items-center gap-1">
            <button
              aria-label="Refresh blade data"
              type="button"
              (click)="refreshCount.update((count) => count + 1)"
              class="sdui-mock-action-btn flex items-center gap-1.5 px-[8px] py-[4px] text-[13px] font-medium text-[var(--sdui-text)] hover:bg-[var(--sdui-border)] rounded-[2px] transition-colors cursor-pointer"
            >
              <svg
                class="sdui-mock-action-icon text-[var(--sdui-primary)]"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Refresh
            </button>
            <button
              type="button"
              [attr.aria-label]="contentsVisible() ? 'Hide demo content' : 'Restore demo content'"
              (click)="contentsVisible.set(!contentsVisible())"
              class="sdui-mock-delete-btn flex items-center gap-1.5 px-[8px] py-[4px] text-[13px] font-medium text-[var(--sdui-text)] hover:bg-[var(--sdui-border)] rounded-[2px] transition-colors cursor-pointer"
            >
              <svg
                class="sdui-mock-delete-icon text-[var(--sdui-primary)]"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              {{ contentsVisible() ? 'Hide' : 'Restore' }}
            </button>
          </div>
        }
      </sdui-blade-header>

      <sdui-blade-content customClass="p-[20px]">
        @if (pinned() || refreshCount() || !contentsVisible()) {
          <p role="status" class="sdui-mock-demo-status">
            {{ pinned() ? 'Pinned locally. ' : '' }}
            {{ refreshCount() ? 'Preview refreshed ' + refreshCount() + ' time(s). ' : '' }}
            {{ contentsVisible() ? '' : 'Demo content hidden; use Restore to show it again.' }}
          </p>
        }
        @if (contentsVisible()) {
          @for (child of node().children; track child.id) {
            <app-sdui-renderer [node]="child" />
          }
        }
      </sdui-blade-content>

      @if ((props().width || 'full') !== 'full') {
        <sdui-blade-footer>
          <!-- Azure Disabled Primary Button Mock (Save) -->
          <button
            aria-label="Save changes"
            type="button"
            disabled
            title="No editable changes in this sizing demo"
            class="sdui-mock-save-btn bg-[var(--sdui-border)]/30 text-[var(--sdui-muted)] px-[18px] py-[6px] rounded-[2px] text-[13px] font-semibold flex items-center justify-center cursor-not-allowed border border-[var(--sdui-border)]"
          >
            Save
          </button>
          <!-- Azure Active Secondary Button Mock (Cancel) -->
          <button
            aria-label="Discard changes"
            type="button"
            class="sdui-mock-discard-btn bg-transparent text-[var(--sdui-primary)] px-[18px] py-[6px] rounded-[2px] text-[13px] font-semibold transition-colors hover:bg-[var(--sdui-primary)]/10 border border-[var(--sdui-primary)] flex items-center justify-center cursor-pointer"
            (click)="bladeService.closeBlade(node().id)"
          >
            Discard
          </button>
        </sdui-blade-footer>
      }
    </sdui-base-blade>
    }
  `,
})
export class FormBladeComponent {
  readonly bladeId = input<string>();
  readonly inputs = input<unknown>();
  /** Bound state machine orchestrator for dismissing this panel structurally. */
  public readonly bladeService = inject(SduiBladeService);
  /** The ingested core json properties for the blade context. */
  public readonly node = input.required<SduiBladeNode>();
  protected readonly pinned = signal(false);
  protected readonly refreshCount = signal(0);
  protected readonly contentsVisible = signal(true);

  protected readonly props = computed(() => {
    return this.node().properties as unknown as { title?: string; subtitle?: string; width?: string; omniverse?: boolean };
  });
}
