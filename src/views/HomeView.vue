<template>
  <v-container grid-list-xs>

    <v-row id="header">
      <v-col id="title" cols="6">
        <h1 class="text-orange">Telemetry Dashboard</h1>
      </v-col>
      <v-col id="uploadBtn" class="text-right">
        <v-btn color="primary" append-icon="mdi-upload" @click="dialog = true">Upload</v-btn>
        <v-dialog v-model="dialog" max-width="500px" transition="dialog-transition">
          <v-card title="Upload files" subtitle="session.csv,car.csv,lap.csv,track.csv">
            <v-card-text>
              <v-file-input accept=".csv" density="compact" label="Upload CSV data" multiple small-chips
                @change='handleChange'></v-file-input>
            </v-card-text>
            <v-card-actions>
              <v-progress-circular v-if="loading && !telemetry.loaded()" indeterminate></v-progress-circular>
              <v-icon icon="mdi-check" v-if="telemetry.loaded()"></v-icon>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <v-row>
      Telemetry loaded ✔️
      {{ telemetry.data.session[0] }}
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { telemetry } from '@/store'
import { handleFiles } from '@/index'
import { defineComponent } from 'vue'

export default defineComponent({
  data () {
    return {
      dialog: false,
      show: false,
      loading: false,
      telemetry
    }
  },

  methods: {
    handleChange (event: Event) {
      this.loading = true
      telemetry.empty()
      handleFiles(event)
    }
  }
})
</script>
