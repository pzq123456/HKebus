<template>
  <ControlPanel
    :updateFn="fetchData"
    :loopLength="84928"
    :timeConvertFn="updateTime"
  />
</template>

<script setup>
import ControlPanel from '@/components/TimeControl.vue';

// 时间转换函数示例
const timeConverter = (timestamp) => {
  return new Date(timestamp * 1000); // 根据实际情况调整
};

// 数据生成函数示例
const fetchData = async (timestamp) => {
  // 指数函数
  return Math.exp(timestamp / 10000) + 100;
};

// 时间转换函数（需根据实际情况实现）
function time_convert_reverse(x, min=1726617600) {
  return new Date((x + min) * 1000);
}

// time_convert_reverse(currentTime).toUTCString().split(' ')[4]

function updateTime(currentTime) {
  return time_convert_reverse(currentTime).toUTCString().split(' ')[4];
}

</script>