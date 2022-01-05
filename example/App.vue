<template>
  <div id="app">
    <VideoUploader msg="视频上传"/>
  </div>
</template>

<script>
  import VideoUploader from './VideoUploader.vue'

  export default {
    name: 'App',
    components: {
      VideoUploader
    }
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
