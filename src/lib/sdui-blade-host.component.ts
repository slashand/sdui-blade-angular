import { CommonModule, isPlatformBrowser, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, PLATFORM_ID, signal, computed, input, Type } from '@angular/core';
import { BLADE_REGISTRY } from './sdui-blade-registry';
import { SduiBladeService } from './sdui-blade.service';

@Component({
  selector: 'app-sdui-blade-host',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'block w-full h-full relative',
    '(document:keydown.escape)': 'onEscapeKey()'
  },
  template: `
    <div class="sdui-blade-host-root relative w-full h-full flex overflow-hidden">
      <!-- MAIN APP CONTENT (ROUTER OUTLET) -->
      <ng-content></ng-content>

      @if (hasBladesForRegion()) {
        <div class="sdui-blade-host-overlay absolute inset-0 w-full h-full flex overflow-hidden z-[100] pointer-events-auto">
          <!-- Render Blades via for loop targeted to this region -->
          @for (blade of bladesForThisRegion(); track blade.id; let i = $index) {
            <div 
              class="sdui-blade-host-instance absolute inset-0 flex flex-col pointer-events-none transition-transform duration-300 ease-out"
              [style.zIndex]="10 + i"
              role="dialog"
              aria-modal="false"
              [attr.aria-label]="blade.properties?.title || 'Slide-out panel'"
            >
              <!-- Wrapper enforcing rigid SDUI constraints, mimicking the framer-motion approach -->
              <div class="sdui-blade-host-scroll-boundary flex-1 overflow-auto no-scrollbar relative z-0 pointer-events-auto flex flex-col"
                   [class]="i === 0 ? '[&>*]:!w-full [&>*]:!max-w-none [&>*]:!ml-0 [&>*]:!border-l-0 [&>*]:!rounded-none' : ''"
              >
                @if (resolvedComponents()[blade.type]) {
                  <ng-container *ngComponentOutlet="resolvedComponents()[blade.type]!; inputs: { node: blade }"></ng-container>
                } @else {
                  <ng-content select="[fallback-loader]"></ng-content>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class SduiBladeHostComponent implements OnInit {
  region = input<string>('global');
  protected bladeService = inject(SduiBladeService);
  protected resolvedComponents = signal<Record<string, Type<unknown>>>({});
  
  protected bladesForThisRegion = computed(() => {
    return this.bladeService.activeBlades().filter((b: any) => {
      // If a blade specifies no region, it defaults to 'global'
      const bladeRegion = b.properties?.region || 'global';
      return bladeRegion === this.region();
    });
  });

  protected hasBladesForRegion = computed(() => this.bladesForThisRegion().length > 0);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    // A simplified effect tracking un-resolved component types and triggering lazy loads.
    // Ideally this uses Angular's upcoming `import()` template native syntax, 
    // but for now we manually ingest the registry loaders.
    if (isPlatformBrowser(this.platformId)) {
      const intervalId = setInterval(() => {
        const blades = this.bladesForThisRegion();
      const currentRes = this.resolvedComponents();

      let needsUpdate = false;
      const newRes = { ...currentRes };

      for (const bladeNode of blades) {
        if (!newRes[bladeNode.type]) {
          const loader = BLADE_REGISTRY.getLoader(bladeNode.type);
          if (loader) {
            needsUpdate = true;
            loader().then(component => {
              this.resolvedComponents.update((registry: Record<string, Type<unknown>>) => ({ ...registry, [bladeNode.type]: component }));
            });
          } else {
            console.warn(`[SDUI Blade Engine] No Angular component registered for JSON type: '${bladeNode.type}'`);
          }
        }
        }
      }, 100); // Polling for demo, typical implementation uses explicit RxJS subjects on state changes.
      
      this.destroyRef.onDestroy(() => clearInterval(intervalId));
    }
  }

  protected onEscapeKey(): void {
    if (this.hasBladesForRegion()) {
      const active = this.bladesForThisRegion();
      const top = active[active.length - 1];
      if (!top.properties?.disableClose) {
        this.bladeService.closeTopBlade();
      }
    }
  }
}
