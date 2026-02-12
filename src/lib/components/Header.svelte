<script lang="ts">
  /**
   * Site Header Component
   * 
   * Main navigation header with language switcher and theme toggle.
   * Responsive design with mobile hamburger menu.
   * 
   * @component Header
   * @author Hairven Dev Team
   * @since 2026-02-10
   */
  
  import { page } from '$app/stores';
  import LanguageSwitcher from './LanguageSwitcher.svelte';
  import { locale } from '$lib/i18n';
  
  export let currentTheme: 'light' | 'dark' = 'light';
  export let onToggleTheme: () => void = () => {};
  
  let isMenuOpen = false;
  
  // Navigation items
  const navItems = [
    { href: '/', label: 'Home', labelKey: 'nav.home' },
    { href: '/about', label: 'About', labelKey: 'nav.about' },
    { href: '/services', label: 'Services', labelKey: 'nav.services' },
    { href: '/shop', label: 'Shop', labelKey: 'nav.shop' },
    { href: '/blog', label: 'Blog', labelKey: 'nav.blog' },
    { href: '/contact', label: 'Contact', labelKey: 'nav.contact' }
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
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-20">
      <!-- Logo -->
      <a href={getLocalizedUrl('/')} class="text-2xl sm:text-3xl font-handwritten font-bold text-pink-bright hover:text-pink-medium transition-colors">
        Hairven by Elyn
      </a>
      
      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center space-x-1">
        {#each navItems as item}
          <a 
            href={getLocalizedUrl(item.href)}
            class="px-4 py-2 rounded-lg transition-colors duration-200 {currentPath === getLocalizedUrl(item.href) ? 'text-pink-bright bg-pink-bright/10' : 'hover:text-pink-bright hover:bg-pink-bright/5'}"
            style={currentPath === getLocalizedUrl(item.href) ? '' : 'color: var(--text-secondary);'}
          >
            {item.label}
          </a>
        {/each}
        
        <!-- Theme Toggle -->
        <button
          on:click={onToggleTheme}
          class="ml-2 p-2 rounded-lg transition-colors duration-200 hover:bg-pink-bright/10"
          style="color: var(--text-secondary);"
          aria-label="Toggle theme"
          title={currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {#if currentTheme === 'dark'}
            <!-- Sun icon -->
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          {:else}
            <!-- Moon icon -->
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          {/if}
        </button>
        
        <!-- Language Switcher -->
        <div class="ml-2 pl-4 border-l" style="border-color: var(--border-color);">
          <LanguageSwitcher variant="dropdown" showFlags={true} showNames={false} />
        </div>
        
        <!-- Book Now Button -->
        <a 
          href={getLocalizedUrl('/contact')}
          class="ml-4 px-6 py-2 bg-pink-bright font-semibold rounded-lg hover:bg-pink-medium transition-colors"
          style="color: var(--text-inverse);"
        >
          Book Now
        </a>
      </nav>
      
      <!-- Mobile: Theme + Lang + Menu -->
      <div class="md:hidden flex items-center gap-2">
        <!-- Mobile Theme Toggle -->
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
        
        <!-- Mobile Language Switcher -->
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
  
  <!-- Mobile Menu -->
  {#if isMenuOpen}
    <div class="md:hidden backdrop-blur-lg border-t transition-colors"
      style="background-color: var(--bg-mobile-menu); border-color: var(--border-accent);">
      <nav class="max-w-7xl mx-auto px-4 py-4 space-y-2">
        {#each navItems as item}
          <a 
            href={getLocalizedUrl(item.href)}
            class="block px-4 py-3 rounded-lg transition-colors {currentPath === getLocalizedUrl(item.href) ? 'text-pink-bright bg-pink-bright/10' : 'hover:text-pink-bright hover:bg-pink-bright/5'}"
            style={currentPath === getLocalizedUrl(item.href) ? '' : 'color: var(--text-primary);'}
            on:click={() => isMenuOpen = false}
          >
            {item.label}
          </a>
        {/each}
        <a 
          href={getLocalizedUrl('/contact')}
          class="block mt-4 px-4 py-3 bg-pink-bright font-semibold rounded-lg text-center"
          style="color: var(--text-inverse);"
          on:click={() => isMenuOpen = false}
        >
          Book Now
        </a>
      </nav>
    </div>
  {/if}
</header>

<!-- Spacer for fixed header -->
<div class="h-20"></div>
