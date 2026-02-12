<script lang="ts">
  /**
   * Site Header — Affiliate / Sales Focus
   * Compact responsive nav that fits all screen sizes.
   */
  
  import { page } from '$app/stores';
  import LanguageSwitcher from './LanguageSwitcher.svelte';
  import { locale } from '$lib/i18n';
  
  export let currentTheme: 'light' | 'dark' = 'light';
  export let onToggleTheme: () => void = () => {};
  
  let isMenuOpen = false;
  
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ];
  
  $: currentPath = $page.url.pathname;
  $: currentLang = $locale?.split('-')[0] || 'en';
  
  function getLocalizedUrl(path: string): string {
    if (currentLang === 'en') return path;
    return `/${currentLang}${path}`;
  }
</script>

<header class="fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b transition-colors duration-300"
  style="background-color: var(--bg-nav); border-color: var(--border-accent);">
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="flex items-center justify-between h-16 sm:h-18 lg:h-20">
      <!-- Logo -->
      <a href={getLocalizedUrl('/')} class="text-xl sm:text-2xl lg:text-3xl font-handwritten font-bold text-pink-bright hover:text-pink-medium transition-colors whitespace-nowrap">
        Hairven by Elyn
      </a>
      
      <!-- Desktop Nav — visible from 640px (sm) -->
      <nav class="hidden sm:flex items-center gap-0.5 lg:gap-1">
        {#each navItems as item}
          <a 
            href={getLocalizedUrl(item.href)}
            class="px-2.5 lg:px-3.5 py-1.5 rounded-lg text-sm lg:text-base transition-colors duration-200 whitespace-nowrap {currentPath === getLocalizedUrl(item.href) ? 'text-pink-bright bg-pink-bright/10 font-medium' : 'hover:text-pink-bright hover:bg-pink-bright/5'}"
            style={currentPath === getLocalizedUrl(item.href) ? '' : 'color: var(--text-secondary);'}
          >
            {item.label}
          </a>
        {/each}
        
        <!-- Theme Toggle -->
        <button
          on:click={onToggleTheme}
          class="p-1.5 lg:p-2 rounded-lg transition-colors duration-200 hover:bg-pink-bright/10 ml-1"
          style="color: var(--text-secondary);"
          aria-label="Toggle theme"
          title={currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {#if currentTheme === 'dark'}
            <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          {:else}
            <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          {/if}
        </button>
        
        <!-- Language Switcher -->
        <div class="ml-1 pl-2 lg:pl-3 border-l" style="border-color: var(--border-color);">
          <LanguageSwitcher variant="dropdown" showFlags={true} showNames={false} />
        </div>
      </nav>
      
      <!-- Mobile only (below 640px) -->
      <div class="sm:hidden flex items-center gap-1">
        <button
          on:click={onToggleTheme}
          class="p-2 rounded-lg transition-colors hover:bg-pink-bright/10"
          style="color: var(--text-secondary);"
          aria-label="Toggle theme"
        >
          {#if currentTheme === 'dark'}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          {:else}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          {/if}
        </button>
        
        <LanguageSwitcher variant="minimal" />
        
        <button 
          class="p-2 hover:text-pink-bright transition-colors"
          style="color: var(--text-primary);"
          on:click={() => isMenuOpen = !isMenuOpen}
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {#if isMenuOpen}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            {/if}
          </svg>
        </button>
      </div>
    </div>
  </div>
  
  <!-- Mobile Menu (below 640px only) -->
  {#if isMenuOpen}
    <div class="sm:hidden backdrop-blur-lg border-t transition-colors"
      style="background-color: var(--bg-mobile-menu); border-color: var(--border-accent);">
      <nav class="max-w-7xl mx-auto px-4 py-3 space-y-1">
        {#each navItems as item}
          <a 
            href={getLocalizedUrl(item.href)}
            class="block px-4 py-3 rounded-lg transition-colors {currentPath === getLocalizedUrl(item.href) ? 'text-pink-bright bg-pink-bright/10 font-medium' : 'hover:text-pink-bright hover:bg-pink-bright/5'}"
            style={currentPath === getLocalizedUrl(item.href) ? '' : 'color: var(--text-primary);'}
            on:click={() => isMenuOpen = false}
          >
            {item.label}
          </a>
        {/each}
      </nav>
    </div>
  {/if}
</header>

<!-- Spacer for fixed header -->
<div class="h-16 sm:h-18 lg:h-20"></div>
