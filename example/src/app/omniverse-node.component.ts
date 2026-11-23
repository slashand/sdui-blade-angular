import { Component, computed, ElementRef, forwardRef, input, inject, signal } from '@angular/core';
import { SduiBladeNode, SduiElementType, SduiNode } from '@slashand/sdui-blade-core';
import { SduiBladeService } from '@slashand/sdui-blade-angular';

type DemoColumn = { key: string; name: string };

@Component({
  selector: 'app-omniverse-node',
  standalone: true,
  imports: [forwardRef(() => OmniverseNodeComponent)],
  template: `
    @switch (node().type) {
      @case (types.Section) {
        <section class="omniverse-section">
          @if (props()['title']) { <h3>{{ props()['title'] }}</h3> }
          @for (child of children(); track child.id) { <app-omniverse-node [node]="child" /> }
        </section>
      }
      @case (types.Grid) {
        <div class="omniverse-grid" [style.--grid-columns]="props()['columns'] || 2">
          @for (child of children(); track child.id) { <app-omniverse-node [node]="child" /> }
        </div>
      }
      @case (types.Row) {
        <div class="omniverse-row">
          @for (child of children(); track child.id) { <app-omniverse-node [node]="child" /> }
        </div>
      }
      @case (types.Alert) {
        <div class="omniverse-alert" [attr.data-intent]="props()['type'] || 'info'" role="status">
          @if (props()['title']) { <strong>{{ props()['title'] }}</strong> }
          <span>{{ props()['message'] }}</span>
        </div>
      }
      @case (types.StatusBadge) {
        <span class="omniverse-badge" [attr.data-intent]="props()['status'] || 'info'">{{ props()['text'] }}</span>
      }
      @case (types.Text) { <p class="omniverse-text">{{ props()['value'] }}</p> }
      @case (types.Button) {
        <div class="omniverse-action">
          <button type="button" class="omniverse-button" [disabled]="!props()['action']" (click)="activate()">{{ props()['label'] }}</button>
          @if (actionStatus()) { <span class="omniverse-action-status" role="status">{{ actionStatus() }}</span> }
        </div>
      }
      @case (types.Pivot) {
        <div class="omniverse-pivot" role="tablist" aria-label="{{ props()['title'] || 'Sections' }}">
          @for (item of items(); track item.targetId) {
            <button type="button" role="tab" [attr.aria-selected]="$index === activeTab()" (click)="activeTab.set($index)">{{ item.title }}</button>
          }
        </div>
      }
      @case (types.DataGrid) {
        <div class="omniverse-table-scroll"><table class="omniverse-table">
          <thead><tr>@for (column of columns(); track column.key) { <th scope="col">{{ column.name }}</th> }</tr></thead>
          <tbody>@for (row of rows(); track $index) { <tr>@for (column of columns(); track column.key) { <td>{{ row[column.key] }}</td> }</tr> }</tbody>
        </table></div>
      }
      @case (types.ExtensionMount) {
        <div class="omniverse-extension" [attr.data-mount]="props()['mountPoint']" role="img" [attr.aria-label]="extensionLabel()">
          <span class="omniverse-extension-label">{{ extensionLabel() }}</span>
          @for (bar of chartBars; track $index) { <span class="omniverse-candle" [class.up]="bar > 0" [style.height.%]="bar > 0 ? bar : -bar"></span> }
        </div>
      }
      @default {
        @for (child of children(); track child.id) { <app-omniverse-node [node]="child" /> }
      }
    }
  `,
})
export class OmniverseNodeComponent {
  readonly node = input.required<SduiNode>();
  readonly types = SduiElementType;
  readonly chartBars = [44, 69, 32, -71, 47, 73, -65, 52, 69, -54, 74, 61];
  readonly activeTab = signal(0);
  readonly actionStatus = signal('');
  private readonly blades = inject(SduiBladeService);
  private readonly element = inject(ElementRef<HTMLElement>);
  readonly props = computed(() => (this.node().properties || {}) as Record<string, any>);
  readonly children = computed(() => this.node().children || []);
  readonly columns = computed(() => (this.props()['columns'] || []) as DemoColumn[]);
  readonly rows = computed(() => (this.props()['rows'] || []) as Record<string, unknown>[]);
  readonly items = computed(() => (this.props()['items'] || []) as { title: string; targetId: string }[]);
  readonly extensionLabel = computed(() => String(this.props()['mountPoint'] || 'Interactive extension').replaceAll('_', ' '));

  activate(): void {
    const action = this.props()['action'] as { type?: string; payload?: SduiBladeNode; endpoint?: string; target?: string } | undefined;
    if (action?.type === 'navigate' && action.payload) {
      this.blades.openBlade({
        ...action.payload,
        properties: { ...action.payload.properties, omniverse: true } as SduiBladeNode['properties'],
      });
      return;
    }
    if (action?.type === 'close') {
      if (action.target === 'all') this.blades.closeAllBlades();
      else if (action.target) this.blades.closeBlade(action.target);
      else this.blades.closeTopBlade();
      return;
    }
    if (action?.type === 'dispatch' || action?.type === 'invoke' || action?.type === 'api') {
      this.element.nativeElement.dispatchEvent(new CustomEvent('sdui:action', {
        bubbles: true,
        detail: { nodeId: this.node().id, action },
      }));
      this.actionStatus.set(action.type === 'api'
        ? 'Demo request emitted. No backend is connected.'
        : 'Demo action emitted; no backend call. The blade remains open.');
    }
  }
}
