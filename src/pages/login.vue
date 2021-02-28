<template>
  <div
    class="sm:px-8 md:px-12 lg:px-16 xl:px-32 flex min-h-screen justify-center items-center bg-blue-100"
  >
    <div
      class="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8"
    >
      <div class="col-span-full flex justify-center">
        <BInput type="text" name="filter" id="filter" v-model:value="search" />
      </div>
      <template v-if="data">
        <BCard v-for="user of data.users" :key="user.id">
          <BImg
            class="p-2 rounded-full"
            :src="user.avatarUrl"
            height="120"
            width="120"
          ></BImg>
          <BCardTitle>{{ user.name }}</BCardTitle>
          <BCardActions class="p-2">
            <BButton class="w-full" @click="login(user.id)">login</BButton>
          </BCardActions>
        </BCard>
      </template>
      <BCard>
        <!-- <BIcon path="mdiAccountCircleOutline"></BIcon> -->
        <BImg
          :src="avatarUrl"
          class="p-2 rounded-full"
          height="120"
          width="120"
        ></BImg>
        <BCardTitle>
          <BInput
            placeholder="Paul"
            name="username"
            id="username"
            @keydown.enter="register"
            type="text"
            v-model:value="name"
          />
        </BCardTitle>
        <BCardActions class="p-2">
          <BButton class="w-full" @click="register">register</BButton>
        </BCardActions>
      </BCard>
    </div>
  </div>
</template>

<script lang="ts">
import {
  useLoginCreateUserMutation,
  useLoginUsersQuery,
} from '@/__generated__/globalTypes'
import { gql } from '@urql/vue'
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const CREATE_USER = gql`
  mutation loginCreateUser($name: String!) {
    createOneUser(data: { name: $name }) {
      id
      accounts {
        id
        token
        service
      }
      name
      preferredRssFeedUri
    }
  }
`

export const USERS_QUERY = gql`
  query loginUsers($search: String!) {
    users(
      orderBy: { lastLoggedInAt: desc }
      where: { name: { contains: $search } }
    ) {
      id
      name
      avatarUrl
      accounts {
        id
        service
      }
    }
  }
`

export default defineComponent({
  layout: 'empty',
  async setup() {
    const { executeMutation } = useLoginCreateUserMutation()

    const router = useRouter()
    const route = useRoute()

    function login(id: number) {
      localStorage.setItem('userId', id.toString())
      //TODO: handle route.query.redirectTo
      console.warn(route.query.redirectTo)
      router.push('/')
    }

    async function register(name: string) {
      const { data, error } = await executeMutation({
        name,
      })

      if (!data) {
        console.warn(error)
        //TODO: handle error
        return
      }

      login(data.createOneUser.id)
    }

    const search = ref('')

    const { data } = await useLoginUsersQuery({
      variables: { search },
    })

    const newUser = reactive({
      name: '',
      avatarUrl:
        'https://media.tenor.com/images/6e52b53b32029c6351247976a5d1fa3d/tenor.gif',
    })

    return {
      register: () => register(newUser.name),
      search,
      data,
      login,
      ...toRefs(newUser),
    }
  },
  //             <a
  //           :href="`https://anilist.co/api/v2/oauth/authorize?client_id=${CLIENT_ID}&response_type=token`"
  //           >Login with AniList</a
  //         >
  // const CLIENT_ID = process.env.VUE_APP_ANILIST_API_CLIENT_ID

  // beforeRouteEnter(to, from) {
  //   if (localStorage.getItem('userId')) {
  //     return {
  //       path: '/',
  //     }
  //   }
  // },
})
</script>
