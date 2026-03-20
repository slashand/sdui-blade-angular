import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, Type } from '@angular/core';
import { BLADE_REGISTRY } from './sdui-blade-registry';
import { SduiBladeService } from './sdui-blade.service';

@Component({
  selector: 'app-sdui-blade-host',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (bladeService.hasActiveBlades()) {
      <div class="absolute inset-0 w-full h-full flex overflow-hidden z-[100] pointer-events-auto">
        <!-- Render Blades via for loop -->
        @for (blade of bladeService.activeBlades(); track blade.id; let i = $index) {
          <div 
            class="absolute inset-0 flex flex-col pointer-events-none transition-transform duration-300 ease-out"
            [style.zIndex]="10 + i"
          >
            <!-- Wrapper enforcing rigid SDUI constraints, mimicking the framer-motion approach -->
            <div class="flex-1 overflow-auto no-scrollbar relative z-0 pointer-events-auto flex flex-col"
                 [class]="i === 0 ? '[&>*]:!w-full [&>*]:!max-w-none [&>*]:!ml-0 [&>*]:!border-l-0 [&>*]:!rounded-none' : ''"
            >
              @if (resolvedComponents()[blade.type]) {
                <ng-container *ngComponentOutlet="resolvedComponents()[blade.type]!; inputs: { node: blade }"></ng-container>
              } @else {
                <!-- Optional fallback loader -->
              }
            </div>
          </div>
        }
      </div>
    }
  `
})
export class SduiBladeHostComponent implements OnInit {
  protected bladeService = inject(SduiBladeService);
  protected resolvedComponents = signal<Record<string, Type<unknown>>>({});

  ngOnInit() {
    // A simplified effect tracking un-resolved component types and triggering lazy loads.
    // Ideally this uses Angular's upcoming `import()` template native syntax, 
    // but for now we manually ingest the registry loaders.
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
    }, 100); // Polling for demo, typical implementation uses explicit RxJS subjects on state changes.
  }
}
