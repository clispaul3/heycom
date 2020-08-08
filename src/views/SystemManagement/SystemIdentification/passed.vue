<template>
  <div class="page-content-area">
    <div class="title-status-bar">
      <h3>认证状态</h3>
      <span active="success">已通过</span>
    </div>
    <div class="notify-bar">
      <div>
        <!-- <span>提示：</span>请如实填写以下信息和上传真实图片，用于电信运营商服务开通审核，以下信息皆为必填项 -->
      </div>
    </div>
    <div class="company-info">
      <el-row :gutter="10">
        <el-col :span="12">
          <label for="company-name">公司名称：</label>
          <span>{{companyInfo.name}}</span>
        </el-col>
        <el-col :span="12">
          <label for="company-name">公司电话：</label>
          <span>{{companyInfo.tel}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <label for="company-name">公司地址：</label>
          <div style="width: calc(50% + 20.5em);display: inline-block;">{{companyInfo.address}}</div>
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
          </el-col>
          <el-col :lg="6" :md="12">
            <div class="row-title">法人代表身份证人像面</div>
            <div class="row-image">
              <img :src="authList && authList.identityFront && authList.identityFront.value">
            </div>
          </el-col>
          <el-col :lg="6" :md="12">
            <div class="row-title">法人代表身份证国徽面</div>
            <div class="row-image"><img :src="authList && authList.identityBack && authList.identityBack.value"></div>
          </el-col>
          <el-col :lg="6" :md="12">
            <div class="row-title">客户沟通话术（盖章）</div>
            <div class="row-image"><img  :src="authList && authList.seal && authList.seal.value"></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import {getAuthinfo} from '@/api/systemManagement/company'

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
                color: #666;
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
