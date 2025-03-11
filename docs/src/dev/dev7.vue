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
import { ColumnLayer } from '@deck.gl/layers'; // 使用 ColumnLayer

import pkg from 'lodash';
const { throttle } = pkg;

import { data } from '@/loaders/cs_gdf.data.js';

// Deck.gl 实例
let deckMap = null;
const tooltip = ref(null);

// 颜色常量
const BLUE = [23, 184, 190, 200]; // 添加透明度
const GRAY = [128, 128, 128, 200]; // 添加透明度

// 地图初始化
async function handleMapLoaded(map) {
  deckMap = useDeckOverlay(map);
  const columnLayer = createColumnLayer(data);
  deckMap.setProps({
    layers: [columnLayer],
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
        backgroundColor: '#fff',
        color: '#000',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      },
    },
  });
}

// 创建 ColumnLayer
function createColumnLayer(data) {
  return new ColumnLayer({
    id: 'column-layer',
    data,
    getPosition: d => [d.lon, d.lat], // 获取经纬度
    getElevation: d => d.total * 10, // 根据 total 设置柱子高度
    getFillColor: d => d.built ? BLUE : GRAY, // 根据 built 设置颜色
    radius: 50, // 柱子底部半径
    extruded: true, // 启用 3D 效果
    pickable: true, // 允许拾取
    elevationScale: 1, // 高度缩放比例
    coverage: 1, // 柱子覆盖范围
    updateTriggers: {
      getFillColor: [BLUE, GRAY],
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