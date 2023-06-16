<template>
    <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ChartOptions, ChartData, LineControllerChartOptions } from 'chart.js'
import { PropType } from 'vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement)

export default {
  name: 'LineChart',
  components: { Line },
  props: {
    chartData: {
      type: Object as PropType<ChartData>,
      required: true
    },
    chartOptions: {
      type: Object as PropType<ChartOptions>
    }
  }
}
</script>
