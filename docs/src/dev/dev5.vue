<template>
    <ControlPanel
    :updateFn="updateTime"
    :loopLength="84928"
    :timeConvertFn="updateTimeString"
  />
  <MapComponent
      :center="[114.173355, 22.320048]"
      :zoom="11"
      width="100%"
      height="80vh"
      @map-loaded="handleMapLoaded"
  />
</template>

<script setup>
import ControlPanel from '@/components/TimeControl.vue';

import { onUnmounted} from 'vue';
import MapComponent from '@/components/map.vue';
import { useDeckOverlay } from '@/composables/useDeckOverlay.js';
import { TripsLayer } from '@deck.gl/geo-layers';

import pkg from 'lodash';
const { throttle } = pkg;

import MyWorker from '@/workers/worker.js?worker';
import { data as myData} from '@/loaders/trips.data.js';

const worker = new MyWorker();

worker.postMessage({ type: 'INITIALIZE_DATA', data: myData }); // 初始化数据

// Deck.gl 实例
let deckMap = null;
let data = null;

// 颜色常量
const BLUE = [23, 184, 190];
const RED = [253, 128, 93];

// 使用异步函数改写
async function generateTrajectoryDataForRows(timestamp) {
  worker.postMessage({ type: 'GENERATE_TRAJECTORY', timestamp });
  return new Promise((resolve, reject) => {
      worker.onmessage = function(e) {
          const { type, data, error } = e.data;

          if (type === 'TRAJECTORY_DATA') {
              resolve(data);
          } else {
              reject(error);
          }
      };
  });
}

// 图层创建
function createTripsLayer(data, currentTime) {
  return new TripsLayer({
      id: 'trips',
      data,
      getPath: d => d.path,
      getTimestamps: d => d.timestamps,
      getColor: d => (d.vendor === 0 ? RED : BLUE),
      opacity: 0.5,
      widthMinPixels: 3,
      rounded: true,
      trailLength: 80,
      currentTime,
  });
}

// 时间更新逻辑
async function updateTime(newTime) {
  data = await generateTrajectoryDataForRows(newTime);
  const newLayer = createTripsLayer(data, newTime);

  deckMap.setProps({
      layers: [newLayer],
  });

  return data.length;
}

// 地图初始化
async function handleMapLoaded(map) {
  deckMap = useDeckOverlay(map);
  data = await generateTrajectoryDataForRows(0);
  const tripsLayer = createTripsLayer(data, 0);
  deckMap.setProps({
      layers: [tripsLayer],
  });
}

// 清理逻辑
onUnmounted(() => {
  worker.terminate();
});

// 时间转换函数（需根据实际情况实现）
function time_convert_reverse(x, min=1726617600) {
  return new Date((x + min) * 1000);
}

function updateTimeString(currentTime) {
  return time_convert_reverse(currentTime).toUTCString();
}

</script>


<style scoped>

#time-slider {
  width: 100%;
  margin-top: 10px;
}

#control-panel {
position: absolute;
bottom: 0;
left: 0;
margin: 12px;
padding: 20px;
z-index: 1;
border: 1px solid var(--vp-c-border); /* 使用边框变量 */
border-radius: 5px;
box-shadow: var(--vp-shadow-1); /* 使用阴影变量 */
backdrop-filter: blur(18px); /* 添加背景模糊效果 */
width: 35%;
}

#legend {
  background-color: var(---vp-c-bg-soft);
  padding: 10px;
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  z-index: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  color: var(--vp-c-text-1);
}

.legend-color {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 50%;
}

#play-btn{
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  width: 100px;
  margin: 5px;
  padding: 5px;
}

/* honver */
#play-btn:hover{
  background-color: var(--vp-c-bg-soft);
}
</style>