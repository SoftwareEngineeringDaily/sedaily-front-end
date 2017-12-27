<template>
<v-layout row justify-center>
  <v-dialog v-model="showErrorDialog" max-width="400">
    <v-card>
      <v-card-title class="headline">Error</v-card-title>
      <v-card-text>{{ errorMessage }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click.prevent="closeErrorDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState([
      'showErrorDialog',
      'errorMessage'
    ])
  },
  methods: {
    ...mapActions(['closeErrorDialog'])
  }
}
</script>
