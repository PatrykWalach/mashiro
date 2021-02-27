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

//  accounts: {
//     create: {
//       service: {
//         connectOrCreate: {
//           create: { name: "ANILIST" }
//           where: { name: "ANILIST" }
//         }
//       }
//       token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijc5ZGZhMzkxODAwNjkzOTNkMTkyZjVhZjg3MDRmMmI2YTg3NGYzZDViYmI3ZGM5ZDBmZjA2ZDU2OTc4MDRjNWE4MGNjNWUwOTVjYjllYWQxIn0.eyJhdWQiOiIzNDU1IiwianRpIjoiNzlkZmEzOTE4MDA2OTM5M2QxOTJmNWFmODcwNGYyYjZhODc0ZjNkNWJiYjdkYzlkMGZmMDZkNTY5NzgwNGM1YTgwY2M1ZTA5NWNiOWVhZDEiLCJpYXQiOjE2MTM4MjU5NjAsIm5iZiI6MTYxMzgyNTk2MCwiZXhwIjoxNjQ1MzYxOTYwLCJzdWIiOiIyMjA4MzIiLCJzY29wZXMiOltdfQ.AXYbgyIRbXsOkTnFixBGKB91E86UnE-mFi_6UUTl8JRQRtJzbzP3rpKLSvyyIwycxdG7CemrOE3x6fvhmIcvxg-AgBlXJLhgPCNq9Pcs0dROulNLEQSpiPlHn1V-fcGUWYSI-E4dyVBVPX9IFzYt9mB5wx8PS4iJA_Sk7VC-6rrxwKKKMRXS3zSdej0FJiPZrvLOJIS3FarN8i9eoziB3FJoaAOi8CReXFHkmFAawE4tweM7H8xC2ksAFV8fiIujiu0RPNFLA04flONvnutVhQGKICFUgKMf7rgsw3tF-mwkurRnyaUZp-LAuBll4ZXPebV4Lw0EkAW_csO3gm-_JWekI6QmA3wKPre_N2TcA9ssDJSJa0_QkxI_tlkx3fsSpURoxnycTobfN45CsSkV2bdDw7xVRBRrPJ4syh7PDIHheMrtr5N3dwbE8vBRxW73D7rjsCHEvHUL12UnkvXCEoEh1lKMYB4I3z7q0IeLqpWn4yYZvbmP1WNHpJWO46nU7DJ5x4ImOwvzM0GaM-4gthhvP1Yhbf5EgpGPWekenz2QQYV8GvCO-cf2oH4w-011YNvuhbhAjPrSUbET7-aMzeJHHgUll0UUrig0NNXFBI88FHbzIE5eBve7B_2BdmynrEeCf5EXY562r0B4yF24LACnEf1DDB33NjPgG5asirg"
//     }
//   }

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
