<template>
    <MapComponent
        :center="[114.173355, 22.320048]"
        :zoom="11"
        width="100%"
        height="80vh"
        @map-loaded="handleMapLoaded"
    />

    {{ currentTime }}
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import MapComponent from '@/components/map.vue';
import { useDeckOverlay } from '@/composables/useDeckOverlay.js';
import { TripsLayer } from '@deck.gl/geo-layers';
import MyWorker from '@/workers/worker.js?worker';

const worker = new MyWorker();

let deckMap = null;

// 颜色常量
const BLUE = [23, 184, 190];
const RED = [253, 128, 93];

const currentTime = ref(0);
let animationFrameId = null;

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
        id: 'trips',
        data,
        getPath: d => d.path,
        getTimestamps: d => d.timestamps,
        getColor: d => (d.vendor === 0 ? RED : BLUE),
        opacity: 0.5,
        widthMinPixels: 3,
        rounded: true,
        trailLength: 80,
        currentTime: currentTimeValue,
        onViewStateChange: ({ viewState }) => {
            deckgl.setProps({ viewState });
        },
    });
}

// 地图初始化
async function handleMapLoaded(map) {
    deckMap = useDeckOverlay(map);

    const timestamp = 0;

    const data = await generateTrajectoryDataForRows(timestamp);
    const tripsLayer = await createTripsLayer(data, currentTime.value);

    deckMap.setProps({
        layers: [tripsLayer],
    });

    startAnimation();
}

// 动画函数
function startAnimation() {
    async function animate(){
        currentTime.value += 1;
        if (currentTime.value > 84928) {
            currentTime.value = 0;
        }

        const data = await generateTrajectoryDataForRows(currentTime.value);
        const tripsLayer = await createTripsLayer(data, currentTime.value);

        deckMap.setProps({
            layers: [tripsLayer],
        });

        animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
}

onUnmounted(() => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});


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