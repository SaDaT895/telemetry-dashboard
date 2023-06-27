<template>
  <v-container>

    <v-row>
      <v-col id="title" cols="6">
        <h1 class="text-orange">Lap {{ id }} of {{ lapCountArray.length }}</h1>
      </v-col>
      <v-col id="uploadBtn" class="text-right">
        <router-link to="/" custom v-slot="{navigate}">
          <v-btn color="primary" append-icon="mdi-home" @click="navigate">Go Back</v-btn>
        </router-link>
      </v-col>
    </v-row>

    <v-row justify='center' align-items='center'>
      <v-col cols="3">
        <v-card>
          <v-card-item>
            <v-img src="@/assets/track.avif"></v-img>
            <v-card-subtitle>TRACK MAP</v-card-subtitle>
          </v-card-item>
          <v-card-text>
            Final Lap Time: {{ getLapTime(lapData.at(-1)?.current_lap) }}
            <br>
            Valid: {{ invalid }}
          </v-card-text>
          <br>

          <v-card>
            <v-card-text v-if="currentTimestamp">
              <v-row>
                  <v-list-item>
                  <v-list-item-title>Time</v-list-item-title>{{ getLapTime(dynamicLapData.current_lap) }}
                </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Lap Percentage</v-list-item-title>{{ Math.round(dynamicLapData.lap_position * 1000) / 10 }}
                  </v-list-item>
                    <v-list-item>
                    <v-list-item-title>Fuel (in kgs)</v-list-item-title> {{ Math.round(dynamicCarData.fuel * 100) / 100 }}
                  </v-list-item>
                    <v-list-item>
                    <v-list-item-title>Current Sector</v-list-item-title> {{ dynamicLapData.current_sector + 1 }}
                  </v-list-item>
                    <v-list-item>
                    <v-list-item-title>Delta</v-list-item-title>{{ Math.round(dynamicLapData.lap_delta * 1000)/1000 }}
                  </v-list-item>
              </v-row>
            </v-card-text>
          </v-card>
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
            <v-list-item
              v-for="(item, index) in lapCountArray.filter(e => e !== Number(id))"
              :key="index"
              :value="item"
              @click="overlayLap(item)"
            >
              <v-list-item-title>Lap {{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
            </v-menu>
          </v-btn>
        </v-col>

        </v-row>

        <v-window v-model="graphMode">
          <v-window-item value="basic">
            <basic-graphs :id='Number(id)' :overlay-id="overlay!==Number(id)?overlay: undefined" @graphhover='(val) => currentTimestamp = val'/>
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
import { telemetry } from '@/store'
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
      return this.lapData.at(-1)?.invalid
    },
    lapCountArray,
    dynamicLapData () {
      if (this.currentTimestamp) return telemetry.data.lap.find(e => e.timestamp === this.currentTimestamp)
      return null
    },
    dynamicCarData () {
      if (this.currentTimestamp) return telemetry.data.car.find(e => e.timestamp === this.currentTimestamp)
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
  }
})
</script>
