# 003: Spatial Boundaries and Mounting

The Blade Engine acts as a flexible overlay that strictly adheres to the boundaries of the container you place it inside. It does not blindly usurp the full `<body>` tag natively unless told to.

## 🏗️ Mounting the Host

Place the `app-sdui-blade-host` component as a wrapper over your primary application content. 

If you want the blades to overlay the *entire screen*, place the host at the absolute root of your app (`app.component.html`), wrapping the main `<router-outlet>`. 

If you want the blades to respect a sidebar, or live strictly beneath a global header (like Amazon Web Services or Gravity English), place the `app-sdui-blade-host` *inside* your main layout grid, adjacent to or wrapping the targeted content section.

## 🧭 Multi-Regional Mounts (Targeted Injection)

By default, any blade opened via the service will mount to the first available host. However, in complex enterprise layouts, you may wish to run *multiple* Blade Hosts simultaneously (e.g., one host for full-screen global settings, and another host constrained within a specific dashboard widget).

The Angular SDK supports **Targeted Spatial Boundaries** via the `region` attribute.

```html
<!-- A host capturing 'global' blades (the default) -->
<app-sdui-blade-host region="global">
  <!-- Content... -->
</app-sdui-blade-host>

<!-- A separate host in another component capturing 'floating-sidebar' blades -->
<app-sdui-blade-host region="floating-sidebar">
  <!-- Specific dashboard content... -->
</app-sdui-blade-host>
```

When triggering a blade via the service, simply pass the `region` in the properties payload. The Blade will automatically bypass the global host and mount itself perfectly within the constrained sidebar host:

```json
{
  "type": "user-profile",
  "properties": {
    "region": "floating-sidebar"
  }
}
```

## ⏳ Custom Fallback Loaders

You **must** provide your own native loader. The SDK remains profoundly agnostic and will not force an opinionated spinner into your enterprise layout.

Because the SDK utilizes `NgComponentOutlet` for dynamic lazy injection, it project your custom loader exactly when a dynamic chunk is resolving over the network. 

To define what spins while the network resolves the chunk, pass an element with the `fallback-loader` attribute into the host:

```html
<app-sdui-blade-host>
  <router-outlet></router-outlet>
  
  <!-- This native loader spins only while the chunk resolves -->
  <div fallback-loader class="my-enterprise-spinner absolute inset-0 flex items-center justify-center">
    <spinner-icon></spinner-icon>
  </div>
</app-sdui-blade-host>
```
