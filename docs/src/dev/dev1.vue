<template>
    <div id="map-gui" ref="map_gui"
    ></div>
    <MapComponent
        :center="[114.173355, 22.320048]"
        :zoom="11"
        width="100%"
        height="80vh"
        @map-loaded="handleMapLoaded"
    />
</template>

<script setup>
import { ref, onMounted} from 'vue';

import MapComponent from '@/components/map.vue';
import { useDeckOverlay } from '@/composables/useDeckOverlay.js';

import {FlowmapLayer} from '@flowmap.gl/layers';
import {GUI} from 'lil-gui';

import { data } from '@/loaders/flow.data.js';
import {initLilGui, UI_INITIAL} from '@/composables/ui-config.js';

const config = {...UI_INITIAL};

const map_gui = ref(null);

onMounted(() => {
    const gui = new GUI({container: map_gui.value});
    initLilGui(gui);
});

let deckMap = null; 

const flowLayer = 
    new FlowmapLayer({
            id: 'my-flowmap-layer',
            data,
            pickable: true,
            opacity: config.opacity,
            darkMode: config.darkMode,
            colorScheme: config.colorScheme,
            fadeAmount: config.fadeAmount,
            fadeEnabled: config.fadeEnabled,
            fadeOpacityEnabled: config.fadeOpacityEnabled,
            locationsEnabled: config.locationsEnabled,
            locationTotalsEnabled: config.locationTotalsEnabled,
            animationEnabled: config.animationEnabled,
            clusteringEnabled: config.clusteringEnabled,
            clusteringAuto: config.clusteringAuto,
            clusteringLevel: config.clusteringLevel,
            adaptiveScalesEnabled: config.adaptiveScalesEnabled,
            highlightColor: config.highlightColor,
            getLocationId: (loc) => loc.id,
            getLocationLat: (loc) => loc.lat,
            getLocationLon: (loc) => loc.lon,
            getFlowOriginId: (flow) => flow.origin,
            getFlowDestId: (flow) => flow.dest,
            getFlowMagnitude: (flow) => flow.count,
            getLocationName: (loc) => loc.name,
            });

const handleMapLoaded = (map) => {
    // console.log('Map loaded:', map);
    // 你可以在这里使用 map 对象
    deckMap = useDeckOverlay(map); // 创建一个 DeckMap 实例

    deckMap.setProps({
        layers: [flowLayer]
    });
};

function onUpdated() {
    deckMap.setProps({
        layers: [flowLayer]
    });
}
</script>

<style scoped>
#map-gui {
    /* 悬浮在地图上方 */
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
}
</style>