import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-oxc'
import compression from 'vite-plugin-compression'
import { visualizer } from 'vite-plugin-visualizer'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Enable SWC minification in production
      jsxRuntime: 'automatic',
      // Optimize decorators and other TS features
      tsDecorators: true,
    }),
    compression({
      verbose: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Bundle analyzer - generates stats.html
    mode === 'analyze' && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/admin': path.resolve(__dirname, './src/admin'),
    },
  },

  build: {
    target: 'esnext',
    sourcemap: mode !== 'production',
    minify: 'terser',
    reportCompressedSize: false,
    // Increase workers for faster parallel builds
    rollupOptions: {
      maxParallelFileOps: 20,
    },
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.debug'] : [],
        passes: 3, // Extra minification passes
      },
      mangle: true,
      format: {
        comments: false,
      },
    },
    rolldownOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor splitting strategy — critical for caching
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom'))
            return 'react-core'
          if (id.includes('node_modules/framer-motion')) return 'animation'
          if (id.includes('node_modules/zustand')) return 'state'
          if (id.includes('node_modules/@tanstack')) return 'tanstack'
          if (id.includes('node_modules/axios')) return 'http'
          if (id.includes('node_modules/react-router')) return 'router'
          if (id.includes('node_modules/dompurify')) return 'security'
          if (id.includes('src/admin/')) return 'admin-module'
          if (id.includes('src/utils/crypto/')) return 'crypto'
          if (id.includes('src/pages/')) {
            const pageName = id.match(/src\/pages\/(\w+)\//)?.[1]
            return pageName ? `page-${pageName.toLowerCase()}` : undefined
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 600,
    // Assets are inlined if smaller than this (in bytes)
    assetsInlineLimit: 4096,
    // Output directory
    outDir: 'dist',
    // Emit CSS separately
    emptyOutDir: true,
  },

  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
      '/ws': { target: 'ws://localhost:8080', ws: true },
    },
    https: false,
    // Middleware for performance headers
    middlewareMode: false,
    // Enable compression in dev
    compression: 'gzip',
    // Reduce polling frequency
    watch: {
      usePolling: false,
      interval: 100,
      batchTimeout: 100,
    },
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'zustand',
      'axios',
      '@tanstack/react-virtual',
      '@tanstack/react-query',
      'dompurify',
      'tweetnacl',
    ],
    exclude: ['argon2-browser'],
    // Esbuild options for faster deps pre-bundling
    esbuildOptions: {
      target: 'esnext',
      logLevel: 'silent',
    },
  },

  css: {
    devSourcemap: mode !== 'production',
    modules: {
      localsConvention: 'camelCaseOnly',
      hashPrefix: 'prefix',
    },
    // PostCSS options
    postcss: {
      plugins: [
        // Tailwind will be auto-applied if tailwind.config exists
        'tailwindcss',
        'autoprefixer',
      ],
    },
    // Optimize CSS
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },

  // Define environment variables
  define: {
    __DEV__: mode === 'development',
    __PROD__: mode === 'production',
  },

  // Performance hints
  ssr: {
    noExternal: ['framer-motion'],
  },
}))
