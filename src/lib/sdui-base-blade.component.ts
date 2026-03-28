import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { BladeSize, bladeSizeClasses } from './sdui-blade.types';

/**
 * [COMPONENT]
 * SduiBaseBladeComponent
 * 
 * The visual HTML container for an individual Blade. 
 * Note: This is NOT the orchestrator. This is merely a presentation-layer wrapper to enforce 
 * the CSS box-model, shadow, and structural properties for whatever content is injected into it.
 * 
 * CORE RESPONSIBILITIES:
 * 1. Enforce strict mathematical bounding boxes (widths, max-widths, shrink values).
 * 2. Accept mapped generic dimensions and apply local CSS Custom Properties.
 * 
 * file: src/lib/sdui-base-blade.component.ts
 */
@Component({
  selector: 'sdui-base-blade',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass()">
      <ng-content></ng-content>
    </div>
  `
})
export class SduiBaseBladeComponent {
  readonly size = input<BladeSize>('full');
  readonly customClass = input<string>('');

  readonly computedClass = computed(() => {
    const sizeClass = bladeSizeClasses[this.size()];
    return `sdui-base-blade-container ${sizeClass} ${this.customClass()}`;
  });
}
