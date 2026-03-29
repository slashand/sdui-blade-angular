import { TestBed } from '@angular/core/testing';
import { PlatformLocation } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SduiBladeService } from './sdui-blade.service';
import { SduiBladeNode, SduiElementType } from '@slashand/sdui-blade-core';

describe('SduiBladeService', () => {
  let service: SduiBladeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SduiBladeService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: PlatformLocation,
          useValue: {
            hash: '',
            onPopState: vi.fn(),
            onHashChange: vi.fn(),
            pushState: vi.fn(),
            replaceState: vi.fn()
          }
        }
      ]
    });
    service = TestBed.inject(SduiBladeService);
  });

  const createMockBlade = (id: string, properties: Partial<SduiBladeNode['properties']> = {}): SduiBladeNode => ({
    id,
    type: SduiElementType.Blade,
    properties: { title: 'Test', ...properties } as SduiBladeNode['properties']
  });

  it('should be created with an empty stack', () => {
    expect(service).toBeTruthy();
    expect(service.activeBlades().length).toBe(0);
    expect(service.hasActiveBlades()).toBe(false);
  });

  it('opens a new blade and pushes to the stack', () => {
    service.openBlade(createMockBlade('blade-1'));
    expect(service.activeBlades().length).toBe(1);
    expect(service.activeBlades()[0].id).toBe('blade-1');
    expect(service.hasActiveBlades()).toBe(true);
  });

  it('updates instead of duplicating when opening the same blade id consecutively', () => {
    service.openBlade(createMockBlade('blade-1', { title: 'Original' }));
    service.openBlade(createMockBlade('blade-1', { title: 'Updated', subtitle: 'New' }));

    expect(service.activeBlades().length).toBe(1);
    expect(service.activeBlades()[0].properties['title']).toBe('Updated');
    expect(service.activeBlades()[0].properties['subtitle']).toBe('New');
  });

  it('closes a specific blade and truncates all blades after it', () => {
    service.openBlade(createMockBlade('blade-1'));
    service.openBlade(createMockBlade('blade-2'));
    service.openBlade(createMockBlade('blade-3'));

    service.closeBlade('blade-2');

    expect(service.activeBlades().length).toBe(1);
    expect(service.activeBlades()[0].id).toBe('blade-1');
  });

  it('closes the top blade', () => {
    service.openBlade(createMockBlade('blade-1'));
    service.openBlade(createMockBlade('blade-2'));

    service.closeTopBlade();

    expect(service.activeBlades().length).toBe(1);
    expect(service.activeBlades()[0].id).toBe('blade-1');
  });

  it('closes all blades', () => {
    service.openBlade(createMockBlade('blade-1'));
    service.openBlade(createMockBlade('blade-2'));

    service.closeAllBlades();

    expect(service.activeBlades().length).toBe(0);
  });

  it('sets the root app blade exactly', () => {
    service.openBlade(createMockBlade('blade-prev'));
    service.setAppBlade(createMockBlade('root-blade'));

    expect(service.activeBlades().length).toBe(1);
    expect(service.activeBlades()[0].id).toBe('root-blade');
  });

  it('sets an array of blades explicitly', () => {
    service.setBlades([createMockBlade('blade-x'), createMockBlade('blade-y')]);

    expect(service.activeBlades().length).toBe(2);
    expect(service.activeBlades()[0].id).toBe('blade-x');
  });

  it('updates partial blade properties dynamically in-place', () => {
    service.openBlade(createMockBlade('blade-1', { title: 'Old Region', region: 'sidebar' }));
    service.updateBladeProperties('blade-1', { title: 'New Region' });

    expect(service.activeBlades().length).toBe(1);
    expect(service.activeBlades()[0].properties['title']).toBe('New Region');
    // Ensure it was a partial merge, keeping existing properties
    expect(service.activeBlades()[0].properties['region']).toBe('sidebar');
  });
});
