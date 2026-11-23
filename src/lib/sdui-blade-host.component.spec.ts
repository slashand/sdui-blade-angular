import { Component, PLATFORM_ID, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SduiBladeHostComponent } from './sdui-blade-host.component';
import { SduiBladeService } from './sdui-blade.service';
import { BLADE_REGISTRY } from './sdui-blade-registry';
import { SduiBladeNode, SduiElementType } from '@slashand/sdui-blade-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

@Component({
  standalone: true,
  template: `<div class="mock-child">Mock Blade</div>`,
})
class MockDynamicBladeComponent {}

describe('SduiBladeHostComponent', () => {
  let component: SduiBladeHostComponent;
  let fixture: ComponentFixture<SduiBladeHostComponent>;
  let bladeService: SduiBladeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SduiBladeHostComponent, MockDynamicBladeComponent],
      providers: [SduiBladeService, { provide: PLATFORM_ID, useValue: 'browser' }],
    }).compileComponents();

    bladeService = TestBed.inject(SduiBladeService);

    // Register the mock loader for vitest
    BLADE_REGISTRY.register(SduiElementType.Blade, async () => MockDynamicBladeComponent);

    fixture = TestBed.createComponent(SduiBladeHostComponent);
    component = fixture.componentInstance;
  });

  it('creates the host component', () => {
    expect(component).toBeTruthy();
  });

  it('renders nothing when there are no blades for the region', () => {
    fixture.detectChanges();
    const instances = fixture.nativeElement.querySelectorAll('.sdui-blade-host-instance');
    expect(instances.length).toBe(0);
  });

  it('dynamically resolves and mounts a blade when instructed by the service', async () => {
    const node: SduiBladeNode = {
      id: 'blade-1',
      type: SduiElementType.Blade,
      properties: { title: 'Test Blade', region: 'global' },
    };

    bladeService.openBlade(node);
    fixture.detectChanges();

    await new Promise((r) => setTimeout(r, 150));
    fixture.detectChanges();

    const instances = fixture.nativeElement.querySelectorAll('.sdui-blade-host-instance');
    expect(instances.length).toBe(1);
    expect(
      instances[0].querySelector('.sdui-blade-host-scroll-boundary')?.classList.contains('sdui-boundary-size-large'),
    ).toBe(true);

    // Assert the component outlet successfully rendered the mock child
    const childText = fixture.nativeElement.querySelector('.mock-child')?.textContent;
    expect(childText).toBe('Mock Blade');
  });

  it('uses the manifest width when a legacy size is also present', async () => {
    const properties = { title: 'Width priority', width: 'small' as const, size: 'large' };
    bladeService.openBlade({
      id: 'width-priority',
      type: SduiElementType.Blade,
      properties,
    });
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 150));
    fixture.detectChanges();

    const boundary = fixture.nativeElement.querySelector('.sdui-blade-host-scroll-boundary');
    expect(boundary?.classList.contains('sdui-boundary-size-small')).toBe(true);
  });

  it('mounts the animated boundary only after its lazy blade content is ready', async () => {
    let resolveLoader!: (component: Type<unknown>) => void;
    const pending = new Promise<Type<unknown>>((resolve) => {
      resolveLoader = resolve;
    });
    BLADE_REGISTRY.register(SduiElementType.Blade, () => pending);
    bladeService.openBlade({ id: 'delayed', type: SduiElementType.Blade, properties: { title: 'Delayed' } });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sdui-blade-host-instance')).toBeNull();

    resolveLoader(MockDynamicBladeComponent);
    await pending;
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    const boundary = fixture.nativeElement.querySelector('.sdui-blade-host-instance');
    expect(boundary).not.toBeNull();
    expect(boundary.querySelector('.mock-child')?.textContent).toBe('Mock Blade');
  });

  it('does NOT render blades meant for a different region', async () => {
    const node: SduiBladeNode = {
      id: 'blade-sidebar',
      type: SduiElementType.Blade,
      properties: { title: 'Test Sidebar', region: 'sidebar' },
    }; // Defaults to `global` region in the component if not overridden

    bladeService.openBlade(node);
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 50));
    fixture.detectChanges();

    // Host region defaults to 'global', so 'sidebar' blade should be ignored
    const instances = fixture.nativeElement.querySelectorAll('.sdui-blade-host-instance');
    expect(instances.length).toBe(0);
  });

  it('applies transient backdrop class correctly', async () => {
    bladeService.openBlade({
      id: 'blade-transient',
      type: SduiElementType.Blade,
      properties: { title: 'Transient', isTransient: true } as unknown as SduiBladeNode['properties'],
    });

    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 50));
    fixture.detectChanges();

    const instance = fixture.nativeElement.querySelector('.sdui-blade-host-instance');
    expect(instance.classList.contains('sdui-transient-backdrop')).toBe(true);
  });

  it('shows a configured backdrop behind a root blade and removes it when disabled', async () => {
    bladeService.openBlade({ id: 'root', type: SduiElementType.Blade, properties: { title: 'Root', width: 'medium' } });
    fixture.componentRef.setInput('backdrop', { enabled: true, opacity: 0.36, blur: 3 });
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 50));
    fixture.detectChanges();

    const instance = fixture.nativeElement.querySelector('.sdui-blade-host-instance');
    expect(instance.classList.contains('sdui-transient-backdrop')).toBe(true);
    expect(instance.style.getPropertyValue('--sdui-backdrop-bg')).toBe('rgb(0 0 0 / 0.36)');
    expect(instance.style.getPropertyValue('--sdui-backdrop-blur')).toBe('3px');

    fixture.componentRef.setInput('backdrop', { enabled: false, opacity: 0.36, blur: 3 });
    fixture.detectChanges();
    expect(instance.classList.contains('sdui-transient-backdrop')).toBe(false);
  });

  it('uses host backdrop settings for the top nested blade and can disable them', async () => {
    const closeTopBlade = vi.spyOn(bladeService, 'closeTopBlade').mockImplementation(() => {});
    bladeService.openBlade({ id: 'base', type: SduiElementType.Blade, properties: { title: 'Base' } });
    bladeService.openBlade({ id: 'nested', type: SduiElementType.Blade, properties: { title: 'Nested' } });
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 50));
    fixture.detectChanges();

    let instances = fixture.nativeElement.querySelectorAll('.sdui-blade-host-instance');
    instances[1].click();
    expect(closeTopBlade).not.toHaveBeenCalled();

    fixture.componentRef.setInput('backdrop', { enabled: true, opacity: 0.4, blur: 6, closeOnClick: true });
    fixture.detectChanges();
    instances = fixture.nativeElement.querySelectorAll('.sdui-blade-host-instance');
    expect(instances[0].classList.contains('sdui-transient-backdrop')).toBe(false);
    expect(instances[1].classList.contains('sdui-transient-backdrop')).toBe(true);
    expect(instances[1].style.getPropertyValue('--sdui-backdrop-bg')).toBe('rgb(0 0 0 / 0.4)');
    expect(instances[1].style.getPropertyValue('--sdui-backdrop-blur')).toBe('6px');
    instances[1].click();
    expect(closeTopBlade).toHaveBeenCalledOnce();

    closeTopBlade.mockClear();
    fixture.componentRef.setInput('backdrop', { enabled: false, closeOnClick: true });
    fixture.detectChanges();
    instances = fixture.nativeElement.querySelectorAll('.sdui-blade-host-instance');
    expect(instances[1].classList.contains('sdui-transient-backdrop')).toBe(false);
    instances[1].click();
    expect(closeTopBlade).not.toHaveBeenCalled();
  });

  it('closes top blade when escape key is pressed', async () => {
    vi.spyOn(bladeService, 'closeTopBlade');

    bladeService.openBlade({
      id: 'escape-test',
      type: SduiElementType.Blade,
      properties: { title: 'Escape Test' },
    });

    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 50));
    fixture.detectChanges();

    // Simulate escape keydown on the host
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event); // The host binds to document:keydown.escape

    expect(bladeService.closeTopBlade).toHaveBeenCalled();
  });

  it('blocks escape key closure if disableClose is true', async () => {
    vi.spyOn(bladeService, 'closeTopBlade');

    bladeService.openBlade({
      id: 'escape-blocked',
      type: SduiElementType.Blade,
      properties: { title: 'Escape Blocked', disableClose: true } as unknown as SduiBladeNode['properties'],
    });

    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 50));
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(bladeService.closeTopBlade).not.toHaveBeenCalled();
  });

  it('calculates z-index correctly for stacked blades', async () => {
    bladeService.openBlade({ id: 'stack-1', type: SduiElementType.Blade, properties: { title: 's1' } });
    bladeService.openBlade({ id: 'stack-2', type: SduiElementType.Blade, properties: { title: 's2' } });

    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 50));
    fixture.detectChanges();

    const instances = fixture.nativeElement.querySelectorAll('.sdui-blade-host-instance');
    expect(instances.length).toBe(2);

    // First blade index=0 -> 10 + 0 = 10
    expect(instances[0].style.zIndex).toBe('10');
    // Second blade index=1 -> 10 + 1 = 11
    expect(instances[1].style.zIndex).toBe('11');
  });
});
