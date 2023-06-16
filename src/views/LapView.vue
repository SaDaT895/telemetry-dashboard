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
            <v-img src="@/assets/map.png"></v-img>
            <v-card-subtitle>INTERACTIVE TRACK MAP</v-card-subtitle>
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
            Valid: {{ (lapData.at(-1)?.invalid) === "False" }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col>
        <line-chart :chart-data="graphData()" :chart-options="{
          responsive: true,
          scales: {
            x: {
            }
          }
        }"></line-chart>
      </v-col>
    </v-row>

  </v-container>
</template>

<script lang="ts">
import { telemetry } from '@/store'
import { getLapData, lapCountArray, getLapTime } from '..'
import { defineComponent } from 'vue'
import LineChart from '@/components/LineChart.vue'

export default defineComponent({
  props: ['id'],
  data () {
    return {
      telemetry
    }
  },
  computed: {
    lapData () {
      const lapNo = Number(this.id!)
      return getLapData(lapNo)
    },
    lapCountArray
  },
  methods: {
    getLapData,
    getLapTime,
    graphData () {
      const startIdx = telemetry.data.car.findIndex(c => c.timestamp === this.lapData[0].timestamp)
      const carData = telemetry.data.car.slice(startIdx, startIdx + this.lapData.length).map(c => c.speed)
      const labels = this.lapData.map(v => Math.round(v.lap_position * telemetry.data.session[0].track_length) + 'm')
      const data = this.lapData.map((_, i) => carData[i])
      console.log(labels)
      return {
        labels: labels,
        datasets: [
          {
            backgroundColor: '#EA7431',
            data: data,
            label: 'Speed',
            pointRadius: 0,
            borderColor: '#EA7431',
            tension: 0.1
          }
        ]
      }
    }
  },
  components: {
    LineChart
  }
})
</script>
