<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import { clikaStore, timeRangeStore, fetchClikaAnalytics, loadingStore } from '$lib/admin/stores';
  import type { TimeRange } from '$lib/admin/types';
  
  Chart.register(...registerables);
  
  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
  ];
  
  let proxyChart: Chart | null = null;
  let hoursChart: Chart | null = null;
  let proxyCanvas: HTMLCanvasElement;
  let hoursCanvas: HTMLCanvasElement;
  
  function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
  
  function getHealthColor(score: number): string {
    if (score >= 0.9) return 'text-green-400';
    if (score >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  }
  
  function getHealthBg(score: number): string {
    if (score >= 0.9) return 'bg-green-500';
    if (score >= 0.7) return 'bg-yellow-500';
    return 'bg-red-500';
  }
  
  function initCharts() {
    if (!proxyCanvas || !hoursCanvas) return;
    
    const proxyCtx = proxyCanvas.getContext('2d');
    if (proxyCtx) {
      const proxies = $clikaStore.proxyUsage.slice(0, 8);
      proxyChart = new Chart(proxyCtx, {
        type: 'bar',
        data: {
          labels: proxies.map(p => p.country),
          datasets: [
            { label: 'Proxies', data: proxies.map(p => p.proxyCount), backgroundColor: 'rgba(147, 51, 234, 0.8)', borderRadius: 4 },
            { label: 'Clicks', data: proxies.map(p => p.clickCount), backgroundColor: 'rgba(255, 20, 147, 0.8)', borderRadius: 4 }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#e5e5e5' } } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#6b6b6b' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#6b6b6b' } }
          }
        }
      });
    }
    
    const hoursCtx = hoursCanvas.getContext('2d');
    if (hoursCtx) {
      const hours = $clikaStore.businessHours;
      hoursChart = new Chart(hoursCtx, {
        type: 'bar',
        data: {
          labels: hours.map(h => h.country),
          datasets: [
            { label: 'Business Hours', data: hours.map(h => h.businessHoursClicks), backgroundColor: 'rgba(34, 197, 94, 0.8)', borderRadius: 4 },
            { label: 'After Hours', data: hours.map(h => h.afterHoursClicks), backgroundColor: 'rgba(107, 107, 107, 0.5)', borderRadius: 4 }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#e5e5e5' } } },
          scales: {
            x: { stacked: true, grid: { display: false }, ticks: { color: '#6b6b6b' } },
            y: { stacked: true, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#6b6b6b' } }
          }
        }
      });
    }
  }
  
  function updateCharts() {
    if (proxyChart) {
      const proxies = $clikaStore.proxyUsage.slice(0, 8);
      proxyChart.data.labels = proxies.map(p => p.country);
      proxyChart.data.datasets[0].data = proxies.map(p => p.proxyCount);
      proxyChart.data.datasets[1].data = proxies.map(p => p.clickCount);
      proxyChart.update();
    }
    if (hoursChart) {
      const hours = $clikaStore.businessHours;
      hoursChart.data.labels = hours.map(h => h.country);
      hoursChart.data.datasets[0].data = hours.map(h => h.businessHoursClicks);
      hoursChart.data.datasets[1].data = hours.map(h => h.afterHoursClicks);
      hoursChart.update();
    }
  }
  
  function handleTimeRangeChange(range: TimeRange) {
    timeRangeStore.set(range);
    loadingStore.update(l => ({ ...l, clika: true }));
    fetchClikaAnalytics(range).then(() => {
      updateCharts();
      loadingStore.update(l => ({ ...l, clika: false }));
    });
  }
  
  function handleTimeRangeSelect(e: Event) {
    const target = e.target as HTMLSelectElement;
    handleTimeRangeChange(target.value as TimeRange);
  }
  
  onMount(() => {
    loadingStore.update(l => ({ ...l, clika: true }));
    fetchClikaAnalytics($timeRangeStore).then(() => {
      initCharts();
      loadingStore.update(l => ({ ...l, clika: false }));
    });
  });
  
  onDestroy(() => {
    proxyChart?.destroy();
    hoursChart?.destroy();
  });
</script>

<div class="space-y-6">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h2 class="text-2xl font-semibold text-white">Clika Evasion Analytics</h2>
      <p class="text-gray-medium mt-1">Monitor proxy performance and click distribution</p>
    </div>
    <select 
      value={$timeRangeStore}
      on:change={handleTimeRangeSelect}
      class="bg-black-soft border border-gray-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-bright"
    >
      {#each timeRanges as range}
        <option value={range.value}>{range.label}</option>
      {/each}
    </select>
  </div>
  
  {#if $loadingStore.clika}
    <div class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-bright"></div>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <p class="text-sm text-gray-medium mb-1">Active Proxies</p>
        <p class="text-3xl font-bold text-white">{$clikaStore.totalProxies}</p>
      </div>
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <p class="text-sm text-gray-medium mb-1">Evasion Clicks</p>
        <p class="text-3xl font-bold text-white">{formatNumber($clikaStore.totalEvasionClicks)}</p>
      </div>
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <p class="text-sm text-gray-medium mb-1">Health Score</p>
        <p class="text-3xl font-bold text-white">{Math.round($clikaStore.avgHealthScore * 100)}%</p>
      </div>
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <p class="text-sm text-gray-medium mb-1">ISP Diversity</p>
        <p class="text-3xl font-bold text-white">{$clikaStore.ispDiversity.length}</p>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <h3 class="text-lg font-semibold text-white mb-4">Proxy Usage by Country</h3>
        <div class="h-72">
          <canvas bind:this={proxyCanvas}></canvas>
        </div>
      </div>
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <h3 class="text-lg font-semibold text-white mb-4">Business Hours Alignment</h3>
        <div class="h-72">
          <canvas bind:this={hoursCanvas}></canvas>
        </div>
      </div>
    </div>
  {/if}
</div>
