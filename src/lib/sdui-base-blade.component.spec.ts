import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SduiBaseBladeComponent } from './sdui-base-blade.component';
import { BladeSize, bladeSizeClasses } from './sdui-blade.types';
import { beforeEach, describe, expect, it } from 'vitest';

@Component({
  standalone: true,
  imports: [SduiBaseBladeComponent],
  template: `
    <sdui-base-blade [size]="mockSize()" [customClass]="mockCustomClass()">
      <div class="test-projected-content">Projected</div>
    </sdui-base-blade>
  `
})
class TestHostComponent {
  mockSize = signal<BladeSize>('full');
  mockCustomClass = signal<string>('');
}

describe('SduiBaseBladeComponent', () => {
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
    const projected = fixture.nativeElement.querySelector('.test-projected-content');
    expect(projected).toBeTruthy();
    expect(projected.textContent).toBe('Projected');
  });

  it('applies the default "full" size class mapping', () => {
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('.sdui-base-blade-container');
    expect(container).toBeTruthy();
    const expectedClasses = bladeSizeClasses['full'].split(' ');
    for (const cssClass of expectedClasses) {
      expect(container.classList.contains(cssClass)).toBe(true);
    }
  });

  it('dynamically reacts to size input changes and updates the underlying CSS class mapping', () => {
    fixture.detectChanges(); // Init with 'full'
    
    component.mockSize.set('menu');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.sdui-base-blade-container');
    const expectedMenuClasses = bladeSizeClasses['menu'].split(' ');
    for (const cssClass of expectedMenuClasses) {
      expect(container.classList.contains(cssClass)).toBe(true);
    }
    const unexpectedFullClasses = bladeSizeClasses['full'].split(' ');
    // 'w-full' and 'shrink' are in both, but 'max-w-...' is not in 'full'.
    // Test that at least the unique classes are removed
    expect(container.classList.contains('flex-1')).toBe(false);
  });

  it('appends custom exterior classes flawlessly', () => {
    component.mockCustomClass.set('my-magic-override-class border-red-500');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.sdui-base-blade-container');
    expect(container.className).toContain('my-magic-override-class');
    expect(container.className).toContain('border-red-500');
  });
});
