import { CommonModule, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, Type, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { BLADE_REGISTRY } from './sdui-blade-registry';
import { SduiBladeService } from './sdui-blade.service';

@Component({
  selector: 'app-sdui-blade-host',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full h-full relative'
  },
  template: `
    <div class="relative w-full h-full flex overflow-hidden">
      <!-- MAIN APP CONTENT (ROUTER OUTLET) -->
      <div class="flex-1 relative z-0 overflow-hidden flex flex-col">
        <ng-content></ng-content>
      </div>

      <!-- JOURNEY PROTOCOL: Z-AXIS RIGHT-ANCHORED OVERLAPPING -->
      @if (bladeService.hasActiveBlades()) {
        <div #scrollContainer class="absolute inset-0 overflow-hidden z-[100] pointer-events-none">
          @for (blade of bladeService.activeBlades(); track blade.id; let i = $index) {
            <div 
              class="absolute top-0 bottom-0 right-0 border-l border-[var(--sdui-border)] bg-[var(--sdui-panel-bg)] flex flex-col transition-all duration-300 pointer-events-auto"
              [style.z-index]="10 + i"
              [style.box-shadow]="i > 0 ? '-10px 0 25px rgba(0, 0, 0, 0.4)' : 'none'"
              [ngClass]="getBladeClasses(blade)"
              [ngStyle]="getBladeInlineStyle(blade)"
            >
              @if (resolvedComponents()[blade.type]) {
                <ng-container *ngComponentOutlet="resolvedComponents()[blade.type]!; inputs: { node: blade }"></ng-container>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class SduiBladeHostComponent implements OnInit, AfterViewChecked {
  protected bladeService = inject(SduiBladeService);
  protected resolvedComponents = signal<Record<string, Type<unknown>>>({});
  
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLDivElement>;
  private previousBladeCount = 0;

  public getBladeClasses(blade: any): string {
    const w = blade.properties?.['width'] as string | undefined;
    
    // Azure Specific Framework Default Mappings 
    // Uses max-width so they act rigidly at desktop size but can gracefully shrink if forced on smaller viewports.
    switch (w) {
      case 'menu': return 'w-full max-w-[265px] shrink-0';
      case 'small': return 'w-full max-w-[315px] shrink-0';
      case 'normal': 
      case 'medium': return 'w-full max-w-[585px] shrink-0';
      case 'large': return 'w-full max-w-[855px] shrink-0';
      case 'xlarge': return 'w-full max-w-[1125px] shrink-0';
      case 'full':
      default:
        // Default or implicit 'full' acts as a strict full-screen grid base.
        return 'w-full shrink-0 min-w-[320px]';
    }
  }

  // To support legacy inline number properties if passed:
  public getBladeInlineStyle(blade: any) {
    const w = blade.properties?.['width'];
    if (typeof w === 'number') return { 'width': `${w}px` };
    return {};
  }

  ngOnInit() {
    // A simplified effect tracking un-resolved component types and triggering lazy loads.
    setInterval(() => {
      const blades = this.bladeService.activeBlades();
      const currentRes = this.resolvedComponents();

      let needsUpdate = false;
      const newRes = { ...currentRes };

      for (const b of blades) {
        if (!newRes[b.type]) {
          const loader = BLADE_REGISTRY.getLoader(b.type);
          if (loader) {
            needsUpdate = true;
            loader().then(comp => {
              this.resolvedComponents.update(v => ({ ...v, [b.type]: comp }));
            });
          } else {
            console.warn(`[SDUI Blade Engine] No Angular component registered for JSON type: '${b.type}'`);
          }
        }
      }
    }, 100);
  }

  ngAfterViewChecked() {
    // Auto-scroll mechanics: When a new blade is injected into the DOM, physically scroll the view to the right.
    const currentCount = this.bladeService.activeBlades().length;
    if (currentCount > this.previousBladeCount) {
      this.scrollToRight();
    }
    this.previousBladeCount = currentCount;
  }

  private scrollToRight() {
    if (this.scrollContainer && this.scrollContainer.nativeElement) {
      // Use setTimeout to ensure the DOM has fully painted the new flex child bounds before calculating scrollWidth.
      setTimeout(() => {
        const el = this.scrollContainer.nativeElement;
        el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
      }, 50);
    }
  }
}
