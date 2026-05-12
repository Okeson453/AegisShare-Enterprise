/** @type {import('tailwindcss').Config} */
module.exports = {
  // ─── Content Scanning ─────────────────────────────────────────────────────
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],

  // ─── Dark Mode ────────────────────────────────────────────────────────────
  // 'class' strategy — <html class="dark"> is hardcoded in index.html
  // Wire to Zustand store if light mode toggle is added later
  darkMode: 'class',

  theme: {
    // ─── Breakpoints ────────────────────────────────────────────────────────
    screens: {
      xs:   '320px',
      sm:   '480px',
      md:   '768px',
      lg:   '1024px',
      xl:   '1280px',
      '2xl': '1440px',
      '3xl': '1920px',
      '4k':  '2560px',
    },

    extend: {
      // ─── Colors — All bridged from CSS custom properties ────────────────
      colors: {
        // Background ramp (7 steps)
        bg:  'var(--bg)',
        s0:  'var(--s0)',
        s1:  'var(--s1)',
        s2:  'var(--s2)',
        s3:  'var(--s3)',
        s4:  'var(--s4)',
        s5:  'var(--s5)',

        // Borders
        bd:  'var(--bd)',
        bd1: 'var(--bd1)',
        bd2: 'var(--bd2)',
        bd3: 'var(--bd3)',

        // Text ramp (4 steps)
        t0:  'var(--t0)',
        t1:  'var(--t1)',
        t2:  'var(--t2)',
        t3:  'var(--t3)',

        // Cyan (primary brand)
        cy:  'var(--cy)',
        cy1: 'var(--cy1)',
        cy2: 'var(--cy2)',
        cy3: 'var(--cy3)',

        // Emerald (success)
        em:  'var(--em)',
        em1: 'var(--em1)',
        em2: 'var(--em2)',
        em3: 'var(--em3)',

        // Amber (warning)
        am:  'var(--am)',
        am1: 'var(--am1)',
        am2: 'var(--am2)',
        am3: 'var(--am3)',

        // Rose (danger)
        rd:  'var(--rd)',
        rd1: 'var(--rd1)',
        rd2: 'var(--rd2)',
        rd3: 'var(--rd3)',

        // Violet (info)
        vl:  'var(--vl)',
        vl1: 'var(--vl1)',
        vl2: 'var(--vl2)',
        vl3: 'var(--vl3)',

        // Extended enterprise palette
        bl:  'var(--bl)',   // Blue — info states
        nv:  'var(--nv)',   // Navy indigo — deep accent
        gs:  'var(--gs)',   // Gunmetal slate — muted
        go:  'var(--go)',   // Gold — premium/admin
        sl:  'var(--sl)',   // Slate — neutral
        ice: 'var(--ice)',  // Ice white — light text on saturated bg
      },

      // ─── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
        body:    ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        cinzel:  ['Cinzel', 'Times New Roman', 'serif'],
      },

      fontWeight: {
        regular:   '400',
        medium:    '500',
        semibold:  '600',
        bold:      '700',
        black:     '900',
      },

      // ─── Font Size — Aligned with CSS token scale ─────────────────────────
      // FIX: Previous config had mismatched values vs --text-* CSS tokens
      // These now match globals.css exactly so var(--text-sm) = text-sm = 14px
      fontSize: {
        '2xs': ['11px', { lineHeight: '16px', letterSpacing: '0.02em'  }],
        xs:    ['12px', { lineHeight: '16px', letterSpacing: '-0.01em' }],
        sm:    ['14px', { lineHeight: '20px', letterSpacing: '-0.005em'}],
        base:  ['14px', { lineHeight: '24px', letterSpacing: '0'       }],
        md:    ['16px', { lineHeight: '24px', letterSpacing: '0'       }],
        lg:    ['18px', { lineHeight: '28px', letterSpacing: '0.005em' }],
        xl:    ['20px', { lineHeight: '28px', letterSpacing: '0.01em'  }],
        '2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
        '3xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.02em' }],
        '4xl': ['36px', { lineHeight: '40px', letterSpacing: '-0.02em' }],

        // Display scale — Playfair Display
        'display-sm': ['30px',  { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-md': ['36px',  { lineHeight: '1.15',letterSpacing: '-0.025em'}],
        'display-lg': ['48px',  { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'display-xl': ['60px',  { lineHeight: '1.05',letterSpacing: '-0.03em' }],
        'display-2xl':['72px',  { lineHeight: '1',   letterSpacing: '-0.03em' }],

        // Mono scale — JetBrains Mono
        'mono-xs': ['11px', { lineHeight: '16px', letterSpacing: '0.1em'  }],
        'mono-sm': ['12px', { lineHeight: '18px', letterSpacing: '0.06em' }],
        'mono-md': ['13px', { lineHeight: '20px', letterSpacing: '0.04em' }],
        'mono-lg': ['14px', { lineHeight: '22px', letterSpacing: '0.04em' }],
      },

      // ─── Letter Spacing ───────────────────────────────────────────────────
      letterSpacing: {
        tight:   '-0.025em',
        normal:  '0em',
        wide:    '0.025em',
        wider:   '0.05em',
        widest:  '0.1em',
        super:   '0.2em',   // Cinzel super-labels
      },

      // ─── Line Height ──────────────────────────────────────────────────────
      lineHeight: {
        none:    '1',
        tight:   '1.25',
        snug:    '1.375',
        normal:  '1.5',
        relaxed: '1.625',
        loose:   '2',
      },

      // ─── Spacing ──────────────────────────────────────────────────────────
      spacing: {
        safe: 'env(safe-area-inset-bottom)',
        // Sidebar dimensions
        'sidebar':           '230px',
        'sidebar-collapsed': '56px',
      },

      // ─── Border Radius — Bridged from CSS tokens ──────────────────────────
      borderRadius: {
        sm:   'var(--radius-sm)',   // 2px
        md:   'var(--radius-md)',   // 4px
        lg:   'var(--radius-lg)',   // 8px
        xl:   'var(--radius-xl)',   // 12px
        full: '9999px',
      },

      // ─── Box Shadow — Bridged from CSS tokens ─────────────────────────────
      boxShadow: {
        sm:       'var(--shadow-sm)',
        md:       'var(--shadow-md)',
        lg:       'var(--shadow-lg)',
        xl:       'var(--shadow-xl)',
        '2xl':    'var(--shadow-2xl)',
        modal:    'var(--shadow-modal)',
        'glow-sm':'var(--glow-sm)',
        'glow-md':'var(--glow-md)',
        'glow-lg':'var(--glow-lg)',
        glass:    'var(--glass-glow)',
        focus:    'var(--focus-ring)',
      },

      // ─── Z-Index — Bridged from CSS tokens ───────────────────────────────
      zIndex: {
        hide:              '-1',
        base:              '0',
        dropdown:          '100',
        sticky:            '200',
        fixed:             '300',
        'modal-backdrop':  '900',
        modal:             '1000',
        popover:           '1100',
        tooltip:           '1200',
        notification:      '1300',
      },

      // ─── Backdrop Blur ────────────────────────────────────────────────────
      backdropBlur: {
        xs:  '2px',
        sm:  '4px',
        md:  '12px',
        lg:  '16px',
        xl:  '24px',
        '2xl': '40px',
      },

      // ─── Transition Duration — Bridged from CSS tokens ────────────────────
      transitionDuration: {
        instant: '80ms',
        fast:    '150ms',
        mid:     '280ms',
        slow:    '450ms',
        crawl:   '700ms',
      },

      // ─── Transition Timing Functions ──────────────────────────────────────
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
        sharp:  'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ─── Width Utilities ──────────────────────────────────────────────────
      width: {
        sidebar:            'var(--sidebar-w)',
        'sidebar-collapsed': 'var(--sidebar-w-collapsed)',
      },

      // ─── Animations ───────────────────────────────────────────────────────
      animation: {
        'shimmer':    'shimmer 2s ease-in-out infinite',
        'pulse':      'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':    'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'slide-up':   'slideUp 0.3s var(--ease-smooth)',
        'slide-down': 'slideDown 0.3s var(--ease-smooth)',
        'slide-in':   'slideIn 0.3s var(--ease-smooth)',
        'scale-in':   'scaleIn 0.2s var(--ease-spring)',
        'spin':       'spin 1s linear infinite',
        'ping':       'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bounce':     'bounce 1s var(--ease-smooth) infinite',
      },

      // ─── Keyframes ────────────────────────────────────────────────────────
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        slideUp: {
          '0%':   { transform: 'translateY(16px)',  opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(-24px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',     opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        spin: {
          '0%':   { transform: 'rotate(0deg)'   },
          '100%': { transform: 'rotate(360deg)' },
        },
        ping: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)'      },
          '50%':      { transform: 'translateY(-0.5rem)'},
        },
      },
    },
  },

  plugins: [],
}