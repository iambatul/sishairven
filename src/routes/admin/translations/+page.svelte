<script lang="ts">
  import { onMount } from 'svelte';
  import { translationsStore, translationJobsStore, fetchTranslations, triggerTranslation, loadingStore } from '$lib/admin/stores';
  
  const languages = [
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
  ];
  
  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    completed: { label: 'Completed', color: 'text-green-400', bg: 'bg-green-500/20' },
    in_progress: { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    pending: { label: 'Pending', color: 'text-gray-400', bg: 'bg-gray-500/20' },
    failed: { label: 'Failed', color: 'text-red-400', bg: 'bg-red-500/20' },
    queued: { label: 'Queued', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    processing: { label: 'Processing', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  };
  
  let selectedPost: string | null = null;
  let selectedLanguage: string | null = null;
  let showTriggerModal = false;
  let isTriggering = false;
  let filterStatus: string = 'all';
  let searchQuery: string = '';
  
  $: filteredPosts = $translationsStore.filter(post => {
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus !== 'all' && !post.translations.some(t => t.status === filterStatus)) return false;
    return true;
  });
  
  function getTranslationProgress(post: typeof $translationsStore[0]): number {
    const completed = post.translations.filter(t => t.status === 'completed').length;
    return Math.round((completed / post.translations.length) * 100);
  }
  
  function getStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return '✓';
      case 'in_progress': return '◐';
      case 'processing': return '◐';
      case 'pending': return '○';
      case 'queued': return '⏳';
      case 'failed': return '✗';
      default: return '○';
    }
  }
  
  function openTriggerModal(post: typeof $translationsStore[0], langCode: string) {
    selectedPost = post.slug;
    selectedLanguage = langCode;
    showTriggerModal = true;
  }
  
  function getTranslationButtonClass(status: string): string {
    const baseClass = 'p-3 rounded-lg border transition-all text-left';
    if (status === 'completed') {
      return `${baseClass} border-green-500/50 bg-green-500/5`;
    } else if (status === 'pending') {
      return `${baseClass} border-gray-500/30 bg-gray-500/5`;
    } else if (status === 'failed') {
      return `${baseClass} border-red-500/50 bg-red-500/5`;
    } else {
      return `${baseClass} border-yellow-500/50 bg-yellow-500/5`;
    }
  }
  
  function closeTriggerModal() {
    showTriggerModal = false;
    selectedPost = null;
    selectedLanguage = null;
  }
  
  async function handleTriggerTranslation() {
    if (!selectedPost || !selectedLanguage) return;
    isTriggering = true;
    const success = await triggerTranslation(selectedPost, selectedLanguage);
    if (success) {
      await fetchTranslations();
      closeTriggerModal();
    } else {
      alert('Failed to trigger translation. Please try again.');
    }
    isTriggering = false;
  }
  
  async function cancelJob(jobId: string) {
    try {
      const response = await fetch(`/api/admin/translations?jobId=${jobId}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) await fetchTranslations();
    } catch (error) {
      console.error('Failed to cancel job:', error);
    }
  }
  
  async function refreshData() {
    loadingStore.update(l => ({ ...l, translations: true }));
    await fetchTranslations();
    loadingStore.update(l => ({ ...l, translations: false }));
  }
  
  onMount(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  });
</script>

<div class="space-y-6">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h2 class="text-2xl font-semibold text-white">Translation Management</h2>
      <p class="text-gray-medium mt-1">Manage blog post translations and monitor translation jobs</p>
    </div>
    <button 
      on:click={refreshData}
      class="flex items-center gap-2 px-4 py-2 bg-black-soft border border-gray-dark rounded-lg text-white hover:border-pink-bright transition-colors"
      disabled={$loadingStore.translations}
    >
      <svg class="w-4 h-4" class:animate-spin={$loadingStore.translations} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
      </svg>
      Refresh
    </button>
  </div>
  
  {#if $translationJobsStore.length > 0}
    <div class="bg-black-soft rounded-xl border border-gray-dark/50 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-dark/50">
        <h3 class="text-lg font-semibold text-white">Active Translation Jobs</h3>
      </div>
      <div class="divide-y divide-gray-dark/30">
        {#each $translationJobsStore as job}
          <div class="px-6 py-4 flex items-center justify-between hover:bg-black/30 transition-colors">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center {statusConfig[job.status]?.bg || 'bg-gray-500/20'}">
                <span class="text-lg">{getStatusIcon(job.status)}</span>
              </div>
              <div>
                <p class="text-white font-medium">{job.slug}</p>
                <p class="text-sm text-gray-medium">
                  {languages.find(l => l.code === job.targetLanguage)?.flag}
                  {languages.find(l => l.code === job.targetLanguage)?.name}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              {#if job.status === 'processing'}
                <div class="w-32">
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-medium">Progress</span>
                    <span class="text-white">{job.progress}%</span>
                  </div>
                  <div class="h-2 bg-gray-dark rounded-full overflow-hidden">
                    <div class="h-full bg-pink-bright rounded-full transition-all" style="width: {job.progress}%"></div>
                  </div>
                </div>
              {/if}
              {#if job.status === 'queued' || job.status === 'processing'}
                <button on:click={() => cancelJob(job.id)} class="text-red-400 hover:text-red-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  
  <div class="flex flex-col sm:flex-row gap-4">
    <div class="flex-1">
      <input 
        type="text"
        bind:value={searchQuery}
        placeholder="Search posts..."
        class="w-full bg-black-soft border border-gray-dark rounded-lg px-4 py-2 text-white placeholder-gray-medium focus:outline-none focus:border-pink-bright"
      />
    </div>
    <select bind:value={filterStatus} class="bg-black-soft border border-gray-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-bright">
      <option value="all">All Statuses</option>
      <option value="completed">Completed</option>
      <option value="in_progress">In Progress</option>
      <option value="pending">Pending</option>
    </select>
  </div>
  
  {#if $loadingStore.translations}
    <div class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-bright"></div>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-4">
      {#each filteredPosts as post}
        <div class="bg-black-soft rounded-xl border border-gray-dark/50 p-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-white">{post.title}</h3>
              <p class="text-sm text-gray-medium">{post.slug}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-medium">Translation Progress</p>
              <div class="flex items-center gap-2 mt-1">
                <div class="w-24 h-2 bg-gray-dark rounded-full overflow-hidden">
                  <div class="h-full bg-pink-bright rounded-full" style="width: {getTranslationProgress(post)}%"></div>
                </div>
                <span class="text-white font-medium">{getTranslationProgress(post)}%</span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {#each post.translations as translation}
              {@const lang = languages.find(l => l.code === translation.language)}
              {@const status = statusConfig[translation.status]}
              <button 
                class={getTranslationButtonClass(translation.status)}
                on:click={() => { if (translation.status === 'pending' || translation.status === 'failed') openTriggerModal(post, translation.language); }}
              >
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-lg">{lang?.flag}</span>
                  <span class="text-sm font-medium text-white">{lang?.name}</span>
                </div>
                <span class="text-xs {status?.color}">{status?.label}</span>
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

{#if showTriggerModal}
  {@const post = $translationsStore.find(p => p.slug === selectedPost)}
  {@const lang = languages.find(l => l.code === selectedLanguage)}
  <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-black-soft rounded-2xl border border-gray-dark/50 p-6 max-w-md w-full">
      <h3 class="text-xl font-semibold text-white mb-4">Start Translation</h3>
      <div class="space-y-4 mb-6">
        <div class="bg-black rounded-lg p-4">
          <p class="text-sm text-gray-medium">Post</p>
          <p class="text-white font-medium">{post?.title}</p>
        </div>
        <div class="bg-black rounded-lg p-4">
          <p class="text-sm text-gray-medium">Target Language</p>
          <div class="flex items-center gap-2">
            <span class="text-2xl">{lang?.flag}</span>
            <span class="text-white font-medium">{lang?.name}</span>
          </div>
        </div>
      </div>
      <div class="flex gap-3">
        <button 
          on:click={closeTriggerModal}
          class="flex-1 px-4 py-2 bg-gray-dark rounded-lg text-white hover:bg-gray-medium transition-colors"
          disabled={isTriggering}
        >
          Cancel
        </button>
        <button 
          on:click={handleTriggerTranslation}
          class="flex-1 px-4 py-2 bg-pink-bright rounded-lg text-white hover:bg-pink-dark transition-colors flex items-center justify-center gap-2"
          disabled={isTriggering}
        >
          {#if isTriggering}
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Starting...
          {:else}
            Start Translation
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}
