<template>
  <div>
    <div id="nav">
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/activities">Activities</router-link> |
      <router-link to="/error">error</router-link> -->
      <Routes :routes="routes" basename="/"></Routes>
    </div>
    <router-view />
    <!-- <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view> -->
  </div>
</template>
<script lang="ts">
import { defineComponent, h, PropType, resolveComponent } from 'vue'
import routes from 'vue-auto-routing'
import { RouteRecordRaw } from 'vue-router'

export default defineComponent({
  components: {
    Routes: defineComponent({
      name: 'Routes',
      props: {
        basename: { type: String, required: true },
        routes: { type: Array as PropType<RouteRecordRaw[]>, required: true },
      },
      setup(props) {
        return () =>
          props.routes.map((route) => [
            h(
              resolveComponent('router-link'),
              {
                to: props.basename + route.path,
              },
              () => [props.basename + route.path],
            ),
            ' | ',
            route.children &&
              h(resolveComponent('Routes'), {
                routes: route.children,
                basename: route.path,
              }),
          ])
      },
    }),
  },
  setup() {
    return {
      routes,
    }
  },
})
</script>
