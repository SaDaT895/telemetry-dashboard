import { telemetry } from './store'
import Papa from 'papaparse'

export const handleFile = (file: File) => {
  Papa.parse(file, {
    header: true,
    transformHeader (header, index) {
      return header.replace(' ', '_')
    },
    dynamicTyping: true,
    complete: (res) => { telemetry.car = structuredClone(res.data as never[]); console.log(telemetry) }
  })
}
