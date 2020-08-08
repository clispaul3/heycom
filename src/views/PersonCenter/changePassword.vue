<!-- 修改密码 -->
<template>
  <div v-loading="loading">
    <h3 class="title">修改密码</h3>
    <el-card>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="80px"
        label-position="left"
        style="width: 400px">
        <el-form-item
          label="原密码"
          prop="oldPwd">
          <el-input v-model="ruleForm.oldPwd" type="password" placeholder="原密码"/>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPwd">
          <el-input v-model="ruleForm.newPwd" type="password" placeholder="设置新密码"/>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPassword">
          <el-input v-model="ruleForm.confirmPassword" type="password" placeholder="确认新密码"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%;" @click="save">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { adminUsersResetPassword } from '@/api/personCenter/personCenter'
import { removeAuth } from '@/utils/auth'
export default {
  name: 'EditPassword', // 编辑个人密码
  components: {},
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        if (this.ruleForm.confirmPassword !== '') {
          this.$refs.ruleForm.validateField('confirmPassword')
        }
        callback()
      }
    }
    const validateCheckPass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else if (value !== this.ruleForm.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      rules: {
        oldPwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, trigger: 'blur', validator: validatePass }
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', validator: validateCheckPass }
        ]
      },
      ruleForm: {
        oldPwd: '',
        newPwd: '',
        confirmPassword: ''
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  // watch: {
  //   show: {
  //     handler(val) {
  //       this.showDialog = val
  //       this.ruleForm.id = this.userInfo.id
  //     },
  //     deep: true,
  //     immediate: true
  //   }
  // },
  mounted() {},
  methods: {
    save() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          adminUsersResetPassword(this.ruleForm)
            .then(res => {
              this.loading = false
              removeAuth().then(() => {
                this.$confirm('修改成功, 请重新登录', '提示', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  type: 'warning'
                })
                .then(() => {
                  this.$router.push('/login')
                })
                .catch(() => {})
              })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  font-weight: normal;
  margin-bottom: 10px;
  font-size: 18px;
}
</style>
