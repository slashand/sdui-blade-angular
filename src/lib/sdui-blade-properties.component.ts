import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface BladePropertyItem {
  label: string;
  value: string;
}

@Component({
  selector: 'sdui-blade-properties',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dl class="sdui-blade-summary grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
      @for (prop of properties(); track prop.label) {
        <div class="sdui-blade-property-item flex flex-col gap-1">
          <dt class="sdui-blade-property-label text-xs text-[var(--th-text-secondary,#94a3b8)] tracking-tight uppercase font-medium">{{ prop.label }}</dt>
          <dd class="sdui-blade-property-value text-sm text-[var(--th-text-primary,#f8fafc)]">{{ prop.value }}</dd>
        </div>
      }
    </dl>
  `
})
export class SduiBladePropertiesComponent {
  readonly properties = input.required<BladePropertyItem[]>();
}
