<script lang="ts">
  /**
   * Language Switcher Component
   * 
   * Dropdown menu for switching between supported languages.
   * Updates the URL to include language prefix and stores preference.
   * 
   * @component LanguageSwitcher
   * @author Hairven Dev Team
   * @since 2026-02-10
   */
  
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { locale, switchLanguage } from '$lib/i18n';
  import { getEnabledLanguages, getLanguageConfig, type LanguageConfig } from '$lib/types/geo';
  import { slide } from 'svelte/transition';
  import { clickOutside } from '$lib/utils/clickOutside';
  
  // Props
  export let variant: 'dropdown' | 'inline' | 'minimal' = 'dropdown';
  export let showFlags = true;
  export let showNames = true;
  
  // State
  let isOpen = false;
  let isLoading = false;
  
  // Get enabled languages
  const languages = getEnabledLanguages();
  
  // Current language config
  $: currentLang = getLanguageConfig($locale?.split('-')[0] || 'en');
  
  // Get alternate URLs for the current page
  function getLanguageUrl(langCode: string): string {
    const currentPath = $page.url.pathname;
    const cleanPath = currentPath.replace(/^\/(es|fr|de)/, '') || '/';
    
    return langCode === 'en' ? cleanPath : `/${langCode}${cleanPath}`;
  }
  
  // Handle language switch
  async function handleLanguageChange(lang: LanguageConfig) {
    if (lang.code === currentLang?.code) {
      isOpen = false;
      return;
    }
    
    isLoading = true;
    
    try {
      // Update i18n locale
      await switchLanguage(lang.code);
      
      // Navigate to language-specific URL
      const newUrl = getLanguageUrl(lang.code);
      await goto(newUrl, { replaceState: false });
      
    } catch (error) {
      console.error('Failed to switch language:', error);
    } finally {
      isLoading = false;
      isOpen = false;
    }
  }
</script>

{#if variant === 'dropdown'}
  <div class="relative" use:clickOutside={() => isOpen = false}>
    <!-- Trigger Button -->
    <button
      type="button"
      class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-light hover:text-white hover:bg-white/5 transition-colors"
      on:click={() => isOpen = !isOpen}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      disabled={isLoading}
    >
      {#if showFlags && currentLang}
        <span class="text-lg">{currentLang.flag}</span>
      {/if}
      {#if showNames && currentLang}
        <span class="text-sm font-medium">{currentLang.name}</span>
      {/if}
      <svg 
        class="w-4 h-4 transition-transform {isOpen ? 'rotate-180' : ''}" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
      {#if isLoading}
        <span class="animate-spin ml-1">⟳</span>
      {/if}
    </button>
    
    <!-- Dropdown Menu -->
    {#if isOpen}
      <div 
        class="absolute right-0 mt-2 w-48 bg-black-soft border border-gray-dark rounded-lg shadow-lg z-50 overflow-hidden"
        transition:slide={{ duration: 150 }}
        role="listbox"
      >
        <div class="py-1">
          {#each languages as lang}
            <button
              type="button"
              class="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors {lang.code === currentLang?.code ? 'bg-pink-bright/10 text-pink-bright' : 'text-gray-light'}"
              on:click={() => handleLanguageChange(lang)}
              role="option"
              aria-selected={lang.code === currentLang?.code}
            >
              {#if showFlags}
                <span class="text-lg">{lang.flag}</span>
              {/if}
              <span class="text-sm flex-1">{lang.name}</span>
              {#if lang.code === currentLang?.code}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              {/if}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
  
{:else if variant === 'inline'}
  <!-- Inline Language List -->
  <div class="flex items-center gap-1">
    {#each languages as lang, index}
      {#if index > 0}
        <span class="text-gray-dark">|</span>
      {/if}
      <a
        href={getLanguageUrl(lang.code)}
        class="px-2 py-1 text-sm rounded transition-colors {lang.code === currentLang?.code ? 'text-pink-bright font-medium' : 'text-gray-light hover:text-white'}"
        on:click|preventDefault={() => handleLanguageChange(lang)}
      >
        {#if showFlags}
          <span class="mr-1">{lang.flag}</span>
        {/if}
        {lang.code.toUpperCase()}
      </a>
    {/each}
  </div>
  
{:else if variant === 'minimal'}
  <!-- Minimal Icon-only Trigger -->
  <div class="relative" use:clickOutside={() => isOpen = false}>
    <button
      type="button"
      class="p-2 rounded-lg text-gray-light hover:text-white hover:bg-white/5 transition-colors"
      on:click={() => isOpen = !isOpen}
      aria-label="Select language"
      title="Select language"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    </button>
    
    {#if isOpen}
      <div 
        class="absolute right-0 mt-2 w-40 bg-black-soft border border-gray-dark rounded-lg shadow-lg z-50"
        transition:slide={{ duration: 150 }}
      >
        <div class="py-1">
          {#each languages as lang}
            <button
              type="button"
              class="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/5 transition-colors {lang.code === currentLang?.code ? 'text-pink-bright' : 'text-gray-light'}"
              on:click={() => handleLanguageChange(lang)}
            >
              <span>{lang.flag}</span>
              <span class="text-sm">{lang.name}</span>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
{/if}
