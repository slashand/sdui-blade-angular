import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BLADE_REGISTRY, SduiBladeHostComponent, SduiBladeService } from '@slashand/sdui-blade-angular';
import { SduiBladeNode, SduiElementType } from '@slashand/sdui-blade-core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SduiBladeHostComponent],
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
        <nav 
          [class.w-[180px]]="sidebarExpanded()" 
          [class.w-[50px]]="!sidebarExpanded()" 
          class="shrink-0 border-r border-[var(--sdui-border)] bg-[var(--sdui-panel-bg)] flex flex-col justify-between z-10 shadow-lg transition-all duration-300 overflow-hidden">
          
          <ul class="flex flex-col w-full py-4">
            @if (sidebarExpanded()) {
              <li class="px-5 py-2 uppercase text-[11px] font-bold tracking-wider text-[var(--sdui-muted)]/70 whitespace-nowrap">Blade Sizing Specs</li>
            } @else {
              <li class="px-[13px] py-2 uppercase text-[11px] font-bold tracking-wider text-[var(--sdui-muted)]/70 flex justify-center w-full">BS</li>
            }

            <li>
              <a [routerLink]="[]" [queryParams]="{ b: 'demo-blade-full' }" 
                 routerLinkActive="bg-[var(--sdui-border)] text-[var(--sdui-text)] font-semibold border-l-2 border-[var(--sdui-primary)]" 
                 class="flex items-center gap-[12px] px-[16px] py-[10px] text-[13px] text-[var(--sdui-muted)] transition-colors hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] border-l-2 border-transparent hover:underline overflow-hidden whitespace-nowrap">
                <svg class="shrink-0 text-[16px]" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                <span [class.opacity-0]="!sidebarExpanded()" class="transition-opacity duration-200">Full-Width (Default)</span>
              </a>
            </li>
            <li>
              <a [routerLink]="[]" [queryParams]="{ b: 'demo-blade-xlarge' }" 
                 routerLinkActive="bg-[var(--sdui-border)] text-[var(--sdui-text)] font-semibold border-l-2 border-[var(--sdui-primary)]" 
                 class="flex items-center gap-[12px] px-[16px] py-[10px] text-[13px] text-[var(--sdui-muted)] transition-colors hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] border-l-2 border-transparent overflow-hidden whitespace-nowrap">
                <svg class="shrink-0 text-[16px]" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="16" y1="4" x2="16" y2="20"/></svg>
                <span [class.opacity-0]="!sidebarExpanded()" class="transition-opacity duration-200">X-Large (1125px)</span>
              </a>
            </li>
            <li>
              <a [routerLink]="[]" [queryParams]="{ b: 'demo-blade-large' }" 
                 routerLinkActive="bg-[var(--sdui-border)] text-[var(--sdui-text)] font-semibold border-l-2 border-[var(--sdui-primary)]" 
                 class="flex items-center gap-[12px] px-[16px] py-[10px] text-[13px] text-[var(--sdui-muted)] transition-colors hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] border-l-2 border-transparent overflow-hidden whitespace-nowrap">
                <svg class="shrink-0 text-[16px]" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="14" y1="4" x2="14" y2="20"/></svg>
                <span [class.opacity-0]="!sidebarExpanded()" class="transition-opacity duration-200">Large (855px)</span>
              </a>
            </li>
            <li>
              <a [routerLink]="[]" [queryParams]="{ b: 'demo-blade-medium' }" 
                 routerLinkActive="bg-[var(--sdui-border)] text-[var(--sdui-text)] font-semibold border-l-2 border-[var(--sdui-primary)]" 
                 class="flex items-center gap-[12px] px-[16px] py-[10px] text-[13px] text-[var(--sdui-muted)] transition-colors hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] border-l-2 border-transparent overflow-hidden whitespace-nowrap">
                <svg class="shrink-0 text-[16px]" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
                <span [class.opacity-0]="!sidebarExpanded()" class="transition-opacity duration-200">Medium (585px)</span>
              </a>
            </li>
             <li>
              <a [routerLink]="[]" [queryParams]="{ b: 'demo-blade-small' }" 
                 routerLinkActive="bg-[var(--sdui-border)] text-[var(--sdui-text)] font-semibold border-l-2 border-[var(--sdui-primary)]" 
                 class="flex items-center gap-[12px] px-[16px] py-[10px] text-[13px] text-[var(--sdui-muted)] transition-colors hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] border-l-2 border-transparent overflow-hidden whitespace-nowrap">
                <svg class="shrink-0 text-[16px]" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="12" height="16" rx="2"/><line x1="10" y1="4" x2="10" y2="20"/></svg>
                <span [class.opacity-0]="!sidebarExpanded()" class="transition-opacity duration-200">Small (315px)</span>
              </a>
            </li>
            <li>
              <a [routerLink]="[]" [queryParams]="{ b: 'demo-blade-menu' }" 
                 routerLinkActive="bg-[var(--sdui-border)] text-[var(--sdui-text)] font-semibold border-l-2 border-[var(--sdui-primary)]" 
                 class="flex items-center gap-[12px] px-[16px] py-[10px] text-[13px] text-[var(--sdui-muted)] transition-colors hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] border-l-2 border-transparent overflow-hidden whitespace-nowrap">
                <svg class="shrink-0 text-[16px]" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                <span [class.opacity-0]="!sidebarExpanded()" class="transition-opacity duration-200">Menu (265px)</span>
              </a>
            </li>

            <!-- BEHAVIORAL AND SCROLL SPECS -->
            @if (sidebarExpanded()) {
              <li class="px-5 mt-4 py-2 uppercase text-[11px] font-bold tracking-wider text-[var(--sdui-muted)]/70 whitespace-nowrap">Behavioral Specs</li>
            } @else {
              <li class="px-[13px] mt-4 py-2 uppercase text-[11px] font-bold tracking-wider text-[var(--sdui-muted)]/70 flex justify-center w-full">BX</li>
            }

            <li>
              <a [routerLink]="[]" [queryParams]="{ b: 'demo-kitchen-sink' }" 
                 routerLinkActive="bg-[var(--sdui-border)] text-[var(--sdui-text)] font-semibold border-l-2 border-teal-500" 
                 class="flex items-center gap-[12px] px-[16px] py-[10px] text-[13px] text-[var(--sdui-muted)] transition-colors hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] border-l-2 border-transparent overflow-hidden whitespace-nowrap">
                <svg class="shrink-0 text-[16px]" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <span [class.opacity-0]="!sidebarExpanded()" class="transition-opacity duration-200">Kitchen Sink (Scroll)</span>
              </a>
            </li>
            <li>
              <a [routerLink]="[]" [queryParams]="{ b: 'demo-limited-scroll' }" 
                 routerLinkActive="bg-[var(--sdui-border)] text-[var(--sdui-text)] font-semibold border-l-2 border-teal-500" 
                 class="flex items-center gap-[12px] px-[16px] py-[10px] text-[13px] text-[var(--sdui-muted)] transition-colors hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] border-l-2 border-transparent overflow-hidden whitespace-nowrap">
                <svg class="shrink-0 text-[16px]" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg>
                <span [class.opacity-0]="!sidebarExpanded()" class="transition-opacity duration-200">Limited Scroll Block</span>
              </a>
            </li>
            <li>
              <a [routerLink]="[]" [queryParams]="{ b: 'demo-stacking' }" 
                 routerLinkActive="bg-[var(--sdui-border)] text-[var(--sdui-text)] font-semibold border-l-2 border-amber-500" 
                 class="flex items-center gap-[12px] px-[16px] py-[10px] text-[13px] text-[var(--sdui-muted)] transition-colors hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] border-l-2 border-transparent overflow-hidden whitespace-nowrap">
                <svg class="shrink-0 text-[16px]" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                <span [class.opacity-0]="!sidebarExpanded()" class="transition-opacity duration-200">Journey Parallax Stack</span>
              </a>
            </li>
            <li>
              <a [routerLink]="[]" [queryParams]="{ b: 'demo-naked' }" 
                 routerLinkActive="bg-[var(--sdui-border)] text-[var(--sdui-text)] font-semibold border-l-2 border-fuchsia-500" 
                 class="flex items-center gap-[12px] px-[16px] py-[10px] text-[13px] text-[var(--sdui-muted)] transition-colors hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] border-l-2 border-transparent overflow-hidden whitespace-nowrap">
                <svg class="shrink-0 text-[16px]" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20"/><path d="M12 2v20"/></svg>
                <span [class.opacity-0]="!sidebarExpanded()" class="transition-opacity duration-200">Naked Decoupling</span>
              </a>
            </li>
            <li>
              <a [routerLink]="[]" [queryParams]="{ b: 'demo-footer' }" 
                 routerLinkActive="bg-[var(--sdui-border)] text-[var(--sdui-text)] font-semibold border-l-2 border-fuchsia-500" 
                 class="flex items-center gap-[12px] px-[16px] py-[10px] text-[13px] text-[var(--sdui-muted)] transition-colors hover:bg-[var(--sdui-border)] hover:text-[var(--sdui-text)] border-l-2 border-transparent overflow-hidden whitespace-nowrap">
                <svg class="shrink-0 text-[16px]" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="14" width="18" height="8" rx="2" ry="2"/><path d="M3 14h18"/><path d="M3 10h18"/><path d="M3 6h18"/></svg>
                <span [class.opacity-0]="!sidebarExpanded()" class="transition-opacity duration-200">Footer Alignments</span>
              </a>
            </li>
          </ul>

          <div class="p-2 border-t border-[var(--sdui-border)] flex" [class.justify-end]="sidebarExpanded()" [class.justify-center]="!sidebarExpanded()">
            <button 
              (click)="sidebarExpanded.set(!sidebarExpanded())"
              class="p-2 rounded hover:bg-[var(--sdui-border)] text-[var(--sdui-muted)] hover:text-[var(--sdui-text)] transition-colors text-xs font-bold font-mono tracking-widest cursor-pointer"
              title="Toggle Sidebar">
              {{ sidebarExpanded() ? '<<' : '>>' }}
            </button>
          </div>
        </nav>

        <!-- Main Content Area Wrapped by SDUI Blade Host! -->
        <app-sdui-blade-host class="flex-1 relative flex flex-col overflow-hidden bg-[var(--sdui-bg)]">
          <main class="h-full w-full overflow-auto p-[20px] relative z-0 flex flex-col items-center justify-center bg-[radial-gradient(var(--sdui-border)_1px,transparent_1px)] [background-size:24px_24px]">
            
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

  public readonly sidebarExpanded = signal(true);

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

    // NEW BEHAVIORAL SPEC REGISTRATIONS
    BLADE_REGISTRY.register('kitchen-sink', async () => (await import('./mock-blades/kitchen-sink-blade.component')).KitchenSinkBladeComponent);
    BLADE_REGISTRY.register('limited-scroll', async () => (await import('./mock-blades/limited-scroll-blade.component')).LimitedScrollBladeComponent);
    BLADE_REGISTRY.register('stack-test', async () => (await import('./mock-blades/stacking-blade.component')).StackingBladeComponent);
    BLADE_REGISTRY.register('naked-test', async () => (await import('./mock-blades/naked-blade.component')).NakedBladeComponent);
    BLADE_REGISTRY.register('footer-test', async () => (await import('./mock-blades/footer-alignments-blade.component')).FooterAlignmentsBladeComponent);

    this.initializeMockDb();

    // Natively observe the Engine's Signal tree. Serialize only Durable Blades to the URL.
    effect(() => {
      const active = this.bladeService.activeBlades();

      // Do not wipe the URL while Angular is booting up!
      if (this.isHydrating) return;

      const durableIds = active
        .filter(bladeNode => bladeNode.properties && !(bladeNode.properties as any)['isTransient'])
        .map(bladeNode => bladeNode.id);

      const durableParams = durableIds.length > 0 ? durableIds.join(',') : null;
      const currentParams = this.route.snapshot.queryParams['b'] || null;

      // Prevent Navigation Ping-Pong: Only push to history if the state ACTUALLY drifted from the URL
      if (durableParams !== currentParams) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { b: durableParams },
          queryParamsHandling: 'merge',
          // Important: replaceUrl should be FALSE if we want browser BACK button to work!
          replaceUrl: false
        });
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    // BROWSER REFRESH REHYDRATION AND BROWSER BACK BUTTON SYNC:
    // We listen to the router's exact query params. This fires on reload AND on Back/Forward!
    this.route.queryParams.subscribe(params => {
      const bParam = params['b'];
      const activeIds = this.bladeService.activeBlades().map(bladeNode => bladeNode.id);

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
        const mappedNodes = ids.map((id: string) => this.mockDb[id]).filter((mappedNode: any) => !!mappedNode);
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
      properties: { title: 'Full Width (Responsive)', subtitle: 'flex-1', width: 'full' } as any,
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

    const kitchenSinkManifest: SduiBladeNode = {
      id: 'demo-kitchen-sink', type: 'kitchen-sink' as any,
      properties: { title: 'Kitchen Sink', width: 'large' } as any
    };

    const limitedScrollManifest: SduiBladeNode = {
      id: 'demo-limited-scroll', type: 'limited-scroll' as any,
      properties: { title: 'Limited Overflow', width: 'medium' } as any
    };

    const stackingManifest: SduiBladeNode = {
      id: 'demo-stacking', type: 'stack-test' as any,
      properties: { depth: 1, width: 'xlarge' } as any
    };

    const nakedManifest: SduiBladeNode = {
      id: 'demo-naked', type: 'naked-test' as any,
      properties: { width: 'large' } as any
    };

    const footerManifest: SduiBladeNode = {
      id: 'demo-footer', type: 'footer-test' as any,
      properties: { width: 'medium' } as any
    };

    this.mockDb['demo-blade-full'] = fullManifest;
    this.mockDb['demo-blade-xlarge'] = xlargeManifest;
    this.mockDb['demo-blade-large'] = largeManifest;
    this.mockDb['demo-blade-medium'] = mediumManifest;
    this.mockDb['demo-blade-small'] = smallManifest;
    this.mockDb['demo-blade-menu'] = menuManifest;
    this.mockDb['demo-kitchen-sink'] = kitchenSinkManifest;
    this.mockDb['demo-limited-scroll'] = limitedScrollManifest;
    this.mockDb['demo-stacking'] = stackingManifest;
    this.mockDb['demo-naked'] = nakedManifest;
    this.mockDb['demo-footer'] = footerManifest;

    // Connect payload relations
    (fullManifest.children![0] as any).children[1].properties.actionPayload = largeManifest;
    (xlargeManifest.children![0] as any).children[1].properties.actionPayload = largeManifest;
    (largeManifest.children![0] as any).children[1].properties.actionPayload = mediumManifest;
    (mediumManifest.children![0] as any).children[1].properties.actionPayload = smallManifest;
    (smallManifest.children![0] as any).children[1].properties.actionPayload = menuManifest;
  }
}

