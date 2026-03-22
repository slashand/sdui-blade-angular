import { Component, input } from '@angular/core';
import { SduiNode } from '@slashand/sdui-blade-core';

@Component({
  selector: 'app-mock-text',
  standalone: true,
  template: `
    <p class="text-[13px] text-[var(--sdui-text)] mb-4 leading-relaxed">
      {{ $any(node().properties?.['content']) }}
    </p>
  `
})
export class TextComponent {
  public readonly node = input.required<SduiNode>();
}
