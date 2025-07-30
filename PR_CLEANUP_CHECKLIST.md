# PR Cleanup Checklist

- [ ] Remove all unused and redundant files (see below for list).
- [ ] Rename files for consistency (see below for suggestions).
- [ ] Remove dead code and unused props/states from components.
- [ ] Ensure all imports/exports are updated after renaming/deleting.
- [ ] Test all routes and dynamic imports for breakage.
- [ ] Run linter and formatter.

## Unused Files (delete):

- src/data/categories.js
- src/data/export const categories = [.js
- src/assets/logo2.svg
- src/assets/logofooter.png
- src/assets/unnderwater_logo_sound.mp4
- src/assets/about.mp4
- src/components/ProfessionalCarousel.jsx
- src/components/ProfessionalHeader.jsx
- src/components/ProfessionalProductCard.jsx
- src/components/RhodeProductCard.jsx
- src/components/CarouselProductCard.jsx
- src/components/DuppProductCard.jsx
- src/pages/ProfessionalDuppPage.jsx
- src/pages/RhodePage.jsx
- src/pages/DuppPage.jsx

## Rename Suggestions:

- ProductCarousel.jsx → carousel.jsx
- RhodeProductCard.jsx → product-card-alt.jsx
- ProfessionalCarousel.jsx → carousel-alt.jsx
- DuppProductCard.jsx → product-card-alt.jsx
- ProfessionalHeader.jsx → header-alt.jsx
- ProfessionalProductCard.jsx → product-card-alt.jsx
- CarouselProductCard.jsx → carousel-card.jsx
- ProfessionalDuppPage.jsx, RhodePage.jsx, DuppPage.jsx → brand-page.jsx (if merged in the future)
