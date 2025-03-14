<template>
  <div id="control-panel">
      <div id="toolbar">
          <div id="barchart-container" v-if="showVloume">
              <div id="barchart">
                  <div id="curr" :style="{ left: curr + '%' }"></div>
              </div>
          </div>
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
          <div id="current-time" class="time-container">
              <span class="info">
                  Current Time:
              </span>
              <span class="time">
                  {{ timeConvertFn(currentTime) }}
              </span>
          </div>
          <button class="btn" id="play-btn" @click="togglePlay">
              {{ isPlaying ? 'Pause' : 'Play' }}
          </button>
          <button
              v-for="speed in [1, 5, 10, 100]"
              :key="speed"
              class="btn"
              :class="{ active: step === speed }"
              @click="step = speed"
          >
              {{ speed }}x
          </button>
      </div>

      <!-- slot for legend -->
      <div class="legend" id="legend">
          <slot></slot>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import * as d3 from 'd3';
import { throttle } from 'lodash';

let animationId = null;

const props = defineProps({
  loopLength: {
    type: Number,
    default: 84928
  },
  updateFn: {
    type: Function,
    default: (timestamp) => 0
  },
  timeConvertFn: {
    type: Function,
    default: (currentTime) => "00:00:00"
  },
  showVloume: {
    type: Boolean,
    default: false
  }
});

const { updateFn, loopLength, timeConvertFn, showVloume } = props;

const currentTime = ref(0);
const isPlaying = ref(false);
const step = ref(1);
const currAmount = ref(0);
const chartData = new Map();

chartData.set(0, 0);
chartData.set(84928, 0);

const curr = computed(() => {
  return (currentTime.value / loopLength) * 100;
});

const BLUE = [23, 184, 190];
const RED = [253, 128, 93];

async function updateTime(newTime) {
  currAmount.value = await generateTrajectoryDataForRows(newTime);
  if (!chartData.has(newTime)) {
      chartData.set(newTime, currAmount.value);
  }

  if (showVloume) {
      drawLineChart();
  }
}

function animate() {
  if (!isPlaying.value) return;
  currentTime.value = (currentTime.value + step.value) % loopLength;
  updateTime(currentTime.value);
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

function onUpdated(e) {
  const newTime = parseFloat(e.target.value);
  currentTime.value = newTime;
  throttle(updateTime, 2000)(newTime);
}

onUnmounted(() => {
  cancelAnimationFrame(animationId);
});

async function generateTrajectoryDataForRows(timestamp) {
  return updateFn(timestamp);
}

function drawLineChart() {
  const container = d3.select("#barchart");
  if (container.empty()) return; // 如果容器不存在，直接返回

  container.select("svg").remove();

  const chartDataArray = Array.from(chartData, ([time, value]) => ({ time, value }));
  chartDataArray.sort((a, b) => a.time - b.time);

  const width = container.node().offsetWidth;
  const height = container.node().offsetHeight;

  const svg = container.append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "none");

  const xScale = d3.scaleTime()
      .domain(d3.extent(chartDataArray, d => d.time))
      .range([0, width]);

  const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartDataArray, d => d.value)])
      .range([height, 0]);

  const line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.value));

  svg.append("path")
      .datum(chartDataArray)
      .attr("fill", "none")
      .attr("stroke", "var(--vp-c-green-3)")
      .attr("fill", "var(--vp-c-green-soft)")
      .attr("stroke-width", 1.5)
      .attr("d", line);
}

onMounted(() => {
  if (showVloume) {
      drawLineChart();
  }
});

// 监听 showVloume 的变化
watch(showVloume, (newVal) => {
  if (newVal) {
      drawLineChart();
  }
});
</script>



<style scoped>

.time{
  font-weight: bold;
  color: var(--vp-c-brand-1);
}

.info{
  font-weight: bold;
  color: var(--vp-c-text-1);
  margin-left: 10px;
}

/* 新增容器布局样式 */
#barchart-container {
  position: relative;
  width: calc(100% - 20px);
  height: 50px;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
}

#barchart {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
}

#curr {
  position: absolute;
  width: 2px;
  height: 100%;
  background-color: rgba(255, 0, 0, 0.8);
  top: 0;
  transform: translateX(-50%);
  z-index: 20;
  pointer-events: none;
}

#barchart svg {
  z-index: 10;
}

#time-slider {
  width: calc(100% - 10px); /* Adjust width to align with barchart */
  margin-left: 5px;
}

#control-panel {
  margin: 10px auto;
  z-index: 1;
  border: 1px solid var(--vp-c-border); /* 使用边框变量 */
  border-radius: 5px;
  box-shadow: var(--vp-shadow-1); /* 使用阴影变量 */
  backdrop-filter: blur(18px); /* 添加背景模糊效果 */
  width: 30%;
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

.btn{
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  width: 70px;
  margin: 5px;
  padding: 5px;
}

.btn:hover{
  background-color: var(--vp-c-green-soft);
}

.active {
  background-color: var(--vp-c-green-soft);
  border: 1px solid var(--vp-c-text-1);
}

.legend{
  margin-top: 10px;
  padding: 10px;
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  background-color: var(--vp-c-bg-soft);
  font-family: Arial, sans-serif;
  font-size: 14px;
  z-index: 1;
}

</style>