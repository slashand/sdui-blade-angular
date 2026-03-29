import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, input, signal, computed, inject } from '@angular/core';
import { SduiBaseBladeComponent, SduiBladeFooterComponent, SduiBladeHeaderComponent, SduiBladeContentComponent, SduiBladeService } from '@slashand/sdui-blade-angular';
import { SduiBladeNode } from '@slashand/sdui-blade-core';

@Component({
  selector: 'app-footer-alignments-blade',
  standalone: true,
  imports: [CommonModule, SduiBaseBladeComponent, SduiBladeHeaderComponent, SduiBladeContentComponent, SduiBladeFooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sdui-base-blade [size]="(props().width || 'full')">
      <sdui-blade-header 
        [title]="props().title || 'Footer Alignment Engine'" 
        [subtitle]="'CSS Flexbox Validation Sandbox'">
      </sdui-blade-header>

      <sdui-blade-content customClass="footer-alignment-content gap-6 p-8 bg-white h-full">
        
        <p class="footer-alignment-text text-slate-600 font-medium">
          Dynamically toggle the justification properties of the <code class="footer-alignment-code bg-slate-100 px-1 rounded">sdui-blade-footer</code> below to verify that the CSS utilities are bound correctly.
        </p>

        <div class="footer-alignment-grid grid grid-cols-2 gap-4">
          <button aria-label="Align left" (click)="alignment.set('left')" [class.ring-2]="alignment() === 'left'" class="footer-alignment-btn-left px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-300 transition-all font-mono cursor-pointer">.sdui-align-left</button>
          <button aria-label="Align center" (click)="alignment.set('center')" [class.ring-2]="alignment() === 'center'" class="footer-alignment-btn-center px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-300 transition-all font-mono cursor-pointer">.sdui-align-center</button>
          <button aria-label="Align right" (click)="alignment.set('right')" [class.ring-2]="alignment() === 'right'" class="footer-alignment-btn-right px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-300 transition-all font-mono cursor-pointer">.sdui-align-right</button>
          <button aria-label="Align between" (click)="alignment.set('between')" [class.ring-2]="alignment() === 'between'" class="footer-alignment-btn-between px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-300 transition-all font-mono cursor-pointer">.sdui-align-between</button>
        </div>

      </sdui-blade-content>

      <sdui-blade-footer [align]="alignment()">
        @if (alignment() === 'between') {
          <button aria-label="Dismiss footer" class="footer-alignment-btn-dismiss px-5 py-2 font-semibold text-slate-500 hover:bg-slate-100 rounded-md transition-colors cursor-pointer" (click)="close()">Dismiss</button>
        }
        <button aria-label="Commit alignment changes" class="footer-alignment-btn-commit px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow transition-colors cursor-pointer" (click)="close()">Commit Changes</button>
      </sdui-blade-footer>
    </sdui-base-blade>
  `
})
export class FooterAlignmentsBladeComponent {
  node = input.required<Required<SduiBladeNode>>();
  alignment = signal<'left' | 'right' | 'center' | 'between'>('right');
  protected bladeService = inject(SduiBladeService);
  
  protected readonly props = computed(() => {
    return this.node().properties as unknown as { title?: string; subtitle?: string; width?: 'full' | 'menu' | 'small' | 'medium' | 'large' | 'xlarge' };
  });

  close() { this.bladeService.closeBlade(this.node().id); }
}
