import { describe, expect, it } from 'vitest';
import { SduiBladeRegistry, BLADE_REGISTRY, BladeRegistryMap } from './sdui-blade-registry';
import { Type } from '@angular/core';

describe('SduiBladeRegistry', () => {
  it('instantiates the registry', () => {
    const registry = new SduiBladeRegistry();
    expect(registry).toBeTruthy();
    expect(registry.getLoader('test-blade')).toBeNull();
  });

  it('registers a single loader and resolves it successfully', async () => {
    const registry = new SduiBladeRegistry();
    const mockComponent: Type<unknown> = class {} as Type<unknown>;
    
    registry.register('test-blade', async () => mockComponent);
    
    const loader = registry.getLoader('test-blade');
    expect(loader).not.toBeNull();
    if (loader) {
      const resolved = await loader();
      expect(resolved).toBe(mockComponent);
    }
  });

  it('registers an entire map dictionary simultaneously', async () => {
    const registry = new SduiBladeRegistry();
    const mockComponentA: Type<unknown> = class {} as Type<unknown>;
    const mockComponentB: Type<unknown> = class {} as Type<unknown>;
    
    const map: BladeRegistryMap = {
      'blade-a': async () => mockComponentA,
      'blade-b': async () => mockComponentB,
    };

    registry.registerAll(map);
    
    expect(registry.getLoader('blade-a')).not.toBeNull();
    expect(registry.getLoader('blade-b')).not.toBeNull();
    expect(registry.getLoader('blade-c')).toBeNull();
  });

  it('exports a global singleton BLADE_REGISTRY correctly', () => {
    expect(BLADE_REGISTRY).toBeTruthy();
    expect(typeof BLADE_REGISTRY.register).toBe('function');
  });
});
