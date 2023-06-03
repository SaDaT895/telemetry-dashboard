<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <RouterLink to="/about">
          <v-img :src="require('../assets/logo.svg')" class="my-3" contain height="200" />
        </RouterLink>
        <VCard>Hello</VCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloWorld'
})
</script>
