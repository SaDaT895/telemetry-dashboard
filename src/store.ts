import { reactive } from 'vue'

interface Car {
  speed: string,
  rpm: string,
  gear: string,
  fuel: string,
  'drs available': string,
  'drs enabled': string,
}

export const telemetry = reactive({
  car: [],
  session: [],
  lap: [],
  tyre: [],
  input: []
})
