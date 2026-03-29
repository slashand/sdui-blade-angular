import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SduiBladeFooterComponent } from './sdui-blade-footer.component';
import { beforeEach, describe, expect, it } from 'vitest';

@Component({
  standalone: true,
  imports: [SduiBladeFooterComponent],
  template: `
    <sdui-blade-footer 
      [align]="mockAlign()" 
      [customClass]="mockCustomClass()">
      <button class="test-action">Save</button>
    </sdui-blade-footer>
  `
})
class TestHostComponent {
  mockAlign = signal<'left' | 'right' | 'center' | 'between'>('left');
  mockCustomClass = signal<string>('');
}

describe('SduiBladeFooterComponent', () => {
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
    const action = fixture.nativeElement.querySelector('.test-action');
    expect(action).toBeTruthy();
    expect(action.textContent).toBe('Save');
  });

  it('applies default left alignment class', () => {
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('.sdui-blade-footer-container');
    expect(container.className).toContain('sdui-align-left');
  });

  it('dynamically switches alignment flex utility classes', () => {
    fixture.detectChanges(); // Init
    
    component.mockAlign.set('right');
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('.sdui-blade-footer-container');
    expect(container.className).toContain('sdui-align-right');
    expect(container.className).not.toContain('sdui-align-left');

    component.mockAlign.set('center');
    fixture.detectChanges();
    expect(container.className).toContain('sdui-align-center');

    component.mockAlign.set('between');
    fixture.detectChanges();
    expect(container.className).toContain('sdui-align-between');
  });

  it('appends custom exterior classes flawlessly', () => {
    component.mockCustomClass.set('bg-red-500 my-footer');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.sdui-blade-footer-container');
    expect(container.className).toContain('bg-red-500');
    expect(container.className).toContain('my-footer');
  });
});
