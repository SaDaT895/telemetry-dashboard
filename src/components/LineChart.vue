<template>
    <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ChartOptions, ChartData, Interaction } from 'chart.js'
import { PropType } from 'vue'
import { CrosshairPlugin, Interpolate } from 'chartjs-plugin-crosshair/dist/chartjs-plugin-crosshair.esm.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, CrosshairPlugin)
Interaction.modes.interpolate = Interpolate
ChartJS.defaults.plugins.tooltip.mode = 'interpolate'
ChartJS.defaults.plugins.tooltip.intersect = false

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
