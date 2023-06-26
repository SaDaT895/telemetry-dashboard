<template>
    <Scatter :options="chartOptions" :data="chartData"></Scatter>
</template>

<script lang="ts">
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ChartOptions, ChartData, Interaction } from 'chart.js'
import { CrosshairPlugin, Interpolate } from 'chartjs-plugin-crosshair/dist/chartjs-plugin-crosshair.esm.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import { PropType, defineComponent } from 'vue'
import { Scatter } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, CrosshairPlugin, zoomPlugin)
ChartJS.defaults.plugins.tooltip.mode = 'index'
ChartJS.defaults.plugins.tooltip.intersect = false
export default defineComponent({
  name: 'ScatterChart',
  components: { Scatter },
  props: {
    chartData: {
      type: Object as PropType<ChartData<'scatter'>>,
      required: true
    },
    chartOptions: {
      type: Object as PropType<ChartOptions<'scatter'>>
    }
  }
})
</script>
