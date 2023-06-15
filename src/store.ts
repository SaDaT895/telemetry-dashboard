import { reactive } from 'vue'

export const telemetry = reactive({
  data: {
    car: [] as Array<any>,
    session: [],
    lap: [] as Array<any>,
    tyre: [],
    input: []
  },
  loaded () {
    return Object.values(this.data).every((i) => { return i.length !== 0 })
  },
  empty () {
    Object.values(this.data).forEach((val) => { val.length = 0 })
  }
})
