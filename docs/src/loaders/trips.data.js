import fs from 'node:fs';
import { parse } from 'csv-parse/sync';

const indexURL = './data/index.csv';
const trajectoryURL = './data/trajectory.json';

export default {
    watch: [indexURL, trajectoryURL],
    load() {
        const index = parse(fs.readFileSync(indexURL, 'utf8'), {
            columns: true,  // 保证第一行是列名
            cast: (value, context) => {
                // 这里是转换逻辑
                if (!isNaN(value)) {  // 如果值是数字
                    return parseInt(value, 10);  // 转换为整数
                }
                return value;  // 否则返回原值
            }
        });

        const trajectory = JSON.parse(fs.readFileSync(trajectoryURL, 'utf8'));

        return { index, trajectory };
    },
};

