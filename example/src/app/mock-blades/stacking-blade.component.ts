import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SduiBladeNode } from '@slashand/sdui-blade-core';
import { SduiBaseBladeComponent, SduiBladeHeaderComponent, SduiBladeFooterComponent, SduiBladeContentComponent, SduiBladeService } from '@slashand/sdui-blade-angular';

@Component({
  selector: 'app-stacking-blade',
  standalone: true,
  imports: [CommonModule, SduiBaseBladeComponent, SduiBladeHeaderComponent, SduiBladeContentComponent, SduiBladeFooterComponent],
  template: `
    <sdui-base-blade [size]="(props().width || 'full')">
      <sdui-blade-header 
        [title]="'Depth Level: ' + currentDepth" 
        [subtitle]="'Journey Stacking Protocol (isTransient: true)'">
      </sdui-blade-header>

      <sdui-blade-content customClass="stacking-blade-content gap-6 p-8 bg-slate-900 text-slate-200 h-full">
        
        <div class="stacking-blade-box px-6 py-4 bg-slate-800 rounded-xl border border-slate-700 shadow-inner">
          <h2 class="stacking-blade-title text-xl font-bold text-white mb-2">Recursive Journey Testing</h2>
          <p class="stacking-blade-text text-sm text-slate-400">
            Current Depth Index: <span class="stacking-blade-depth font-mono text-cyan-400">{{ currentDepth }}</span> <br>
            Opening a child blade will push this active blade leftward by exactly <code>-60px</code> due to the parallax spatial matrix. Because we inject <code>isTransient: true</code>, the child blade will drop a blur/dim overlay to visually push us into the background.
          </p>
        </div>

        <div class="stacking-blade-btn-group flex flex-col gap-3">
          <button aria-label="Stack large child" (click)="spawnChild('large')" class="stacking-blade-btn-large text-left px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-cyan-500 transition-all font-semibold shadow-sm cursor-pointer">
            Stack Large Child (855px)
          </button>
          <button aria-label="Stack medium child" (click)="spawnChild('medium')" class="stacking-blade-btn-medium text-left px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-cyan-500 transition-all font-semibold shadow-sm cursor-pointer">
            Stack Medium Child (585px)
          </button>
          <button aria-label="Stack small child" (click)="spawnChild('small')" class="stacking-blade-btn-small text-left px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-cyan-500 transition-all font-semibold shadow-sm cursor-pointer">
            Stack Small Child (315px)
          </button>
          <button aria-label="Stack menu child" (click)="spawnChild('menu')" class="stacking-blade-btn-menu text-left px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-cyan-500 transition-all font-semibold shadow-sm cursor-pointer">
            Stack Menu Child (265px)
          </button>
        </div>

      </sdui-blade-content>

      <sdui-blade-footer align="between">
        <button aria-label="Collapse all" class="stacking-blade-btn-collapse px-4 py-2 font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer" (click)="closeAll()">Collapse All</button>
        <button aria-label="Close this level" class="stacking-blade-btn-close px-4 py-2 font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded shadow transition-colors cursor-pointer" (click)="close()">Close Level {{currentDepth}}</button>
      </sdui-blade-footer>
    </sdui-base-blade>
  `
})
export class StackingBladeComponent {
  node = input.required<Required<SduiBladeNode>>();
  protected bladeService = inject(SduiBladeService);

  protected readonly props = computed(() => {
    return this.node().properties as unknown as { depth?: number; width?: 'full' | 'menu' | 'small' | 'medium' | 'large' | 'xlarge' };
  });

  get currentDepth(): number {
    return this.props().depth || 1;
  }

  /**
   * Formal factory method to construct a compliant SduiBladeNode for the recursive stacking test.
   * This replaces the legacy inline type-cast bypassing the strict SDK enforcement.
   */
  private createChildNode(widthType: 'full' | 'menu' | 'small' | 'medium' | 'large' | 'xlarge'): SduiBladeNode {
    const nextDepth = this.currentDepth + 1;
    return {
      id: `stack-${nextDepth}-${Date.now()}`,
      type: 'stack-test' as any, // Override strict enum for open-ended string registries
      properties: {
        title: `Depth Level: ${nextDepth}`,
        depth: nextDepth,
        isTransient: true,
        width: widthType
      } as any, // Cast local props to generic Record
      children: []
    } as SduiBladeNode;
  }

  spawnChild(widthType: 'full' | 'menu' | 'small' | 'medium' | 'large' | 'xlarge') {
    const payload = this.createChildNode(widthType);
    this.bladeService.openBlade(payload);
  }

  close() {
    this.bladeService.closeBlade(this.node().id);
  }

  closeAll() {
    this.bladeService.closeAllBlades();
  }
}
