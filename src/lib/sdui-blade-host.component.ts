import { CommonModule, isPlatformBrowser, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, PLATFORM_ID, signal, computed, input, Type, effect } from '@angular/core';
import { BLADE_REGISTRY } from './sdui-blade-registry';
import { SduiBladeService } from './sdui-blade.service';
import { SduiBladeNode } from '@slashand/sdui-blade-core';

/**
 * [COMPONENT]
 * SduiBladeHostComponent
 * 
 * The Root DOM Container for the structured Blade UI system. 
 * This component listens to the active `SduiBladeService` and materializes generic JSON requests into real Angular Standalone Components.
 * 
 * CORE RESPONSIBILITIES:
 * 1. Enact the "Inversion of Mount Points" by wrapping dynamically loaded Angular components in strict CSS boundaries.
 * 2. Automate structural layout (Width constraints, z-index elevation, and overlapping offset).
 * 3. Handle physical hardware UX interactions (Backdrop clicks, ESC key tracking).
 * 
 * file: src/lib/sdui-blade-host.component.ts
 */
@Component({
  selector: 'app-sdui-blade-host',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'sdui-blade-host',
    '(document:keydown.escape)': 'onEscapeKey()'
  },
  template: `
    <!-- The Root Application Context -->
    <ng-content></ng-content>

    @if (hasBladesForRegion()) {
      @for (blade of bladesForThisRegion(); track blade.id; let bladeIndex = $index) {
        <div 
          class="sdui-blade-host-instance"
          animate.enter="sdui-blade-enter"
          animate.leave="sdui-blade-leave"
          [class.sdui-root-blade]="bladeIndex === 0"
          [class.sdui-transient-backdrop]="isTransient(blade)"
          [style.zIndex]="10 + bladeIndex"
          [style.transform]="bladeIndex === bladesForThisRegion().length - 1 ? 'translateX(0%)' : 'translateX(0%)'"
          role="dialog"
          aria-modal="false"
          [attr.aria-label]="blade.properties.title || 'Slide-out panel'"
          (click)="onBackdropClick($event, blade, bladeIndex)"
        >
          <!-- Wrapper enforcing rigid SDUI constraints, mimicking the framer-motion approach -->
          <div class="sdui-blade-host-scroll-boundary"
               (click)="$event.stopPropagation()"
               [ngClass]="getBladeSizeClass(blade)">
            @if (resolvedComponents()[blade.type]) {
              <ng-container *ngComponentOutlet="resolvedComponents()[blade.type]!; inputs: getComponentInputs(blade)"></ng-container>
            } @else {
              <ng-content select="[fallback-loader]"></ng-content>
            }
          </div>
        </div>
      }
    }
  `
})
export class SduiBladeHostComponent implements OnInit {
  region = input<string>('global');
  protected bladeService = inject(SduiBladeService);
  protected resolvedComponents = signal<Record<string, Type<unknown>>>({});
  protected bladesForThisRegion = computed(() => {
    return this.bladeService.activeBlades().filter((bladeNode: SduiBladeNode) => {
      // If a blade specifies no region, it defaults to 'global'
      const bladeRegion = bladeNode.properties.region || 'global';
      return bladeRegion === this.region();
    });
  });

  protected getBladeSizeClass(bladeNode: SduiBladeNode): string {
    const w = bladeNode.properties.width || 'full';
    return `sdui-size-${w}`;
  }

  protected isTransient(bladeNode: SduiBladeNode): boolean {
    return !!(bladeNode.properties as Record<string, unknown>)?.['isTransient'];
  }

  protected hasBladesForRegion = computed(() => this.bladesForThisRegion().length > 0);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  
  protected getComponentInputs(bladeTarget: SduiBladeNode): Record<string, unknown> {
    return {
      node: bladeTarget
    };
  }
  
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
      if (!top.properties.disableClose) {
        this.bladeService.closeTopBlade();
      }
    }
  }

  protected onBackdropClick(event: MouseEvent, blade: SduiBladeNode, index: number): void {
    const active = this.bladesForThisRegion();
    // Only close if they clicked the exact backdrop of the TOPMOST blade
    if (index === active.length - 1 && !blade.properties.disableClose) {
        this.bladeService.closeTopBlade();
    }
  }
}
