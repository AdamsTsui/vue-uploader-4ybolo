<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div class="uploader-con">
      <uploader ref="fileUploader" :options="options" :file-status-text="fileStatusText" class="uploader-example">
        <uploader-unsupport></uploader-unsupport>
        <uploader-drop>
          <p class="uploader-drag-text">上传视频，即表示您已同意 上传服务条款，请勿上传色情，反动等违法视频。
            上传单个文件最大5G。 支持格式：mp4</p>
          <uploader-btn :attrs="attrs">选择文件</uploader-btn>
        </uploader-drop>
        <uploader-list></uploader-list>
      </uploader>
      <div class="form-con">
        <span class="require">*</span><label class="form-label">视频名称：</label><input class="form-input" type="text" v-model="aliasName"><button class="form-submit-btn" @click="handleSubmit">提 交</button>
      </div>

    </div>
  </div>
</template>

<script>
  let _this
  let fileName

  import request from 'axios'

  export default {
    name: 'VideoUploader',
    props: {
      msg: String
    },
    created() {
      _this = this
    },
    data() {
      return {
        options: {
          target: '/video/front/videoTrans/uploadFromBreak',
          mergeStatusUrl: '/file/upload/progress',
          testChunks: false,
          allowDuplicateUploads: true,
          maxChunkRetries: 3,
          simultaneousUploads: 1,
          singleFile: true,
          chunkSize: 20 * 1024 * 1024,
          uploadMethod: 'POST',
          mergeStatusMethod: 'GET',
          parseTimeRemaining: function (timeRemaining, parsedTimeRemaining) {
            return parsedTimeRemaining
              .replace(/\syears?/, '年')
              .replace(/\days?/, '天')
              .replace(/\shours?/, '小时')
              .replace(/\sminutes?/, '分钟')
              .replace(/\sseconds?/, '秒')
          },
          generateUniqueIdentifier: function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
              var r = (d + Math.random() * 16) % 16 | 0;
              d = Math.floor(d / 16);
              return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
          },
          processResponse: function (response, cb) {
            cb(null, response);
            if (response) {
              let res = JSON.parse(response);
              if (res.code == 0) {
                fileName = res.data.videoName
                console.info('视频上传成功。。。');
              } else {
                alert(res.msg)
                const uploaderInstance = _this.$refs.fileUploader.uploader;
                uploaderInstance.cancel();
              }
            }
          },
          processMergeComplete: function (file) {
            // 文件合并完成
            console.log(file)
          }
        },
        fileStatusText: {
          success: '上传成功',
          merging: '合并中',
          error: '上传出错',
          uploading: '加载中',
          paused: '暂停',
          waiting: '等待中'
        },
        attrs: {
          accept: 'video/mp4'
        },
        aliasName: ''
      }
    },
    methods: {
      handleSubmit() {
        if (!fileName) {
          alert('请先完成视频上传')
          return
        }

        if (!this.aliasName) {
          alert('视频名称不能为空')
          return
        }

        if (this.aliasName.length > 128) {
          alert('视频名称不能超过128个字符')
          return
        }
        // console.log('sss:' + this.aliasName + ':::::fileName:::' + fileName)

        request({
          url: '/video/front/videoTrans/trans',
          method: 'post',
          data: {
            coId: '10001',
            videoLevel: 1,
            transType: 0,
            publishName: '管理员',
            showOuterLink: 1,
            downloadable: 1,
            aliasName: this.aliasName,
            fileName
          }
        }).then(res => {
          if (res.data.code === 0) {
            fileName = null
            alert('提交成功')
          } else {
            alert(res.data.msg + '')
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {

  }

  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .uploader-con {

  }

  .uploader-example {
    width: 480px;
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }

  .uploader-example .uploader-btn {
    margin-right: 4px;
  }

  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .uploader-drag-text {
    color: red;
  }

  .uploader-btn {
    background-color: #FFA53EFF !important;
    border: none !important;
    color: #fff !important;
  }

  .uploader-btn:hover {
    background-color: #FF8800FF !important;
  }
  .form-con {
    text-align: left;
    width: 510px;
    margin: 30px auto;
  }
  .form-label {

  }
  .form-input {
    height: 24px;
    line-height: 24px;
    border: 1px solid #bbb;
    outline: none;
    width: 320px;
    display: inline-block;
    padding-left: 10px;
    transform: translateY(-2px);
  }
  .form-submit-btn {
    float: right;
    background-color: #FFA53EFF;
    border: none;
    color: #ffffff;
    padding: 6px 15px;
    cursor: pointer;
    display: inline-block;
    transform: translateY(-4px);
  }
  .require {
    color: red;
    display: inline-block;
    transform: translateY(5px);
  }
</style>
