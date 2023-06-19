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
        <div style="height: 25vh;">
          <line-chart :chart-data="speedData" :chart-options="{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                ticks: {
                  callback(tickValue, index, ticks) {
                    const val = Number(this.getLabelForValue(tickValue as number))
                    if (val % 500 === 0) return val + 'm'
                  },
                }
              }
            },
            plugins: {
              crosshair: {
                line: {
                  color: 'white'
                },
                sync: {
                  enabled: false,
                },
                zoom: {
                  enabled: false
                }
              }
            }
          }"/>
        </div>
        <div style="height: 25vh;" class="my-5">
           <line-chart :chart-data="gearData" :chart-options="{
             responsive: true,
             maintainAspectRatio: false,
             scales: {
               y: {
                ticks: {
                  stepSize: 1
                }
              },
              x: {
                ticks: {
                   callback(tickValue, index, ticks) {
                    const val = Number(this.getLabelForValue(tickValue as number))
                    if (val % 500 === 0) return val + 'm'
                  }
                }
              }
             },
             plugins: {
              crosshair: {
                line: {
                  color: 'white'
                },
                sync: {
                  enabled: false,
                },
                zoom: {
                  enabled: false
                }
              }
             }
           }"/>
        </div>
         <div style="height: 25vh;" class="my-5">
             <line-chart :chart-data="revData" :chart-options="{
               responsive: true,
               maintainAspectRatio: false,
               scales: {
                 x: {
                   ticks: {
                     callback(tickValue, index, ticks) {
                       const val = Number(this.getLabelForValue(tickValue as number))
                       if (val % 500 === 0) return val + 'm'
                     }
                   }
                 }
               },
               plugins: {
                 crosshair: {
                   line: {
                     color: 'white'
                   },
                   sync: {
                     enabled: false,
                   },
                   zoom: {
                     enabled: false
                   }
                 },
                 zoom: {
                  pan: {
                    enabled: true,
                    mode: 'x',
                    threshold: 10
                  },
                  zoom: {
                    wheel: {
                      enabled: true
                    },
                    mode: 'x'
                  }
                 }
               }
             }"/>
          </div>
      </v-col>
    </v-row>

  </v-container>
</template>

<script lang="ts">
import { telemetry } from '@/store'
import { getLapData, lapCountArray, getLapTime } from '..'
import { defineComponent } from 'vue'
import LineChart from '@/components/LineChart.vue'
import { ChartData } from 'chart.js'

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
    invalid () {
      return this.lapData.at(-1)?.invalid
    },
    speedData () : ChartData<'line'> {
      const startIdx = telemetry.data.car.findIndex(c => c.timestamp === this.lapData[0].timestamp)
      const endIdx = telemetry.data.car.findIndex(c => c.timestamp === this.lapData.at(-1).timestamp)
      const carData = telemetry.data.car.slice(startIdx, endIdx).map(c => Math.round(c.speed))
      const labels = this.lapData.map(v => Math.round(v.lap_position * telemetry.data.session[0].track_length))
      const data = this.lapData.map((_, i) => carData[i])
      return {
        labels: labels,
        datasets: [
          {
            backgroundColor: '#EA7431',
            data: data,
            label: 'Speed',
            pointRadius: 0,
            borderColor: '#EA7431',
            tension: 0.1,
            borderWidth: 1
          }
        ]
      }
    },
    gearData () : ChartData<'line'> {
      const startIdx = telemetry.data.car.findIndex(c => c.timestamp === this.lapData[0].timestamp)
      const endIdx = telemetry.data.car.findIndex(c => c.timestamp === this.lapData.at(-1).timestamp)
      const carData = telemetry.data.car.slice(startIdx, endIdx).map(c => c.gear)
      const labels = this.lapData.map(v => Math.round(v.lap_position * telemetry.data.session[0].track_length))
      const data = this.lapData.map((_, i) => carData[i])
      return {
        labels: labels,
        datasets: [
          {
            backgroundColor: '#EA7431',
            data: data,
            label: 'Gear',
            pointRadius: 0,
            borderColor: '#EA7431',
            tension: 0,
            spanGaps: true,
            borderWidth: 1
          }
        ]
      }
    },
    revData (): ChartData<'line'> {
      const startIdx = telemetry.data.car.findIndex(c => c.timestamp === this.lapData[0].timestamp)
      const endIdx = telemetry.data.car.findIndex(c => c.timestamp === this.lapData.at(-1).timestamp)
      const carData = telemetry.data.car.slice(startIdx, endIdx).map(c => c.rpm)
      const labels = this.lapData.map(v => Math.round(v.lap_position * telemetry.data.session[0].track_length))
      const data = this.lapData.map((_, i) => carData[i])
      return {
        labels: labels,
        datasets: [
          {
            backgroundColor: '#EA7431',
            data: data,
            label: 'RPM',
            pointRadius: 0,
            borderColor: '#EA7431',
            tension: 0,
            // spanGaps: true,
            borderWidth: 1
          }
        ]
      }
    },
    lapCountArray
  },
  methods: {
    getLapData,
    getLapTime
  },
  components: {
    LineChart
  }
})
</script>
