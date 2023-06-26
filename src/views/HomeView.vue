<template>
  <v-container>
    <v-row id="header">
      <v-col id="title" cols="6">
        <h1 class="text-orange">Telemetry Dashboard</h1>
      </v-col>
      <v-col id="uploadBtn" class="text-right">
        <v-btn color="primary" append-icon="mdi-upload" @click="dialog = true">Upload</v-btn>
      </v-col>
    </v-row>

    <v-row v-if="telemetry.loaded()">
      <v-col cols="4">
        <v-card>
          <v-card-item>
              <v-card-title>{{ car }}</v-card-title>
            <v-card-subtitle>CAR</v-card-subtitle>
            <v-img src="@/assets/preview.jpg" alt="No Image found"></v-img>
          </v-card-item>
          <v-card-text>
            Fastest Lap : {{ fastestLap[0] }} (Lap {{ fastestLap[1] }} )
          </v-card-text>
        </v-card>
        <br>
      </v-col>
      <v-col cols="4">
         <v-card>
            <v-card-item>
              <v-card-title>{{ track }}</v-card-title>
              <v-card-subtitle>TRACK</v-card-subtitle>
              <v-img src="@/assets/map.png"></v-img>
            </v-card-item>
          </v-card>
      </v-col>
      <v-col cols="4">
        <v-card v-for="lap in lapCountArray" :key="lap" class='my-5'>
          <v-card-title><router-link :to="`/lap/${lap}`"> Lap {{ lap }}</router-link></v-card-title>
          <v-card-item>{{ getLapTime(telemetry.data.lap.findLast(e => e.lap_count === lap)?.current_lap) }}</v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px" transition="dialog-transition">
      <v-card title="Upload files" subtitle="session.csv,car.csv,lap.csv,track.csv">
        <v-card-text>
          <v-file-input accept=".csv" density="compact" label="Upload CSV data" multiple small-chips
            @change='handleChange'></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-icon icon="mdi-check" v-if="telemetry.loaded()"></v-icon>
          <br>
          <v-btn v-if="telemetry.loaded()" color="primary" block @click='dialog=false'>Close Dialog</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script lang="ts">
import { telemetry, sessionType } from '@/store'
import { getLapData, getLapTime, handleFiles, lapCountArray } from '@/index'
import { defineComponent } from 'vue'

export default defineComponent({
  data () {
    return {
      dialog: false,
      show: false,
      loading: false,
      sessionType,
      telemetry
    }
  },
  computed: {
    lapCountArray,
    fastestLap () {
      const allLaps = lapCountArray().map((i: number) => getLapData(i).at(-1)?.current_lap)
      const fastest = Math.min(...allLaps)
      return [getLapTime(fastest), allLaps.indexOf(fastest) + 1]
    },
    car () {
      return (telemetry.data.session[0]?.car as string).toUpperCase().replaceAll('_', ' ')
    },
    track () {
      const track = telemetry.data.session[0]?.track as string
      return (track.startsWith('ks_') ? track.split('_')[1] : track).toUpperCase()
    },
    session () {
      return sessionType[telemetry.data.session[0].session_type as keyof typeof sessionType]
    }
  },
  methods: {
    handleChange (event: Event) {
      this.loading = true
      telemetry.empty()
      handleFiles(event)
    },
    getLapTime
  }
})
</script>
