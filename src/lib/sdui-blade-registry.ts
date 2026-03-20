import { Type } from '@angular/core';

export type BladeRegistryMap = Record<string, () => Promise<Type<unknown>>>;

export class SduiBladeRegistry {
    private registry: BladeRegistryMap = {};

    register(type: string, loader: () => Promise<Type<unknown>>) {
        this.registry[type] = loader;
    }

    registerAll(map: BladeRegistryMap) {
        this.registry = { ...this.registry, ...map };
    }

    getLoader(type: string): (() => Promise<Type<unknown>>) | null {
        return this.registry[type] || null;
    }
}

export const BLADE_REGISTRY = new SduiBladeRegistry();
