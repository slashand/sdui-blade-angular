import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BladePivotTab, SduiBladePivotComponent } from './sdui-blade-pivot.component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

@Component({
  standalone: true,
  imports: [SduiBladePivotComponent],
  template: `
    <sdui-blade-pivot 
      [tabs]="mockTabs()" 
      [activeId]="mockActiveId()"
      (activeIdChange)="onTabChange($event)">
    </sdui-blade-pivot>
  `
})
class TestHostComponent {
  mockTabs = signal<BladePivotTab[]>([
    { id: 'tab-1', label: 'General' },
    { id: 'tab-2', label: 'Security' }
  ]);
  mockActiveId = signal<string>('tab-1');
  onTabChange = vi.fn();
}

describe('SduiBladePivotComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  it('renders all structural tabs accurately', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.sdui-blade-pivot-tab');
    
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent.trim()).toBe('General');
    expect(buttons[1].textContent.trim()).toBe('Security');
  });

  it('applies the active styling border to the activeId tab', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.sdui-blade-pivot-tab');
    
    // The active tab gets the primary border color
    expect(buttons[0].className).toContain('border-[var(--th-text-primary');
    // The inactive tab gets transparent
    expect(buttons[1].className).toContain('border-transparent');
  });

  it('emits the activeIdChange output when an inactive tab is clicked', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.sdui-blade-pivot-tab');
    
    // Click the second tab (Security)
    buttons[1].click();
    
    expect(component.onTabChange).toHaveBeenCalledWith('tab-2');
  });
});
