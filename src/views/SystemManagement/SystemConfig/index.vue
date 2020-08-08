<template>
  <flexbox style="height:100%;" direction="column" align="stretch">
    <div class="header">企业信息</div>
    <div v-loading="loading" class="body">
      <div class="section" style="display: none;">
        <div class="name">企业logo</div>
        <el-upload
          v-if="!companyInfo.image"
          :show-file-list="false"
          :http-request="fileUpload"
          drag
          class="upload"
          action="http"
          accept="image/png, image/jpeg, image/gif, image/jpg"
        >
          <i class="el-icon-plus uploader-icon" />
        </el-upload>
        <div v-else class="upload-show">
          <img :src="companyInfo.image" />
          <i class="el-icon-remove icon-delete" @click="deleteSystemImage" />
        </div>
        <div class="el-upload__tip">可展示在顶部导航栏左上角Logo位置</div>
      </div>
      <div class="section">
        <div class="name">企业名称</div>
        <el-input v-model="companyInfo.name" placeholder="公司全称" />
      </div>
      <div class="section">
        <div class="name">公司电话</div>
        <el-input v-model="companyInfo.tel" placeholder="办公电话" />
      </div>
      <div class="section">
        <div class="name">公司地址</div>
        <el-input v-model="companyInfo.address" placeholder="办公地址" />
      </div>
      <div class="handle-bar">
        <el-button v-if="systemSaveAuth" class="save-button" type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <edit-image
      :fixed-number="[15, 4]"
      :show="showEditImage"
      :image="editImage"
      :file="editFile"
      title="编辑企业logo"
      preview-width="150px"
      preview-height="40px"
      preview-radius="0"
      width="550px"
      save-button-title="确定"
      @save="submiteImage"
      @close="showEditImage=false"
    />
  </flexbox>
</template>

<script>
import {getCompanyInfo, updateCompany} from '@/api/systemManagement/company'
import { uploadFile } from '@/api/common'
import EditImage from '@/components/EditImage'
import { mapGetters } from 'vuex'

export default {
  name: 'SystemConfig',
  components: {
    EditImage
  },
  data() {
    return {
      loading: false,
      companyInfo: {
        name: '', // 公司名称
        address: '',// 公司地址
        image: '', // 公司logo
        tel: ''// 公司电话
      },
     
      showEditImage: false,
      editImage: null,
      editFile: null,
      editedImage: null// 编辑后的图片
    }
  },
  computed: {
    ...mapGetters(['manage']),
    systemSaveAuth() {
      return this.manage && this.manage.system && this.manage.system.update
    }
  },
  beforeMount(){
    this.init();
  },
  methods: {
    //初始化
    init(){
      this.getCompanyInfo();
    },
    //获取企业信息
    getCompanyInfo(){
      getCompanyInfo().then(res=> {
        const {code , data} = res;
        if(code === 0){
          if(typeof data === 'object' && data !== null){
            this.companyInfo = {
              name: '',
              address: '',
              image: '', 
              tel: '',
              ...data
            }
          }
        }else{
            this.$message.error('获取企业信息失败！！！');
        }
      });
    },
    /** 附件上传 */
    fileUpload(content) {
      const reader = new FileReader()
      var self = this
      reader.onload = function(e) {
        let result
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          result = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          result = e.target.result
        }
        self.editImage = result
        self.editFile = content.file
        self.showEditImage = true
      }
      reader.readAsDataURL(content.file)
    },
    deleteSystemImage() {
      this.companyInfo.image = ''
      this.editedImage = null
    },
    submiteImage(data) {
      uploadFile(data).then(res => {
        if(res.code === 0 && res.data.filepath){
          this.companyInfo.image = res.data.filepath;
        }else{
          this.$message.error('上传图片失败');
        }
      }).catch(err=> {
        this.$message.error('上传失败');
        console.log(err)
      });
      this.editedImage = data;
    },

    //保存企业信息
    save() {
      const data = {
        name: this.companyInfo.name,
        tel: this.companyInfo.tel,
        address: this.companyInfo.address,
        image: this.companyInfo.image
      }
      if (!data.name) {
        this.$message.error('企业名称不能为空')
      } else {
        this.loading = true
        updateCompany(data)
          .then(res => {
            if(res.code === 0){
              this.loading = false
              this.$message.success('操作成功');
              this.getCompanyInfo();
            }else{
              this.$message.error('更新企业信息失败！！！')
            }
          })
          .catch(() => {
            this.$message.error('系统错误！！！')
            this.loading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  z-index: 100;
  padding: 0 20px;
  font-size: 18px;
  margin-bottom: 10px;
}

.body {
  flex: 1;
  overflow-y: auto;
  padding: 40px 30px 20px 30px;
  background-color: white;
  border: 1px solid #e6e6e6;
  border-radius: 2px;
  position: relative;
  min-width: 300px;
  > div {
    width: 300px;
    margin: 0 auto;
    &.section {
      margin-bottom: 30px;
      .name {
        color: #777777;
        font-size: 12px;
        margin-bottom: 8px;
      }
      .el-input {
        width: 100%;
      }
      .upload /deep/ {
        .el-upload {
          width: 100%;
        }
        .el-upload-dragger {
          width: 100%;
          height: 80px;
          .uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 100%;
            height: 80px;
            line-height: 80px;
            text-align: center;
          }
        }
      }
      .upload-show {
        position: relative;
        display: block;
        width: 100%;
        height: 80px;
        img {
          width: 100%;
          height: 100%;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
        }
        .icon-delete {
          position: absolute;
          top: -10px;
          right: -8px;
          color: red;
          font-size: 20px;
          display: none;
        }
        &:hover {
          .icon-delete {
            display: block;
          }
        }
      }
      .el-upload__tip {
        opacity: 0.8;
        transform-origin: 0 50%;
        transform: scale(0.9);
      }
    }
    &.handle-bar {
      text-align: right;
      > button.save-button {
        width: 100%;
        height: 40px;
        border-radius: 3px;
      }
    }
  }
}
</style>

