<template>
  <div>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </router-view>
    <div>custom layout</div>
  </div>
</template>
