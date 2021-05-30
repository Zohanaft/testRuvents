<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <!-- TODO: прокинуть в стор -->
      <file-uploader @loadFile="">
        <template v-slot:loadFile>
          Load File
        </template>
      </file-uploader>
    </v-col>
  </v-row>
</template>

<script>

export default {
  name: "Files",
  components: {
  }
}
</script>

<style lang="scss">

</style>
