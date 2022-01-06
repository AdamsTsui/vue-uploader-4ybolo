<template>
  <div class="uploader-list">
    <slot :file-list="fileList">
      <ul :key="firstFileId">
        <li v-for="file in fileList" :key="file.id">
          <uploader-file :file="file" :list="true"></uploader-file>
        </li>
      </ul>
    </slot>
  </div>
</template>

<script>
  import UploaderFile from './file.vue'
  import { computed, inject } from 'vue'

  const COMPONENT_NAME = 'uploader-list'

  export default {
    name: COMPONENT_NAME,
    components: {
      UploaderFile
    },
    setup() {
      const uploader = inject('uploader')
      const firstFileId = computed(() => uploader.firstFileId)
      const fileList = computed(() => uploader.fileList)
      return {
        firstFileId,
        fileList
      }
    }
  }
</script>

<style>
  .uploader-list {
    position: relative;
  }
  .uploader-list > ul {
    list-style: none;
    margin: 0;
    padding: 0
  }
</style>
