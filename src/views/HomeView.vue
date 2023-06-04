<template>
  <v-container grid-list-xs>
    <v-row>
      <v-col cols="6">
        <h1 class="text-orange">Telemetry Dashboard</h1>
      </v-col>
      <v-col class="text-right">
         <v-btn color="primary" append-icon="mdi-upload" @click="dialog = true">Upload</v-btn>
          <v-dialog v-model="dialog" max-width="500px" transition="dialog-transition">
            <v-card title="Upload files" subtitle="session.csv,car.csv,lap.csv,track.csv">
              <v-card-text>
              <v-file-input accept=".csv" density="compact" label="Upload CSV data" small-chips multiple></v-file-input>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="dialog = false">Close Dialog</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  data () {
    return {
      dialog: false
    }
  }
}
</script>
