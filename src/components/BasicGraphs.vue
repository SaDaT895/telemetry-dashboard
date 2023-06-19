<template>
    <div>
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
            </div>
</template>

<script lang="ts">
import { telemetry } from '@/store'
import { ChartData } from 'chart.js'
import { defineComponent } from 'vue'
import LineChart from '@/components/LineChart.vue'
import { getLapData } from '..'

export default defineComponent({
  name: 'BasicGraphs',
  props: ['id'],
  data () {
    return {
      telemetry,
      dataOptions: {
        backgroundColor: '#EA7431',
        pointRadius: 0,
        borderColor: '#EA7431',
        tension: 0.1,
        borderWidth: 1
      }
    }
  },
  computed: {
    lapData () {
      const lapNo = Number(this.id!)
      return getLapData(lapNo)
    },
    labels () {
      return this.lapData.map(v => Math.round(v.lap_position * telemetry.data.session[0].track_length))
    },
    speedData (): ChartData<'line'> {
      const startIdx = telemetry.data.car.findIndex(c => c.timestamp === this.lapData[0].timestamp)
      const endIdx = telemetry.data.car.findIndex(c => c.timestamp === this.lapData.at(-1).timestamp)
      const carData = telemetry.data.car.slice(startIdx, endIdx).map(c => Math.round(c.speed))

      const data = this.lapData.map((_, i) => carData[i])
      return {
        labels: this.labels,
        datasets: [
          {
            data: data,
            label: 'Speed',
            ...this.dataOptions
          }
        ]
      }
    },
    gearData (): ChartData<'line'> {
      const startIdx = telemetry.data.car.findIndex(c => c.timestamp === this.lapData[0].timestamp)
      const endIdx = telemetry.data.car.findIndex(c => c.timestamp === this.lapData.at(-1).timestamp)
      const carData = telemetry.data.car.slice(startIdx, endIdx).map(c => c.gear)
      const data = this.lapData.map((_, i) => carData[i])
      return {
        labels: this.labels,
        datasets: [
          {
            data: data,
            label: 'Gear',
            spanGaps: true,
            ...this.dataOptions
          }
        ]
      }
    },
    revData (): ChartData<'line'> {
      const startIdx = telemetry.data.car.findIndex(c => c.timestamp === this.lapData[0].timestamp)
      const endIdx = telemetry.data.car.findIndex(c => c.timestamp === this.lapData.at(-1).timestamp)
      const carData = telemetry.data.car.slice(startIdx, endIdx).map(c => c.rpm)
      const data = this.lapData.map((_, i) => carData[i])
      return {
        labels: this.labels,
        datasets: [
          {
            data: data,
            label: 'RPM',
            ...this.dataOptions
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
