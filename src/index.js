import Uploader from './components/uploader.vue'
import UploaderBtn from './components/btn.vue'
import UploaderDrop from './components/drop.vue'
import UploaderUnsupport from './components/unsupport.vue'
import UploaderList from './components/list.vue'
import UploaderFiles from './components/files.vue'
import UploaderFile from './components/file.vue'

const uploader = {
  install,
  Uploader,
  UploaderBtn,
  UploaderDrop,
  UploaderUnsupport,
  UploaderList,
  UploaderFiles,
  UploaderFile
}

export default uploader

function install (vueApp) {
  if (install.installed) {
    return
  }
  vueApp.component(Uploader.name, Uploader)
  vueApp.component(UploaderBtn.name, UploaderBtn)
  vueApp.component(UploaderDrop.name, UploaderDrop)
  vueApp.component(UploaderUnsupport.name, UploaderUnsupport)
  vueApp.component(UploaderList.name, UploaderList)
  vueApp.component(UploaderFiles.name, UploaderFiles)
  vueApp.component(UploaderFile.name, UploaderFile)
}
