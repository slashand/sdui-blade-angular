# 005: Theming and CSS Agnosticism

A profound architectural decision for the Blade Engine is the **Hardcoded Color Ban**. 

## 🎨 Zero Proprietary Theming

The engine does not utilize Tailwind utilities for colors (`bg-zinc-900`), nor does it ship with a massive CSS file dictating a specific visual aesthetic. 

Every visual surface area in the SDK maps perfectly to CSS Variables. This enforces strict presentation separation, allowing you to skin the Blade Engine securely within a multi-tenant white-label SaaS, or match a specific Tailwind `preset` without fighting `!important` cascades.

## The Contract

You dictate the theme from your global `styles.css`. You must satisfy this contract to see the blades correctly:

```css
:root {
  /* Required SDK Theme Variables - The Core Backgrounds */
  --th-panel-bg:       #1e293b;   /* The master blade surface */
  --th-element-bg:     #475569;   /* Inner elements, headers */

  /* Structural Variables */
  --th-border:         #334155;   /* The 1px borders separating zones */

  /* Text & Typography Variables */
  --th-text-primary:   #f8fafc;   /* Master headings */
  --th-text-secondary: #94a3b8;   /* Sub-labels and meta text */
}

/* Optional: Dark Mode Overrides */
.dark-mode {
  --th-panel-bg:       #000000;
  --th-element-bg:     #111111;
  --th-border:         #333333;
}
```

By changing these variables dynamically at runtime via JavaScript (e.g., `document.documentElement.style.setProperty`), the entire horizontal Blade universe updates instantaneously.
