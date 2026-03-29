import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BladeAlertType, SduiBladeAlertComponent } from './sdui-blade-alert.component';
import { beforeEach, describe, expect, it } from 'vitest';

@Component({
  standalone: true,
  imports: [SduiBladeAlertComponent],
  template: `
    <sdui-blade-alert 
      [title]="mockTitle()" 
      [type]="mockType()">
      <span class="test-message">Alert Content</span>
    </sdui-blade-alert>
  `
})
class TestHostComponent {
  mockTitle = signal<string | undefined>(undefined);
  mockType = signal<BladeAlertType>('info');
}

describe('SduiBladeAlertComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  it('renders projected content correctly', () => {
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('.test-message');
    expect(content).toBeTruthy();
    expect(content.textContent).toBe('Alert Content');
  });

  it('conditionally renders the h4 title if provided', () => {
    component.mockTitle.set('Warning!');
    fixture.detectChanges();

    const titleEl = fixture.nativeElement.querySelector('.sdui-blade-alert-title');
    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent).toBe('Warning!');
  });

  it('hides the h4 title completely if omitted', () => {
    component.mockTitle.set(undefined);
    fixture.detectChanges();

    const titleEl = fixture.nativeElement.querySelector('.sdui-blade-alert-title');
    expect(titleEl).toBeNull();
  });

  it('maps the `info` type to its semantic CSS classes', () => {
    component.mockType.set('info');
    fixture.detectChanges();
    
    const alertBody = fixture.nativeElement.querySelector('.sdui-blade-alert');
    expect(alertBody.className).toContain('bg-blue-500/10');
    expect(alertBody.className).toContain('text-blue-400');
  });

  it('maps the `error` type to its semantic CSS classes', () => {
    component.mockType.set('error');
    fixture.detectChanges();
    
    const alertBody = fixture.nativeElement.querySelector('.sdui-blade-alert');
    expect(alertBody.className).toContain('bg-red-500/10');
    expect(alertBody.className).toContain('text-red-400');
  });

  it('maps the `success` type to its semantic CSS classes', () => {
    component.mockType.set('success');
    fixture.detectChanges();
    
    const alertBody = fixture.nativeElement.querySelector('.sdui-blade-alert');
    expect(alertBody.className).toContain('bg-emerald-500/10');
    expect(alertBody.className).toContain('text-emerald-400');
  });

  it('maps the `warning` type to its semantic CSS classes', () => {
    component.mockType.set('warning');
    fixture.detectChanges();
    
    const alertBody = fixture.nativeElement.querySelector('.sdui-blade-alert');
    expect(alertBody.className).toContain('bg-yellow-500/10');
    expect(alertBody.className).toContain('text-yellow-400');
  });
});
