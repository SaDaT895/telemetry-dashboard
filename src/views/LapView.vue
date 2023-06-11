<template>
    <v-container>
        <v-row class="text-center">
          <v-col>
            {{ id }}
          </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">

export default {
  props: ['id'],
  data () {
    return {

    }
  }
}
</script>
