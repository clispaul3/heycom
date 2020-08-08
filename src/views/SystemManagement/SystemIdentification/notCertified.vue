<template>
  <div class="page-content-area">
    <div class="title-status-bar">
      <h3>认证状态</h3>
      <span></span>
    </div>
    <div class="notify-bar">
      <div>
        <span>提示：</span>请如实填写以下信息和上传真实图片，用于电信运营商服务开通审核，以下信息皆为必填项
      </div>
    </div>
    <div class="company-info">
      <el-row :gutter="10">
        <el-col :span="12">
          <label for="company-name">公司名称：</label>
          <el-input style="width: 20em" label="company-name" placeholder="公司全称" v-model="companyInfo.name"></el-input>
        </el-col>
        <el-col :span="12">
          <label for="company-name">公司电话：</label>
          <el-input style="width: 20em" label="company-name" placeholder="办公电话" v-model="companyInfo.tel"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <label for="company-name">公司地址：</label>
          <el-input style="width: calc(50% + 20.5em)" label="company-addr" placeholder="办公地址" v-model="companyInfo.address"></el-input>
        </el-col>
      </el-row>
      <div class="authentication-img-area">
        <div class="title">
          认证图片（<span>每张图片须清晰完整，大小不超过5M</span>）
        </div>
        <el-row>
          <el-col :lg="6" :md="12">
            <div class="row-title">营业执照</div>
            <div class="row-image">
              <img :src="authList && authList.businessLicense && authList.businessLicense.value">
            </div>
            <div class="row-handlebar">
              <el-upload
                :show-file-list="false"
                :http-request="uploadAuthentication"
                action="businessLicense"
                accept="image/png, image/jpeg, image/gif, image/jpg"
              >
                <el-button>点击上传</el-button>
              </el-upload>
            </div>
          </el-col>
          <el-col :lg="6" :md="12">
            <div class="row-title">法人代表身份证人像面</div>
            <div class="row-image">
              <img :src="authList && authList.identityFront && authList.identityFront.value">
            </div>
             <div class="row-handlebar">
               <el-upload
                :show-file-list="false"
                :http-request="uploadAuthentication"
                action="identityFront"
                accept="image/png, image/jpeg, image/gif, image/jpg"
              >
                <el-button>点击上传</el-button>
              </el-upload>
             </div>
          </el-col>
          <el-col :lg="6" :md="12">
            <div class="row-title">法人代表身份证国徽面</div>
            <div class="row-image"><img :src="authList && authList.identityBack && authList.identityBack.value"></div>
             <div class="row-handlebar">
               <el-upload
                :show-file-list="false"
                :http-request="uploadAuthentication"
                action="identityBack"
                accept="image/png, image/jpeg, image/gif, image/jpg"
              >
                <el-button>点击上传</el-button>
              </el-upload>
             </div>
          </el-col>
          <el-col :lg="6" :md="12">
            <div class="row-title">客户沟通话术（盖章）</div>
            <div class="row-image"><img  :src="authList && authList.seal && authList.seal.value"></div>
             <div class="row-handlebar">
               <el-upload
                :show-file-list="false"
                :http-request="uploadAuthentication"
                action="seal"
                accept="image/png, image/jpeg, image/gif, image/jpg"
              >
                <el-button>点击上传</el-button>
              </el-upload>
             </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="handlebar">
      <el-button type="primary" @click="saveAuthForm" size="medium">提交审核</el-button>
    </div>
  </div>
</template>

<script>
import {getAuthinfo, saveAuth, updateCompany} from '@/api/systemManagement/company'
import {uploadFile} from '@/api/common'

export default {
  data() {
    return {
      loading: true,
      companyInfo: {
        address: '',
        comId: 0,
        image: '',
        name: '',
        status: 0,
        auth: 0,
        tel: ''
      },
      //保存上传的信息
      authSaveForm: {
        businessLicense: null,
        identityBack: null,
        identityFront: null,
        seal: null
      },
      //上传图片列表(展示)
      authList: {
        "businessLicense": {},
        "identityBack": {},
        "identityFront": {},
        "seal": {}
      }
    }
  },
  beforeMount(){
    this.init();
  },
  methods: {
    init(){
      this.getAuthinfo();
    },
    getAuthinfo(){
      getAuthinfo().then(res => {
          const {code, data} = res;
          if(code === 0 ){
            this.companyInfo = {
              address: data.address || '',
              comId:  data.comId || 0,
              image: data.image || 0,
              name: data.name || '',
              status: data.status || 0,
              auth: data.auth,
              tel: data.tel || ''
            }
            for(let authItem  of data.authList){  
              this.authList[authItem.field] = authItem;
            }
            console.log(data.authList);
            this.loading = false;
          }else{
            this.$message.error('获取认证信息失败！！！');
          }
      });
    },
    //上传证件图片
    uploadAuthentication(content){
      //获取字段名
      const field = content.action;
      //上传
      uploadFile(content.file, 'company/auth').then(res => {
          if(res.code === 0){
            this.authSaveForm[field] = res.data.filepath;
          }else{
            this.$message.error('上传证件失败');
          }
      });
      //预览
      const reader = new FileReader()
      reader.onload = (e) => {
        //做预览
        let result
        if (typeof e.target.result === 'object') {
          result = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          result = e.target.result;
        }
        this.authList[field].value = result;
      }
      reader.readAsDataURL(content.file);
    },
    //保存
    saveAuthForm(){
      //保存审核图片部分、保存基础内容部分
      const authData = [];
      for(let field in this.authSaveForm){
          var value = this.authSaveForm[field];
          if(value){
            authData.push({
              field,
              value
            });
          }
      }
      Promise.all([updateCompany({
         tel: this.companyInfo.tel,
         address: this.companyInfo.address,
         name: this.companyInfo.name
       }), saveAuth(authData)]).then(res => {
        if(res.code === 0){
          this.$message.success('操作成功！！！');
          this.init();
        }else{
          this.$message.error('操作失败！！！');
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index-content-area.scss';
.page-content-area {
  > div {
    &.company-info {
      padding: 0.5em 0;
      > div {
        // 认证图片部分
        &.authentication-img-area {
          > div{
            &.title {
              font-size: 14px;
              line-height: 2em;
              color: #333;
              margin-bottom: 1em;
              > span{
                color: red;
              }
            }
            &.el-row{
              > .el-col{
                .row-title{
                  text-align: center;
                }
                .row-image{
                  width: 260px;
                  margin: 1em auto;
                  height: 330px;
                  outline: 1px dashed #aaa;
                  text-align: center;
                  border-radius: 4px;
                  overflow: hidden;
                  > img{
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    display: block;
                  }
                }
                .row-handlebar{
                  width: 100%;
                  text-align: center;
                }  
              }
            }  
          }
        }
      }
    }
  }
}
</style>
