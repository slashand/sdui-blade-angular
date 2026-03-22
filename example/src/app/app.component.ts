import { Component, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { SduiBladeNode, SduiElementType } from '@slashand/sdui-blade-core';
import { BLADE_REGISTRY, SduiBladeHostComponent, SduiBladeService } from '../../../src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SduiBladeHostComponent],
  template: `
    <div class="flex flex-col h-screen w-screen bg-[var(--sdui-bg)] text-[var(--sdui-text)] overflow-hidden font-sans">
      
      <!-- Global Top Nav -->
      <header class="h-[48px] shrink-0 border-b border-[var(--sdui-border)] bg-[var(--sdui-panel-bg)] flex items-center px-[20px] justify-between z-20">
        <div class="flex items-center gap-[20px]">
          <h2 class="text-xl font-black tracking-tight text-[var(--sdui-primary)]">Slashand<span class="text-[var(--sdui-text)]">Cloud</span></h2>
          <div class="w-[1px] h-[24px] bg-[var(--sdui-border)]"></div>
          <div class="text-sm font-medium text-[var(--sdui-text)]">Dashboard</div>
        </div>
        <div class="flex items-center gap-[20px] text-sm text-[var(--sdui-muted)]">
          <span>Active Directory</span>
          <div class="w-8 h-8 rounded-full bg-[var(--sdui-primary)] text-[var(--sdui-text-inverse)] flex items-center justify-center font-bold">TC</div>
        </div>
      </header>

      <div class="flex flex-1 overflow-hidden relative">
        <!-- Collapsible Sidebar -->
        <nav class="w-64 shrink-0 border-r border-[var(--sdui-border)] bg-[var(--sdui-panel-bg)] flex flex-col z-10 shadow-lg transition-all duration-300">
          <ul class="flex flex-col w-full py-4">
            <li class="px-5 py-2 uppercase text-[11px] font-bold tracking-wider text-[var(--sdui-muted)]/70">Blade Sizing Specs</li>
            <li>
              <a [routerLink]="[]" [queryParams]="{ b: 'demo-blade-full' }" 
                 routerLinkActive="bg-[var(--sdui-border)] text-[var(--sdui-text)] font-semibold border-l-2 border-[var(--sdui-primary)]" 
                 class="block px-5 py-[8px] text-[13px] text-[var(--sdui-muted)] transition-colors hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] border-l-2 border-transparent">
                Full-Width (Default)
              </a>
            </li>
            <li>
              <a [routerLink]="[]" [queryParams]="{ b: 'demo-blade-xlarge' }" 
                 routerLinkActive="bg-[var(--sdui-border)] text-[var(--sdui-text)] font-semibold border-l-2 border-[var(--sdui-primary)]" 
                 class="block px-5 py-[8px] text-[13px] text-[var(--sdui-muted)] transition-colors hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] border-l-2 border-transparent">
                X-Large (1125px)
              </a>
            </li>
            <li>
              <a [routerLink]="[]" [queryParams]="{ b: 'demo-blade-large' }" 
                 routerLinkActive="bg-[var(--sdui-border)] text-[var(--sdui-text)] font-semibold border-l-2 border-[var(--sdui-primary)]" 
                 class="block px-5 py-[8px] text-[13px] text-[var(--sdui-muted)] transition-colors hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] border-l-2 border-transparent">
                Large (855px)
              </a>
            </li>
            <li>
              <a [routerLink]="[]" [queryParams]="{ b: 'demo-blade-medium' }" 
                 routerLinkActive="bg-[var(--sdui-border)] text-[var(--sdui-text)] font-semibold border-l-2 border-[var(--sdui-primary)]" 
                 class="block px-5 py-[8px] text-[13px] text-[var(--sdui-muted)] transition-colors hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] border-l-2 border-transparent">
                Medium (585px)
              </a>
            </li>
             <li>
              <a [routerLink]="[]" [queryParams]="{ b: 'demo-blade-small' }" 
                 routerLinkActive="bg-[var(--sdui-border)] text-[var(--sdui-text)] font-semibold border-l-2 border-[var(--sdui-primary)]" 
                 class="block px-5 py-[8px] text-[13px] text-[var(--sdui-muted)] transition-colors hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] border-l-2 border-transparent">
                Small (315px)
              </a>
            </li>
            <li>
              <a [routerLink]="[]" [queryParams]="{ b: 'demo-blade-menu' }" 
                 routerLinkActive="bg-[var(--sdui-border)] text-[var(--sdui-text)] font-semibold border-l-2 border-[var(--sdui-primary)]" 
                 class="block px-5 py-[8px] text-[13px] text-[var(--sdui-muted)] transition-colors hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] border-l-2 border-transparent">
                Menu (265px)
              </a>
            </li>
          </ul>
        </nav>

        <!-- Main Content Area Wrapped by SDUI Blade Host! -->
        <app-sdui-blade-host class="flex-1 relative flex flex-col overflow-hidden bg-[var(--sdui-bg)]">
          <main class="h-full w-full overflow-auto p-[20px] relative z-0 flex flex-col items-center justify-center">
            
            <div class="p-8 border-2 border-dashed border-[var(--sdui-border)] rounded-lg flex flex-col items-center justify-center bg-[var(--sdui-panel-bg)]/30 max-w-lg text-center">
              <div class="text-[var(--sdui-muted)] mb-2">
                <!-- Compass / Hub icon -->
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
              </div>
              <h2 class="text-xl font-bold text-[var(--sdui-text)] mb-2">Welcome to SDUI Blade Angular</h2>
              <p class="text-sm text-[var(--sdui-muted)] mb-4">
                The core dashboard is completely empty. Click <strong>Virtual Machines</strong> in the sidebar to simulate receiving an <code>xlarge</code> JSON payload from the server, mapping a pristine Full-Width Browse Blade dynamically over the workspace.
              </p>
            </div>

          </main>
        </app-sdui-blade-host>
      </div>
    </div>
  `,
  host: {
    class: 'block w-screen h-screen bg-[var(--sdui-bg)] text-[var(--sdui-text)] overflow-hidden'
  }
})
export class AppComponent implements OnInit {
  private readonly bladeService = inject(SduiBladeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private isHydrating = true;

  // MOCK DATABASE FOR DEEP-LINK HYDRATION
  // Normally the Engine makes REST/GQL calls for these IDs
  private readonly mockDb: Record<string, SduiBladeNode> = {};

  constructor() {
    // Scaffold initial registry mappings for the sandbox.
    BLADE_REGISTRY.register(SduiElementType.Blade, async () => (await import('./mock-blades/form-blade.component')).FormBladeComponent);
    BLADE_REGISTRY.register(SduiElementType.Section, async () => (await import('./mock-blades/section.component')).SectionComponent);
    BLADE_REGISTRY.register(SduiElementType.Alert, async () => (await import('./mock-blades/alert.component')).AlertComponent);
    BLADE_REGISTRY.register('MOCK_BUTTON', async () => (await import('./mock-blades/button.component')).ButtonComponent);
    BLADE_REGISTRY.register('MOCK_INPUT', async () => (await import('./mock-blades/form-input.component')).FormInputComponent);
    BLADE_REGISTRY.register('MOCK_TEXT', async () => (await import('./mock-blades/text.component')).TextComponent);
    BLADE_REGISTRY.register('MOCK_ROW', async () => (await import('./mock-blades/row.component')).RowComponent);

    this.initializeMockDb();

    // Natively observe the Engine's Signal tree. Serialize only Durable Blades to the URL.
    effect(() => {
      const active = this.bladeService.activeBlades();

      // Do not wipe the URL while Angular is booting up!
      if (this.isHydrating) return;

      const durableIds = active
        .filter(b => b.properties && !(b.properties as any)['isTransient'])
        .map(b => b.id);

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { b: durableIds.length > 0 ? durableIds.join(',') : null },
        queryParamsHandling: 'merge',
        // Important: replaceUrl should be FALSE if we want browser BACK button to work!
        // We only replace if we don't want history. But we DO want history for Blades.
        replaceUrl: false
      });
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    // BROWSER REFRESH REHYDRATION AND BROWSER BACK BUTTON SYNC:
    // We listen to the router's exact query params. This fires on reload AND on Back/Forward!
    this.route.queryParams.subscribe(params => {
      const bParam = params['b'];
      const activeIds = this.bladeService.activeBlades().map(b => b.id);

      if (!bParam) {
        // If URL has no blades but engine does (Back button pressed to root), clear them.
        this.bladeService.closeAllBlades();
      } else {
        const ids = bParam.split(',');

        // 1. Check if we actually need to change anything
        if (ids.join(',') === activeIds.join(',')) {
          return; // Perfect sync, do nothing.
        }

        // 2. ATOMIC SYNC: We bypass `openBlade`/`closeBlade` loop differences because closing 
        // a root blade via the standard API triggers the "Chain of Death" which accidentally 
        // obliterates any new blades we just added to the end of the array.
        // By using `setBlades`, we instruct the Engine to strictly match the URL's snapshot.
        const mappedNodes = ids.map((id: string) => this.mockDb[id]).filter((n: any) => !!n);
        this.bladeService.setBlades(mappedNodes);
      }

      // Release lock after first parse
      if (this.isHydrating) {
        setTimeout(() => this.isHydrating = false, 50);
      }
    });
  }

  private initializeMockDb() {
    
    const fullManifest: SduiBladeNode = {
      id: 'demo-blade-full',
      type: SduiElementType.Blade,
      properties: { title: 'Full Width (Responsive)', subtitle: 'flex-1' } as any,
      children: [
        { 
          id: 's1', type: SduiElementType.Section, properties: { title: 'Behavior' }, 
          children: [
            { id: 't1', type: 'MOCK_TEXT' as any, properties: { content: 'This blade claims all available horizontal space (flex-1). It acts as a powerful root Dashboard.' } },
            { id: 'btn-sub', type: 'MOCK_BUTTON' as any, properties: { label: '＋ Spawn Large Blade', actionPayload: { id: 'demo-blade-large' } } }
          ] 
        }
      ]
    };

    const xlargeManifest: SduiBladeNode = {
      id: 'demo-blade-xlarge',
      type: SduiElementType.Blade,
      properties: { title: 'X-Large Constraint', width: 'xlarge' } as any,
      children: [
        { 
          id: 's2', type: SduiElementType.Section, properties: { title: '1125px Structural Limit' }, 
          children: [
            { id: 't2', type: 'MOCK_TEXT' as any, properties: { content: 'Perfect for wide data grids or complex configuration wizards.' } },
            { id: 'btn2', type: 'MOCK_BUTTON' as any, properties: { label: '＋ Nested Large Blade', actionPayload: { id: 'demo-blade-large' } } }
          ] 
        }
      ]
    };

    const largeManifest: SduiBladeNode = {
      id: 'demo-blade-large',
      type: SduiElementType.Blade,
      properties: { title: 'Large Constraint', width: 'large' } as any,
      children: [
        { 
          id: 's3', type: SduiElementType.Section, properties: { title: '855px Structural Limit' }, 
          children: [
            { id: 't3', type: 'MOCK_TEXT' as any, properties: { content: 'The standard architectural width for primary resource overviews.' } },
            { id: 'btn3', type: 'MOCK_BUTTON' as any, properties: { label: '＋ Nested Medium Blade', actionPayload: { id: 'demo-blade-medium' } } }
          ] 
        }
      ]
    };

    const mediumManifest: SduiBladeNode = {
      id: 'demo-blade-medium',
      type: SduiElementType.Blade,
      properties: { title: 'Medium Constraint', width: 'medium' } as any,
      children: [
        { 
          id: 's4', type: SduiElementType.Section, properties: { title: '585px Structural Limit' }, 
          children: [
            { id: 't4', type: 'MOCK_TEXT' as any, properties: { content: 'The classic side-panel width used for deep configuration forms or tagging.' } },
            { id: 'btn4', type: 'MOCK_BUTTON' as any, properties: { label: '＋ Nested Small Blade', actionPayload: { id: 'demo-blade-small' } } }
          ] 
        }
      ]
    };

    const smallManifest: SduiBladeNode = {
      id: 'demo-blade-small',
      type: SduiElementType.Blade,
      properties: { title: 'Small Constraint', width: 'small' } as any,
      children: [
        { 
          id: 's5', type: SduiElementType.Section, properties: { title: '315px Structural Limit' }, 
          children: [
            { id: 't5', type: 'MOCK_TEXT' as any, properties: { content: 'Used for tiny flyouts or quick action menus.' } },
            { id: 'btn5', type: 'MOCK_BUTTON' as any, properties: { label: '＋ Nested Menu Blade', actionPayload: { id: 'demo-blade-menu' } } }
          ] 
        }
      ]
    };

    const menuManifest: SduiBladeNode = {
      id: 'demo-blade-menu',
      type: SduiElementType.Blade,
      properties: { title: 'Menu Constraint', width: 'menu' } as any,
      children: [
        { 
          id: 's6', type: SduiElementType.Section, properties: { title: '265px Structural Limit' }, 
          children: [
            { id: 't6', type: 'MOCK_TEXT' as any, properties: { content: 'The absolute thinnest blade form-factor, strictly for tertiary navigation arrays.' } }
          ] 
        }
      ]
    };

    this.mockDb['demo-blade-full'] = fullManifest;
    this.mockDb['demo-blade-xlarge'] = xlargeManifest;
    this.mockDb['demo-blade-large'] = largeManifest;
    this.mockDb['demo-blade-medium'] = mediumManifest;
    this.mockDb['demo-blade-small'] = smallManifest;
    this.mockDb['demo-blade-menu'] = menuManifest;

    // Connect payload relations
    (fullManifest.children![0] as any).children[1].properties.actionPayload = largeManifest;
    (xlargeManifest.children![0] as any).children[1].properties.actionPayload = largeManifest;
    (largeManifest.children![0] as any).children[1].properties.actionPayload = mediumManifest;
    (mediumManifest.children![0] as any).children[1].properties.actionPayload = smallManifest;
    (smallManifest.children![0] as any).children[1].properties.actionPayload = menuManifest;
  }
}

