<template>
  <a
    :href="`https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=token`"
    >Login with AniList</a
  >

  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/activities">Activities</router-link>
  </div>
  <router-view />
</template>

<script lang="ts" setup>
const clientId = process.env.VUE_APP_ANILIST_API_CLIENT_ID
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

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
