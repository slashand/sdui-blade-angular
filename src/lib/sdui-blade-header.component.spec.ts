import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SduiBladeHeaderComponent } from './sdui-blade-header.component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

@Component({
  standalone: true,
  imports: [SduiBladeHeaderComponent],
  template: `
    <sdui-blade-header 
      [title]="mockTitle()" 
      [subtitle]="mockSubtitle()" 
      [showClose]="mockShowClose()"
      (close)="onCloseClicked()">
      
      <div commands class="test-command">Save</div>
    </sdui-blade-header>
  `
})
class TestHostComponent {
  mockTitle = signal<string | undefined>(undefined);
  mockSubtitle = signal<string | undefined>(undefined);
  mockShowClose = signal<boolean>(true);
  
  onCloseClicked = vi.fn();
}

describe('SduiBladeHeaderComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  it('renders title and subtitle when provided', () => {
    component.mockTitle.set('Settings');
    component.mockSubtitle.set('User Profile');
    fixture.detectChanges();

    const titleEl = fixture.nativeElement.querySelector('.sdui-blade-title-text');
    const subtitleEl = fixture.nativeElement.querySelector('.sdui-blade-subtitle-text');

    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent).toBe('Settings');
    
    expect(subtitleEl).toBeTruthy();
    expect(subtitleEl.textContent).toBe('User Profile');
  });

  it('hides title and subtitle elements when undefined', () => {
    component.mockTitle.set(undefined);
    component.mockSubtitle.set(undefined);
    fixture.detectChanges();

    const titleEl = fixture.nativeElement.querySelector('.sdui-blade-title-text');
    const subtitleEl = fixture.nativeElement.querySelector('.sdui-blade-subtitle-text');

    expect(titleEl).toBeNull();
    expect(subtitleEl).toBeNull();
  });

  it('emits the close event when the default close button is clicked', () => {
    fixture.detectChanges();
    
    const closeBtn = fixture.nativeElement.querySelector('.sdui-blade-close');
    expect(closeBtn).toBeTruthy();
    
    closeBtn.click();
    expect(component.onCloseClicked).toHaveBeenCalledOnce();
  });

  it('hides the close button completely when showClose is false', () => {
    component.mockShowClose.set(false);
    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('.sdui-blade-close');
    expect(closeBtn).toBeNull();
  });

  it('projects custom commands correctly', () => {
    fixture.detectChanges();

    const projectedCommand = fixture.nativeElement.querySelector('.sdui-blade-commands .test-command');
    expect(projectedCommand).toBeTruthy();
    expect(projectedCommand.textContent).toBe('Save');
  });
});
