import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 600, // Increase warning limit slightly
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // Router
            if (id.includes('react-router')) {
              return 'router';
            }
            // Firebase
            if (id.includes('firebase') || id.includes('@firebase')) {
              return 'firebase';
            }
            // Stripe
            if (id.includes('@stripe') || id.includes('stripe')) {
              return 'stripe';
            }
            // GSAP animations
            if (id.includes('gsap')) {
              return 'animations';
            }
            // Framer Motion
            if (id.includes('framer-motion')) {
              return 'framer';
            }
            // Lucide icons
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Other vendors
            return 'vendor';
          }
          
          // App chunks
          if (id.includes('/pages/')) {
            return 'pages';
          }
          if (id.includes('/components/')) {
            return 'components';
          }
          if (id.includes('/hooks/') || id.includes('/utils/') || id.includes('/services/')) {
            return 'utils';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
}));
