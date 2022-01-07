<template>
  <div class="uploader">
    <slot :files="files" :file-list="fileList" :started="started">
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop>
        <p>Drop files here to upload or</p>
        <uploader-btn>select files</uploader-btn>
        <uploader-btn :directory="true">select folder</uploader-btn>
      </uploader-drop>
      <uploader-list></uploader-list>
    </slot>
  </div>
</template>

<script>
  import Uploader from 'simple-uploader.js'
  import { kebabCase } from '../common/utils'
  import UploaderBtn from './btn.vue'
  import UploaderDrop from './drop.vue'
  import UploaderUnsupport from './unsupport.vue'
  import UploaderList from './list.vue'

  import { ref, reactive } from 'vue'

  const COMPONENT_NAME = 'uploader'
  const FILE_ADDED_EVENT = 'fileAdded'
  const FILES_ADDED_EVENT = 'filesAdded'
  const UPLOAD_START_EVENT = 'uploadStart'

  export default {
    name: COMPONENT_NAME,
    provide () {
      return {
        uploader: this
      }
    },
    props: {
      options: {
        type: Object,
        default () {
          return {}
        }
      },
      autoStart: {
        type: Boolean,
        default: true
      },
      fileStatusText: {
        type: [Object, Function],
        default () {
          return {
            success: 'success',
            error: 'error',
            uploading: 'uploading',
            paused: 'paused',
            waiting: 'waiting'
          }
        }
      }
    },
    unmounted () {
      const uploader = this.uploader
      uploader.off('catchAll', this.allEvent)
      uploader.off(FILE_ADDED_EVENT, this.fileAdded)
      uploader.off(FILES_ADDED_EVENT, this.filesAdded)
      uploader.off('fileRemoved', this.fileRemoved)
      uploader.off('filesSubmitted', this.filesSubmitted)
      this.uploader = null
    },
    components: {
      UploaderBtn,
      UploaderDrop,
      UploaderUnsupport,
      UploaderList
    },

    setup(props, ctx) {
      let started = ref(false)
      let files = ref([])
      let fileList = ref([])
      const { options, autoStart, fileStatusText } = reactive(props)

      const _props = {
        ...options,
        initialPaused: !autoStart
      }

      const uploader = new Uploader(_props)
      uploader.fileStatusText = fileStatusText

      const evtHandlers = {
        uploadStart: () => {
          started.value = true
        }
      }

      const allEvent = (...args) => {
        const name = args[0]
        const EVENTSMAP = {
          [FILE_ADDED_EVENT]: true,
          [FILES_ADDED_EVENT]: true,
          [UPLOAD_START_EVENT]: 'uploadStart'
        }
        const handler = EVENTSMAP[name]
        if (handler) {
          if (handler === true) {
            return
          }
          evtHandlers[handler].apply(ctx, args.slice(1))
        }
        args[0] = kebabCase(name)
        ctx.emit.apply(ctx, args)
      }

      const fileAdded = (file) => {
        ctx.emit(kebabCase(FILE_ADDED_EVENT), file)
        if (file.ignored) {
          return false
        }
      }

      const filesAdded = (files, fileList) => {
        ctx.emit(kebabCase(FILES_ADDED_EVENT), files, fileList)
        if (files.ignored || fileList.ignored) {
          return false
        }
      }

      const fileRemoved = () => {
        files.value.splice(0, files.value.length, ...uploader.files)
        fileList.value.splice(0, fileList.value.length, ...uploader.fileList)
      }

      const filesSubmitted =  () => {
        files.value.splice(0, files.value.length, ...uploader.files)
        fileList.value.splice(0, fileList.value.length, ...uploader.fileList)
        if (autoStart) {
          uploader.upload()
        }
      }

      uploader.on('catchAll', allEvent)
      uploader.on(FILE_ADDED_EVENT, fileAdded)
      uploader.on(FILES_ADDED_EVENT, filesAdded)
      uploader.on('fileRemoved', fileRemoved)
      uploader.on('filesSubmitted', filesSubmitted)

      return {
        started,
        files,
        fileList,
        uploader,
        allEvent,
        fileAdded,
        filesAdded,
        fileRemoved,
        filesSubmitted
      }
    }

  }
</script>

<style>
  .uploader {
    position: relative;
  }
</style>
