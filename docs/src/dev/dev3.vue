<template>
    <div id="control-panel">
        <div id="toolbar">
            <div id="barchart">
                <div id="curr" :style="{ left: curr + '%' }"></div>
            </div>
            {{ currAmount }} trajectories
            {{ currentTime }} / 84928
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
                Current Time: {{ time_convert_reverse(currentTime).toUTCString() }}
            </div>
            <button id="play-btn" @click="togglePlay">
                {{ isPlaying ? 'Pause' : 'Play' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import * as d3 from 'd3';
import { throttle } from 'lodash';

// 响应式状态
const currentTime = ref(0);
const isPlaying = ref(false);
let animationId = null;
const step = 1;
const loopLength = 84928;

const currAmount = ref(0); // 当前绘制的轨迹数量
const chartData = ref([]); // 图表数据

// 计算当前 curr 的位置
const curr = computed(() => {
    return (currentTime.value / loopLength) * 100;
});

// 颜色常量
const BLUE = [23, 184, 190];
const RED = [253, 128, 93];

// 时间更新逻辑
async function updateTime(newTime) {
    currAmount.value = await generateTrajectoryDataForRows(newTime);
    chartData.value.push({ time: newTime, value: currAmount.value });
    drawLineChart();
}

// 动画控制
function animate() {
    if (!isPlaying.value) return;
    currentTime.value = (currentTime.value + step) % loopLength;
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

// 输入事件处理
function onUpdated(e) {
    const newTime = parseFloat(e.target.value);
    currentTime.value = newTime;
    throttle(updateTime, 2000)(newTime);
}

// 清理逻辑
onUnmounted(() => {
    cancelAnimationFrame(animationId);
});

// 时间转换函数（需根据实际情况实现）
function time_convert_reverse(x, min=1726617600) {
    return new Date((x + min) * 1000);
}

// 使用异步函数改写
async function generateTrajectoryDataForRows(timestamp) {
    // 每个时间步的值都是唯一的
    const timeMap = new Map(); // timestamp : 0-84928 - unique random number

    if(timeMap.has(timestamp)) {
        return timeMap.get(timestamp);
    }else{
        // const rendomNumber = Math.floor(Math.random() * 84928);
        // 使用正弦函数包装
        const rendomNumber = Math.floor(84928 * (Math.sin(timestamp) + 1) / 2);
        timeMap.set(timestamp, rendomNumber);
        return rendomNumber;
    }

}

// 绘制折线图
function drawLineChart() {
    // Clear the existing svg before drawing a new one
    d3.select("#barchart").select("svg").remove();

    // Implement the logic to draw the line chart using d3.js
    const svg = d3.select("#barchart").append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    const xScale = d3.scaleTime()
        .domain(d3.extent(chartData.value, d => d.time))
        .range([0, svg.node().getBoundingClientRect().width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(chartData.value, d => d.value)])
        .range([svg.node().getBoundingClientRect().height, 0]);

    const line = d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.value));

    svg.append("path")
        .datum(chartData.value)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);
}

// 监听 currentTime 的变化
watch(currentTime, (newTime) => {
    updateTime(newTime);
});

// 初始化图表
onMounted(() => {
    drawLineChart();
});
</script>



<style scoped>

#barchart {
    width: calc(100% - 25px); /* Adjust width to align with slider */
    height: 100px;
    background-color: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-border);
    border-radius: 5px;
    margin: 10px; /* Add margin to align with slider */
}

#barchart svg {
    z-index: 1;
}

#curr {
    width: 3px;
    height: 100%;
    background-color: rgba(255, 0, 0, 0.555);
    left: 0;
    position: relative;
    z-index: 1;
}

#time-slider {
    width: calc(100% - 20px); /* Adjust width to align with barchart */
    margin: 10px; 
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