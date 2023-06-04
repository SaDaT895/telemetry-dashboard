<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <RouterLink to="/about">
          <v-img :src="require('../assets/logo.svg')" class="my-3" contain height="200" />
        </RouterLink>
        <VCard>
          <RouterLink to="/lap">
            Go to laps
          </RouterLink>
        </VCard>
        <v-btn color="primary" @click="dialog = true">Upload</v-btn>
        <v-dialog v-model="dialog" max-width="500px" transition="dialog-transition">
          <v-card>
            <v-card-text>
              Upload files here
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" block @click="dialog = false">Close Dialog</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang='ts'>
export default {
  data () {
    return {
      dialog: false
    }
  }
}
</script>
