<template>
    <div id="control-panel">
        <div id="toolbar">
            <div id="barchart-container">
                <div id="barchart">
                    <div id="curr" :style="{ left: curr + '%' }"></div>
                </div>
            </div>
            <!-- {{ currAmount }} trajectories
            {{ currentTime }} / 84928 -->
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
                    Current Time: Wed, 18 Sep 2024
                </span>
                <span class="time">
                    {{ time_convert_reverse(currentTime).toUTCString().split(' ')[4] }}
                </span>
            </div>
            <button class="btn" id="play-btn" @click="togglePlay">
                {{ isPlaying ? 'Pause' : 'Play' }}
            </button>

            <!-- 1x 2x 5x 10x-->
                <button
                    v-for="speed in [1, 2, 5, 10]"
                    :key="speed"
                    class="btn"
                    :class="{ active: step === speed }"
                    @click="step = speed"
                >
                    {{ speed }}x
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
const step = ref(1);
const loopLength = 84928;

const currAmount = ref(0); // 当前绘制的轨迹数量
const chartData = new Map(); // 存储绘制的数据

// init chartData
// 首先压入起点和终点的值都是0
chartData.set(0, 0);
chartData.set(84928, 0);

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
    if(!chartData.has(newTime)){
        chartData.set(newTime, currAmount.value);
    } // 只有在时间戳不存在时才添加

    drawLineChart();
}

// 动画控制
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
    // 只返回当前的 几点几分
    // return new Date((x + min) * 1000).toLocaleTimeString();
}

// 使用异步函数改写
async function generateTrajectoryDataForRows(timestamp) {
    // 每个时间步的值都是唯一的
    const timeMap = new Map(); // timestamp : 0-84928 - unique random number

    if(timeMap.has(timestamp)) {
        return timeMap.get(timestamp);
    }else{
        // const rendomNumber = Math.floor(Math.random() * 84928);
        // 使用正弦函数包装 周期非常长的这正弦函数
        const rendomNumber = Math.floor(84928 * (1 + Math.sin(timestamp / 1000)));
        timeMap.set(timestamp, rendomNumber);
        return rendomNumber;
    }

}

function drawLineChart() {
    const container = d3.select("#barchart");
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
        // 增加线下面积的填充
        .attr("fill", "var(--vp-c-green-soft)")
        .attr("stroke-width", 1.5)
        .attr("d", line);
}


// 初始化图表
onMounted(() => {
    drawLineChart();
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
    width: 100px;
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
</style>