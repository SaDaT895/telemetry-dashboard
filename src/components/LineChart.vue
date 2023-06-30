<template>
    <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ChartOptions, ChartData, Interaction, ChartTypeRegistry, TooltipItem } from 'chart.js'
import { CrosshairPlugin, Interpolate } from 'chartjs-plugin-crosshair/dist/chartjs-plugin-crosshair.esm.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import { PropType, defineComponent } from 'vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, CrosshairPlugin, zoomPlugin)
Interaction.modes.interpolate = Interpolate
ChartJS.defaults.plugins.tooltip.mode = 'interpolate'
ChartJS.defaults.plugins.tooltip.intersect = false
ChartJS.defaults.plugins.tooltip.callbacks.title = (tooltipItems: TooltipItem<keyof ChartTypeRegistry>[]) => { return tooltipItems[0].element.x + 'm' }
ChartJS.defaults.plugins.tooltip.callbacks.label = (tooltipItem: TooltipItem<keyof ChartTypeRegistry>) => {
  return (tooltipItem.chart.data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.element.y.toFixed(0))
}

export default defineComponent({
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
})
</script>
