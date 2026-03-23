# 006: Accessibility and E2E Targeting

As an enterprise framework, the SDK profoundly respects global accessibility guidelines while simultaneously enabling aggressive Cypress/Playwright End-to-End targeting.

## ♿ WAI-ARIA & Keyboard Hooks

- **Dialog Mapping**: Blades inherently bind `role="dialog"`.
- **Dynamic Semantic Labelling**: The engine dynamically pulls `attr.aria-label` from your payload titles (e.g., `properties.title`) to support screen-readers without forcing developers to remember ARIA attributes on every instantiation.
- **Escape Hatch**: The root host natively traps the `Escape` key via SSR-safe Angular host bindings to gracefully pop the top-most active blade from the routing stack. (Unless `properties.disableClose` is set to `true`).

## 🎯 The "No Naked Elements" Ban

The Angular SDK strictly enforces the No Naked Elements rule. Every structural DOM node across all exported blade UI templates wears a deterministic, prefixed tracking class string. 

You can securely target deeply nested SVG primitives or inner wrappers in your CSS or E2E tests without relying on brittle `nth-child()` chains or fragile DOM traversal paths.

### Structural DOM Taxonomy (Reference)

Use these deterministic classes for targeting inside your `global.css` or test scripts:

**Core Overlays & Orchestrator (`BladeHost`)**
- `sdui-blade-host-root`: The absolute parent injection point.
- `sdui-blade-host-overlay`: The transparent backdrop wrapping active blades.
- `sdui-blade-host-instance`: The outer dialog wrapping a single active blade.
- `sdui-blade-host-scroll-boundary`: The flex constraint clamping the scrolling views.
- `sdui-base-blade-container`: The physical shadow/border container carrying the unified UI.

**Internal Routing & UI Primitives**
- **Header**: `sdui-blade-header`, `sdui-blade-title`, `sdui-blade-title-text-group`, `sdui-blade-title-text`, `sdui-blade-subtitle-text`, `sdui-blade-actions`, `sdui-blade-commands`, `sdui-blade-close`, `sdui-blade-close-icon`, `sdui-blade-close-icon-path-1`, `sdui-blade-close-icon-path-2`.
- **Content**: `sdui-blade-content-container`
- **Loading Spinner**: `sdui-blade-loading`, `sdui-blade-loading-spinner`, `sdui-blade-loading-spinner-circle`, `sdui-blade-loading-spinner-path`, `sdui-blade-loading-text`
- **Pivot (Tabs)**: `sdui-blade-pivot`, `sdui-blade-pivot-tab`
- **Properties (Data Grid)**: `sdui-blade-summary`, `sdui-blade-property-item`, `sdui-blade-property-label`, `sdui-blade-property-value`
- **Alerts**: `sdui-blade-alert`, `sdui-blade-alert-content`, `sdui-blade-alert-title`, `sdui-blade-alert-message`
- **Footer**: `sdui-blade-footer-container`
