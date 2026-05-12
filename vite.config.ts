import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [

    // Uses Rust-based OXC compiler: faster cold starts, better for HDD machines
    react(),

    compression({
      verbose: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),

    // Bundle analyzer — run with: npm run build:analyze
    mode === 'analyze' && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ].filter(Boolean),

  // ─── Path Aliases ──────────────────────────────────────────────────────────
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

  // ─── Build ─────────────────────────────────────────────────────────────────
  build: {
    target: 'esnext',
    sourcemap: mode !== 'production',
    minify: 'terser',
    reportCompressedSize: false,

    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.debug'] : [],
        passes: 3,
      },
      mangle: true,
      format: { comments: false },
    },

    // FIX: was split across rollupOptions + rolldownOptions (invalid key)
    // Merged into single rollupOptions — chunk splitting now actually works
    rollupOptions: {
      maxParallelFileOps: 20,
      output: {
        manualChunks: (id) => {
          // ── Vendor chunk splitting strategy ──────────────────────────────
          // Each chunk is separately cacheable — critical for repeat visitors
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom'))
            return 'react-core'
          if (id.includes('node_modules/framer-motion'))
            return 'animation'
          if (id.includes('node_modules/zustand'))
            return 'state'
          if (id.includes('node_modules/@tanstack'))
            return 'tanstack'
          if (id.includes('node_modules/axios'))
            return 'http'
          if (id.includes('node_modules/react-router'))
            return 'router'
          if (id.includes('node_modules/dompurify'))
            return 'security'
          if (id.includes('src/admin/'))
            return 'admin-module'
          if (id.includes('src/utils/crypto/'))
            return 'crypto'
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
    assetsInlineLimit: 4096,
    outDir: 'dist',
    emptyOutDir: true,
  },

  // ─── Dev Server ────────────────────────────────────────────────────────────
  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
      '/ws': { target: 'ws://localhost:8080', ws: true },
    },
    https: false,
    // FIX: removed server.compression — not a valid Vite server option
    watch: {
      usePolling: false,  // set true if on WSL or network drive
      interval: 100,
      batchTimeout: 100,
    },
  },

  // ─── Dependency Pre-Bundling ───────────────────────────────────────────────
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'zustand',
      'axios',
      '@tanstack/react-virtual',
      // FIX: removed @tanstack/react-query — not in package.json
      'dompurify',
      'tweetnacl',
    ],
    exclude: ['argon2-browser'],
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
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },

  // ─── Global Constants ──────────────────────────────────────────────────────
  define: {
    __DEV__: mode === 'development',
    __PROD__: mode === 'production',
  },

  // ─── SSR ───────────────────────────────────────────────────────────────────
  ssr: {
    noExternal: ['framer-motion'],
  },
}))