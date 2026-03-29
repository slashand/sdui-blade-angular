import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SduiBladeContentComponent } from './sdui-blade-content.component';
import { beforeEach, describe, expect, it } from 'vitest';

@Component({
  standalone: true,
  imports: [SduiBladeContentComponent],
  template: `
    <sdui-blade-content [customClass]="mockCustomClass()">
      <p class="test-content">Scrolling Content Payload</p>
    </sdui-blade-content>
  `
})
class TestHostComponent {
  mockCustomClass = signal<string>('');
}

describe('SduiBladeContentComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  it('renders projected content successfully', () => {
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('.test-content');
    expect(content).toBeTruthy();
    expect(content.textContent).toBe('Scrolling Content Payload');
  });

  it('applies the mandatory scroll boundary class', () => {
    fixture.detectChanges();
    const hostNode = fixture.nativeElement.querySelector('sdui-blade-content');
    expect(hostNode.className).toContain('sdui-blade-content-container');
  });

  it('appends custom exterior classes flawlessly to the host wrapper', () => {
    component.mockCustomClass.set('p-4 mt-2 gap-4 flex-col');
    fixture.detectChanges();

    const hostNode = fixture.nativeElement.querySelector('sdui-blade-content');
    expect(hostNode.className).toContain('p-4');
    expect(hostNode.className).toContain('gap-4');
  });
});
