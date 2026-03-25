import { Component, input } from '@angular/core';
import { SduiNode } from '@slashand/sdui-blade-core';

/**
 * Leaf rendering node for typography output.
 * Impact on others: Purely visual rendering; does not mutate history or container dimensions.
 */
@Component({
  selector: 'app-mock-text',
  standalone: true,
  template: `
    <p class="sdui-mock-text-p text-[13px] text-[var(--sdui-text)] mb-4 leading-relaxed">
      {{ $any(node().properties?.['content']) }}
    </p>
  `
})
export class TextComponent {
  /** Node structure containing string-based 'content' properties. */
  public readonly node = input.required<SduiNode>();
}
