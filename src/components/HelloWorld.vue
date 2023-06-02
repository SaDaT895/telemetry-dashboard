<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <RouterLink to="/about">
          <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"/>
        </RouterLink>
        <VCard>Hello</VCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloWorld',

  data () {
    return {
      ecosystem: [
        {
          text: 'vuetify-loader',
          href: 'https://github.com/vuetifyjs/vuetify-loader/tree/next'
        },
        {
          text: 'github',
          href: 'https://github.com/vuetifyjs/vuetify/tree/next'
        },
        {
          text: 'awesome-vuetify',
          href: 'https://github.com/vuetifyjs/awesome-vuetify'
        }
      ],
      importantLinks: [
        {
          text: 'Chat',
          href: 'https://community.vuetifyjs.com'
        },
        {
          text: 'Made with Vuetify',
          href: 'https://madewithvuejs.com/vuetify'
        },
        {
          text: 'Twitter',
          href: 'https://twitter.com/vuetifyjs'
        },
        {
          text: 'Articles',
          href: 'https://medium.com/vuetify'
        }
      ],
      whatsNext: [
        {
          text: 'Explore components',
          href: 'https://vuetifyjs.com'
        },
        {
          text: 'Roadmap',
          href: 'https://vuetifyjs.com/en/introduction/roadmap/'
        },
        {
          text: 'Frequently Asked Questions',
          href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions'
        }
      ]
    }
  }
})
</script>
