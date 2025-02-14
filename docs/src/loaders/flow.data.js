import fs from 'node:fs';
// import {csv} from 'd3-fetch';
// import {getClusterLevelsH3} from './h3-clustering';

import { parse } from 'csv-parse/sync'

const flowURL = './data/flow.csv';
const stationsURL = './data/stations.csv';

let cachedData;

export default {
    watch: [flowURL, stationsURL],
    load() {
        if (!cachedData) {
            const flow = fs.readFileSync(flowURL, 'utf8');
            const stations = fs.readFileSync(stationsURL, 'utf8');
            const flowData = parse(flow, {columns: true});
            const stationsData = parse(stations, {columns: true});
            cachedData = {
                locations: stationsData.map((d) => ({
                    id: d.id,
                    name: d.name,
                    lat: Number(d.lat),
                    lon: Number(d.lon),
                })),
                flows: flowData.map((d) => ({
                    origin: d.origin,
                    dest: d.dest,
                    count: Number(d.count),
                })),
            };
        }
        return {
            ...cachedData,
            clusterLevels: getClusterLevelsH3(cachedData.locations),
        }
    },
};


// async function fetchData(clusterMethod = 'HCA') {
//   if (!cachedData) {
//     cachedData = await Promise.all([
//       csv(stationsURL, (row, i) => ({
//         id: row.id,
//         name: row.name,
//         lat: Number(row.lat),
//         lon: Number(row.lon),
//       })),
//       csv(flowURL, (row) => ({
//         origin: row.origin,
//         dest: row.dest,
//         count: Number(row.count),
//       })),
//     ]).then(([locations, flows]) => ({locations, flows}));
//   }
//   return {
//     ...cachedData,
//     ...(clusterMethod === 'H3'
//       ? {clusterLevels: getClusterLevelsH3(cachedData.locations)}
//       : null),
//   };
// }


/*
 * Copyright (c) Flowmap.gl contributors
 * Copyright (c) 2018-2020 Teralytics
 * SPDX-License-Identifier: Apache-2.0
 */

import {latLngToCell, cellToLatLng} from 'h3-js';

export function getClusterLevelsH3(locations, minZoom = 1, maxZoom = 20) {
  let nodes = locations.map((d) => ({
    id: d.id,
    zoom: maxZoom,
    lat: +d.lat,
    lon: +d.lon,
  }));

  const result = [];
  let rawZoom = null;
  for (let zoom = maxZoom - 1; zoom >= minZoom; zoom--) {
    const h3Zoom = zoom - 4;
    const nodesByH3 = nodes.reduce((acc, d) => {
      const h3Id = latLngToCell(+d.lat, +d.lon, h3Zoom);
      if (!acc[h3Id]) {
        acc[h3Id] = [];
      }
      acc[h3Id].push(d);
      return acc;
    }, {});

    const keys = Object.keys(nodesByH3);
    if (keys.length < locations.length) {
      if (rawZoom === null) {
        rawZoom = zoom + 1;
      }
      nodes = keys.map((id) => {
        if (nodesByH3[id].length === 1) {
          const node = nodesByH3[id][0];
          return {
            id: `{[${node.id}:${zoom}]}`,
            zoom,
            lat: node.lat,
            lon: node.lon,
            children: [node.id],
          };
        }
        return {
          id: `{[${id}:${zoom}]}`,
          zoom,
          lat: cellToLatLng(id, true)[0],
          lon: cellToLatLng(id, true)[1],
          children: nodesByH3[id].map((d) => d.id),
        };
      });

      result.unshift({
        zoom,
        nodes,
      });
    }

    if (keys.length <= 1) {
      break;
    }
  }

  result.push({
    zoom: rawZoom ?? maxZoom,
    nodes: locations,
  });

  return result;
}
