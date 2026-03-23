# 004: Triggering Blades

The true power of the SDUI Blade Architecture relies on programmatic instantiations acting as transient states, rather than durable URL-driven routes. 

## 🚀 The Core Orchestrator

Inject the `SduiBladeService` to invoke Journeys. The service utilizes strict `SduiBladeNode` schema primitives (from `@slashand/sdui-blade-core`) to hydrate the active Blade Host.

```typescript
import { Component, inject } from '@angular/core';
import { SduiBladeService, SduiBladeNode } from '@slashand/sdui-blade-angular';

@Component({ ... })
export class SidebarComponent {
  private bladeService = inject(SduiBladeService);

  openSettings() {
    this.bladeService.openBlade({
      id: 'settings-panel-1',
      type: 'user-profile', // Must match an ID configured in the Blade Registry
      properties: {
        title: 'Account Settings',
        disableClose: false,
        region: 'global' // Explicitly target the global host boundary
      }
    });
  }

  forceCloseAll() {
    this.bladeService.closeAllBlades();
  }
}
```

## 🔐 Preventing Accidental Closure

When forms are active in a blade, escaping or dismissing the blade can cause catastrophic data loss.

If you set `properties.disableClose` to `true` in your trigger JSON, the core orchestrator natively hides the exit cross in the blade chrome, forcing the user to interact with the explicit Submit or Cancel buttons your injected component provides.
