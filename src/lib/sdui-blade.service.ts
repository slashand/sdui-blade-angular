import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, InjectionToken, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { BladeHistory, SduiBladeNode } from '@slashand/sdui-blade-core';

/**
 * Injection Token to natively access the surrounding blade context from ANY child component
 * in the tree, completely eliminating the need for strict `@Input()` drilling.
 */
export const SDUI_BLADE_NODE = new InjectionToken<Required<SduiBladeNode>>('SDUI_BLADE_NODE');

/**
 * Native Angular v21 Signal-based service orchestrating the SDUI JSON logic and Blade Stack pipeline.
 * (We avoid Zustand in Angular in favor of native reactive primitives).
 *
 * CORE RESPONSIBILITIES:
 * 1. Maintain the `activeBlades` Signal, identifying the precise deterministic layout state of the Journey Protocol.
 * 2. Handle programmatic push, pop, and reset methods for transient layout elements.
 */
@Injectable({
  providedIn: 'root',
})
export class SduiBladeService implements OnDestroy {
  /**
   * The single source of truth for all currently active blade nodes.
   * Modifying this underlying signal will immediately cause the Orchestrator to mount or unmount components.
   * Impact on others: Drives the SduiBladeHostComponent rendering cycle.
   */
  private readonly _activeBlades = signal<Required<SduiBladeNode>[]>([]);

  /**
   * Public readonly exposure of the active blades signal.
   * Impact on others: Consumed by host angular applications to map active components to the DOM.
   */
  public readonly activeBlades = this._activeBlades.asReadonly();

  /**
   * Derived state indicating if any blades are currently active in the Journey.
   * Impact on others: Often used to toggle application-level overlays or hide background dashboards.
   */
  public readonly hasActiveBlades = computed(() => this._activeBlades().length > 0);

  /** The host resolves cold links; the cache restores payloads opened during this session. */
  private history: BladeHistory | null = null;
  private stopHistory: (() => void) | null = null;
  private readonly payloadCache = new Map<string, Required<SduiBladeNode>>();

  /**
   * Platform ID token.
   * Functionality: Distinguishes between browser and SSR environments.
   * Impact on others: Necessary for avoiding `window` object collisions during Angular Universal rendering.
   */
  private readonly platformId = inject(PLATFORM_ID);

  private readonly document = inject(DOCUMENT);

  /** Connect after the host has registered its blade payloads. Core owns all URL frames. */
  connectHistory(resolve: (id: string) => SduiBladeNode | undefined, parameter = 'blades'): void {
    if (!isPlatformBrowser(this.platformId) || !this.document.defaultView) return;
    this.stopHistory?.();
    this.history = new BladeHistory(this.document.defaultView, parameter);
    const hydrate = (ids: string[]) => {
      const active = this._activeBlades();
      if (ids.length === active.length && ids.every((id, index) => id === active[index].id)) return;
      const nodes = ids
        .map((id) => this.payloadCache.get(id) ?? resolve(id))
        .filter((node): node is SduiBladeNode => !!node);
      this._activeBlades.set(nodes as Required<SduiBladeNode>[]);
    };
    hydrate(this.history.readDurable());
    this.stopHistory = this.history.listen(hydrate);
  }

  ngOnDestroy(): void {
    this.stopHistory?.();
  }

  /**
   * Discards the entire Journey Protocol stack.
   * Functionality: Empties the `_activeBlades` signal returning the application to an unmounted state.
   * Impact on others: Every single open blade will be immediately unmounted.
   */
  closeAllBlades(): void {
    if (this._activeBlades().length > 0) {
      this._activeBlades.set([]);
      this.recordHistory([]);
    }
  }

  /**
   * Selectively closes a specific blade from anywhere in the stack by truncating all blades AFTER it, including the target.
   * Functionality: Searches for the index of the provided ID, slicing the stack up to that point.
   * Impact on others: Causes the targeted blade and all its children to animate out of the DOM.
   * @param id The unique ID of the blade to close.
   */
  closeBlade(id: string): void {
    const blades = this._activeBlades();
    const index = blades.findIndex((bladeNode) => bladeNode.id === id);
    if (index > -1) {
      const newBlades = blades.slice(0, index);
      this._activeBlades.set(newBlades);
      this.recordHistory(newBlades);
    }
  }

  /**
   * Closes the most recently opened blade.
   * Functionality: Pops the final element off the internal signal array.
   * Impact on others: Removes exactly one active DOM node from the end of the Journey.
   */
  closeTopBlade(): void {
    const blades = this._activeBlades();
    if (blades.length > 0) {
      const newBlades = blades.slice(0, -1);
      this._activeBlades.set(newBlades);
      this.recordHistory(newBlades);
    }
  }

  /**
   * Pushes a new blade onto the stack or updates the topmost blade in-place if the IDs match.
   * Functionality: Instantiates a new node in the Journey Protocol.
   * Impact on others: Causes a new visual blade to slide into the viewport, pushing previous blades backward.
   * @param node The SduiBladeNode defining type and properties.
   */
  openBlade(node: SduiBladeNode): void {
    const id = node.id || `${node.type}-${Date.now()}`;

    this._activeBlades.update((blades: Required<SduiBladeNode>[]) => {
      const lastBlade = blades[blades.length - 1];
      // Prevent stacking the EXACT SAME IDENTIFIER consecutively
      if (lastBlade && lastBlade.id === id) {
        // Safe update in place, don't flood history
        const newBlades = [...blades];
        newBlades[newBlades.length - 1] = {
          ...lastBlade,
          properties: node.properties || {},
          children: node.children || lastBlade.children,
        } as unknown as Required<SduiBladeNode>;
        this.recordHistory(newBlades, true);
        return newBlades;
      }

      const newBlades = [
        ...blades,
        {
          id,
          type: node.type,
          properties: node.properties || {},
          children: node.children || [],
        } as unknown as Required<SduiBladeNode>,
      ];
      this.recordHistory(newBlades);
      return newBlades;
    });
  }

  /**
   * Formally resets the blade stack and drops a new root domain into the initial pipeline index.
   * Functionality: Purges previous state and pushes a single new blade, defining it as the new parent-less root.
   * Impact on others: Required whenever switching Core Pillar applications (e.g., leaving Logistics for Cybersecurity).
   * @param blade The SduiBladeNode to act as the new initial state.
   */
  setAppBlade(blade: SduiBladeNode): void {
    const id = blade.id || `${blade.type}-${Date.now()}`;
    const parsedBlade = { ...blade, id, properties: blade.properties || {} } as Required<SduiBladeNode>;
    const newBlades = [parsedBlade];
    this._activeBlades.set(newBlades);
    this.recordHistory(newBlades);
  }

  /**
   * Instantly overrides the entire active blade pipeline with a hardcoded topological array.
   * Functionality: Sets the raw signal payload to the provided array.
   * Impact on others: This clears all existing DOM portals and replaces the visual state deterministically.
   * @param blades A complete array of `SduiBladeNode` models to replace state.
   */
  setBlades(blades: SduiBladeNode[], replace = false): void {
    const typed = blades as Required<SduiBladeNode>[];
    this._activeBlades.set(typed);
    this.recordHistory(typed, replace);
  }

  /**
   * Mutates the dynamic properties inside a currently active blade.
   * Functionality: Searches for an exact ID, merges the new partial properties into its existing payload.
   * Impact on others: Component subscribers depending on `properties` will independently trigger Angular's change detection without unmounting the whole blade.
   * @param id The blade's exact string identifier.
   * @param properties The partial mapped payload to override.
   */
  updateBladeProperties(id: string, properties: Partial<SduiBladeNode['properties']>): void {
    this._activeBlades.update((blades: Required<SduiBladeNode>[]) => {
      const index = blades.findIndex((bladeNode) => bladeNode.id === id);
      if (index > -1) {
        const newBlades = [...blades];
        const existingNode = newBlades[index];
        newBlades[index] = {
          ...existingNode,
          properties: { ...(existingNode.properties || {}), ...properties },
        } as unknown as Required<SduiBladeNode>;
        // Use replace = true so partial layout tweaks don't flood the browser Back navigation stack
        this.recordHistory(newBlades, true);
        return newBlades;
      }
      return blades;
    });
  }
  private recordHistory(nodes: Required<SduiBladeNode>[], replace = false): void {
    for (const node of nodes) this.payloadCache.set(node.id, node);
    const durable = nodes.filter((node) => {
      const properties = node.properties as Record<string, unknown> | undefined;
      return !properties?.['isTransient'] && !properties?.['skipUrl'];
    });
    this.history?.record(
      nodes.map((node) => node.id),
      replace,
      durable.map((node) => node.id),
    );
  }
}
