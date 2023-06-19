<template>
    <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script lang="ts">
import { Chart, Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ChartOptions, ChartData, Interaction } from 'chart.js'
import { PropType } from 'vue'
import { CrosshairPlugin, Interpolate } from 'chartjs-plugin-crosshair/dist/chartjs-plugin-crosshair.esm.js'
import zoomPlugin from 'chartjs-plugin-zoom'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, CrosshairPlugin, zoomPlugin)
Interaction.modes.interpolate = Interpolate
ChartJS.defaults.plugins.tooltip.mode = 'index'
ChartJS.defaults.plugins.tooltip.intersect = false
// ChartJS.defaults.plugins.tooltip.callbacks.title = ()
// ChartJS.defaults.hover.intersect = false
// ChartJS.defaults.hover.mode = 'point'

export default {
  name: 'LineChart',
  components: { Line },
  props: {
    chartData: {
      type: Object as PropType<ChartData<'line'> >,
      required: true
    },
    chartOptions: {
      type: Object as PropType<ChartOptions<'line'> >
    }
  }
}
</script>
