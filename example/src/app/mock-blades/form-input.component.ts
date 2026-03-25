import { Component, input } from '@angular/core';
import { SduiNode } from '@slashand/sdui-blade-core';

/**
 * Mock representation of an interactive text field parameter.
 * Impact on others: Currently isolated layout mockup; does not bind upstream form states yet.
 */
@Component({
  selector: 'app-mock-form-input',
  standalone: true,
  template: `
    <div class="sdui-mock-form-input-container flex flex-col gap-1 w-full">
      <label class="sdui-mock-form-label text-[13px] font-semibold text-[var(--sdui-text)] flex items-center gap-1">
        {{ $any(node().properties?.['label']) }}
        <svg class="w-3.5 h-3.5 text-[var(--sdui-muted)] opacity-80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
      </label>
      <input type="text" class="sdui-mock-form-input h-[28px] px-2 bg-transparent border border-gray-600 focus:border-[#4da6ff] focus:outline-none focus:ring-1 focus:ring-[#4da6ff] hover:border-gray-400 text-[13px] w-full text-[var(--sdui-text)] transition-colors" />
    </div>
  `
})
export class FormInputComponent {
  /** Ingests standard node properties specifically looking for 'label'. */
  public readonly node = input.required<SduiNode>();
}
