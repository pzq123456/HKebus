<template>
    <MapComponent
        :center="[114.173355, 22.320048]"
        :zoom="11"
        width="100%"
        height="80vh"
        @map-loaded="handleMapLoaded"
    />

    <div id="control-panel">
        <div id="toolbar">
            <input
                id="time-slider"
                type="range"
                min="0"
                max="84928"
                step="1"
                v-model.number="currentTime"
                @input="onUpdated"
                ref="slider"
            />
            <div id="current-time">
                Current Time: {{ currentTime + time_convert_reverse(currentTime).toUTCString() }}
            </div>
            <button id="play-btn" @click="togglePlay">
                {{ isPlaying ? 'Pause' : 'Play' }}
            </button>
        </div>
        <div class="legend" id="legend">
            <div class="legend-item">
                <div class="legend-color" style="background-color: rgb(253, 128, 93);"></div>
                <span>GMB</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: rgb(23, 184, 190);"></div>
                <span>Non-GMB</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onUnmounted, watch } from 'vue';
import MapComponent from '@/components/map.vue';
import { useDeckOverlay } from '@/composables/useDeckOverlay.js';
import { TripsLayer } from '@deck.gl/geo-layers';
import MyWorker from '@/workers/worker?worker';

import pkg from 'lodash';
const { throttle } = pkg;

const worker = new MyWorker();

// 响应式状态
const currentTime = ref(0);
const isPlaying = ref(false);
let animationId = null;
const step = 1;
const loopLength = 84928;

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
async function createTripsLayer(data, currentTimeValue) {
    return new TripsLayer({
        id: getUUID(),
        data,
        getPath: d => d.path,
        getTimestamps: d => d.timestamps,
        getColor: d => (d.vendor === 0 ? RED : BLUE),
        opacity: 1,
        widthMinPixels: 3,
        // rounded: true,
        trailLength: 80,
        currentTime: currentTimeValue,
        onViewStateChange: ({ viewState }) => {
            deckgl.setProps({ viewState });
        },
    });
}

// 时间更新逻辑
async function updateTime(newTime) {
    data = await generateTrajectoryDataForRows(newTime);

    const newLayer = await createTripsLayer(data, currentTime.value);

    deckMap.setProps({
        layers: [newLayer],
    });
}

// 动画控制
function animate() {
    if (!isPlaying.value) return;

    currentTime.value = (currentTime.value + step) % loopLength;

    throttle(updateTime, 1000)(currentTime.value);

    animationId = requestAnimationFrame(animate);
}

function togglePlay() {
    isPlaying.value = !isPlaying.value;
    if (isPlaying.value) {
        animate();
    } else {
        cancelAnimationFrame(animationId);
    }
}

// 地图初始化
async function handleMapLoaded(map) {
    deckMap = useDeckOverlay(map);
    // updateTime(0);
    data = await generateTrajectoryDataForRows(0);
    const tripsLayer = createTripsLayer(data, currentTime.value);

    deckMap.setProps({
        layers: [tripsLayer],
    });
}

// watch(currentTime, (newTime) => {
//     updateTime(newTime);
// });

// 输入事件处理
function onUpdated(e) {
    const newTime = parseFloat(e.target.value);
    currentTime.value = newTime;
    updateTime(newTime);
}

// 清理逻辑
onUnmounted(() => {
    worker.terminate();
    cancelAnimationFrame(animationId);
});

// 时间转换函数（需根据实际情况实现）
function time_convert_reverse(x, min=1726617600) {
    return new Date((x + min) * 1000);
}

function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
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
  width: 50%;
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