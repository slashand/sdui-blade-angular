import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SduiBladeLoadingComponent } from './sdui-blade-loading.component';
import { beforeEach, describe, expect, it } from 'vitest';

@Component({
  standalone: true,
  imports: [SduiBladeLoadingComponent],
  template: `
    <sdui-blade-loading 
      [isLoading]="mockIsLoading()" 
      [text]="mockText()">
    </sdui-blade-loading>
  `
})
class TestHostComponent {
  mockIsLoading = signal<boolean>(false);
  mockText = signal<string | undefined>(undefined);
}

describe('SduiBladeLoadingComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  it('renders nothing when isLoading is false', () => {
    fixture.detectChanges();
    const loadingOverlay = fixture.nativeElement.querySelector('.sdui-blade-loading');
    expect(loadingOverlay).toBeNull();
  });

  it('renders the loading overlay and spinner when isLoading is true', () => {
    component.mockIsLoading.set(true);
    fixture.detectChanges();

    const loadingOverlay = fixture.nativeElement.querySelector('.sdui-blade-loading');
    expect(loadingOverlay).toBeTruthy();
    
    const spinner = fixture.nativeElement.querySelector('.sdui-blade-loading-spinner');
    expect(spinner).toBeTruthy();
  });

  it('renders the optional text label if provided', () => {
    component.mockIsLoading.set(true);
    component.mockText.set('Fetching profile...');
    fixture.detectChanges();

    const textEl = fixture.nativeElement.querySelector('.sdui-blade-loading-text');
    expect(textEl).toBeTruthy();
    expect(textEl.textContent).toBe('Fetching profile...');
  });

  it('hides the text label completely if text input is omitted', () => {
    component.mockIsLoading.set(true);
    component.mockText.set(undefined);
    fixture.detectChanges();

    const textEl = fixture.nativeElement.querySelector('.sdui-blade-loading-text');
    expect(textEl).toBeNull();
  });
});
