<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-dialog
        fullscrean
        :value="inLoad && !loaded"
        persistent
      >
        <v-progress-linear
          :value="Math.ceil((current / chunks) * 100)"
        />
      </v-dialog>

      <transition-group name="fade" mode="out-in">
        <file-uploader
          key="uploader-form"
          v-show="!inLoad && !loaded"
          @loadFile="loadFile({ files: $event })"
          mimeType="text/plain"
        >
          <template v-slot:loadFile>
            Load File
          </template>
        </file-uploader>

        <v-card
          key="uploader-file-edit"
          v-show="loaded"
          class="container"
        >
          <v-card-title class="pa-0">{{ file.name }}</v-card-title>
          <v-divider/>
          <!-- TODO: если еще раз буду использовать такое преобразование - лучше вынести в utils -->
          <div
            class="d-flex flex-row pt-4 align-center"
          >
            <v-card-subtitle>{{ `${Math.ceil(file.size / (1024*1024) * 100)/100} Mb` }}</v-card-subtitle>
            <v-card-subtitle>
              {{ `results: ${searchResult}` }}
            </v-card-subtitle>
            <v-spacer />
            <v-btn
              elevation="0"
              fab
              depresed
              x-small
              color="error"
              @click="clearStore()"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          
          <div
            class="d-flex flex-row pt-4 align-center"
          >
            <v-text-field
              class="mr-4"
              @input="updateSearchLine({ text: $event })"
            />
            <v-btn
              class="mt-2"
              @click="startSearch()"
              :elevation="0"
            >
              Search
            </v-btn>
          </div>
        </v-card>
        <!-- TODO: поиск/обработка (п.с) разобраться с аосом в чанках и утечками памяти -->
      </transition-group>
      
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
    'clearStore',
    'init',
    'updateSearchLine',
    'startSearch'
  ]),
  computed: mapState('fileProcessing', {
    loaded:       (state) => state.loaded,
    inLoad:       (state) => state.inLoad,
    chunks:       (state) => state.chunks,
    progress:     (state) => state.progress,
    current:      (state) => state.current,
    file:         (state) => state.file,
    searchResult: (state) => state.searchResult
  }),
  mounted () {
    this.init()
  }
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
