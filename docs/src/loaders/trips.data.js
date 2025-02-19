import fs from 'node:fs';
// import {csv} from 'd3-fetch';
// import {getClusterLevelsH3} from './h3-clustering';

import { parse } from 'csv-parse/sync'

const indexURL = './data/index.csv';
const trajectoryURL = './data/trajectory.json';

export default {
    watch: [indexURL, trajectoryURL],
    load() {
        const index = parse(fs.readFileSync(indexURL, 'utf8'), {
            columns: true
        });

        const trajectory = JSON.parse(fs.readFileSync(trajectoryURL, 'utf8'));

        return {index, trajectory};
    },
};


// // worker.js
// let data = []; // 用来存储解析后的 CSV 数据
// let trajectoryData = []; // 用来存储解析后的轨迹数据

// // 加载 CSV 数据的函数
// function loadCSVData() {
//   return new Promise((resolve, reject) => {
//     Papa.parse('../data/index.csv', {
//       download: true,
//       header: true,
//       dynamicTyping: true,
//       complete: function(results) {
//         data = results.data;
//         resolve();
//       },
//       error: function(error) {
//         reject(error);
//       }
//     });
//   });
// }

// // 加载轨迹数据的函数
// function loadTrajectoryData() {
//   return fetch('../data/trajectory.json')
//     .then(response => response.json())
//     .then(json => {
//       trajectoryData = json;
//     });
// }


