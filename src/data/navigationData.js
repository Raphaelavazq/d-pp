export const mainNavigation = [
  { id: "shop", label: "SHOP", href: "/shop" },
  { id: "about", label: "ABOUT", href: "/about" },
  { id: "impact", label: "IMPACT", href: "/impact" },
  { id: "contact", label: "CONTACT", href: "/contact" },
];

export const mobileNavCategories = [
  {
    id: "featured",
    links: [
      { id: "featured", label: "Featured" },
      { id: "skincare", label: "Skincare" },
      { id: "makeup", label: "Makeup" },
      { id: "wellness", label: "Wellness" },
      { id: "bestsellers", label: "Bestsellers" },
    ],
  },
];

export const desktopNavCategories = [
  {
    id: "featured",
    label: "Featured",
    products: [
      {
        id: "vitamin-c-serum",
        name: "VITAMIN C SERUM",
        description: "Brightening daily serum",
        href: "/products/vitamin-c-serum",
        image:
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&crop=center",
        alt: "düpp vitamin c serum",
        paddingClass:
          "text-[13.95px] box-border block tracking-[0.279px] leading-[20.925px] z-[1] pb-[100%] md:text-[14.4px] md:tracking-[0.288px] md:leading-[21.6px]",
        badge: { type: "new", text: "New" },
      },
      {
        id: "glow-moisturizer",
        name: "GLOW MOISTURIZER",
        description: "Hydrating face cream",
        href: "/products/glow-moisturizer",
        image:
          "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=center",
        alt: "düpp glow moisturizer",
        paddingClass:
          "text-[13.95px] box-border block tracking-[0.279px] leading-[20.925px] z-[1] pb-[100%] md:text-[14.4px] md:tracking-[0.288px] md:leading-[21.6px]",
        badge: { type: "new", text: "New" },
      },
      {
        id: "cleansing-balm",
        name: "CLEANSING BALM",
        description: "Gentle makeup remover",
        href: "/products/cleansing-balm",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center",
        alt: "düpp cleansing balm",
        paddingClass:
          "text-[13.95px] box-border block tracking-[0.279px] leading-[20.925px] z-[1] pb-[100%] md:text-[14.4px] md:tracking-[0.288px] md:leading-[21.6px]",
        badge: { type: "new", text: "New" },
      },
      {
        id: "starter-kit",
        name: "THE DÜPP KIT",
        description: "Essential skincare trio",
        href: "/products/starter-kit",
        image:
          "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop&crop=center",
        alt: "düpp starter kit with cleanser, serum and moisturizer",
        paddingClass:
          "text-[13.95px] box-border block tracking-[0.279px] leading-[20.925px] z-[1] pb-[100%] md:text-[14.4px] md:tracking-[0.288px] md:leading-[21.6px]",
        badge: { type: "new", text: "New" },
      },
    ],
    shopAllHref: "/collections/featured",
    shopAllLabel: "shop düpp - shop düpp",
    shopAllText: "shop düpp",
  },
  {
    id: "skincare",
    label: "Skincare",
    products: [
      {
        id: "vitamin-c-serum-skincare",
        name: "VITAMIN C SERUM",
        description: "Brightening daily serum",
        href: "/products/vitamin-c-serum",
        image:
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&crop=center",
        alt: "düpp vitamin c serum",
        paddingClass:
          "text-[13.95px] box-border block tracking-[0.279px] leading-[20.925px] z-[1] pb-[100%] md:text-[14.4px] md:tracking-[0.288px] md:leading-[21.6px]",
        badge: { type: "new", text: "New" },
      },
      {
        id: "hyaluronic-acid",
        name: "HYALURONIC ACID",
        description: "Deep hydration booster",
        href: "/products/hyaluronic-acid",
        image:
          "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop&crop=center",
        alt: "düpp hyaluronic acid serum",
        paddingClass:
          "text-[13.95px] box-border block tracking-[0.279px] leading-[20.925px] z-[1] pb-[100%] md:text-[14.4px] md:tracking-[0.288px] md:leading-[21.6px]",
        badge: {
          type: "award",
          image:
            "https://images.unsplash.com/photo-1621609764180-2ca554a9d6f2?w=80&h=80&fit=crop&crop=center",
          alt: "Düpp Award Badge",
        },
      },
      {
        id: "retinol-cream",
        name: "RETINOL CREAM",
        description: "Anti-aging night treatment",
        href: "/products/retinol-cream",
        image:
          "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=400&fit=crop&crop=center",
        alt: "düpp retinol cream",
        paddingClass:
          "text-[13.95px] box-border block tracking-[0.279px] leading-[20.925px] z-[1] pb-[100%] md:text-[14.4px] md:tracking-[0.288px] md:leading-[21.6px]",
      },
      {
        id: "complete-routine",
        name: "COMPLETE ROUTINE",
        description: "Full skincare regimen",
        href: "/products/complete-routine",
        image:
          "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop&crop=center",
        alt: "düpp complete skincare routine set",
        paddingClass:
          "text-[13.95px] box-border block tracking-[0.279px] leading-[20.925px] z-[1] pb-[100%] md:text-[14.4px] md:tracking-[0.288px] md:leading-[21.6px]",
      },
    ],
    shopAllHref: "/collections/skincare",
    shopAllLabel: "Shop Skincare - Shop Skincare",
    shopAllText: "Shop Skincare",
  },
];
