<template>
  <flexbox class="page-container" style="height:100%;" direction="column" align="stretch">
    <div class="header">企业认证</div>
    <div v-loading="loading" class="body">
      <component v-bind:is="currentTabComponent"/>
    </div>
  </flexbox>
</template>

<script>
import notCertified from './notCertified';
import notPass from './notPass';
import passed from './passed';
import underReview from './underReview';
import {getAuthinfo} from '@/api/systemManagement/company'
import { parse } from 'semver';
export default {
  components: { notCertified, notPass, passed, underReview },
  name: 'SystemIdentification',
  data(){
    return {
      loading: true,
      currentTabComponent: notCertified
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
          if(code === 0){
            let auth = parseInt(data.auth);
            let useComponent = notCertified;
            if(isNaN(auth)){
              this.$message.error('获取授权信息为空');
            }else{
              //认证状态，0 审核中，1 已通过，2未通过
              switch(auth){
                case 0:
                  useComponent = underReview;
                  break;
                case 1: 
                  useComponent = passed;
                  break;
                case 2: 
                  useComponent = notPass;
                  break;
                default:
                  useComponent = notCertified;
                  break;
              }
            }
            this.currentTabComponent = useComponent;
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
  @import './index.scss';
</style>
