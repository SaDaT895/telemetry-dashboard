<template>
  <div>
    <h3 v-if="overlayId">Comparison with Lap {{ overlayId }} ({{ getLapTime(telemetry.data.lap.findLast(e => e.lap_count === overlayId)?.current_lap) }})</h3>
    <div style="height: 25vh;">
      <line-chart :chart-data="speedData" :chart-options="{
        responsive: true,
        maintainAspectRatio: false,
        hover: {
          mode: 'index',
          intersect: false
        },
        onClick: (event, elements, chart) => {
          onHoverEmit(elements[0]?.element.$context.raw.timestamp)
        },
        scales: {
          x: {
            ticks: {
              callback(tickValue, index, ticks) {
                if (tickValue as number % 500 === 0) return tickValue + 'm'
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
              enabled: false
            },
            zoom: {
              enabled: false
            }
          }
        }
      }" />
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
                if (tickValue as number % 500 === 0) return tickValue + 'm'
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
      }" />
    </div>
    <div style="height: 25vh;" class="my-5">
      <line-chart :chart-data="revData" :chart-options="{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              callback(tickValue, index, ticks) {
                if (tickValue as number % 500 === 0) return tickValue + 'm'
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
            limits: {
              x: { min: 0 }
            },
            pan: {
              enabled: true,
              mode: 'x',
            },
            zoom: {
              wheel: {
                enabled: true
              },
              mode: 'x'
            }
          }
        }
      }" />
    </div>
  </div>
</template>

<script lang="ts">
import { telemetry } from '@/store'
import { ChartData, ChartDataset } from 'chart.js'
import { defineComponent } from 'vue'
import LineChart from '@/components/LineChart.vue'
import { getLapData, getLapTime, labels, trackLength } from '..'

export default defineComponent({
  name: 'BasicGraphs',
  props: {
    id: { type: Number, required: true },
    overlayId: Number
  },
  data () {
    return {
      telemetry,
      dataOptions: {
        backgroundColor: '#EA7431',
        pointRadius: 0,
        borderColor: '#EA7431',
        tension: 0.1,
        borderWidth: 1,
        interpolate: true
      }
    }
  },
  computed: {
    labels,
    trackLength,
    lapData () {
      const lapNo = this.id
      return getLapData(lapNo)
    },
    overlayLapData () {
      if (!this.overlayId) return
      const overlayLap = this.overlayId
      return getLapData(overlayLap)
    },
    startIdx () { return telemetry.data.car.findIndex(c => c.timestamp === this.lapData[0].timestamp) },
    endIdx () { return telemetry.data.car.findIndex(c => c.timestamp === this.lapData.at(-1).timestamp) },
    carData () { return telemetry.data.car.slice(this.startIdx, this.endIdx + 1) },
    speedData (): ChartData<'line', { x: number, y: number, timestamp: any }[]> {
      const data = this.carData.map((v, i) => {
        return {
          x: Math.round(this.lapData[i].lap_position * this.trackLength),
          y: Math.round(v.speed),
          timestamp: v.timestamp
        }
      })
      const datasets: ChartDataset<'line', { x: number, y: number, timestamp: any }[]>[] = [
        {
          data: data,
          label: 'Speed',
          ...this.dataOptions,
          interpolate: true
        }

      ]
      if (this.overlayId) {
        const start = telemetry.data.car.findIndex(c => c.timestamp === this.overlayLapData![0].timestamp)
        const end = telemetry.data.car.findIndex(c => c.timestamp === this.overlayLapData!.at(-1).timestamp)
        const carData = telemetry.data.car.slice(start, end + 1).map(c => c.speed)
        const overlayData = this.overlayLapData!.map((v, i) => {
          return {
            x: Math.round(v.lap_position * this.trackLength),
            y: carData[i],
            timestamp: v.timestamp
          }
        })
        datasets.push({
          data: overlayData,
          label: 'Speed ' + this.overlayId,
          ...this.dataOptions,
          backgroundColor: '#FF0000',
          borderColor: '#FF0000'
        })
      }
      return {
        labels: this.labels,
        datasets: datasets
      }
    },
    gearData (): ChartData<'line'> {
      const data = this.carData.map((v, i) => {
        return {
          x: Math.round(this.lapData[i].lap_position * this.trackLength),
          y: v.gear
        }
      })
      const datasets: ChartDataset<'line'>[] = [
        {
          data: data,
          label: 'Gear',
          spanGaps: true,
          ...this.dataOptions,
          interpolate: true
        }
      ]
      if (this.overlayId) {
        const start = telemetry.data.car.findIndex(c => c.timestamp === this.overlayLapData![0].timestamp)
        const end = telemetry.data.car.findIndex(c => c.timestamp === this.overlayLapData!.at(-1).timestamp)
        const carData = telemetry.data.car.slice(start, end + 1).map(c => c.gear)
        const overlayData = this.overlayLapData!.map((v, i) => {
          return {
            x: Math.round(v.lap_position * this.trackLength),
            y: carData[i]
          }
        })
        datasets.push({
          data: overlayData,
          label: 'Gear ' + this.overlayId,
          ...this.dataOptions,
          spanGaps: true,
          backgroundColor: '#FF0000',
          borderColor: '#FF0000'
        })
      }
      return {
        labels: this.labels,
        datasets: datasets
      }
    },
    revData (): ChartData<'line'> {
      const data = this.carData.map((v, i) => {
        return {
          x: Math.round(this.lapData[i].lap_position * this.trackLength),
          y: v.rpm
        }
      })
      const datasets: ChartDataset<'line'>[] = [
        {
          data: data,
          label: 'RPM',
          ...this.dataOptions,
          interpolate: true
        }
      ]
      if (this.overlayId) {
        const start = telemetry.data.car.findIndex(c => c.timestamp === this.overlayLapData![0].timestamp)
        const end = telemetry.data.car.findIndex(c => c.timestamp === this.overlayLapData!.at(-1).timestamp)
        const carData = telemetry.data.car.slice(start, end + 1).map(c => c.rpm)
        const overlayData = this.overlayLapData!.map((v, i) => {
          return {
            x: Math.round(v.lap_position * this.trackLength),
            y: carData[i]
          }
        })
        datasets.push({
          data: overlayData,
          label: 'RPM ' + this.overlayId,
          ...this.dataOptions,
          backgroundColor: '#FF0000',
          borderColor: '#FF0000'
        })
      }
      return {
        labels: this.labels,
        datasets: datasets
      }
    }
  },
  components: {
    LineChart
  },
  methods: {
    onHoverEmit (timestamp: any) {
      this.$emit('graphhover', timestamp)
    },
    getLapTime
  }
})
</script>
