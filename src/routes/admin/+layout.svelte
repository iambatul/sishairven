<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { authStore, sidebarOpen, connectLiveUpdates, disconnectLiveUpdates } from '$lib/admin/stores';
  
  const icons = {
    dashboard: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>`,
    analytics: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
    revenue: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    clika: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
    translations: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>`,
    logout: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>`,
    menu: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>`,
    close: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
  };
  
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: icons.dashboard },
    { path: '/admin/analytics', label: 'Geo Analytics', icon: icons.analytics },
    { path: '/admin/revenue', label: 'Revenue', icon: icons.revenue },
    { path: '/admin/clika', label: 'Clika Evasion', icon: icons.clika },
    { path: '/admin/translations', label: 'Translations', icon: icons.translations },
  ];
  
  let isCheckingAuth = true;
  let mobileMenuOpen = false;
  
  onMount(() => {
    const isAuth = authStore.checkAuth();
    if (!isAuth) goto('/admin');
    isCheckingAuth = false;
    connectLiveUpdates();
  });
  
  onDestroy(() => disconnectLiveUpdates());
  
  function handleLogout() {
    authStore.logout();
    goto('/admin');
  }
  
  function isActive(path: string): boolean {
    return $page.url.pathname === path || (path !== '/admin' && $page.url.pathname.startsWith(path));
  }
  
  function getNavItemClass(path: string): string {
    const active = isActive(path);
    return active 
      ? 'flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-pink-bright/20 text-pink-bright'
      : 'flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-light hover:bg-gray-dark/50';
  }
  
  $: pageTitle = navItems.find(item => isActive(item.path))?.label || 'Dashboard';
  
  function handleLoginSubmit(e: SubmitEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const success = authStore.login(username, password);
    if (!success) alert('Invalid credentials. Try password: hairven2026');
  }
</script>

<svelte:head>
  <title>{pageTitle} - Hairven Admin</title>
</svelte:head>

{#if !$authStore.isAuthenticated}
  <div class="min-h-screen bg-black flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-black-soft rounded-2xl border border-pink-bright/30 p-8 shadow-2xl">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-pink-bright/10 rounded-full mb-4">
          <span class="text-pink-bright text-3xl">✦</span>
        </div>
        <h1 class="text-3xl font-handwritten text-pink-bright mb-2">Hairven Admin</h1>
        <p class="text-gray-medium">Sign in to access the dashboard</p>
      </div>
      <form 
        class="space-y-6"
        on:submit={handleLoginSubmit}
      >
        <div>
          <label for="username" class="block text-sm font-medium text-gray-light mb-2">Username</label>
          <input type="text" id="username" name="username" class="w-full bg-black border border-gray-dark rounded-lg px-4 py-3 text-white placeholder-gray-medium focus:outline-none focus:border-pink-bright" placeholder="admin" required />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-light mb-2">Password</label>
          <input type="password" id="password" name="password" class="w-full bg-black border border-gray-dark rounded-lg px-4 py-3 text-white placeholder-gray-medium focus:outline-none focus:border-pink-bright" placeholder="••••••••" required />
        </div>
        <button type="submit" class="w-full bg-pink-bright text-white font-semibold py-3 rounded-lg hover:bg-pink-dark transition-colors shadow-lg">Sign In</button>
      </form>
      <p class="text-center text-gray-medium text-sm mt-6">Default password: <code class="bg-black px-2 py-1 rounded text-pink-light">hairven2026</code></p>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-black flex">
    <!-- Sidebar (Desktop) -->
    <aside class="hidden lg:flex flex-col w-64 bg-black-soft border-r border-gray-dark/50 fixed h-full z-40">
      <div class="p-6 border-b border-gray-dark/50 flex items-center gap-3">
        <span class="text-pink-bright text-2xl">✦</span>
        <span class="text-xl font-handwritten text-pink-bright">Hairven</span>
      </div>
      <nav class="flex-1 p-4 space-y-1">
        {#each navItems as item}
          <a href={item.path} class={getNavItemClass(item.path)}>
            <span>{@html item.icon}</span>
            <span class="font-medium">{item.label}</span>
          </a>
        {/each}
      </nav>
      <div class="p-4 border-t border-gray-dark/50">
        <button on:click={handleLogout} class="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-medium hover:text-red-400 hover:bg-red-400/10 transition-all">
          <span>{@html icons.logout}</span>
          <span class="font-medium">Logout</span>
        </button>
      </div>
    </aside>
    
    <!-- Mobile Header -->
    <div class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black-soft/95 backdrop-blur border-b border-gray-dark/50">
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center gap-2">
          <span class="text-pink-bright text-xl">✦</span>
          <span class="text-lg font-handwritten text-pink-bright">Hairven Admin</span>
        </div>
        <button on:click={() => mobileMenuOpen = !mobileMenuOpen} class="p-2 text-gray-light">
          {@html mobileMenuOpen ? icons.close : icons.menu}
        </button>
      </div>
      {#if mobileMenuOpen}
        <nav class="border-t border-gray-dark/50 p-4 space-y-1">
          {#each navItems as item}
            <a href={item.path} class={getNavItemClass(item.path)}>
              <span>{@html item.icon}</span>
              <span class="font-medium">{item.label}</span>
            </a>
          {/each}
          <button on:click={handleLogout} class="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-medium hover:text-red-400">
            <span>{@html icons.logout}</span>
            <span class="font-medium">Logout</span>
          </button>
        </nav>
      {/if}
    </div>
    
    <!-- Main Content -->
    <main class="flex-1 lg:ml-64 pt-16 lg:pt-0">
      <header class="sticky top-0 z-30 bg-black/80 backdrop-blur border-b border-gray-dark/30 px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-handwritten text-pink-bright">{pageTitle}</h1>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
{/if}
