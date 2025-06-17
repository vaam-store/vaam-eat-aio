- Style elements by stacking **daisyUI component / part / modifier classes** plus Tailwind utilities.
  If specificity blocks a utility, append `!` (sparingly).

- Only use existing daisyUI or Tailwind classes—write **no custom CSS** unless a component is missing (then build with utilities).

- Keep layouts responsive with Tailwind `flex`/`grid` + breakpoints.

- Follow Refactoring UI design practices; no extra boilerplate or README unless asked.

- Reference docs:

  - daisyui.com (install, config, components)
  - Upgrade guide (v4 → v5) for migration details.

- Use re-usable components such as
  - @app/components/button
  - @app/components/container
  - @app/components/list-block
  - @app/components/list-item
  - @app/components/location-picker
  - @app/components/modal
  - @app/components/network-status
  - @app/components/section
  - @app/components/text
