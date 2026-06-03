import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  main: {
    build: {
      outDir: 'dist/main'
    }
  },

  preload: {
    build: {
      outDir: 'dist/preload'
    }
  },

  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        // Prevent duplicate React instances
        react: resolve('node_modules/react'),
        'react-dom': resolve('node_modules/react-dom'),
        'react/jsx-runtime': resolve('node_modules/react/jsx-runtime'),
      }
    },

    plugins: [
      react(),
      tailwindcss(),
      visualizer({ 
        open: true,
        filename: 'stats.html',
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      })
    ],

    build: {
      outDir: 'dist/renderer',

      // Increase chunk size warning limit
      chunkSizeWarningLimit: 500,

      minify: 'esbuild',

      esbuild: {
        drop: ['console', 'debugger'],
      },

      rollupOptions: {
        output: {
          manualChunks(id) {
            // React core
            if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/') ||
              id.includes('node_modules/react/jsx-runtime')) {
              return 'react-core'
            }

            // React Router
            if (id.includes('node_modules/react-router') ||
              id.includes('node_modules/react-router-dom') ||
              id.includes('node_modules/history') ||
              id.includes('node_modules/@remix-run')) {
              return 'react-router'
            }

            // UI Icons (often large)
            if (id.includes('node_modules/react-icons')) {
              // Further split by icon sets
              if (id.includes('react-icons/fa')) {
                return 'icons-fa'
              }
              if (id.includes('react-icons/hi')) {
                return 'icons-hi'
              }
              if (id.includes('react-icons/ai')) {
                return 'icons-ai'
              }
              return 'icons-other'
            }

            // UI Helpers (small)
            if (id.includes('node_modules/react-hot-toast') ||
              id.includes('node_modules/react-modal') ||
              id.includes('node_modules/react-select')) {
              return 'ui-helpers'
            }

            // html2canvas
            if (id.includes('node_modules/html2canvas')) {
              return 'html2canvas'
            }

            // HTTP libraries
            if (id.includes('node_modules/axios') ||
              id.includes('node_modules/ky') ||
              id.includes('node_modules/superagent')) {
              return 'http-client'
            }

            // Utility libraries
            if (id.includes('node_modules/lodash') ||
              id.includes('node_modules/date-fns') ||
              id.includes('node_modules/dayjs') ||
              id.includes('node_modules/query-string') ||
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/classnames')) {
              return 'utils'
            }

            // Animation libraries (if any)
            if (id.includes('node_modules/framer-motion') ||
              id.includes('node_modules/gsap') ||
              id.includes('node_modules/react-spring')) {
              return 'animations'
            }

            // Chart libraries (if any)
            if (id.includes('node_modules/chart.js') ||
              id.includes('node_modules/recharts') ||
              id.includes('node_modules/echarts')) {
              return 'charts'
            }

            // Form handling
            if (id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/formik') ||
              id.includes('node_modules/react-query') ||
              id.includes('node_modules/@tanstack')) {
              return 'form-state'
            }

            // All other vendors
            if (id.includes('node_modules')) {
              return 'vendor-misc'
            }
          },

          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',

          // Optimize chunk size
          experimentalMinChunkSize: 20000, // 20KB minimum chunk size
        }
      }
    },

    server: {
      proxy: {
        '/api': {
          target: 'https://pharmacy-db-software-server.vercel.app',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})