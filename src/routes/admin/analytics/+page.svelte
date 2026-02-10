<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import { geoAnalyticsStore, timeRangeStore, fetchGeoAnalytics, loadingStore } from '$lib/admin/stores';
  import type { TimeRange } from '$lib/admin/types';
  
  Chart.register(...registerables);
  
  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
  ];
  
  const countryFlags: Record<string, string> = {
    'US': '🇺🇸', 'GB': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺', 'DE': '🇩🇪',
    'FR': '🇫🇷', 'ES': '🇪🇸', 'IT': '🇮🇹', 'JP': '🇯🇵', 'BR': '🇧🇷',
    'IN': '🇮🇳', 'NL': '🇳🇱', 'MX': '🇲🇽'
  };
  
  let countryChart: Chart | null = null;
  let languageChart: Chart | null = null;
  let trafficChart: Chart | null = null;
  let countryCanvas: HTMLCanvasElement;
  let languageCanvas: HTMLCanvasElement;
  let trafficCanvas: HTMLCanvasElement;
  
  function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
  
  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }
  
  function getChangeBadgeClass(change: number): string {
    const isPositive = change >= 0;
    return `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
    }`;
  }
  
  function initCharts() {
    if (!countryCanvas || !languageCanvas || !trafficCanvas) return;
    
    const countryCtx = countryCanvas.getContext('2d');
    if (countryCtx) {
      const topCountries = $geoAnalyticsStore.countries.slice(0, 8);
      countryChart = new Chart(countryCtx, {
        type: 'bar',
        data: {
          labels: topCountries.map(c => c.country),
          datasets: [{
            label: 'Visitors',
            data: topCountries.map(c => c.visitors),
            backgroundColor: 'rgba(255, 20, 147, 0.8)',
            borderColor: '#ff1493',
            borderWidth: 1,
            borderRadius: 4,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#6b6b6b' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#6b6b6b' } }
          }
        }
      });
    }
    
    const languageCtx = languageCanvas.getContext('2d');
    if (languageCtx) {
      const languages = $geoAnalyticsStore.languages.slice(0, 6);
      languageChart = new Chart(languageCtx, {
        type: 'doughnut',
        data: {
          labels: languages.map(l => l.languageName),
          datasets: [{
            data: languages.map(l => l.visitors),
            backgroundColor: ['#ff1493', '#ff69b4', '#ffb6d9', '#c71585', '#db2777', '#ec4899'],
            borderWidth: 0,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'right', labels: { color: '#e5e5e5' } } }
        }
      });
    }
    
    const trafficCtx = trafficCanvas.getContext('2d');
    if (trafficCtx) {
      const traffic = $geoAnalyticsStore.traffic;
      trafficChart = new Chart(trafficCtx, {
        type: 'line',
        data: {
          labels: traffic.map(t => {
            const date = new Date(t.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }),
          datasets: [
            {
              label: 'Visitors',
              data: traffic.map(t => t.visitors),
              borderColor: '#ff1493',
              backgroundColor: 'rgba(255, 20, 147, 0.1)',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Page Views',
              data: traffic.map(t => t.pageViews),
              borderColor: '#3b82f6',
              backgroundColor: 'transparent',
              fill: false,
              tension: 0.4,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#e5e5e5' } } },
          scales: {
            x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#6b6b6b' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#6b6b6b' } }
          }
        }
      });
    }
  }
  
  function updateCharts() {
    if (countryChart) {
      const topCountries = $geoAnalyticsStore.countries.slice(0, 8);
      countryChart.data.labels = topCountries.map(c => c.country);
      countryChart.data.datasets[0].data = topCountries.map(c => c.visitors);
      countryChart.update();
    }
    if (languageChart) {
      const languages = $geoAnalyticsStore.languages.slice(0, 6);
      languageChart.data.labels = languages.map(l => l.languageName);
      languageChart.data.datasets[0].data = languages.map(l => l.visitors);
      languageChart.update();
    }
    if (trafficChart) {
      const traffic = $geoAnalyticsStore.traffic;
      trafficChart.data.labels = traffic.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      trafficChart.data.datasets[0].data = traffic.map(t => t.visitors);
      trafficChart.data.datasets[1].data = traffic.map(t => t.pageViews);
      trafficChart.update();
    }
  }
  
  function handleTimeRangeChange(range: TimeRange) {
    timeRangeStore.set(range);
    loadingStore.update(l => ({ ...l, analytics: true }));
    fetchGeoAnalytics(range).then(() => {
      updateCharts();
      loadingStore.update(l => ({ ...l, analytics: false }));
    });
  }
  
  function handleTimeRangeSelect(e: Event) {
    const target = e.target as HTMLSelectElement;
    handleTimeRangeChange(target.value as TimeRange);
  }
  
  function exportData() {
    const csv = [
      ['Country', 'Visitors', 'Percentage', 'Change'].join(','),
      ...$geoAnalyticsStore.countries.map(c => 
        [c.countryName, c.visitors, c.percentage + '%', c.change + '%'].join(',')
      )
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geo_analytics_${$timeRangeStore}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  onMount(() => {
    loadingStore.update(l => ({ ...l, analytics: true }));
    fetchGeoAnalytics($timeRangeStore).then(() => {
      initCharts();
      loadingStore.update(l => ({ ...l, analytics: false }));
    });
  });
  
  onDestroy(() => {
    countryChart?.destroy();
    languageChart?.destroy();
    trafficChart?.destroy();
  });
</script>

<div class="space-y-6">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h2 class="text-2xl font-semibold text-white">Geographic Analytics</h2>
      <p class="text-gray-medium mt-1">Understand your global audience distribution</p>
    </div>
    <div class="flex items-center gap-3">
      <select 
        value={$timeRangeStore}
        on:change={handleTimeRangeSelect}
        class="bg-black-soft border border-gray-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-bright"
      >
        {#each timeRanges as range}
          <option value={range.value}>{range.label}</option>
        {/each}
      </select>
      <button 
        on:click={exportData}
        class="flex items-center gap-2 px-4 py-2 bg-black-soft border border-gray-dark rounded-lg text-white hover:border-pink-bright transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        Export CSV
      </button>
    </div>
  </div>
  
  {#if $loadingStore.analytics}
    <div class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-bright"></div>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <p class="text-sm text-gray-medium mb-1">Total Visitors</p>
        <p class="text-3xl font-bold text-white">{formatNumber($geoAnalyticsStore.totalVisitors)}</p>
      </div>
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <p class="text-sm text-gray-medium mb-1">Page Views</p>
        <p class="text-3xl font-bold text-white">{formatNumber($geoAnalyticsStore.totalPageViews)}</p>
      </div>
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <p class="text-sm text-gray-medium mb-1">Avg Session</p>
        <p class="text-3xl font-bold text-white">{formatDuration($geoAnalyticsStore.avgSessionDuration)}</p>
      </div>
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <p class="text-sm text-gray-medium mb-1">Bounce Rate</p>
        <p class="text-3xl font-bold text-white">{$geoAnalyticsStore.bounceRate}%</p>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <h3 class="text-lg font-semibold text-white mb-4">Visitors by Country</h3>
        <div class="h-80">
          <canvas bind:this={countryCanvas}></canvas>
        </div>
      </div>
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <h3 class="text-lg font-semibold text-white mb-4">Language Distribution</h3>
        <div class="h-80">
          <canvas bind:this={languageCanvas}></canvas>
        </div>
      </div>
    </div>
    
    <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
      <h3 class="text-lg font-semibold text-white mb-4">Traffic Trend</h3>
      <div class="h-80">
        <canvas bind:this={trafficCanvas}></canvas>
      </div>
    </div>
    
    <div class="bg-black-soft rounded-xl border border-gray-dark/50 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-dark/50">
        <h3 class="text-lg font-semibold text-white">Detailed Country Breakdown</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-black/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase">Country</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-medium uppercase">Visitors</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-medium uppercase">Percentage</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-medium uppercase">Change</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-dark/30">
            {#each $geoAnalyticsStore.countries as country}
              <tr class="hover:bg-black/30 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span class="text-2xl mr-3">{countryFlags[country.country] || '🌍'}</span>
                    <span class="text-white font-medium">{country.countryName}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-white">{formatNumber(country.visitors)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-2">
                    <div class="w-24 h-2 bg-gray-dark rounded-full overflow-hidden">
                      <div class="h-full bg-pink-bright rounded-full" style="width: {country.percentage}%"></div>
                    </div>
                    <span class="text-gray-medium text-sm">{country.percentage}%</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class={getChangeBadgeClass(country.change)}>
                    {country.change >= 0 ? '+' : ''}{country.change}%
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
