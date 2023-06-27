<template>
    <div>
        <div style="height: 25vh;">
            <line-chart :chart-data="throttleData" :chart-options="{
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
            }"></line-chart>

        </div>
        <div style="height: 25vh;" class="my-5"></div>
        <div style="height: 25vh;" class="my-5"></div>
    </div>
</template>

<script lang="ts">
import { telemetry } from '@/store'
import { defineComponent } from 'vue'
import LineChart from './LineChart.vue'
import { getLapData, labels, trackLength } from '..'

export default defineComponent({
  name: 'PerformanceGraphs',
  props: {
    id: { type: String }
  },
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
    labels,
    trackLength,
    lapData () {
      const lapNo = Number(this.id!)
      return getLapData(lapNo)
    },
    startIdx () { return telemetry.data.car.findIndex(c => c.timestamp === this.lapData[0].timestamp) },
    endIdx () { return telemetry.data.car.findIndex(c => c.timestamp === this.lapData.at(-1).timestamp) },
    throttleData () {
      const data = telemetry.data.input.slice(this.startIdx, this.endIdx + 1).map(i => i.gas * 100)
      return {
        labels: this.labels,
        datasets: [
          {
            data: data,
            label: 'Throttle',
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
