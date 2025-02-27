---
layout: page
---

<!-- # Trajectory Map of Bus in Hong Kong  -->
<DropDown :options="menu" defaultKey="B"/>

<myApp />

<script setup>
    import myApp from '@/components/trajectorymap.vue'
    import { menu } from './menu.js';
    import DropDown from '@/components/Dropdown.vue';
</script>

<style scoped>
h1 {
    font-size: 1.5em;
    color: var(--vp-c-brand-1);
    text-align: center;
    margin-top: 5px;
    margin-bottom: 10px;
}
</style>