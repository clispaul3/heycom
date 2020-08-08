<template>
  <div class="navbar">
    <img
      :src="logo"
      class="logo" >
    <div class="nav-items-container">
      <flexbox style="width: auto;">
        <router-link
          v-for="(item, index) in items"
          :style="{ 'color' : item.type == navIndexChild ? '#3E84E9' : '#333333' }"
          :to="item.path"
          :key="index"
          class="nav-item"
          @click.native="navItemsClick(item.type)">
          <i
            :class="'wukong-' + item.icon"
            :style="{ 'color': item.type == navIndexChild ? '#3E84E9' : '#333333'}"
            class="wukong"
            style="margin-right: 10px;"/>
          <div class="nav-item-title">{{ item.title }}</div>
        </router-link>
      </flexbox>
    </div>
    <el-popover
      placement="bottom"
      width="100"
      popper-class="mini-paograms"
      trigger="hover">
      <span>微信扫一扫</span>
      <img src="@/assets/img/miniPrograms-img.jpg" style="width: 100px; margin-bottom: 10px; margin-top: 10px;" alt />
      <el-link :underline="false" type="primary" style="display:block;color: #409eff" @click="downMiniProgrames">下载二维码</el-link>
      <el-link slot="reference" :underline="false" class="hanlder-miniPrograms" style="margin-right: 30px;"><img src="@/assets/img/miniPrograms-icon.svg" style="margin-right: 6px;" alt /><span>小程序</span></el-link>
    </el-popover>
    <el-popover
      :visible-arrow="false"
      placement="bottom"
      popper-class="no-padding-popover"
      width="200"
      trigger="hover">
      <div class="handel-items">
        <div
          class="handel-item"
          @click="handleClick('person')"><i class="wukong wukong-personcenter"/>个人设置</div>
        <div
          v-if="manage"
          class="handel-item"
          @click="enterSystemSet()"><i class="wukong wukong-product"/>企业管理</div>
        <div
          class="handel-item"
          @click="handleClick('goout')"><i class="wukong wukong-goout"/>退出登录</div>
        <!-- <div
          :style="{'margin-bottom': manage ? '15px' : '0'}"
          class="handel-item hr-top"
          style="pointer-events: none;"><i class="wukong wukong-versions"/>版本 V1.0.0.200524</div>
        <div
          v-if="manage"
          class="handel-box">
          <el-button
            type="primary"
            class="handel-button"
            @click="enterSystemSet()">企业管理</el-button>
        </div> -->
      </div>
      <div
        slot="reference"
        class="user-container">
        <div
          v-photo="userInfo"
          v-lazy:background-image="$options.filters.filterUserLazyImg(userInfo.img)"
          :key="userInfo.img"
          class="user-img div-photo"/>
        <i class="el-icon-caret-bottom mark"/>
      </div>
    </el-popover>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Loading } from 'element-ui'
import { adminGroupsTypeListAPI } from '@/api/systemManagement/RoleAuthorization'
var FileSaver = require('file-saver')

export default {
  filters: {
    langName: function(value) {
      if (value) {
        return { cn: '中文', en: 'English' }[value]
      } else {
        return '中文'
      }
    }
  },
  components: {},
  props: {
    navIndex: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      navIndexChild: 0,
      authRedirect: '',
      miniProgramsImg: require('@/assets/img/miniPrograms-img.jpg')
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'lang',
      'logo',
      'home',
      'crm',
      'bi',
      'manage',
      'finance',
      'service',
      'project'
    ]),
    items() {
      var tempsItems = []
      if (this.home) {
        tempsItems.push({
          title: '首页',
          type: 0,
          path: '/homePage',
          icon: 'workbench'
        })
      }
      if (this.crm) { // 如果后台请求过来的数据有crm，那么就显示
        tempsItems.push({
          title: '客户管理',
          type: 1,
          path: '/crm',
          icon: 'customer'
        })
      }
      if (this.bi) {
        tempsItems.push({
          title: '统计分析',
          type: 2,
          path: '/bi',
          icon: 'statistics'
        })
      }
      if (this.finance) {
        tempsItems.push({
          title: '财务管理',
          type: 3,
          path: '/finance',
          icon: 'money'
        })
      }
      if (this.service) {
        tempsItems.push({
          title: '客服支持',
          type: 4,
          path: '/service',
          icon: 'contacts'
        })
      }
      return tempsItems
    }
  },
  mounted() {
    this.navIndexChild = this.navIndex
    // 如何没有后台权限，并且没有企业信息或查看、没有企业认证或查看、没有员工且查看
    if (
      this.manage &&
      (!this.manage.system || (this.manage.system && !this.manage.system.read)) &&
      (!this.manage.systemSet || (this.manage.systemSet && !this.manage.systemSet.read)) &&
      (!this.manage.users || (this.manage.users && !this.manage.users.read))
    ) {
      console.log('准备获取角色管理路径');
      this.getAuthPath()
    }
  },
  methods: {
    navItemsClick(type) {
      this.navIndexChild = type
      this.$store.commit('SET_NAVACTIVEINDEX', type)
      this.$emit('nav-items-click', type)
    },
    enterSystemSet() {
      console.log(this.authRedirect);
      this.$router.push({
        path: this.authRedirect || '/manager'
      })
    },
    handleClick(type) {
      if (type === 'goout') {
        this.$confirm('退出登录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            var loading = Loading.service({
              target: document.getElementById('#app')
            })
            this.$store
              .dispatch('LogOut')
              .then(() => {
                location.reload()
                loading.close()
              })
              .catch(() => {
                location.reload()
                loading.close()
              })
          })
          .catch(() => {})
      } else if (type === 'person') {
        this.$router.push({
          name: 'person'
        })
      }
    },
    switchLang(item) {
      this.$store.commit('SET_LANG', item.lang)
      this.langName = item.name
    },
    // 角色管理页面路径
    getAuthPath() {
      adminGroupsTypeListAPI()
        .then(res => {
          if (res.data && res.data.length) {
            const item = res.data[0]
            this.authRedirect = `/manager/role-auth/${item.roleType}/${encodeURI(
              item.name
            )}`
          }
        })
        .catch(() => {})
    },
    downMiniProgrames() {
      FileSaver.saveAs(this.miniProgramsImg, 'HeyecomMiniPrograms.jpg')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.hanlder-miniPrograms {
  /deep/ .el-link--inner {
    display: flex;
    align-items: center;
  }
}
.navbar {
  height: 60px;
  min-height: 60px;
  background-color: white;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 30px;
  .logo {
    width: 150px;
    height: 40px;
    display: block;
    flex-shrink: 0;
    margin-right: 15px;
  }
  .nav-items-container {
    flex: 1;
    display: flex;
    min-width: 500px;
    height: 100%;
    overflow-x: auto;
    line-height: 60px;
    font-size: 15px;
  }

  .user-container {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    cursor: pointer;
    .user-img {
      display: block;
      width: 32px;
      min-width: 32px;
      min-height: 32px;
      height: 32px;
      margin-right: 8px;
      border-radius: 50%;
    }
    .mark {
      font-size: 15px;
      color: #aaaaaa;
    }
  }

  .user-container:hover {
    .mark {
      color: #2486e4;
    }
  }
}

.nav-item {
  padding: 0 30px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.nav-item-img {
  width: 24px;
  height: 24px;
  display: block;
  margin-right: 5px;
}

.handel-items {
  padding: 10px 0 18px 0;
  .handel-item {
    padding: 5px 20px;
    font-size: 14px;
    color: #aaa;
    cursor: pointer;
    i {
      margin-right: 8px;
      font-size: 15px;
    }
  }
  .handel-item:hover {
    background-color: #f7f8fa;
    color: #3e84e9;
  }
  .handel-box {
    padding: 0 15px;
    .handel-button {
      width: 100%;
      border-radius: 4px;
      border-color: #009df0;
      background-color: #009df0;
    }
  }
}
.hr-top {
  margin-top: 8px;
  border-top: 1px solid #f4f4f4;
  padding-top: 3px;
}

.nav-lang {
  cursor: pointer;
  color: #888;
  padding: 20px;
  &:hover {
    color: #3e84e9;
  }
  &.active {
    font-weight: bold;
    color: #3e84e9;
  }
}

.auth-button {
  background: linear-gradient(to right, #d9ac7c, #c28e5c);
  color: white;
  padding: 5px 15px;
  font-size: 12px;
  height: 24px;
  outline: none;
  margin: 0;
  border: none;
  border-radius: 12px;
  transform: scale(0.9);
  margin-right: 15px;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.auth-content {
  text-align: center;
  color: #333;
  padding: 30px 20px;
  .title {
    font-size: 16px;
    font-weight: 600px;
  }
  .detail {
    transform: scale(0.9);
    margin-top: 8px;
    font-size: 12px;
    margin-bottom: 15px;
  }
  .phone {
    background: linear-gradient(to right, #f2dfb2, #e5c78a);
    border-radius: 4px;
    padding: 5px 17px;
    font-size: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.12);
    line-height: 17px;
  }
}
</style>

