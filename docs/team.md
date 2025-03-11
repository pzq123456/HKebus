---
layout: page
---
<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
} from 'vitepress/theme'

const Investigators = [{
  avatar: 'Tony.png',
  name: 'Dr. Chengxiang (Tony) ZHUGE',
  title: 'Principal Investigator',
}]

// External Collaborators
const ExternalCollaborators = [
  {
    avatar: 'Zhenhan PENG.png',
    name: 'Zhenhan PENG',
    title: 'PhD Student at KU Leuven, Belgium',
  },
  
  {
    avatar: 'Jiaxing LIU.png',
    name: 'Jiaxing LIU',
    title: 'Lecturer at Gannan University of Science and Technology',
  }

  // JiaxingLIU Lecturer at Gannan University of Science and Technology
  
]

// Shiqi WANG 


const Reachers = [
  {
    avatar: 'Zili TIAN.png',
    name: 'Zili TIAN',
    title: 'Leading Researcher & PhD student',
  },
  {
    avatar: 'Xiong Yang.png',
    name: 'Xiong YANG',
    title: 'Leading Researcher & Postdoc Fellow',
  },
  {
    avatar: 'Shiqi WANG.png',
    name: 'Shiqi WANG',
    title: 'Leading Researcher & PhD candidate',
  },

  {
    avatar: 'Zhiqing PAN.png',
    name: 'Zhiqing PAN',
    title: 'Website Developer & Research Assistant',
  },
]

</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>Our Team</template>
    <template #lead>
     Hong Kong eBus Study is led by <a href="https://thetipteam.editorx.io/website/">The TIP Research Group</a> at The Hong Kong Polytechnic University (PolyU), which is an interdisciplinary research group focusing on <b class = "TIP">T</b>echnology innovation, <b class = "TIP">I</b>nfrastructure planning and <b class = "TIP">P</b>olicy making in Smart Cities
    </template>
  </VPTeamPageTitle>

  <VPTeamPageSection>
      <template #title>
      Principal Investigator
      </template>
      <template #members>
        <VPTeamMembers size="medium" :members= "Investigators" />
      </template>
  </VPTeamPageSection>



  <VPTeamPageSection>
    <template #title>
      Researchers & Developers
    </template>
    <template #members>
      <VPTeamMembers size="medium" :members= "Reachers" />
    </template>
  </VPTeamPageSection>


  <VPTeamPageSection>
      <template #title>
        International Collaborators
      </template>
      <template #members>
        <VPTeamMembers size="medium" :members= "ExternalCollaborators" />
      </template>
  </VPTeamPageSection>
</VPTeamPage>

<!-- style -->
<style scoped>
  a {
    color: #3eaf7c;
  }

  .TIP {
    color: #3eaf7c;
    font-weight: bold;
    font-size: 1.2em;
  }

</style>
