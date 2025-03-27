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
    style: "border-radius: 50%; height: 95%;"

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

<script setup>
// 编写脚本主动 下载 favicon 图标
// const url = '/favicon.ico';

// 在页面渲染出来之后，创建一个 link 元素
import { onMounted } from 'vue';

import { withBase, useData } from 'vitepress'

onMounted(() => {
  // 基于静态资源获取 favicon 并添加到页面
  const URL = withBase('/favicon.ico');
  const link = document.createElement('link');
  link.rel = 'icon';

  link.href = URL;
  document.head.appendChild(link);
});

</script>