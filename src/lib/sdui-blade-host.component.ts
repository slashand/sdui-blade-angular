import { CommonModule, isPlatformBrowser, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, Injector, input, OnInit, PLATFORM_ID, signal, Type } from '@angular/core';
import { SduiBladeNode } from '@slashand/sdui-blade-core';
import { BLADE_REGISTRY } from './sdui-blade-registry';
import { SduiBladeService, SDUI_BLADE_NODE } from './sdui-blade.service';

/**
 * The Root DOM Container for the structured Blade UI system. 
 * This component listens to the active `SduiBladeService` and materializes generic JSON requests into real Angular Standalone Components.
 * 
 * CORE RESPONSIBILITIES:
 * 1. Enact the "Inversion of Mount Points" by wrapping dynamically loaded Angular components in strict CSS boundaries.
 * 2. Automate structural layout (Width constraints, z-index elevation, and overlapping offset).
 * 3. Handle physical hardware UX interactions (Backdrop clicks, ESC key tracking).
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
          role="dialog"
          aria-modal="false"
          [attr.aria-label]="blade.properties.title || 'Slide-out panel'"
          (click)="onBackdropClick($event, blade, bladeIndex)"
        >
          <!-- Wrapper enforcing rigid SDUI constraints, mimicking the framer-motion approach -->
          <div class="sdui-blade-host-scroll-boundary"
               [style.--sdui-blade-custom-w]="getCustomWidthPx(blade)"
               [ngClass]="[
                 getBoundarySizeClass(blade)
               ]"
               (click)="onScrollBoundaryClick($event, blade, bladeIndex)">
            @if (resolvedComponents()[blade.type]) {
              <ng-container *ngComponentOutlet="resolvedComponents()[blade.type]!; inputs: getComponentInputs(blade); injector: getBladeInjector(blade)"></ng-container>
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
  // ---------------------------------------------------------------------------
  // PROPERTIES (Alphabetized)
  // ---------------------------------------------------------------------------

  /**
   * Computes the subset of active blades intended for this exact Host region.
   * Functionality: Filters the universal active blade stack logically.
   * Impact on others: Dictates the quantity of `sdui-blade-host-instance` DOM nodes required.
   */
  protected bladesForThisRegion = computed(() => {
    return this.sduiBladeService.activeBlades().filter((bladeNode: SduiBladeNode) => {
      const bladeRegion = bladeNode.properties.region || 'global';
      return bladeRegion === this.region();
    });
  });

  /**
   * Internal reference for clearing lifecycle intervals to prevent memory leaks.
   * Functionality: Used natively by Angular DI to tear down long-running functions on death.
   * Impact on others: Unbinds the registry polling loop when this Host component unmounts.
   */
  private readonly destroyRef = inject(DestroyRef);

  /**
   * Quick boolean flag indicating if any blades exist for this host window.
   * Functionality: Controls the `@if` rendering block for the blade overlay instances.
   * Impact on others: Short-circuits the template to avoid evaluating an empty blade stack.
   */
  protected hasBladesForRegion = computed(() => this.bladesForThisRegion().length > 0);

  /**
   * Tokens holding the current javascript execution environment.
   * Functionality: Allows conditional checks to avoid interval loops executing on Next.js/Nitro SSR shells.
   * Impact on others: Prevents fatal hydration mismatches and runaway infinite polling on backend servers.
   */
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Defines which specific named router outlet region this Host listens to.
   * Functionality: Allows multiple blade hosts to exist on the same page (e.g. 'global', 'sidebar')
   * Impact on others: Filters the universal active blade stack to only mount components targeting this region.
   */
  region = input<string>('global');

  /**
   * Tracks lazy-loaded Angular components as they resolve from the internal Blade Registry.
   * Functionality: Translates `sdui-type` string values into memory-addressable component functions.
   * Impact on others: Direct feed into `NgComponentOutlet`.
   */
  protected resolvedComponents = signal<Record<string, Type<unknown>>>({});

  /**
   * The injected core singleton service orchestrating the stack geometry.
   * Functionality: Primary query source to access the array of currently open JSON views.
   * Impact on others: Central store that dictates layout engine status across all Host nodes.
   */
  protected sduiBladeService = inject(SduiBladeService);


  // ---------------------------------------------------------------------------
  // METHODS (Alphabetized)
  // ---------------------------------------------------------------------------

  /**
   * Caches instantiated injectors to avoid memory leaks during change detection.
   */
  private readonly injectorCache = new Map<string, Injector>();

  /**
   * Captures the default environment injector to serve as the parent context.
   */
  private readonly defaultInjector = inject(Injector);

  /**
   * Spawns a dedicated Injector mapping the SDUI_BLADE_NODE token to the target JSON payload.
   * Functionality: Wraps the generic blade within a native Angular context frame.
   * Impact on others: Allows deeply nested generic SDK components to magically query their host Blade Node globally without manual prop drilling.
   */
  protected getBladeInjector(bladeTarget: SduiBladeNode): Injector {
    const id = bladeTarget.id as string;
    let injector = this.injectorCache.get(id);
    if (!injector) {
      injector = Injector.create({
        providers: [{ provide: SDUI_BLADE_NODE, useValue: bladeTarget }],
        parent: this.defaultInjector
      });
      this.injectorCache.set(id, injector);
    }
    return injector;
  }

  /**
   * Standardizes the inputs fed into the dynamic NgComponentOutlet.
   * Functionality: Ensures every lazy-loaded mock blade receives `bladeId`, `node`, and any custom `inputs`.
   * Impact on others: Mock blades universally depend on this shape to identify themselves.
   */
  protected getComponentInputs(bladeTarget: SduiBladeNode): Record<string, unknown> {
    const props = bladeTarget.properties as Record<string, unknown> || {};
    return {
      bladeId: bladeTarget.id,
      node: bladeTarget,
      inputs: props['inputs']
    };
  }

  /**
   * Resolves the required width bounds and margin-alignments for the host wrapper.
   * Functionality: Extracts `blade.properties.size` directly from the JSON.
   * Impact on others: Solves the flexbox shrink-wrap geometry collapse on full-width blades without using 100cqw hacks.
   */
  protected getBoundarySizeClass(bladeTarget: SduiBladeNode): string {
    const sizeMap: Record<string, string> = {
      full: 'sdui-boundary-size-full',
      large: 'sdui-boundary-size-large',
      medium: 'sdui-boundary-size-medium',
      menu: 'sdui-boundary-size-menu',
      small: 'sdui-boundary-size-small',
      xlarge: 'sdui-boundary-size-xlarge',
      xl: 'sdui-boundary-size-xl',
      '2xl': 'sdui-boundary-size-2xl',
      '3xl': 'sdui-boundary-size-3xl',
      '4xl': 'sdui-boundary-size-4xl',
      '5xl': 'sdui-boundary-size-5xl',
      '6xl': 'sdui-boundary-size-6xl',
      '7xl': 'sdui-boundary-size-7xl',
    };
    const props = (bladeTarget.properties as Record<string, unknown>) || {};
    const sizeRaw = props['size'] || props['width'] || 'medium';
    const sizeStr = String(sizeRaw);
    
    // If it's a known schema string, map it
    if (sizeMap[sizeStr]) {
      return sizeMap[sizeStr];
    }
    
    // Otherwise it's a structural number (e.g. 800)
    return 'sdui-boundary-size-custom';
  }

  /**
   * Helper to determine if the blade is using a strictly typed custom numerical width.
   */
  protected isCustomWidth(bladeTarget: SduiBladeNode): boolean {
    return this.getBoundarySizeClass(bladeTarget) === 'sdui-boundary-size-custom';
  }

  /**
   * Helper to extract the safe pixel value for mathematical rendering.
   */
  protected getCustomWidthPx(bladeTarget: SduiBladeNode): string | null {
    if (!this.isCustomWidth(bladeTarget)) return null;
    const props = (bladeTarget.properties as Record<string, unknown>) || {};
    const sizeRaw = props['size'] || props['width'];
    if (!sizeRaw) return null;
    return typeof sizeRaw === 'number' ? `${sizeRaw}px` : (String(sizeRaw).endsWith('px') ? String(sizeRaw) : `${sizeRaw}px`);
  }

  /**
   * Determines if a blade requires the 'transient' dimming backdrop overlay.
   * Functionality: Inspects `bladeNode.properties.isTransient`.
   * Impact on others: Toggles the `.sdui-transient-backdrop` CSS class which obscures blades behind it.
   */
  protected isTransient(bladeNode: SduiBladeNode): boolean {
    return !!(bladeNode.properties as Record<string, unknown>)?.['isTransient'];
  }

  /**
   * Initializes the registry polling architecture lazily on mount.
   * Functionality: Triggers recursive polling checking if all active blades have resolve mount-paths mapped.
   * Impact on others: Spawns the physical `.then(component)` micro-tasks creating visual UI frames upon registration.
   */
  ngOnInit() {
    // A simplified effect tracking un-resolved component types and triggering lazy loads.
    if (isPlatformBrowser(this.platformId)) {
      const intervalId = setInterval(() => {
        const blades = this.bladesForThisRegion();
        const currentRes = this.resolvedComponents();

        const newRes = { ...currentRes };

        for (const bladeNode of blades) {
          if (!newRes[bladeNode.type]) {
            const loader = BLADE_REGISTRY.getLoader(bladeNode.type);
            if (loader) {
              loader().then(component => {
                this.resolvedComponents.update((registry: Record<string, Type<unknown>>) => ({ ...registry, [bladeNode.type]: component }));
              });
            } else {
              console.warn(`[SDUI Blade Engine] No Angular component registered for JSON type: '${bladeNode.type}'`);
            }
          }
        }
      }, 100);

      this.destroyRef.onDestroy(() => clearInterval(intervalId));
    }
  }

  /**
   * Executes blade closure if a backdrop click happened exactly on the topmost overlay layer.
   * Functionality: Verifies the index of the clicked backdrop against the stack depth.
   * Impact on others: Stops lower blades from accidentally dismissing when clicking their exposed boundaries.
   * @param event The native mouse event.
   * @param blade The SduiBladeNode interacting.
   * @param index The z-index depth of the current action.
   */
  protected onBackdropClick(event: MouseEvent, blade: SduiBladeNode, index: number): void {
    // PREVENT BUBBLING CLOSURES: Only close if the exact backdrop element was clicked
    if (event.target !== event.currentTarget) {
      return;
    }

    const active = this.bladesForThisRegion();
    // Only close if they clicked the exact backdrop of the TOPMOST blade
    if (index === active.length - 1 && !blade.properties.disableClose) {
      this.sduiBladeService.closeTopBlade();
    }
  }

  /**
   * Listens for Escape key events globally when the Host holds focus.
   * Functionality: Checks if top-level blade allows closure, then triggers service pop.
   * Impact on others: Invokes standard Top Blade dismissal animation.
   */
  protected onEscapeKey(): void {
    if (this.hasBladesForRegion()) {
      const active = this.bladesForThisRegion();
      const top = active[active.length - 1];
      if (!top.properties.disableClose) {
        this.sduiBladeService.closeTopBlade();
      }
    }
  }

  /**
   * Catch-all handler for when a user clicks strictly outside a blade window onto the transparent scroll boundary.
   * Functionality: Checks if the event target was literally the boundary and not nested text.
   * Impact on others: Defers closure logic to `onBackdropClick` which pops the active blade.
   * @param event The native mouse event.
   * @param blade The SduiBladeNode interacting.
   * @param index The z-index depth of the current action.
   */
  protected onScrollBoundaryClick(event: MouseEvent, blade: SduiBladeNode, index: number): void {
    const target = event.target as HTMLElement;
    // Clicks on the transparent background will target exactly the scroll boundary.
    // Real inner blade clicks will bubble up from elements with pointer-events: auto
    if (target.classList.contains('sdui-blade-host-scroll-boundary')) {
      this.onBackdropClick(event, blade, index);
    }
  }
}
