# 🌌 @slashand/sdui-blade-angular

[![npm version](https://img.shields.io/npm/v/@slashand/sdui-blade-angular.svg?style=flat-square)](https://npmjs.org/package/@slashand/sdui-blade-angular)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> The Flagship Sandbox. The Enterprise Angular Engine for the Agnostic Blade System, binding the core to Angular 21 Signals.

## 📖 Table of Contents

- [The Immutable Flow](#the-immutable-flow)
- [Technical Supremacy](#technical-supremacy)
- [Installation](#installation)
- [Quickstart Usage](#quickstart-usage)
- [Contributing](#contributing)
- [License](#license)

## 🛡️ The Immutable Flow

`@slashand/sdui-blade-angular` is designed for the strictest enterprise environments. Leveraging Angular 21's native `@if` / `@for` control flow and Signal-based reactivity, it acts as the renderer for the abstract Schema Payload emitted by the Core Reactor.

By relying on Angular Dependency Injection and native Signal computations, this wrapper maps the Core Reactor JSON AST into standalone components in real-time. It safely handles `BladeInvokeControl` slides without the overhead of massive DOM recalculations, fully supporting Analog.js Vite workspaces without the notorious "double core" `inject()` errors.

## ✨ Technical Supremacy

- **The Analog APF Compliance**: Packaged perfectly via `ng-packagr` ensuring zero context injection errors when consumed across Vite workspaces.
- **Signal-Forward Orchestration**: Receives downstream core mutations natively as Signals (`computed()`, `input()`), preventing entire component trees from re-evaluating unnecessarily.
- **Component Outlet Agnosticism**: Securely handles the `NgComponentOutlet` lifecycle, safely disposing of memory and event listeners the second a backend instruction deletes a component node.

## 📦 Installation

```bash
npm install @slashand/sdui-blade-angular @slashand/sdui-blade-core
```

*Required Peer Dependencies:* Angular 21+, `@ngneat/elf`

## 🚀 Quickstart Usage

```typescript
import { Component, inject } from '@angular/core';
import { BladeHostComponent } from '@slashand/sdui-blade-angular';
import { BladeOrchestratorService } from './services/blade.service';

@Component({
  selector: 'app-engine-root',
  standalone: true,
  imports: [BladeHostComponent],
  template: `
    <div class="h-screen w-screen bg-zinc-900 text-zinc-100 flex overflow-hidden">
      <!-- The engine seamlessly mounts the Constellation Map -->
      <app-blade-host [config]="orchestrator.activeBladeConfig()" />
    </div>
  `
})
export class EngineRootComponent {
  readonly orchestrator = inject(BladeOrchestratorService);
}
```

## 🤝 Contributing

Open source contributions are highly encouraged for optimizing Signal rendering and APF build configurations. Open an issue or submit a Pull Request.

## 🌟 Ecosystem Showcase

*Where can you see the Agnostic Blade System in action?*

- **Gravity English** (Coming Soon, March 2026) -> Educational Prompt-Orchestration Platform.
- **Coverlay Studio** (Coming Soon) -> Generative AI Non-Linear Video Editor.

*Live production applications utilizing these blades will be showcased here as their respective websites officially launch.*

## 🗺️ Angular Ecosystem Roadmap

Our specific trajectory for the Angular wrapper.

- [X] **Angular 21 Native Signals Integration**
- [X] **Analog.js APF Strict Compliance**
- [ ] *Component Outlet Memory optimizations*
- [ ] *Server-Side Rendering (SSR) Hydration Lock bypass*

## 📜 License

Published under the [MIT License](LICENSE). Maintained by **Slashand Studio**.
