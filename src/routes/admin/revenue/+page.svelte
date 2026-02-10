<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import { revenueStore, timeRangeStore, fetchRevenueData, loadingStore } from '$lib/admin/stores';
  import type { TimeRange } from '$lib/admin/types';
  
  Chart.register(...registerables);
  
  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
  ];
  
  const currencySymbols: Record<string, string> = {
    'USD': '$', 'EUR': '€', 'GBP': '£', 'CAD': 'C$', 'AUD': 'A$',
    'JPY': '¥', 'MXN': 'MX$', 'BRL': 'R$', 'INR': '₹'
  };
  
  let regionChart: Chart | null = null;
  let trendChart: Chart | null = null;
  let regionCanvas: HTMLCanvasElement;
  let trendCanvas: HTMLCanvasElement;
  
  function formatCurrency(amount: number, currency = 'USD'): string {
    const symbol = currencySymbols[currency] || '$';
    return `${symbol}${amount.toFixed(2)}`;
  }
  
  function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
  
  function initCharts() {
    if (!regionCanvas || !trendCanvas) return;
    
    const regionCtx = regionCanvas.getContext('2d');
    if (regionCtx) {
      const regions = $revenueStore.regions.slice(0, 8);
      regionChart = new Chart(regionCtx, {
        type: 'pie',
        data: {
          labels: regions.map(r => r.countryName),
          datasets: [{
            data: regions.map(r => r.revenue),
            backgroundColor: ['#ff1493', '#ff69b4', '#ffb6d9', '#c71585', '#db2777', '#ec4899', '#f472b6', '#fbcfe8'],
            borderWidth: 0,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { color: '#e5e5e5' }
            }
          }
        }
      });
    }
    
    const trendCtx = trendCanvas.getContext('2d');
    if (trendCtx) {
      const daily = $revenueStore.dailyRevenue;
      trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
          labels: daily.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
          datasets: [
            {
              label: 'Revenue',
              data: daily.map(d => d.revenue),
              borderColor: '#ff1493',
              backgroundColor: 'rgba(255, 20, 147, 0.1)',
              fill: true,
              tension: 0.4,
              yAxisID: 'y'
            },
            {
              label: 'Clicks',
              data: daily.map(d => d.clicks),
              borderColor: '#3b82f6',
              backgroundColor: 'transparent',
              fill: false,
              tension: 0.4,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { labels: { color: '#e5e5e5' } } },
          scales: {
            x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#6b6b6b' } },
            y: {
              type: 'linear', display: true, position: 'left',
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: '#6b6b6b', callback: (value) => '$' + value }
            },
            y1: {
              type: 'linear', display: true, position: 'right',
              grid: { drawOnChartArea: false },
              ticks: { color: '#3b82f6' }
            }
          }
        }
      });
    }
  }
  
  function updateCharts() {
    if (regionChart) {
      const regions = $revenueStore.regions.slice(0, 8);
      regionChart.data.labels = regions.map(r => r.countryName);
      regionChart.data.datasets[0].data = regions.map(r => r.revenue);
      regionChart.update();
    }
    if (trendChart) {
      const daily = $revenueStore.dailyRevenue;
      trendChart.data.labels = daily.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      trendChart.data.datasets[0].data = daily.map(d => d.revenue);
      trendChart.data.datasets[1].data = daily.map(d => d.clicks);
      trendChart.update();
    }
  }
  
  function handleTimeRangeChange(range: TimeRange) {
    timeRangeStore.set(range);
    loadingStore.update(l => ({ ...l, revenue: true }));
    fetchRevenueData(range).then(() => {
      updateCharts();
      loadingStore.update(l => ({ ...l, revenue: false }));
    });
  }
  
  function handleTimeRangeSelect(e: Event) {
    const target = e.target as HTMLSelectElement;
    handleTimeRangeChange(target.value as TimeRange);
  }
  
  onMount(() => {
    loadingStore.update(l => ({ ...l, revenue: true }));
    fetchRevenueData($timeRangeStore).then(() => {
      initCharts();
      loadingStore.update(l => ({ ...l, revenue: false }));
    });
  });
  
  onDestroy(() => {
    regionChart?.destroy();
    trendChart?.destroy();
  });
</script>

<div class="space-y-6">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h2 class="text-2xl font-semibold text-white">Revenue Dashboard</h2>
      <p class="text-gray-medium mt-1">Track affiliate earnings across all Amazon regions</p>
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
    </div>
  </div>
  
  {#if $loadingStore.revenue}
    <div class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-bright"></div>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <p class="text-sm text-gray-medium mb-1">Total Revenue</p>
        <p class="text-3xl font-bold text-white">{formatCurrency($revenueStore.totalRevenue)}</p>
      </div>
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <p class="text-sm text-gray-medium mb-1">Total Clicks</p>
        <p class="text-3xl font-bold text-white">{formatNumber($revenueStore.totalClicks)}</p>
      </div>
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <p class="text-sm text-gray-medium mb-1">Conversion Rate</p>
        <p class="text-3xl font-bold text-white">{$revenueStore.conversionRate.toFixed(2)}%</p>
      </div>
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <p class="text-sm text-gray-medium mb-1">Est. Commission</p>
        <p class="text-3xl font-bold text-white">{formatCurrency($revenueStore.avgCommission)}</p>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <h3 class="text-lg font-semibold text-white mb-4">Revenue by Region</h3>
        <div class="h-80">
          <canvas bind:this={regionCanvas}></canvas>
        </div>
      </div>
      <div class="bg-black-soft rounded-xl p-6 border border-gray-dark/50">
        <h3 class="text-lg font-semibold text-white mb-4">Revenue & Clicks Trend</h3>
        <div class="h-80">
          <canvas bind:this={trendCanvas}></canvas>
        </div>
      </div>
    </div>
  {/if}
</div>
