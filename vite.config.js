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
          if (!id.includes('node_modules')) {
            // App chunks - simplified grouping
            if (id.includes('/pages/')) return 'pages';
            if (id.includes('/components/')) return 'components';
            if (id.includes('/hooks/') || id.includes('/utils/') || id.includes('/services/')) return 'utils';
            return undefined;
          }

          // Vendor chunk mapping
          const vendorMap = {
            'react': 'react-vendor',
            'react-dom': 'react-vendor',
            'react-router': 'router',
            'firebase': 'firebase',
            '@firebase': 'firebase',
            '@stripe': 'stripe',
            'stripe': 'stripe',
            'gsap': 'animations',
            'framer-motion': 'framer',
            'lucide-react': 'icons'
          };

          for (const [key, chunk] of Object.entries(vendorMap)) {
            if (id.includes(key)) return chunk;
          }
          
          return 'vendor';
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
}));
