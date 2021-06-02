<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <!-- TODO: прокинуть в стор -->
      <transition name="fade">
        <file-uploader
          v-show="!inLoad"
          @loadFile="loadFile({ files: $event })"
          @clearFile="clearStore()"
          mimeType="text/plain"
        >
          <template v-slot:loadFile>
            Load File
          </template>
        </file-uploader>

        <v-progress-linear v-show="inLoad && !loaded" value=""></v-progress-linear>

        <!-- TODO: поиск/обработка (п.с) разобраться с аосом в чанках и утечками памяти -->
      </transition>
    </v-col>
  </v-row>
</template>

<script>

import { mapActions, mapState } from 'vuex';

export default {
  name: "Files",
  components: {
  },
  methods: mapActions('fileProcessing', [
    'init',
    'loadFile',
    'clearStore'
  ]),
  computed: mapState('fileProcessing', {
    loaded: (state) => state.loaded,
    inLoad: (state) => state.inLoad,
    chunks: (state) => state.chunks,
    progress: (state) => state.progress,
    current: (state) => state.current
  })
}
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
