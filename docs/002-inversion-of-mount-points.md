# 002: Inversion of Mount Points (Registration)

The Blade Engine operates on a profound architectural principle: **The Inversion of Mount Points.** 

The core engine does *not* know what your User Profile or Settings view looks like. It merely receives a JSON command stating that a `user-profile` should open, along with arbitrary generic `properties`. The Angular renderer is responsible for establishing the link between that sterile string and your rich, interactive Angular Standalone Components.

## 🎛️ Configuration & Registration

You must register your application-specific Angular components mapped to the generic JSON `type` strings emitted by your data layer. This ensures that the engine only lazy-loads chunks exactly when the server requests them.

Create a registry file (e.g., `blade-registry.ts`):

```typescript
import { BLADE_REGISTRY } from '@slashand/sdui-blade-angular';

export function initializeBladeRegistry() {
  // Bind the generic primitive string to a lazy-loaded Angular Component chunk
  BLADE_REGISTRY.register(
    'my-custom-form', 
    () => import('./features/custom-form.component').then(m => m.CustomFormComponent)
  );
  
  BLADE_REGISTRY.register(
    'user-profile', 
    () => import('./features/user-profile.component').then(m => m.UserProfileComponent)
  );
}
```

Invoke `initializeBladeRegistry()` early in your `app.config.ts` or `main.ts` so the maps are heavily primed before the Blade Host ever mounts to the DOM.
