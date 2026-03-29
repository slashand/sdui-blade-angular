import { Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SduiBladeHostComponent } from './sdui-blade-host.component';
import { SduiBladeService } from './sdui-blade.service';
import { BLADE_REGISTRY } from './sdui-blade-registry';
import { SduiBladeNode, SduiElementType } from '@slashand/sdui-blade-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

@Component({
  standalone: true,
  template: `<div class="mock-child">Mock Blade</div>`
})
class MockDynamicBladeComponent {}

describe('SduiBladeHostComponent', () => {
  let component: SduiBladeHostComponent;
  let fixture: ComponentFixture<SduiBladeHostComponent>;
  let bladeService: SduiBladeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SduiBladeHostComponent, MockDynamicBladeComponent],
      providers: [
        SduiBladeService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
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
      properties: { title: 'Test Blade', region: 'global' }
    };

    bladeService.openBlade(node);
    fixture.detectChanges();

    // Trigger the lazy-loader polling interval inside ngOnInit
    await new Promise((r) => setTimeout(r, 50));
    fixture.detectChanges();

    const instances = fixture.nativeElement.querySelectorAll('.sdui-blade-host-instance');
    expect(instances.length).toBe(1);
    
    // Assert the component outlet successfully rendered the mock child
    const childText = fixture.nativeElement.querySelector('.mock-child')?.textContent;
    expect(childText).toBe('Mock Blade');
  });

  it('does NOT render blades meant for a different region', async () => {
    const node: SduiBladeNode = {
      id: 'blade-sidebar',
      type: SduiElementType.Blade,
      properties: { title: 'Test Sidebar', region: 'sidebar' }
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
      properties: { title: 'Transient', isTransient: true } as unknown as SduiBladeNode['properties']
    });
    
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 50));
    fixture.detectChanges();

    const instance = fixture.nativeElement.querySelector('.sdui-blade-host-instance');
    expect(instance.classList.contains('sdui-transient-backdrop')).toBe(true);
  });

  it('closes top blade when escape key is pressed', async () => {
    vi.spyOn(bladeService, 'closeTopBlade');
    
    bladeService.openBlade({
      id: 'escape-test',
      type: SduiElementType.Blade,
      properties: { title: 'Escape Test' }
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
      properties: { title: 'Escape Blocked', disableClose: true } as unknown as SduiBladeNode['properties']
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
