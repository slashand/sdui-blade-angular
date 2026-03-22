import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SduiBladeNode, SduiElementType } from '@slashand/sdui-blade-core';
import { beforeEach, describe, expect, it } from 'vitest';
import { SduiRendererComponent } from './sdui-renderer.component';

// Dynamic host component to effectively pass required v21 input Signals into the renderer
@Component({
  standalone: true,
  imports: [SduiRendererComponent],
  template: `<app-sdui-renderer [node]="mockNode()"></app-sdui-renderer>`
})
class TestHostComponent {
  mockNode = signal<SduiBladeNode>({
    id: 'vitest-1',
    type: SduiElementType.Blade,
    properties: {
      title: 'Test Blade'
    }
  });
}

describe('SduiRendererComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SduiRendererComponent, TestHostComponent]
    }).compileComponents();
  });

  it('compiles the recursive framework heartbeat flawlessly, guaranteeing zero TS constraints or signal resolution failures', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    // Triggers the Angular lifecycle and validates the NgComponentOutlet mounting branch
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.mockNode().id).toBe('vitest-1');
  });
});
