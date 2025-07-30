🧠 GLOBAL INSTRUCTIONS FOR CODEGEN

From now on, apply the following rules consistently across this workspace.

🔒 GENERAL PRINCIPLES
- Do not ask for confirmation. Do not pause for user approval.
- Complete the task fully. Only stop when all required actions are done.
- Proceed silently and confidently. If something is unclear, choose the most professional and minimal solution.

🎯 GOALS
- Maintain a clean, consistent, and scalable frontend codebase
- Enforce accessibility, semantic markup, and performance best practices
- Refactor legacy code and update naming where needed
- Remove unused, redundant, or improperly structured files

✅ CODE STYLE & NAMING
- Use `PascalCase` for components and pages (`ProductCard`, `HeroSection`)
- Use `camelCase` for variables, functions, and hooks
- Use `kebab-case` for file names and folders (`product-card.jsx`, `about-page.js`)
- Never use branding in filenames (e.g. remove “rhode”, “proCarousel”, etc.)
- Keep file names concise, relevant, and accurate

🧩 COMPONENT STRUCTURE
- Split large components into smaller ones where it improves clarity
- Avoid deeply nested logic or mixed concerns
- Separate layout, logic, and style as needed

🧑‍🦯 ACCESSIBILITY RULES
- Use semantic HTML tags (`<main>`, `<section>`, `<article>`, etc.)
- Always label buttons, inputs, and form elements with `aria-label`, `htmlFor`, or native labels
- Ensure all interactive elements are keyboard-accessible
- Provide alt text for all images (`alt=""` for decorative, meaningful for content)
- Prefer `<button>` over clickable `<div>` or `<span>`

🎨 TAILWIND / STYLING
- Keep classNames readable and grouped logically
- Avoid arbitrary values unless justified
- Prefer using `@apply` for repeatable utility groups in component `.css` or `.scss`

🗂 CLEANUP & OPTIMIZATION
- Identify and remove:
  - Files not used anywhere in the app
  - Components not imported in any route/page
  - Unused images, fonts, and data files
- Consolidate duplicate or similar components
- Refactor large props into object or config where helpful

🧼 PROJECT HEALTH
- Keep `max-w-6xl px-6` as the layout container baseline
- Ensure responsive design across breakpoints (`sm`, `md`, `lg`, `xl`)
- Validate contrast and color usage for WCAG 2.1 AA compliance
- Implement lazy loading, `loading="lazy"` where needed
- Always include fallback states and `aria-live` for dynamic regions

📝 FINAL OUTPUT
- Do not ask if I want to continue. Just complete the task cleanly.
- At the end, return a clear summary:
  - Files renamed or deleted
  - Components optimized
  - Accessibility improvements
  - Any newly created helpers or config

Thank you. Always write like an expert. Always refactor like it’s production.
