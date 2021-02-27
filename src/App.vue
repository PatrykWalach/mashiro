<template>
  <!-- <div id="banner"></div>

  <BBanner>
    <template #icon></template>
    <template #action></template>

    Please Log in
  </BBanner>
  <BBanner></BBanner> -->

  <Suspense>
    <template #fallback>Loading...</template>
    <router-view />

    <!-- <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view> -->
  </Suspense>
</template>
