<template>
  <v-container>

    <v-row>
      <v-col id="title" cols="6">
        <h1 class="text-orange">Lap {{ id }} of {{ lapCountArray.length }}</h1>
      </v-col>
      <v-col id="uploadBtn" class="text-right">
        <router-link to="/" custom v-slot="{navigate}">
          <v-btn color="primary" append-icon="mdi-home" @click="navigate">Go Back</v-btn>
        </router-link>
      </v-col>
    </v-row>

    <v-row justify='center' align-items='center'>
      <v-col cols="3">
        <v-card>
          <v-card-item>
            <v-img src="@/assets/track.avif"></v-img>
            <v-card-subtitle>TRACK MAP</v-card-subtitle>
          </v-card-item>
          <v-card-text>
            Time: {{ getLapTime(lapData.at(-1)?.current_lap) }}
            <br>
            Speed: {{ telemetry.data.car.find(v => v.timestamp === lapData.at(-1)?.timestamp)?.speed }}
            <br>
            Gear: {{ telemetry.data.car.find(v => v.timestamp === lapData.at(-1)?.timestamp)?.gear }}
            <br>
            Location: {{ lapData.at(-1)?.lap_position }}
            <br>
            Valid: {{ invalid }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col>
        <v-tabs v-model="graphMode">
          <v-tab value="basic">Basic</v-tab>
          <v-tab value="perf">Performance</v-tab>
          <v-tab value="tyres">Tyres</v-tab>
          <v-btn>Custom</v-btn>
        </v-tabs>

        <v-window v-model="graphMode">
          <v-window-item value="basic">
            <basic-graphs :id="id"></basic-graphs>
          </v-window-item>
          <v-window-item value="perf">
            <h1>Performance Stats go here</h1>
          </v-window-item>
          <v-window-item value="tyres">
            <h1>Tyre Stats go here</h1>
          </v-window-item>
        </v-window>

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { telemetry } from '@/store'
import { getLapData, lapCountArray, getLapTime } from '..'
import { defineComponent, PropType } from 'vue'
import { ChartData } from 'chart.js'
import BasicGraphs from '@/components/BasicGraphs.vue'

export default defineComponent({
  props: {
    id: { type: String, required: true }
  },
  data () {
    return {
      telemetry,
      graphMode: 'basic'
    }
  },
  computed: {
    lapData () {
      const lapNo = Number(this.id!)
      return getLapData(lapNo)
    },
    invalid () {
      return this.lapData.at(-1)?.invalid
    },
    lapCountArray
  },
  methods: {
    getLapData,
    getLapTime
  },
  components: {
    BasicGraphs
  }
})
</script>
