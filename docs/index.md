---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Hong Kong eBus"
  # text: "HKebus"
  tagline: Providing different stakeholders with optimal solutions to electrifying the HK bus system in a strategic way
  image:
    src: "/logo.png"
    alt: "Global EV Data"
    style: "border-radius: 50%; height: 70%;"

features:
  - title: "Map"
    details: "We visualize various spatial bus data and the analysis results through interactive maps."
    link: /map
    icon: 🌍

  - title: "Data"
    details: "We collect route and real-time data of Hong Kong’s buses, along with other spatial data and share the datasets upon request."
    link: /data
    icon: 🔄

  - title: "Publications"
    details: "We update regularly the latest research outputs using the HK eBus data as the main data sources."
    link: /publications
    icon: 📚
---



<div class = "acknowledgment">
Acknowledgment: This research is supported by the Public Policy Research (PPR) Funding Scheme that is administered by the Chief Executive’s Policy Unit (CEPU)
</div>

<script setup>
// 编写脚本主动 下载 favicon 图标
// const url = '/favicon.ico';

// 在页面渲染出来之后，创建一个 link 元素
import { onMounted } from 'vue';

onMounted(() => {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = '/favicon.ico';
  document.head.appendChild(link);
  console.log('favicon added');
});


</script>

<style scoped>

.acknowledgment {
  font-size: 1em;
  margin-top: 5%;
  color: var(--vp-c-text-2);
}
</style>
