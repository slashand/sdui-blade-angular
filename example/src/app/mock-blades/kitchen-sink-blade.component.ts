import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { SduiBaseBladeComponent, SduiBladeContentComponent, SduiBladeFooterComponent, SduiBladeHeaderComponent, SduiBladeService } from '@slashand/sdui-blade-angular';
import { SduiBladeNode } from '@slashand/sdui-blade-core';

@Component({
  selector: 'app-kitchen-sink-blade',
  standalone: true,
  imports: [CommonModule, SduiBaseBladeComponent, SduiBladeHeaderComponent, SduiBladeContentComponent, SduiBladeFooterComponent],
  template: `
    <sdui-base-blade [size]="(props().width || 'full')">
      
      <!-- HEADER -->
      <sdui-blade-header 
        [title]="props().title || 'Kitchen Sink'" 
        [subtitle]="'Testing Full Sticky Height'">
      </sdui-blade-header>

      <!-- CONTENT -->
      <sdui-blade-content customClass="kitchen-sink-content-container p-6 bg-slate-50 text-slate-800">
        <h3 class="kitchen-sink-title font-bold text-lg mb-4 text-slate-900">Scrollable Content Area</h3>
        <p class="kitchen-sink-description text-sm">This blade proves that the SDUI constraints flawlessly handle child elements spanning significantly taller than the Viewport (100vh).</p>
        
        <div class="kitchen-sink-instruction-box p-4 rounded-xl border-2 border-dashed border-slate-300 bg-white">
          The background should be fully flush, and the footer should remain pinned perfectly to the bottom of the viewport even while this middle block scrolls!
        </div>

        <!-- Lots of fake text to force overflow -->
        @for (i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]; track $index) {
          <div class="kitchen-sink-scroll-block h-32 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-400">
            Scroll block {{i}}
          </div>
        }
      </sdui-blade-content>

      <!-- FOOTER -->
      <sdui-blade-footer align="between">
        <button type="button" aria-label="Cancel configuration" class="kitchen-sink-btn-cancel px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer" (click)="close()">Cancel</button>
        <button type="button" aria-label="Save configuration" class="kitchen-sink-btn-save px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-sm transition-colors cursor-pointer" (click)="close()">Save Configuration</button>
      </sdui-blade-footer>

    </sdui-base-blade>
  `
})
export class KitchenSinkBladeComponent {
  node = input.required<Required<SduiBladeNode>>();
  protected bladeService = inject(SduiBladeService);

  protected readonly props = computed(() => {
    return this.node().properties as unknown as { title?: string; subtitle?: string; width?: 'full' | 'menu' | 'small' | 'medium' | 'large' | 'xlarge' };
  });

  close() {
    this.bladeService.closeBlade(this.node().id);
  }
}
