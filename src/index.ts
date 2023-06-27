import { telemetry } from './store'
import Papa from 'papaparse'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import * as d3 from 'd3'

dayjs.extend(duration)
const reader = new FileReader()

export const parsecsv = (file: File) => {
  reader.readAsText(file)
  reader.onload = (e) => {
    return e
  }
}

export const handleFiles = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files) return

  const fieldSize = [17, 22, 10, 69, 6]
  const validation = Object.fromEntries(fieldSize.map((v, i) => [v, Object.keys(telemetry.data)[i]]))

  for (const file of files) {
    Papa.parse(file, {
      header: true,
      transformHeader (header) {
        return header.replace(' ', '_')
      },
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (res) => {
        if (res.meta.fields) {
          const key = validation[res.meta.fields.length] as keyof typeof telemetry.data
          telemetry.data[key] = structuredClone(res.data as never[])
          console.log(key)
        }
      }
    })
  }
}

export const lapCountArray = () => {
  return Array.from({ length: telemetry.data.lap.at(-1)?.lap_count }, (_, i) => i + 1)
}

export const getLapTime = (time: number) => {
  return dayjs.duration(time).format('m:ss:SSS')
}

export const getLapData = (lap: number) => {
  return telemetry.data.lap.filter(v => v.lap_count === lap)
}

export const labels = () => {
  const arr = Array.from({ length: trackLength() + 1 }, (_, i) => i)
  arr.push(...[0, 1, 2])
  return arr
}

export const trackLength = () => {
  return Math.round(telemetry.data.session[0].track_length)
}
