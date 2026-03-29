import { Type } from '@angular/core';

export type BladeRegistryMap = Record<string, () => Promise<Type<unknown>>>;

/**
 * A static dictionary mapping SDUI string types to lazy-loaded Angular Components.
 * 
 * CORE RESPONSIBILITIES:
 * 1. Allow host applications to register custom blade definitions via lazy `import()` statements.
 * 2. Provide a synchronous lookup for the renderer to match incoming JSON nodes.
 */
export class SduiBladeRegistry {
    /**
     * The internal storage map of string tokens to promise loaders.
     * Functionality: Stores the memory references to the user-provided dynamic imports.
     * Impact on others: Determines what components can be successfully resolved during the Render loop.
     */
    private registry: BladeRegistryMap = {};

    /**
     * Resolves a static string token into its matching lazy-load promise.
     * Functionality: Checks the internal dictionary for a match.
     * Impact on others: If null is returned, the Renderer component falls back to a graceful error boundary.
     * @param type The string literal (e.g., 'ideation_library').
     */
    getLoader(type: string): (() => Promise<Type<unknown>>) | null {
        return this.registry[type] || null;
    }

    /**
     * Adds a single lazy-loaded component map to the dictionary.
     * Functionality: Mutates the registry map in-place.
     * Impact on others: Enables the rendering engine to start serving this specific blade type.
     * @param type The string identifier for the blade type.
     * @param loader A function returning an import promise.
     */
    register(type: string, loader: () => Promise<Type<unknown>>) {
        this.registry[type] = loader;
    }

    /**
     * Bulk-registers an entire dictionary of blade loaders at once.
     * Functionality: Merges the incoming map with the existing registry tokens.
     * Impact on others: Often called in `app.config.ts` during application bootstrap to hydrate the engine.
     * @param map A complete BladeRegistryMap dictionary.
     */
    registerAll(map: BladeRegistryMap) {
        this.registry = { ...this.registry, ...map };
    }
}

export const BLADE_REGISTRY = new SduiBladeRegistry();
