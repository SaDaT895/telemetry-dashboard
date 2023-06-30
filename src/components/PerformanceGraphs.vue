<template>
    <div>
    <h3 v-if="overlayId">Comparison with Lap {{ overlayId }} ({{ getLapTime(telemetry.data.lap.findLast(e => e.lap_count === overlayId)?.current_lap) }})</h3>
        <div style="height: 25vh;">
            <line-chart :chart-data="throttleData" :chart-options='chartOptions'></line-chart>
        </div>
        <div style="height: 25vh;" class="my-5">
        <line-chart :chart-data="brakeData" :chart-options="chartOptions"/>
          </div>
        <div style="height: 25vh;" class="my-5">
          <line-chart :chart-data="steeringData" :chart-options="{
            scales: {
              x: {
                border: {
                  display: false
                },
                grid: {
                  display: false
                }
              }
            },
            ...chartOptions
          }"/>
        </div>
    </div>
</template>

<script lang="ts">
import { telemetry } from '@/store'
import { defineComponent } from 'vue'
import LineChart from './LineChart.vue'
import { getLapData, labels, trackLength, getLapTime } from '..'
import { ChartDataset, ChartOptions, ChartData } from 'chart.js'

export default defineComponent({
  name: 'PerformanceGraphs',
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
    chartOptions () {
      return {
        hover: {
          mode: 'index',
          intersect: false
        },
        onClick: (event, elements, chart) => {
          this.onHoverEmit((elements[0]?.element as any).$context.raw.timestamp)
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              callback (tickValue, index, ticks) {
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
              enabled: false
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
              mode: 'x'
            },
            zoom: {
              wheel: {
                enabled: true
              },
              mode: 'x'
            }
          }
        }
      } as ChartOptions<'line'>
    },
    lapData () {
      const lapNo = Number(this.id!)
      return getLapData(lapNo)
    },
    overlayLapData () {
      if (!this.overlayId) return
      const overlayLap = this.overlayId
      return getLapData(overlayLap)
    },
    startIdx () { return telemetry.data.input.findIndex(c => c.timestamp === this.lapData[0].timestamp) },
    endIdx () { return telemetry.data.input.findIndex(c => c.timestamp === this.lapData.at(-1).timestamp) },
    inputData () { return telemetry.data.input.slice(this.startIdx, this.endIdx + 1) },
    throttleData () : ChartData<'line'> {
      const data = this.inputData.map((v, i) => {
        return {
          x: Math.round(this.lapData[i].lap_position * this.trackLength),
          y: v.gas * 100,
          timestamp: v.timestamp
        }
      })
      const datasets: ChartDataset<'line', { x: number, y: number, timestamp: any }[]>[] = [
        {
          data: data,
          label: 'Throttle%',
          ...this.dataOptions
        }
      ]
      if (this.overlayId) {
        const start = telemetry.data.input.findIndex(c => c.timestamp === this.overlayLapData![0].timestamp)
        const end = telemetry.data.input.findIndex(c => c.timestamp === this.overlayLapData!.at(-1).timestamp)
        const inputData = telemetry.data.input.slice(start, end + 1).map(c => c.gas)
        const overlayData = this.overlayLapData!.map((v, i) => {
          return {
            x: Math.round(v.lap_position * this.trackLength),
            y: inputData[i] * 100,
            timestamp: v.timestamp
          }
        })
        datasets.push({
          data: overlayData,
          label: 'Brake% ' + this.overlayId,
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
    brakeData (): ChartData<'line'> {
      const data = this.inputData.map((v, i) => {
        return {
          x: Math.round(this.lapData[i].lap_position * this.trackLength),
          y: v.brake * 100,
          timestamp: v.timestamp
        }
      })
      const datasets: ChartDataset<'line', { x: number, y: number, timestamp: any }[]>[] = [
        {
          data: data,
          label: 'Brake%',
          ...this.dataOptions
        }
      ]
      if (this.overlayId) {
        const start = telemetry.data.input.findIndex(c => c.timestamp === this.overlayLapData![0].timestamp)
        const end = telemetry.data.input.findIndex(c => c.timestamp === this.overlayLapData!.at(-1).timestamp)
        const inputData = telemetry.data.input.slice(start, end + 1).map(c => c.brake)
        const overlayData = this.overlayLapData!.map((v, i) => {
          return {
            x: Math.round(v.lap_position * this.trackLength),
            y: inputData[i] * 100,
            timestamp: v.timestamp
          }
        })
        datasets.push({
          data: overlayData,
          label: 'Brake% ' + this.overlayId,
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
    steeringData (): ChartData<'line'> {
      const data = this.inputData.map((v, i) => {
        return {
          x: Math.round(this.lapData[i].lap_position * this.trackLength),
          y: v.steer,
          timestamp: v.timestamp
        }
      })
      const datasets: ChartDataset<'line', { x: number, y: number, timestamp: any }[]>[] = [
        {
          data: data,
          label: 'Steering Angle (deg)',
          ...this.dataOptions
        }
      ]
      if (this.overlayId) {
        const start = telemetry.data.input.findIndex(c => c.timestamp === this.overlayLapData![0].timestamp)
        const end = telemetry.data.input.findIndex(c => c.timestamp === this.overlayLapData!.at(-1).timestamp)
        const inputData = telemetry.data.input.slice(start, end + 1).map(c => c.steer)
        const overlayData = this.overlayLapData!.map((v, i) => {
          return {
            x: Math.round(v.lap_position * this.trackLength),
            y: inputData[i],
            timestamp: v.timestamp
          }
        })
        datasets.push({
          data: overlayData,
          label: 'Brake% ' + this.overlayId,
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
      this.$emit('graphclick', timestamp)
    },
    getLapTime
  }
})

</script>
