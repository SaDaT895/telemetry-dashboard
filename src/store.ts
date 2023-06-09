import { reactive } from 'vue'

export const telemetry = reactive({
  data: {
    car: [],
    session: [],
    lap: [],
    tyre: [],
    input: []
  },
  loaded () {
    return Object.values(this.data).every((i) => { return i.length !== 0 })
  }
})
