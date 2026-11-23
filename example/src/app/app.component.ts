import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  effect,
  HostListener,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { BLADE_REGISTRY, SduiBladeHostComponent, SduiBladeService } from '@slashand/sdui-blade-angular';
import { SduiBladeNode, SduiElementType, SduiNode, SduiParser } from '@slashand/sdui-blade-core';
import { CORE_PILLARS, generateProceduralPayload, OmniverseApp } from './omniverse-gallery';
import { resolveStackingChild } from './mock-blades/stacking-blade-node';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SduiBladeHostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sdui-demo-shell" [attr.data-theme]="currentTheme()">
      <a class="sdui-skip-link" href="#demo-main">Skip to demo gallery</a>
      <header #demoHeader class="sdui-global-header" (keydown.escape)="closeOptions($event)">
        <h1 class="sdui-brand-title" aria-label="sdui Omniverse SDK Matrix Angular">
          <span class="sdui-brand-prefix">sdui ::</span> <span class="sdui-brand-long">Omniverse </span>SDK Matrix
          <span class="sdui-framework-label">Angular</span>
        </h1>
        <button
          #optionsToggle
          type="button"
          class="sdui-header-button sdui-options-toggle"
          aria-label="Demo options"
          aria-controls="sdui-demo-options"
          [attr.aria-expanded]="optionsOpen()"
          (click)="optionsOpen.set(!optionsOpen())"
        >
          ⋯
        </button>
        <div id="sdui-demo-options" class="sdui-header-actions" [class.sdui-options-open]="optionsOpen()">
          <span class="sdui-theme-label">Current theme: {{ themeName() }}</span>
          <button
            type="button"
            class="sdui-header-button sdui-theme-button"
            (click)="toggleTheme(); optionsOpen.set(false)"
          >
            Change theme
          </button>
          <button
            type="button"
            class="sdui-header-button sdui-toggle-backdrop-button"
            [attr.aria-pressed]="backdropEnabled()"
            (click)="backdropEnabled.set(!backdropEnabled()); optionsOpen.set(false)"
          >
            Backdrop: {{ backdropEnabled() ? 'Enabled' : 'Disabled' }}
          </button>
          <button
            #inspectorToggle
            type="button"
            class="sdui-header-button sdui-inspector-button"
            [attr.aria-expanded]="showJson()"
            aria-controls="sdui-json-inspector"
            (click)="toggleInspector(); optionsOpen.set(false)"
          >
            {{ showJson() ? 'Close payload inspector' : 'Inspect manifest JSON' }}
          </button>
        </div>
      </header>
      <div class="sdui-body-container">
        <nav class="sdui-global-sidebar" aria-label="Demo navigation">
          <button
            type="button"
            class="sdui-sidebar-action sdui-sidebar-primary"
            (click)="bladeService.closeAllBlades()"
            aria-label="Demo gallery"
            title="Demo gallery"
            >✨</button
          >
          <button
            type="button"
            class="sdui-sidebar-action"
            (click)="toggleTheme()"
            aria-label="Change demo theme"
            title="Change demo theme"
          >
            🎨
          </button>
          <span class="sdui-sidebar-action sdui-sidebar-inactive" aria-hidden="true" title="Telemetry preview">📊</span>
        </nav>
        <div #demoWorkspace class="sdui-demo-workspace">
          <app-sdui-blade-host [backdrop]="{ enabled: backdropEnabled(), opacity: 0.36, blur: 3 }">
            <main id="demo-main" tabindex="-1" class="sdui-work-surface">
              <div class="sdui-gallery-inner">
                <div class="sdui-gallery-intro">
                  <h2>SDUI Framework Orchestrator</h2>
                  <p>
                    Explore structural blade sizes, nested journeys, scrolling and footer layouts. Angular mounts each
                    example through the SDK.
                  </p>
                </div>
                <div class="sdui-gallery-grid">
                  <button
                    type="button"
                    class="sdui-matrix-tile"
                    [attr.data-selected]="selectedTileId() === 'procedural'"
                    [attr.aria-pressed]="selectedTileId() === 'procedural'"
                    (click)="launchOmniverseApp(generateProceduralPayload(), $event)"
                  >
                    <span class="sdui-card-heading"
                      ><span class="sdui-card-icon" aria-hidden="true">🌌</span
                      ><span class="sdui-card-title">Synthesize Infinite App</span></span
                    >
                    <span class="sdui-card-description"
                      >Generate a fresh layout from the same protocol used by the React and Svelte demos.</span
                    >
                    <span class="sdui-card-action">Dispatch layout generator →</span>
                  </button>
                  @for (app of pillars; track app.id) {
                    <button type="button" class="sdui-matrix-tile" [attr.data-selected]="selectedTileId() === app.id" [attr.aria-pressed]="selectedTileId() === app.id" (click)="launchOmniverseApp(app, $event)">
                      <span class="sdui-card-heading">
                        <span class="sdui-card-icon" aria-hidden="true">{{ app.icon }}</span>
                        <span class="sdui-card-heading-text">
                          <span class="sdui-card-category">{{ app.category }}</span>
                          <span class="sdui-card-title">{{ app.name }}</span>
                        </span>
                      </span>
                      <span class="sdui-card-description">{{ app.description }}</span>
                      <span class="sdui-card-action">Load manifest and open blade →</span>
                    </button>
                  }
                  @for (demo of demoCards; track demo.id) {
                    <button
                      type="button"
                      class="sdui-matrix-tile"
                      [attr.data-selected]="selectedTileId() === demo.id"
                      [attr.aria-pressed]="selectedTileId() === demo.id"
                      (click)="openDemo(demo.id, $event)"
                    >
                      <span class="sdui-card-heading"
                        ><span class="sdui-card-icon" aria-hidden="true">{{ demo.icon }}</span
                        ><span class="sdui-card-heading-text"
                          ><span class="sdui-card-category">{{ demo.category }}</span
                          ><span class="sdui-card-title">{{ demo.title }}</span></span
                        ></span
                      >
                      <span class="sdui-card-description">{{ demo.description }}</span>
                      <span class="sdui-card-action">Load manifest and open blade →</span>
                    </button>
                  }
                </div>
              </div>
            </main>
          </app-sdui-blade-host>
        </div>
        @if (showJson()) {
          <aside
            id="sdui-json-inspector"
            class="sdui-json-editor-overlay"
            aria-label="Manifest JSON inspector"
            (keydown.escape)="closeInspector($event)"
          >
            <div class="sdui-json-header">
              <div>
                <h2>JSON AST Inspector</h2>
                <p>Live schema editor</p>
              </div>
              <button
                type="button"
                class="sdui-json-close-button"
                aria-label="Close payload inspector"
                (click)="closeInspector()"
              >
                ×
              </button>
            </div>
            @if (validationError()) {
              <p class="sdui-json-error-banner" role="alert">{{ validationError() }}</p>
            }
            <label class="sdui-json-label" for="sdui-json-input">Manifest JSON</label>
            <textarea
              #inspectorTextarea
              id="sdui-json-input"
              class="sdui-json-textarea"
              [value]="jsonInput()"
              (input)="updateJson($event)"
              spellcheck="false"
              placeholder="Select a gallery example to inspect its manifest"
            ></textarea>
            <div class="sdui-json-footer">
              <button
                type="button"
                class="sdui-json-apply-button"
                [disabled]="!jsonInput() || !!validationError()"
                (click)="applyJson()"
              >
                Apply manifest
              </button>
            </div>
          </aside>
        }
      </div>
    </div>
  `,
  host: {
    class: 'sdui-demo-root',
  },
})
export class AppComponent implements OnInit, AfterViewInit {
  readonly pillars = CORE_PILLARS;
  readonly generateProceduralPayload = generateProceduralPayload;
  readonly demoCards = [
    {
      id: 'demo-blade-full',
      title: 'Full-Width (Default)',
      category: 'Sizing',
      description: 'Full work-area blade that preserves navigation.',
      icon: '🧭',
    },
    {
      id: 'demo-blade-xlarge',
      title: 'X-Large (1125px)',
      category: 'Sizing',
      description: 'Wide workspace for detailed content.',
      icon: '🗂️',
    },
    {
      id: 'demo-blade-large',
      title: 'Large (855px)',
      category: 'Sizing',
      description: 'A spacious side panel.',
      icon: '🗃️',
    },
    {
      id: 'demo-blade-medium',
      title: 'Medium (585px)',
      category: 'Sizing',
      description: 'Configuration with nested smaller blades.',
      icon: '⚙️',
    },
    {
      id: 'demo-blade-small',
      title: 'Small (315px)',
      category: 'Sizing',
      description: 'Compact secondary information.',
      icon: '📋',
    },
    {
      id: 'demo-blade-menu',
      title: 'Menu (265px)',
      category: 'Sizing',
      description: 'Narrow contextual commands.',
      icon: '☰',
    },
    {
      id: 'demo-kitchen-sink',
      title: 'Kitchen Sink (Scroll)',
      category: 'Behavior',
      description: 'Scrollable content and fixed controls.',
      icon: '📜',
    },
    {
      id: 'demo-limited-scroll',
      title: 'Limited Scroll Block',
      category: 'Behavior',
      description: 'Independent content scrolling.',
      icon: '↕️',
    },
    {
      id: 'demo-stacking',
      title: 'Journey Parallax Stack',
      category: 'Behavior',
      description: 'Nested navigation through the real host.',
      icon: '🧩',
    },
    {
      id: 'demo-naked',
      title: 'Naked Decoupling',
      category: 'Behavior',
      description: 'Custom content within SDK geometry.',
      icon: '✨',
    },
    {
      id: 'demo-footer',
      title: 'Footer Alignments',
      category: 'Behavior',
      description: 'Explore footer action placement.',
      icon: '📐',
    },
  ];

  public readonly bladeService = inject(SduiBladeService);

  public readonly currentTheme = signal<'dark' | 'neon' | 'minimal'>('dark');
  public readonly themeName = computed(
    () => ({ dark: 'Default Dark', neon: 'Neon Cyberpunk', minimal: 'Light Minimal' })[this.currentTheme()],
  );
  public readonly showJson = signal(false);
  public readonly backdropEnabled = signal(true);
  public readonly optionsOpen = signal(false);
  public readonly selectedTileId = signal<string | null>(null);
  public readonly jsonInput = signal('');
  public readonly validationError = signal<string | null>(null);
  private readonly inspectorToggle = viewChild<ElementRef<HTMLButtonElement>>('inspectorToggle');
  private readonly optionsToggle = viewChild<ElementRef<HTMLButtonElement>>('optionsToggle');
  private readonly demoHeader = viewChild<ElementRef<HTMLElement>>('demoHeader');
  private readonly inspectorTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('inspectorTextarea');
  private readonly demoWorkspace = viewChild<ElementRef<HTMLElement>>('demoWorkspace');
  private readonly destroyRef = inject(DestroyRef);
  private lastGalleryTrigger: HTMLElement | null = null;
  private focusedBladeId: string | null = null;
  private pendingBladeFocus = false;

  // MOCK DATABASE FOR DEEP-LINK HYDRATION
  // Normally the Engine makes REST/GQL calls for these IDs
  private readonly mockDb: Record<string, SduiBladeNode> = {};

  public toggleTheme(): void {
    const themes = ['dark', 'neon', 'minimal'] as const;
    this.currentTheme.set(themes[(themes.indexOf(this.currentTheme()) + 1) % themes.length]);
  }

  public closeOptions(event: Event): void {
    if (!this.optionsOpen()) return;
    event.stopPropagation();
    this.optionsOpen.set(false);
    this.optionsToggle()?.nativeElement.focus();
  }

  @HostListener('document:pointerdown', ['$event'])
  public onDocumentPointerDown(event: PointerEvent): void {
    if (this.optionsOpen() && !this.demoHeader()?.nativeElement.contains(event.target as Node)) {
      this.optionsOpen.set(false);
    }
  }

  public toggleInspector(): void {
    if (this.showJson()) {
      this.closeInspector();
      return;
    }
    this.showJson.set(true);
  }

  public closeInspector(event?: Event): void {
    event?.stopPropagation();
    this.showJson.set(false);
    requestAnimationFrame(() =>
      (window.matchMedia('(max-width: 639px)').matches
        ? this.optionsToggle()
        : this.inspectorToggle()
      )?.nativeElement.focus(),
    );
  }

  public inspectDemo(id: string, event?: Event): void {
    if (event?.currentTarget instanceof HTMLElement) this.lastGalleryTrigger = event.currentTarget;
    const node = this.mockDb[id];
    if (node) {
      this.jsonInput.set(JSON.stringify({ version: '1.0', blade: node }, null, 2));
      this.validationError.set(null);
    }
  }

  public openDemo(id: string, event?: Event): void {
    this.inspectDemo(id, event);
    const node = this.mockDb[id];
    if (node) {
      this.bladeService.setBlades([node]);
      this.selectedTileId.set(id);
    }
  }

  public launchOmniverseApp(app: OmniverseApp, event?: Event): void {
    if (event?.currentTarget instanceof HTMLElement) this.lastGalleryTrigger = event.currentTarget;
    try {
      const manifest = SduiParser.parseManifest(app.payload);
      const blade = manifest.blade as SduiBladeNode;
      const demoBlade = this.registerOmniverseBlade(blade);
      if (app.id.startsWith('chaos-')) {
        try {
          sessionStorage.setItem(`sdui-demo-${demoBlade.id}`, JSON.stringify(app.payload));
        } catch {
          /* Storage is optional for the demo. */
        }
      }
      this.jsonInput.set(JSON.stringify(app.payload, null, 2));
      this.validationError.set(null);
      this.bladeService.setBlades([demoBlade]);
      this.selectedTileId.set(app.id.startsWith('chaos-') ? 'procedural' : app.id);
    } catch (error) {
      this.validationError.set(error instanceof Error ? error.message : 'Invalid manifest JSON');
      this.showJson.set(true);
    }
  }

  private registerOmniverseBlade(blade: SduiBladeNode): SduiBladeNode {
    const registered = {
      ...blade,
      properties: { ...blade.properties, omniverse: true } as SduiBladeNode['properties'],
    };
    this.mockDb[registered.id] = registered;
    const visit = (node: SduiNode): void => {
      const properties = (node.properties || {}) as Record<string, unknown>;
      const action = properties['action'] as { payload?: SduiBladeNode } | undefined;
      if (action?.payload?.type === SduiElementType.Blade) this.registerOmniverseBlade(action.payload);
      for (const child of node.children || []) visit(child);
    };
    for (const child of registered.children || []) visit(child);
    const actions = registered.properties as Record<string, unknown>;
    for (const item of [...((actions['toolbar'] || []) as SduiNode[]), ...((actions['footer'] || []) as SduiNode[])])
      visit(item);
    return registered;
  }

  public updateJson(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.jsonInput.set(value);
    if (!value.trim()) {
      this.validationError.set(null);
      return;
    }
    try {
      SduiParser.parseManifest(JSON.parse(value));
      this.validationError.set(null);
    } catch (error) {
      this.validationError.set(error instanceof Error ? error.message : 'Invalid manifest JSON');
    }
  }

  public applyJson(): void {
    try {
      const manifest = SduiParser.parseManifest(JSON.parse(this.jsonInput()));
      const blade = manifest.blade as SduiBladeNode;
      this.mockDb[blade.id] = blade;
      this.bladeService.setBlades([blade]);
      this.validationError.set(null);
      this.closeInspector();
    } catch (error) {
      this.validationError.set(error instanceof Error ? error.message : 'Invalid manifest JSON');
    }
  }

  public launchProceduralApp(event?: Event): void {
    if (event?.currentTarget instanceof HTMLElement) this.lastGalleryTrigger = event.currentTarget;
    const id = `demo-procedural-${Date.now()}`;
    const blade = this.buildProceduralBlade(id);
    this.mockDb[id] = blade;
    this.inspectDemo(id);
    this.bladeService.setBlades([blade]);
  }

  private buildProceduralBlade(id: string): SduiBladeNode {
    const sections = ['Overview', 'Activity', 'Next steps'];
    return {
      id,
      type: SduiElementType.Blade,
      properties: { title: 'Generated Angular Workspace', subtitle: 'Procedural SDK layout', width: 'large' },
      children: sections.map((title, index) => ({
        id: `${id}-section-${index}`,
        type: SduiElementType.Section,
        properties: { title },
        children: [
          {
            id: `${id}-text-${index}`,
            type: 'MOCK_TEXT' as SduiElementType,
            properties: { content: `${title}: this section was assembled from the Angular demo registry.` },
          },
        ],
      })),
    };
  }

  public ngAfterViewInit(): void {
    const workspace = this.demoWorkspace()?.nativeElement;
    if (!workspace) return;
    const observer = new MutationObserver(() => this.focusTopBlade());
    observer.observe(workspace, { childList: true, subtree: true });
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private focusTopBlade(): void {
    if (!this.pendingBladeFocus || this.showJson()) return;
    const workspace = this.demoWorkspace()?.nativeElement;
    const instances = workspace?.querySelectorAll('.sdui-blade-host-instance:not(.sdui-blade-leave)');
    const close = instances?.item(instances.length - 1)?.querySelector<HTMLButtonElement>('.sdui-blade-close');
    if (close) {
      this.pendingBladeFocus = false;
      close.focus({ preventScroll: true });
    }
  }

  constructor() {
    effect(() => {
      if (this.showJson()) this.inspectorTextarea()?.nativeElement.focus();
    });
    // Scaffold initial registry mappings for the sandbox.
    BLADE_REGISTRY.register(
      SduiElementType.Blade,
      async () => (await import('./mock-blades/form-blade.component')).FormBladeComponent,
    );
    BLADE_REGISTRY.register(
      SduiElementType.Section,
      async () => (await import('./mock-blades/section.component')).SectionComponent,
    );
    BLADE_REGISTRY.register(
      SduiElementType.Alert,
      async () => (await import('./mock-blades/alert.component')).AlertComponent,
    );
    BLADE_REGISTRY.register(
      'MOCK_BUTTON',
      async () => (await import('./mock-blades/button.component')).ButtonComponent,
    );
    BLADE_REGISTRY.register(
      'MOCK_INPUT',
      async () => (await import('./mock-blades/form-input.component')).FormInputComponent,
    );
    BLADE_REGISTRY.register('MOCK_TEXT', async () => (await import('./mock-blades/text.component')).TextComponent);
    BLADE_REGISTRY.register('MOCK_ROW', async () => (await import('./mock-blades/row.component')).RowComponent);

    // NEW BEHAVIORAL SPEC REGISTRATIONS
    BLADE_REGISTRY.register(
      'kitchen-sink',
      async () => (await import('./mock-blades/kitchen-sink-blade.component')).KitchenSinkBladeComponent,
    );
    BLADE_REGISTRY.register(
      'limited-scroll',
      async () => (await import('./mock-blades/limited-scroll-blade.component')).LimitedScrollBladeComponent,
    );
    BLADE_REGISTRY.register(
      'stack-test',
      async () => (await import('./mock-blades/stacking-blade.component')).StackingBladeComponent,
    );
    BLADE_REGISTRY.register(
      'naked-test',
      async () => (await import('./mock-blades/naked-blade.component')).NakedBladeComponent,
    );
    BLADE_REGISTRY.register(
      'footer-test',
      async () => (await import('./mock-blades/footer-alignments-blade.component')).FooterAlignmentsBladeComponent,
    );

    this.initializeMockDb();
    for (const app of CORE_PILLARS) {
      this.registerOmniverseBlade(SduiParser.parseManifest(app.payload).blade as SduiBladeNode);
    }

    // Observe the SDK stack only for focus management. Core records the URL frames.
    effect(
      () => {
        const active = this.bladeService.activeBlades();
        const topId = active.at(-1)?.id ?? null;
        if (topId !== this.focusedBladeId) {
          const hadBlade = this.focusedBladeId !== null;
          this.focusedBladeId = topId;
          this.pendingBladeFocus = !!topId;
          if (topId) requestAnimationFrame(() => this.focusTopBlade());
          else if (hadBlade)
            requestAnimationFrame(() => {
              const target = this.lastGalleryTrigger?.isConnected
                ? this.lastGalleryTrigger
                : document.getElementById('demo-main');
              target?.focus();
            });
        }

      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit() {
    this.bladeService.connectHistory((id) => {
      if (this.mockDb[id]) return this.mockDb[id];
      const stackingChild = resolveStackingChild(id);
      if (stackingChild) return stackingChild;
      if (id.startsWith('blade-proc-')) {
        try {
          const saved = sessionStorage.getItem(`sdui-demo-${id}`);
          if (saved) return this.registerOmniverseBlade(SduiParser.parseManifest(JSON.parse(saved)).blade as SduiBladeNode);
        } catch {
          return undefined;
        }
      }
      if (/^demo-procedural-\d+$/.test(id)) {
        this.mockDb[id] = this.buildProceduralBlade(id);
        return this.mockDb[id];
      }
      return undefined;
    }, 'b');
  }

  private initializeMockDb() {
    const fullManifest: SduiBladeNode = {
      id: 'demo-blade-full',
      type: SduiElementType.Blade,
      properties: { title: 'Full Width (Responsive)', subtitle: 'flex-1', width: 'full' } as any,
      children: [
        {
          id: 's1',
          type: SduiElementType.Section,
          properties: { title: 'Behavior' },
          children: [
            {
              id: 't1',
              type: 'MOCK_TEXT' as any,
              properties: {
                content:
                  'This blade claims all available horizontal space (flex-1). It acts as a powerful root Dashboard.',
              },
            },
            {
              id: 'btn-sub',
              type: 'MOCK_BUTTON' as any,
              properties: { label: '＋ Spawn Large Blade', actionPayload: { id: 'demo-blade-large' } },
            },
          ],
        },
      ],
    };

    const xlargeManifest: SduiBladeNode = {
      id: 'demo-blade-xlarge',
      type: SduiElementType.Blade,
      properties: { title: 'X-Large Constraint', width: 'xlarge' } as any,
      children: [
        {
          id: 's2',
          type: SduiElementType.Section,
          properties: { title: '1125px Structural Limit' },
          children: [
            {
              id: 't2',
              type: 'MOCK_TEXT' as any,
              properties: { content: 'Perfect for wide data grids or complex configuration wizards.' },
            },
            {
              id: 'btn2',
              type: 'MOCK_BUTTON' as any,
              properties: { label: '＋ Nested Large Blade', actionPayload: { id: 'demo-blade-large' } },
            },
          ],
        },
      ],
    };

    const largeManifest: SduiBladeNode = {
      id: 'demo-blade-large',
      type: SduiElementType.Blade,
      properties: { title: 'Large Constraint', width: 'large' } as any,
      children: [
        {
          id: 's3',
          type: SduiElementType.Section,
          properties: { title: '855px Structural Limit' },
          children: [
            {
              id: 't3',
              type: 'MOCK_TEXT' as any,
              properties: { content: 'The standard architectural width for primary resource overviews.' },
            },
            {
              id: 'btn3',
              type: 'MOCK_BUTTON' as any,
              properties: { label: '＋ Nested Medium Blade', actionPayload: { id: 'demo-blade-medium' } },
            },
          ],
        },
      ],
    };

    const mediumManifest: SduiBladeNode = {
      id: 'demo-blade-medium',
      type: SduiElementType.Blade,
      properties: { title: 'Medium Constraint', width: 'medium' } as any,
      children: [
        {
          id: 's4',
          type: SduiElementType.Section,
          properties: { title: '585px Structural Limit' },
          children: [
            {
              id: 't4',
              type: 'MOCK_TEXT' as any,
              properties: { content: 'The classic side-panel width used for deep configuration forms or tagging.' },
            },
            {
              id: 'btn4',
              type: 'MOCK_BUTTON' as any,
              properties: { label: '＋ Nested Small Blade', actionPayload: { id: 'demo-blade-small' } },
            },
          ],
        },
      ],
    };

    const smallManifest: SduiBladeNode = {
      id: 'demo-blade-small',
      type: SduiElementType.Blade,
      properties: { title: 'Small Constraint', width: 'small' } as any,
      children: [
        {
          id: 's5',
          type: SduiElementType.Section,
          properties: { title: '315px Structural Limit' },
          children: [
            {
              id: 't5',
              type: 'MOCK_TEXT' as any,
              properties: { content: 'Used for tiny flyouts or quick action menus.' },
            },
            {
              id: 'btn5',
              type: 'MOCK_BUTTON' as any,
              properties: { label: '＋ Nested Menu Blade', actionPayload: { id: 'demo-blade-menu' } },
            },
          ],
        },
      ],
    };

    const menuManifest: SduiBladeNode = {
      id: 'demo-blade-menu',
      type: SduiElementType.Blade,
      properties: { title: 'Menu Constraint', width: 'menu' } as any,
      children: [
        {
          id: 's6',
          type: SduiElementType.Section,
          properties: { title: '265px Structural Limit' },
          children: [
            {
              id: 't6',
              type: 'MOCK_TEXT' as any,
              properties: {
                content: 'The absolute thinnest blade form-factor, strictly for tertiary navigation arrays.',
              },
            },
          ],
        },
      ],
    };

    const kitchenSinkManifest: SduiBladeNode = {
      id: 'demo-kitchen-sink',
      type: 'kitchen-sink' as any,
      properties: { title: 'Kitchen Sink', width: 'large' } as any,
    };

    const limitedScrollManifest: SduiBladeNode = {
      id: 'demo-limited-scroll',
      type: 'limited-scroll' as any,
      properties: { title: 'Limited Overflow', width: 'medium' } as any,
    };

    const stackingManifest: SduiBladeNode = {
      id: 'demo-stacking',
      type: 'stack-test' as any,
      properties: { depth: 1, width: 'xlarge' } as any,
    };

    const nakedManifest: SduiBladeNode = {
      id: 'demo-naked',
      type: 'naked-test' as any,
      properties: { width: 'large' } as any,
    };

    const footerManifest: SduiBladeNode = {
      id: 'demo-footer',
      type: 'footer-test' as any,
      properties: { width: 'medium' } as any,
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
