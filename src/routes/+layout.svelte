<script lang="ts">
  /**
   * Root Layout Component
   * 
   * Initializes i18n, sets up geo data from server, and provides
   * the base structure for all pages. Handles theme detection.
   * 
   * @component Layout
   * @author Hairven Dev Team
   * @since 2026-02-10
   */
  
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { writable } from 'svelte/store';
  
  // Components
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Analytics from '$lib/components/Analytics.svelte';
  import { initializeI18n, isLoadingTranslations } from '$lib/i18n';
  import { initializeGeoStore } from '$lib/stores/geo';
  
  // Theme store — exported so Header can import it
  export const theme = writable<'light' | 'dark'>('light');
  
  function applyTheme(t: 'light' | 'dark') {
    if (!browser) return;
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('hairven-theme', t);
    theme.set(t);
  }
  
  function toggleTheme() {
    theme.update(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      return next;
    });
  }
  
  // Initialize on mount
  onMount(async () => {
    // Detect theme
    const stored = localStorage.getItem('hairven-theme');
    if (stored === 'dark' || stored === 'light') {
      applyTheme(stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
    
    // Listen for OS theme changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('hairven-theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);
    
    // Initialize i18n
    if (browser) {
      await initializeI18n($page.data?.lang);
    }
    
    // Initialize geo store from page data
    if ($page.data?.geo) {
      initializeGeoStore($page.data.geo);
    }
    
    return () => {
      mq.removeEventListener('change', handler);
    };
  });
</script>

<!-- Analytics -->
<Analytics />

<!-- Loading Indicator for Translations -->
{#if $isLoadingTranslations}
  <div class="fixed top-0 left-0 w-full h-0.5 bg-pink-bright z-[100]">
    <div class="h-full bg-white animate-pulse"></div>
  </div>
{/if}

<!-- Main Layout -->
<div class="min-h-screen flex flex-col" style="background-color: var(--bg-primary);">
  <Header currentTheme={$theme} onToggleTheme={toggleTheme} />
  
  <main class="flex-1">
    <slot />
  </main>
  
  <Footer />
</div>
