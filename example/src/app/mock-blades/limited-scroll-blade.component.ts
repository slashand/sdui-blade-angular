import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SduiBladeNode } from '@slashand/sdui-blade-core';
import { SduiBaseBladeComponent, SduiBladeHeaderComponent, SduiBladeFooterComponent, SduiBladeContentComponent, SduiBladeService } from '@slashand/sdui-blade-angular';

@Component({
  selector: 'app-limited-scroll-blade',
  standalone: true,
  imports: [CommonModule, SduiBaseBladeComponent, SduiBladeHeaderComponent, SduiBladeContentComponent, SduiBladeFooterComponent],
  template: `
    <sdui-base-blade [size]="(props().width || 'full')">
      <sdui-blade-header 
        [title]="props().title || 'Limited Scroll Test'" 
        [subtitle]="'Internal Scroll Viewport Constraint'">
      </sdui-blade-header>
      <sdui-blade-content customClass="limited-scroll-content p-6 bg-slate-50 relative h-full">
        <!-- The Content Container DOES NOT reach 100vh. It contains an intrinsic list that scrolls internally -->
        
        <div class="limited-scroll-box bg-white border border-slate-200 rounded-xl flex flex-col h-[400px] overflow-hidden shadow-sm">
          <div class="limited-scroll-box-title px-4 py-3 border-b border-slate-100 bg-slate-50/50 font-semibold text-sm text-slate-700">Deep Internal Scroll Container</div>
          
          <div class="limited-scroll-list flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            @for (i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]; track $index) {
              <div class="limited-scroll-item p-3 bg-slate-100 text-slate-600 rounded-md text-sm border border-transparent hover:border-blue-200 transition-colors">
                List Item Entry {{i}}
              </div>
            }
          </div>
        </div>
        
        <p class="limited-scroll-text mt-8 text-sm text-slate-500 leading-relaxed max-w-sm">
          Notice how the blade itself isn't forced to expand infinitely. The scroll happens exclusively within the dedicated flex-child container, honoring the SDK boundary physics.
        </p>

      </sdui-blade-content>

      <sdui-blade-footer align="right">
        <button aria-label="Acknowledge constrained scroll" class="limited-scroll-btn-ack px-6 py-2 bg-slate-800 text-white rounded-md text-sm font-semibold cursor-pointer" (click)="close()">Acknowledge</button>
      </sdui-blade-footer>
    </sdui-base-blade>
  `
})
export class LimitedScrollBladeComponent {
  node = input.required<Required<SduiBladeNode>>();
  protected bladeService = inject(SduiBladeService);
  
  protected readonly props = computed(() => {
    return this.node().properties as unknown as { title?: string; subtitle?: string; width?: 'full' | 'menu' | 'small' | 'medium' | 'large' | 'xlarge' };
  });

  close() { this.bladeService.closeBlade(this.node().id); }
}
