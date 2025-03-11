<template>
  <MapComponent
      :center="[114.173355, 22.320048]"
      :zoom="11"
      width="100%"
      height="80vh"
      @map-loaded="handleMapLoaded"
  />
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import MapComponent from '@/components/map.vue';
import { useDeckOverlay } from '@/composables/useDeckOverlay.js';
import { ScatterplotLayer } from '@deck.gl/layers';

import pkg from 'lodash';
const { throttle } = pkg;

import { data } from '@/loaders/cs_gdf.data.js';

console.log(data);

// Deck.gl 实例
let deckMap = null;
const tooltip = ref(null);

// 颜色常量
const BLUE = [23, 184, 190];
const GRAY = [128, 128, 128];

// 地图初始化
async function handleMapLoaded(map) {
  deckMap = useDeckOverlay(map);
  const scatterplotLayer = createScatterplotLayer(data);
  deckMap.setProps({
    layers: [scatterplotLayer],
    getTooltip: ({ object }) => object && {
      html: `
        <div>
          <strong>Node ID:</strong> ${object.node_id}<br/>
          <strong>Lon:</strong> ${object.lon}<br/>
          <strong>Lat:</strong> ${object.lat}<br/>
          <strong>Built:</strong> ${object.built}<br/>
          <strong>Fast:</strong> ${object.fast}<br/>
          <strong>Slow:</strong> ${object.slow}<br/>
          <strong>Total:</strong> ${object.total}
        </div>
      `,
      style: {
        backgroundColor: 'var(--vp-c-bg-soft)',
        color: 'var(--vp-c-text-1)',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      },
    },
  });
}

// 创建 ScatterplotLayer
function createScatterplotLayer(data) {
  return new ScatterplotLayer({
    id: 'scatterplot-layer',
    data,
    getPosition: d => [d.lon, d.lat],
    getRadius: d => Math.sqrt(d.total) * 30, // 根据 total 设置点的大小
    getFillColor: d => d.built ? BLUE : GRAY, // 根据 built 设置颜色
    getLineColor: d => d.built ? BLUE : GRAY,
    getLineWidth: d => d.built ? 1 : 2, // 设置线宽
    lineWidthUnits: 'pixels',
    pickable: true, // 允许拾取
    radiusMinPixels: 3, // 最小半径
    radiusMaxPixels: 30, // 最大半径
    stroked: true, // 使用描边
    filled: true, // 填充颜色
    updateTriggers: {
      getFillColor: [BLUE, GRAY],
      getLineColor: [BLUE, GRAY],
    },
  });
}

onUnmounted(() => {
  if (deckMap) {
    deckMap.finalize();
  }
});
</script>

<style scoped>
/* 可以在这里添加一些样式 */
</style>