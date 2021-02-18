<template>
  <a
    :href="`https://anilist.co/api/v2/oauth/authorize?client_id=${CLIENT_ID}&response_type=token`"
    >Login with AniList</a
  >

  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/activities">Activities</router-link>
  </div>
  <Suspense>
    <template #fallback>Loading...</template>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </router-view>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent(function App() {
  const CLIENT_ID = process.env.VUE_APP_ANILIST_API_CLIENT_ID
  return {
    CLIENT_ID,
  }
})
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
