import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SduiBladeNode } from '@slashand/sdui-blade-core';
import { SduiBladeHostComponent, SduiBladeService, BLADE_REGISTRY } from '../../../src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SduiBladeHostComponent],
  template: `
    <!-- The Root Blade Host intercepts the entire viewport -->
    <app-sdui-blade-host>
      <div class="p-8">
        <h1 class="text-4xl font-bold mb-4">SDUI Angular Sandbox</h1>
        <p class="text-zinc-400 mb-8">Click below to parse and render a complex Server-Driven JSON Blade.</p>
        <button 
          (click)="triggerRemoteManifest()"
          class="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-500 transition-colors cursor-pointer">
          Fetch Remote JSON Manifest
        </button>
      </div>
    </app-sdui-blade-host>
  `,
  host: {
    class: 'block w-screen h-screen bg-zinc-950 text-white overflow-hidden'
  }
})
export class AppComponent {
  private readonly bladeService = inject(SduiBladeService);

  constructor() {
    // Scaffold initial registry mappings for the sandbox.
    BLADE_REGISTRY.register('Extension.FormBlade', async () => (await import('./mock-blades/form-blade.component')).FormBladeComponent);
    BLADE_REGISTRY.register('Common.Section', async () => (await import('./mock-blades/section.component')).SectionComponent);
    BLADE_REGISTRY.register('Common.Alert', async () => (await import('./mock-blades/alert.component')).AlertComponent);
  }

  triggerRemoteManifest() {
    // Simulated remote payload matching the SduiBladeNode / SduiElement schema matrix
    const manifest: SduiBladeNode = {
      id: 'demo-blade-1',
      type: 'Extension.FormBlade',
      props: {
        title: 'Azure Virtual Machine Configuration',
        subtitle: 'eastus-prod-cluster',
        width: 'medium',
        children: [
          {
            type: 'Common.Section',
            props: {
              title: 'Networking & Security Rules',
              children: [
                { type: 'Common.Alert', props: { message: 'Warning! Port 22 is open to the public internet. This constitutes a critical security vulnerability.', intent: 'warning' } },
                { type: 'Common.Alert', props: { message: 'Inbound traffic allowed exclusively from explicit known IP addresses.', intent: 'info' } }
              ]
            }
          }
        ]
      }
    };

    this.bladeService.openBlade(manifest);
  }
}
