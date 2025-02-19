let index = [];
let trajectory = [];

// 查找与给定时间戳有交集的活跃行数据
function findActiveRowsAtTimestamp(timestamp) {
  return index.filter(row => row.s_time < timestamp && row.e_time > timestamp);
}

// 生成轨迹数据的函数
function generateTrajectoryData(activeRows) {
  const result = [];

  activeRows.forEach(row => {
    const trackIndex = row.old_index; // 找到对应的轨迹索引
    const deltaTime = row.delta_time; // 获取偏移时间

    // 获取对应轨迹
    const track = trajectory[trackIndex];

    if (track) {
      // 对时间戳进行偏移操作
      const updatedTimestamps = track.timestamps.map(timestamp => timestamp + deltaTime);
      
      // 生成更新后的轨迹数据
      result.push({
        vendor: track.vendor,
        path: track.path,
        timestamps: updatedTimestamps
      });
    }
  });

  return result;
}

// 监听主线程消息并处理请求
onmessage = function(e) {
  const { type, timestamp, data } = e.data;

  // 接收外部传入的 index 和 trajectory 数据
  if (type === 'INITIALIZE_DATA') {
    // console.log('INITIALIZE_DATA', data);
    index = data.index;
    trajectory = data.trajectory;
    postMessage({ type: 'INITIALIZED' });
    return;
  }

  if (type === 'GET_ACTIVE_ROWS') {
    const activeData = findActiveRowsAtTimestamp(timestamp);
    postMessage({ type: 'ACTIVE_ROWS', data: activeData });
  } else if (type === 'GENERATE_TRAJECTORY') {
    const activeRows = findActiveRowsAtTimestamp(timestamp);
    const trajectoryData = generateTrajectoryData(activeRows);
    postMessage({ type: 'TRAJECTORY_DATA', data: trajectoryData });
  }
};


// // 改写这个worker使之在创建时接受从外界传入的index和trajectory数据，而不是自己加载他们。


// import { data } from '@/loaders/trips.data.js';

// const { index, trajectory } = data;

// // 查找与给定时间戳有交集的活跃行数据
// function findActiveRowsAtTimestamp(timestamp) {
//   return index.filter(row => row.s_time < timestamp && row.e_time > timestamp);
// }

// // 生成轨迹数据的函数
// function generateTrajectoryData(activeRows) {
//   const result = [];

//   activeRows.forEach(row => {
//     const trackIndex = row.old_index; // 找到对应的轨迹索引
//     const deltaTime = row.delta_time; // 获取偏移时间

//     // 获取对应轨迹
//     const track = trajectory[trackIndex];

//     if (track) {
//       // 对时间戳进行偏移操作
//       const updatedTimestamps = track.timestamps.map(timestamp => timestamp + deltaTime);
      
//       // 生成更新后的轨迹数据
//       result.push({
//         vendor: track.vendor,
//         path: track.path,
//         timestamps: updatedTimestamps
//       });
//     }
//   });

//   return result;
// }


// // 监听主线程消息并处理请求
// onmessage = function(e) {
//   const { type, timestamp } = e.data;

//   if (type === 'GET_ACTIVE_ROWS') {
//     const activeData = findActiveRowsAtTimestamp(timestamp);
//     postMessage({ type: 'ACTIVE_ROWS', data: activeData });
//   } else if (type === 'GENERATE_TRAJECTORY') {
//     const activeRows = findActiveRowsAtTimestamp(timestamp);
//     const trajectory = generateTrajectoryData(activeRows);
//     postMessage({ type: 'TRAJECTORY_DATA', data: trajectory });
//   }
// };