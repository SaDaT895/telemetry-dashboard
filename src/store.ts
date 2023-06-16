import { reactive } from 'vue'

export const telemetry = reactive({
  data: {
    car: [] as Array<any>,
    session: [] as Array<any>,
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

export const sessionType = {
  [-1]: 'Unknown',
  0: 'Practice',
  1: 'Qualifying',
  2: 'Race',
  3: 'Hotlap',
  4: 'Time Attack',
  5: 'Drift',
  6: 'Drag',
  7: 'Hotstint',
  8: 'Hotstint Super Pole'
}
