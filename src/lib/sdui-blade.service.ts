import { PlatformLocation, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, InjectionToken, PLATFORM_ID, signal } from '@angular/core';
import { SduiBladeNode } from '@slashand/sdui-blade-core';

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
  providedIn: 'root'
})
export class SduiBladeService {
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

  /**
   * Internal tracking flag for programmatic back navigation.
   * Functionality: Prevents circular hash serialization when reversing the traversal stack.
   * Impact on others: N/A in the current un-hashed platform.
   */
  private isProgrammaticBack = false;

  /**
   * Platform ID token.
   * Functionality: Distinguishes between browser and SSR environments.
   * Impact on others: Necessary for avoiding `window` object collisions during Angular Universal rendering.
   */
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Platform Location token.
   * Functionality: Provides normalized access to the browser's history and URL state.
   * Impact on others: Used for hash-routing parsing if implemented.
   */
  private readonly platformLocation = inject(PlatformLocation);
  private readonly document = inject(DOCUMENT);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // 1. Initial hydration from URL
      const initialHash = this.platformLocation.hash;
      if (initialHash) {
        const nodes = this.deserializeFromHash(initialHash);
        if (nodes.length > 0) {
          this._activeBlades.set(nodes);
        }
      }

      // 2. Listen to browser Back/Forward popstate events
      this.platformLocation.onHashChange(() => {
        this.isProgrammaticBack = true;
        const hash = this.platformLocation.hash;
        const nodes = this.deserializeFromHash(hash);
        this._activeBlades.set(nodes);
        
        // Reset the flag asynchronously to allow the update to process
        setTimeout(() => {
          this.isProgrammaticBack = false;
        }, 0);
      });
    }
  }

  /**
   * Discards the entire Journey Protocol stack.
   * Functionality: Empties the `_activeBlades` signal returning the application to an unmounted state.
   * Impact on others: Every single open blade will be immediately unmounted.
   */
  closeAllBlades(): void {
    if (this._activeBlades().length > 0) {
      this._activeBlades.set([]);
      this.updateURLHash([], false);
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
    const index = blades.findIndex(bladeNode => bladeNode.id === id);
    if (index > -1) {
      const newBlades = blades.slice(0, index);
      this._activeBlades.set(newBlades);
      this.updateURLHash(newBlades, false);
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
      this.updateURLHash(newBlades, false);
    }
  }

  /**
   * Internal mechanism to reconstruct a stack of blade nodes from a URL hash payload.
   * Functionality: Parses encoded URL fragments back into `SduiBladeNode` objects.
   * Impact on others: Used during initial bootstrap or back-navigation logic if deep-linking is supported.
   */
  private deserializeFromHash(hash: string): Required<SduiBladeNode>[] {
    const cleanHash = hash.replace(/^#/, '');
    if (!cleanHash) return [];
    return cleanHash.split('/').map(segment => {
      let type = segment;
      const properties: Record<string, any> = {};
      const paren = segment.indexOf('(');
      if (paren > -1 && segment.endsWith(')')) {
        type = segment.substring(0, paren);
        const pairsStr = segment.substring(paren + 1, segment.length - 1);
        pairsStr.split(',').forEach(pairString => {
          const [propertyKey, propertyValue] = pairString.split('=');
          if (propertyKey && propertyValue !== undefined) properties[decodeURIComponent(propertyKey)] = decodeURIComponent(propertyValue);
        });
      }
      return {
        id: `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type,
        properties,
        children: []
      } as unknown as Required<SduiBladeNode>;
    });
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
        newBlades[newBlades.length - 1] = { ...lastBlade, properties: node.properties || {}, children: node.children || lastBlade.children } as unknown as Required<SduiBladeNode>;
        this.updateURLHash(newBlades, true);
        return newBlades;
      }

      const newBlades = [...blades, { id, type: node.type, properties: node.properties || {}, children: node.children || [] } as unknown as Required<SduiBladeNode>];
      this.updateURLHash(newBlades, false);
      return newBlades;
    });
  }

  /**
   * Internal mechanism to convert an array of blade nodes into a shareable URL hash.
   * Functionality: Strips out transient properties and skips hashing for background blades.
   * Impact on others: Determines which blades are considered "permanent" enough to bookmark.
   */
  private serializeToHash(nodes: Required<SduiBladeNode>[]): string {
    if (nodes.length === 0) return '';
    // Transient blades or sidebars should not pollute the shareable URL
    const validNodes = nodes.filter(bladeNode => {
      const props = bladeNode.properties as Record<string, unknown> | undefined;
      return !props?.['isTransient'] && !props?.['skipUrl'];
    });
    if (validNodes.length === 0) return '';

    const segments = validNodes.map(bladeNode => {
      let segment = String(bladeNode.type);
      if (bladeNode.properties && Object.keys(bladeNode.properties).length > 0) {
        const pairs: string[] = [];
        for (const [propertyKey, propertyValue] of Object.entries(bladeNode.properties)) {
          if (propertyKey !== 'isTransient' && propertyKey !== 'skipUrl' && typeof propertyValue !== 'object' && propertyValue !== undefined && propertyValue !== null) {
            pairs.push(`${encodeURIComponent(propertyKey)}=${encodeURIComponent(String(propertyValue))}`);
          }
        }
        if (pairs.length > 0) segment += `(${pairs.join(',')})`;
      }
      return segment;
    });
    return '#' + segments.join('/');
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
    this.updateURLHash(newBlades, true);
  }

  /**
   * Instantly overrides the entire active blade pipeline with a hardcoded topological array.
   * Functionality: Sets the raw signal payload to the provided array.
   * Impact on others: This clears all existing DOM portals and replaces the visual state deterministically.
   * @param blades A complete array of `SduiBladeNode` models to replace state.
   */
  setBlades(blades: SduiBladeNode[]): void {
    const typed = blades as Required<SduiBladeNode>[];
    this._activeBlades.set(typed);
    this.updateURLHash(typed, true);
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
      const index = blades.findIndex(bladeNode => bladeNode.id === id);
      if (index > -1) {
        const newBlades = [...blades];
        const existingNode = newBlades[index];
        newBlades[index] = {
          ...existingNode,
          properties: { ...(existingNode.properties || {}), ...properties }
        } as unknown as Required<SduiBladeNode>;
        // Use replace = true so partial layout tweaks don't flood the browser Back navigation stack
        this.updateURLHash(newBlades, true);
        return newBlades;
      }
      return blades;
    });
  }
  private updateURLHash(nodes: Required<SduiBladeNode>[], replace = false): void {
    if (this.isProgrammaticBack) return; // Prevent loop
    const newHash = this.serializeToHash(nodes);
    
    // We only interact with URL if we are in browser to prevent errors on SSR
    if (isPlatformBrowser(this.platformId)) {
      const windowObj = this.document.defaultView;
      const currentHash = windowObj?.location.hash || ''; // Need explicitly to catch empty
      if (currentHash !== newHash && windowObj) {
        if (replace || newHash === '') {
          // Empty hash is technically a "replace" up the stack, or `replace` explicitly
          windowObj.history.replaceState(null, '', windowObj.location.pathname + windowObj.location.search + newHash);
        } else {
          windowObj.location.hash = newHash;
        }
      }
    }
  }
}

