// 用于管理图层的 deck.gl 对象
import {MapboxOverlay} from '@deck.gl/mapbox';
import { onMounted, onUnmounted } from 'vue';

export function useDeckOverlay(map) {
    const DeckOverlay = new MapboxOverlay({
        interleaved: true, 
        layers: [], // layers
    });

    if(map) {
        map.addControl(DeckOverlay);
    }
    // onMounted(() => {

    // });

    // onUnmounted(() => {
    //     DeckOverlay.finalize(); // 清理资源
    // });
    
    return DeckOverlay;
}