<template>
  <v-card
    class="container"
    @dragleave="fileDragOut"
    @dragover="fileDragIn"
    @drop="handleFileDrop, fileDragOut"
  >
    <v-form>
      <v-card-title class="pa-0">Add your file here:</v-card-title>
      <v-col
        v-show="files.length"
        class="file-wrapper d-flex align-center justify-center mt-4"
        cols="12"
      >
        <input
          type="file"
          name="file-input"
          multiply="false"
          @change="handleFileInput"
        >
        <h3 class="text--secondary">
          Drag here or click
        </h3>
      </v-col>
      <v-list
        v-if="files.length"
        class="pt-4"
      >
        <v-list-item
          v-for="(file, index) in files"
          :key="index"
          exact
          @click="removeFile(index)"
        >
          <v-list-item-action>
            <v-icon>mdi-file-document</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title
              v-text="`${file.name} ( ${Math.ceil(file.size / (1024*1024) * 100)/100} Mb)`"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-btn
        class="mt-2"
        @click="$emit('loadFile', files)"
        :elevation="0"
      >
        <slot name="loadFile" />
      </v-btn>
    </v-form>
  </v-card>
</template>

<script>

export default {
  data: () => {
    return {
      files: []
    }
  },
  methods: {
    handleFileDrop(e) {
      let droppedFiles = e.dataTransfer.files;
      if(!droppedFiles) return;
      ([...droppedFiles]).forEach(f => {
    
    this.files.push(f);
      });
    },
    handleFileInput(e) {
      let files = e.target.files;
      files = e.target.files
            if(!files) return;
      ([...files]).forEach(f => {
    
    this.files.push(f);
      });
    },
    removeFile(fileKey){
      this.files.splice(fileKey, 1)
    },
    fileDragIn(){
      this.color="white"
    },
    fileDragOut(){
    }
  }
}
</script>

<style>
.file-wrapper {
  text-align: center;
  width: 100%;
  height: 5em;
  vertical-align: middle;
  display: table-cell;
  position: relative;
  overflow: hidden;
  border: dashed gray 2px;
}


.file-wrapper input {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    opacity: 0.0;
    filter: alpha(opacity=0);
    font-size: 300px;
    height: 200px;
}
</style>
