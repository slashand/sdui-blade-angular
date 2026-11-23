import { Component, computed, input } from '@angular/core';
import { SduiBladeNode, SduiNode } from '@slashand/sdui-blade-core';
import {
  SduiBaseBladeComponent,
  SduiBladeContentComponent,
  SduiBladeFooterComponent,
  SduiBladeHeaderComponent,
} from '@slashand/sdui-blade-angular';
import { OmniverseNodeComponent } from './omniverse-node.component';

@Component({
  selector: 'app-omniverse-blade',
  standalone: true,
  imports: [
    SduiBaseBladeComponent,
    SduiBladeHeaderComponent,
    SduiBladeContentComponent,
    SduiBladeFooterComponent,
    OmniverseNodeComponent,
  ],
  host: { style: 'display: contents' },
  template: `
    <sdui-base-blade size="full">
      <sdui-blade-header [title]="props()['title'] || 'Workspace'" [subtitle]="props()['subtitle'] || ''">
        <div commands class="omniverse-toolbar">
          @for (action of toolbar(); track action.id) { <app-omniverse-node [node]="action" /> }
        </div>
      </sdui-blade-header>
      <sdui-blade-content customClass="omniverse-content">
        @for (child of node().children || []; track child.id) { <app-omniverse-node [node]="child" /> }
      </sdui-blade-content>
      @if (footer().length) {
        <sdui-blade-footer align="right">
          @for (action of footer(); track action.id) { <app-omniverse-node [node]="action" /> }
        </sdui-blade-footer>
      }
    </sdui-base-blade>
  `,
})
export class OmniverseBladeComponent {
  readonly node = input.required<SduiBladeNode>();
  readonly props = computed(() => (this.node().properties || {}) as Record<string, any>);
  readonly toolbar = computed(() => (this.props()['toolbar'] || []) as SduiNode[]);
  readonly footer = computed(() => (this.props()['footer'] || []) as SduiNode[]);
}
