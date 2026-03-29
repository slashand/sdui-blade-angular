import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SduiBladeNode } from '@slashand/sdui-blade-core';
import { SduiBladeService } from '@slashand/sdui-blade-angular';

@Component({
  selector: 'app-naked-blade',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- NO <sdui-base-blade> Wrapper! -->
    <div class="naked-blade-shell flex flex-col h-full bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] border-l border-slate-200">
      <div class="naked-blade-scroll flex-1 overflow-y-auto p-12">
        <div class="naked-blade-container max-w-md">
          <h1 class="naked-blade-title text-4xl font-black tracking-tight text-indigo-900 mb-6 font-serif">Naked Aesthetics</h1>
          
          <p class="naked-blade-quote text-lg text-slate-600 leading-relaxed mb-6 font-serif italic">
            "A design system is only as good as its weakest absolute constraint."
          </p>
          
          <p class="naked-blade-text text-slate-700 leading-relaxed mb-8">
            This component proves the Angular SDK's Inversion of Mount Points holds perfectly. This UI does not import <code class="naked-blade-code bg-slate-100 text-red-500 px-1 py-0.5 rounded text-sm">&lt;sdui-base-blade&gt;</code>, nor does it use standard headers. It is a completely custom flexbox column structurally injected inside the transient proxy.
          </p>

          <button aria-label="Conclude Demonstration" (click)="close()" class="naked-blade-btn-close group relative px-8 py-4 font-bold text-white rounded-full bg-indigo-600 overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full cursor-pointer">
            <span class="naked-blade-btn-label relative z-10">Conclude Demonstration</span>
            <div class="naked-blade-btn-hover absolute inset-0 h-full w-full scale-0 rounded-full bg-white/20 transition-all duration-300 group-hover:scale-100"></div>
          </button>
        </div>
      </div>
    </div>
  `
})
export class NakedBladeComponent {
  node = input.required<Required<SduiBladeNode>>();
  constructor(private bladeService: SduiBladeService) {}
  close() { this.bladeService.closeBlade(this.node().id); }
}
