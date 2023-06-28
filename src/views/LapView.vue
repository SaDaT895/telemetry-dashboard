<template>
  <v-container>

    <v-row>
      <v-col id="title" cols="6">
        <h1 class="text-orange">Lap {{ id }} of {{ lapCountArray.length }}</h1>
      </v-col>
      <v-col id="uploadBtn" class="text-right">
        <router-link to="/" custom v-slot="{ navigate }">
          <v-btn color="primary" append-icon="mdi-home" @click="navigate">Go Back</v-btn>
        </router-link>
      </v-col>
    </v-row>

    <v-row justify='center' align-items='center'>
      <v-col cols="3">
        <v-card>
          <v-card-item>
            <v-img src="@/assets/map.png"></v-img>
            <v-card-subtitle>
              <p v-if="invalid" class="text-error">INVALID LAP</p>
              <p v-if="!invalid" class="text-green">VALID LAP</p>
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            Final Lap Time: {{ getLapTime(lapData.at(-1)?.current_lap) }}
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-item>
            <v-card-subtitle>ESSENTIALS</v-card-subtitle>
          </v-card-item>
          <v-card-text v-if="currentTimestamp">
            <v-row>
              <v-col cols="4">
                  <v-list-item>
                <v-list-item-title>Time</v-list-item-title>{{ getLapTime(dynamicLapData.current_lap) }}
              </v-list-item>
              </v-col>
              <v-list-item>
                <v-list-item-title>Lap Percentage</v-list-item-title>{{ Math.round(dynamicLapData.lap_position * 1000) /
                  10 }}
              </v-list-item>
              <v-list-item>
                <h3>Speed</h3>
                {{ Math.round(dynamicCarData.speed) }}
              </v-list-item>
              <v-col cols="4">
                <v-list-item>
                  <h3>Fuel (kgs)</h3> {{ Math.round(dynamicCarData.fuel * 100) / 100 }}
                </v-list-item>
              </v-col>
              <v-list-item>
                <h3>Current Sector</h3> {{ dynamicLapData.current_sector + 1 }}
              </v-list-item>
              <v-list-item>
                <h3>Delta</h3>{{ Math.round(dynamicLapData.lap_delta * 1000) / 1000 }}
              </v-list-item>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-item>
            <v-card-subtitle>TYRES</v-card-subtitle>
            <v-card-text v-if="currentTimestamp">
              <v-row>
                <v-col v-for="(x, i) in tyres" :key="i" cols="6">
                    <v-list-item >
                    <h3>{{ x }}</h3>
                    Temp: {{ Math.round(dynamicTyreData['core_temp' + i] * 10)/10}}&deg;C
                    <br>
                    Slip Angle: {{ Math.round(dynamicTyreData['slip_angle' + i] * 10)/10 }}&deg;
                  </v-list-item>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col>
        <v-row>
          <v-col>
            <v-tabs v-model="graphMode">
              <v-tab value="basic">Basic</v-tab>
              <v-tab value="perf">Performance</v-tab>
              <v-tab value="tyres">Tyres</v-tab>
              <v-btn>Custom</v-btn>
            </v-tabs>
          </v-col>

          <v-col class="text-right">
            <v-btn>
              Compare with
              <v-menu activator='parent'>
                <v-list>
                  <v-list-item v-for="(item, index) in lapCountArray.filter(e => e !== Number(id))" :key="index"
                    :value="item" @click="overlayLap(item)">
                    <v-list-item-title>Lap {{ item }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
          </v-col>

        </v-row>

        <v-window v-model="graphMode">
          <v-window-item value="basic">
            <basic-graphs :id='Number(id)' :overlay-id="overlay !== Number(id) ? overlay : undefined"
              @graphhover='(val) => currentTimestamp = val' />
          </v-window-item>
          <v-window-item value="perf">
            <performance-graphs :id="id"></performance-graphs>
          </v-window-item>
          <v-window-item value="tyres">
            <h1>Tyre Stats go here</h1>
          </v-window-item>
        </v-window>

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { telemetry, tyres } from '@/store'
import { getLapData, lapCountArray, getLapTime } from '..'
import { defineComponent, PropType } from 'vue'
import BasicGraphs from '@/components/BasicGraphs.vue'
import PerformanceGraphs from '@/components/PerformanceGraphs.vue'

export default defineComponent({
  props: {
    id: { type: String, required: true }
  },
  data () {
    return {
      telemetry,
      tyres,
      graphMode: 'basic',
      overlay: Number(this.id),
      currentTimestamp: null
    }
  },
  computed: {
    lapData () {
      const lapNo = Number(this.id)
      return getLapData(lapNo)
    },
    invalid () {
      return this.lapData.at(-1)?.invalid === 'True'
    },
    lapCountArray,
    dynamicLapData () {
      if (this.currentTimestamp) return telemetry.data.lap.find(e => e.timestamp === this.currentTimestamp)
      return null
    },
    dynamicCarData () {
      if (this.currentTimestamp) return telemetry.data.car.find(e => e.timestamp === this.currentTimestamp)
      return null
    },
    dynamicTyreData () {
      if (this.currentTimestamp) return telemetry.data.tyre.find(e => e.timestamp === this.currentTimestamp)
      return null
    }
  },
  methods: {
    getLapData,
    getLapTime,
    overlayLap (lap: number) {
      this.overlay = lap
    }
  },
  components: {
    BasicGraphs,
    PerformanceGraphs
  },
  beforeRouteEnter (to, from) {
    // next(vm => {
    //   const id = Number(JSON.parse(JSON.stringify(vm.$props)).id)
    //   if (!telemetry.loaded() || !lapCountArray().includes(id)) {
    //     console.log(id)
    //     vm.$router.push('/')
    //   }
    // })
    const id = Number(to.params.id)
    if (!telemetry.loaded() || !lapCountArray().includes(id)) {
      alert('Upload Data again')
      return { path: '/' }
    }
    return true
  }
})
</script>
