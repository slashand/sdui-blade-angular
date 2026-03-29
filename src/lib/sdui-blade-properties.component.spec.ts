import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BladePropertyItem, SduiBladePropertiesComponent } from './sdui-blade-properties.component';
import { beforeEach, describe, expect, it } from 'vitest';

@Component({
  standalone: true,
  imports: [SduiBladePropertiesComponent],
  template: `
    <sdui-blade-properties [properties]="mockProperties()">
    </sdui-blade-properties>
  `
})
class TestHostComponent {
  mockProperties = signal<BladePropertyItem[]>([
    { label: 'Status', value: 'Active' },
    { label: 'Created At', value: '2026-03-29' }
  ]);
}

describe('SduiBladePropertiesComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  it('renders all property key-value pairs accurately', () => {
    fixture.detectChanges();
    
    const dts = fixture.nativeElement.querySelectorAll('.sdui-blade-property-label');
    const dds = fixture.nativeElement.querySelectorAll('.sdui-blade-property-value');
    
    expect(dts.length).toBe(2);
    expect(dds.length).toBe(2);

    expect(dts[0].textContent.trim()).toBe('Status');
    expect(dds[0].textContent.trim()).toBe('Active');

    expect(dts[1].textContent.trim()).toBe('Created At');
    expect(dds[1].textContent.trim()).toBe('2026-03-29');
  });

  it('updates the grid layout correctly when the input signal mutates', () => {
    fixture.detectChanges(); // initial load

    component.mockProperties.set([
      { label: 'ID', value: 'bld-559' }
    ]);
    fixture.detectChanges();

    const dts = fixture.nativeElement.querySelectorAll('.sdui-blade-property-label');
    const dds = fixture.nativeElement.querySelectorAll('.sdui-blade-property-value');
    
    expect(dts.length).toBe(1);
    expect(dds.length).toBe(1);
    expect(dts[0].textContent.trim()).toBe('ID');
    expect(dds[0].textContent.trim()).toBe('bld-559');
  });

  it('renders nothing inside the dl if properties list is empty', () => {
    component.mockProperties.set([]);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.sdui-blade-property-item');
    expect(items.length).toBe(0);
  });
});
