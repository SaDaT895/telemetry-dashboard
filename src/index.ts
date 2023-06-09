import { telemetry } from './store'
import Papa from 'papaparse'

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
      complete: (res) => {
        if (res.meta.fields) {
          const key = validation[res.meta.fields.length] as keyof typeof telemetry.data
          telemetry.data[key] = structuredClone(res.data as never[])
          Object.entries(telemetry.data).map((val) => console.log(val[1].length))
        }
      }
    })
  }
}
