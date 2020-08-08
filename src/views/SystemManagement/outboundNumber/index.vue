<template>
  <flexbox class="page-container" style="height:100%;" direction="column" align="stretch">
    <div class="header">{{status === 0?'待审外呼号码':'全部外呼号码'}}</div>
    <div v-loading="loading" class="body">
      <el-row class="list-search-condition">
        <el-col>
          <el-input placeholder="请输入姓名/外呼号码" v-model="condition.search" @change="reGetList">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
        <el-col>
          <el-select v-model="condition.deptId" placeholder="全部部门" @change="reGetList">
            <el-option key="-1" label="全部部门" value="0"></el-option>
            <el-option
              v-for="item in deptList"
              :key="item.value"
              :label="item.name"
              :value="item.deptId"
            ></el-option>
          </el-select>
        </el-col>
        <el-col v-if="status === 1">
          <el-select v-model="examineStatus" @change="selectStatus" placeholder="审核状态">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col v-if="status === 1" style="float: right; text-align: right; padding-right: 0">
          <el-button type="primary" @click="addCall">新增外呼号码</el-button>
        </el-col>
      </el-row>
      <el-row class="list-handle-bar">
        <span>
          已选中
          <font color="primary">{{checkboxSelection.length}}</font>项
        </span>
        <el-button type="text" @click="passReviewed">
          <i class="el-icon-check"></i>通过
        </el-button>
        <el-button type="text" @click="unPassReviewed">
          <i class="el-icon-close"></i>不通过
        </el-button>
        <el-button type="text" v-if="status === 1" @click="deleteCall">
          <i class="el-icon-delete"></i>删除
        </el-button>
      </el-row>
      <el-row class="list-body">
        <el-table
          ref="multipleTable"
          :data="list"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleCheckboxChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="userName" label="姓名" sortable></el-table-column>
          <el-table-column prop="mainMobile" label="注册手机" width="150" sortable></el-table-column>
          <el-table-column prop="dept" label="部门" sortable></el-table-column>
          <el-table-column prop="post" label="岗位" sortable></el-table-column>
          <el-table-column v-if="status === 1" prop="mobile" label="外呼号码" sortable></el-table-column>
          <el-table-column v-if="status === 1" prop="statusFormat" label="审核状态" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.status===0" style="color: #909399">未通过</span>
              <span v-if="scope.row.status===1" style="color: #67C23A">已通过</span>
              <span v-if="scope.row.status===2" style="color: #F56C6C">待审核</span>
            </template>
          </el-table-column>
          <el-table-column v-if="status === 0" prop="mobile" label="待审外呼号码" width="150" sortable></el-table-column>
          <el-table-column
            label="添加时间"
            prop="createTime"
            width="150"
            sortable
            header-align="center"
            :formatter="formatDate"
          />
        </el-table>
      </el-row>
      <el-row class="pagination-area">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @prev-click="handlePreClick"
          @next-click="handleNextClick"
          :current-page="pageNow"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="pageSize"
          layout="total, prev, pager, next, sizes, jumper"
          :total="pageCount"
        ></el-pagination>
      </el-row>
    </div>
    <!-- 新增外呼号码 -->
    <el-dialog title="新增外呼号码(新增成功即默认审核通过)" :visible.sync="dialogFormVisible" @open="openAddForm">
      <el-form ref="addForm" :model="addForm" :rules="addRules" class="form-wrap">
        <el-input type="hidden" v-model="addForm.userId" autocomplete="off" style="height: 0"></el-input>
        <el-form-item label="选择员工：" prop="userId" :label-width="formLabelWidth">
          <xh-user-cell :value="user" @value-change="userSelect" />
        </el-form-item>
        <el-form-item label="外呼号码：" prop="mobile" :label-width="formLabelWidth">
          <el-input v-model="addForm.mobile" autocomplete="off" placeholder="请输入外呼号码"></el-input>
        </el-form-item>
        <el-form-item label="验证码：" prop="code" :label-width="formLabelWidth" class="phone-code">
          <el-input v-model="addForm.code" placeholder="手机验证码"></el-input>
          <!-- 验证码倒计时 -->
          <countDown :moblie-value="addForm.mobile" :if-reset="ifReset" @sendCode="getCode" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmAdd()">确 定</el-button>
      </div>
    </el-dialog>
  </flexbox>
</template>

<script>
import {
  getPhoneList as getList,
  checkUserPhone,
  addUserPhone,
  deleteUserPhone
} from '@/api/systemManagement/OutboundNumber'
import { adminStructuresSubIndex } from '@/api/common'
import { sendCode } from '@/api/login'
import { XhUserCell } from '@/components/CreateCom'
import CountDown from '@/views/login/countDown'
import { regexIsNumber } from '@/utils'
export default {
  components: {
    XhUserCell,
    CountDown
  },
  name: 'SystemIdentification',
  data() {
    const validateUser = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error('员工不能为空'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error('手机号不能为空'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (regexIsNumber(value) && value.length === 4) {
        callback()
      } else {
        callback(new Error('验证码必须为4数字'))
      }
    }
    return {
      loading: true,
      pageSize: 100,
      pageCount: 0,
      pageNow: 1,
      pageNumber: 1,
      list: [],
      // 负责人弹出框
      user: [],
      dialogFormVisible: false,
      addForm: {
        userId: '',
        mobile: '',
        code: ''
      },
      addRules: {
        userId: [{ required: true, trigger: 'blur', validator: validateUser }],
        mobile: [
          { required: true, trigger: 'blur', validator: validateMobile }
        ],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      formLabelWidth: '120px',
      options: [
        {
          value: null,
          label: '审核状态'
        },
        {
          value: '2',
          label: '待审核'
        },
        {
          value: '1',
          label: '已通过'
        },
        {
          value: '0',
          label: '未通过'
        }
      ],
      examineStatus: '',
      condition: {
        status: null,
        search: null,
        deptId: null
      },
      deptList: [],
      checkboxSelection: [],
      ifReset: false
    }
  },
  computed: {},
  watch: {
    $route(to, from) {
      this.initPage()
    }
  },
  beforeMount() {
    this.initPage()
  },

  methods: {
    initPage() {
      //设置页面状态(如果是1那么就是列表页，如果是0，那么就是未审核页面)
      let status = parseInt(
        this.$route.path.replace(/^.*?\/index\/(\d)$/i, '$1')
      )
      this.status = isNaN(status) ? 0 : status

      this.getList().then(res => {
        this.loading = false
      })
      this.getDepList()
    },
    //时间戳转换
    formatDate(row, { property }) {
      let val = parseInt(row[property])
      if (!isNaN(val)) {
        let date = new Date(val)
        let Y = date.getFullYear() + '-'
        let M =
          date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1) + '-'
            : date.getMonth() + 1 + '-'
        let D =
          date.getDate() < 10
            ? '0' + date.getDate() + ' '
            : date.getDate() + ' '
        let h =
          date.getHours() < 10
            ? '0' + date.getHours() + ':'
            : date.getHours() + ':'
        let m =
          date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        let s =
          ':' + date.getSeconds() < 10
            ? '0' + date.getSeconds()
            : date.getSeconds()
        return Y + M + D + h + m
      } else {
        return ''
      }
    },
    //获取展示列表
    getList(condition = null) {
      return new Promise((resolve, reject) => {
        let where = {}
        //status 0未审核 ，1审核 ，没有就是获取所有
        if (this.status === 0) {
          where.status = 2
        }
        getList({
          page: this.pageNow,
          limit: this.pageSize,
          ...where,
          ...condition
        })
          .then(res => {
            if (res.code === 0) {
              const { pageSize, totalRow, list, pageNumber } = res.data
              this.pageSize = pageSize
              this.pageNow = pageNumber
              this.pageCount = totalRow
              this.list = list
            } else {
              this.$message.error('请求列表失败！！！')
            }
            resolve(res)
          })
          .catch(err => {
            this.$message.error('系统错误！！！')
            reject(err)
          })
      })
    },
    //重新获取列表
    reGetList() {
      const condition = {}
      let { search, deptId } = this.condition
      if (search) {
        condition.search = search
      }
      deptId = parseInt(deptId)
      if (!isNaN(deptId) && deptId > 0) {
        condition.deptId = deptId
      }
      this.getList(condition)
    },
    //获取部门列表
    getDepList() {
      adminStructuresSubIndex().then(res => {
        const { code, data } = res
        if (code === 0) {
          this.deptList = data.dept
        } else {
          this.$message.error('获取部门失败！！！')
        }
      })
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.reGetList()
    },
    handleCurrentChange(pageNow) {
      this.pageNow = pageNow
      this.reGetList()
    },
    handlePreClick() {
      if (this.pageNow > 1) {
        this.pageNow--
        this.reGetList()
      }
    },
    handleNextClick() {
      if (this.pageNow < this.pageNumber) {
        this.pageNow++
        this.reGetList()
      }
    },
    //复选框选中
    handleCheckboxChange(val) {
      this.checkboxSelection = val
    },
    //获取选中的id列表
    checkUserPhoneBySelect(status) {
      let msg = ''
      if (status === 0) {
        msg = '不通过'
      } else if (status === 1) {
        msg = '通过'
      } else if (status === 2) {
        msg = '删除'
      }
      const ids = []
      if (this.checkboxSelection.length <= 0) {
        this.$message.warning('没有选中任何数据，无需操作')
        return
      } else {
        this.$confirm(`确定要批量${msg}这些数据吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let item of this.checkboxSelection) {
            if (item.type !== 1) {
              ids.push(item.id)
            }
          }
          if (status === 0 || status === 1) {
            checkUserPhone({
              status,
              ids: ids.join(',')
            }).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '审核成功!'
                })
                this.reGetList()
              } else {
                this.$message({
                  type: 'error',
                  message: '审核失败!'
                })
              }
            })
          } else if (status === 2) {
            deleteUserPhone({
              ids: ids.join(',')
            }).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.reGetList()
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败!'
                })
              }
            })
          }
        })
      }
    },
    //不通过
    unPassReviewed() {
      this.checkUserPhoneBySelect(0)
    },
    //通过审核
    passReviewed() {
      this.checkUserPhoneBySelect(1)
    },
    // 删除外呼号码
    deleteCall() {
      this.checkUserPhoneBySelect(2)
    },
    addCall() {
      this.dialogFormVisible = true
    },
    openAddForm() {
      this.$nextTick(function () {
        this.$refs['addForm'].resetFields()
        this.ifReset = !this.ifReset
      })
    },
    // 审核状态选择
    selectStatus() {
      const condition = {}
      let { search, deptId, status } = this.condition
      if (search) {
        condition.search = search
      }
      if (deptId) {
        condition.deptId = deptId
      }
      status = parseInt(this.examineStatus)
      if (!isNaN(status)) {
        condition.status = status
      }
      this.getList(condition)
    },
    userSelect(data) {
      if (this.list.length > 10) {
        this.$message.error('该员工外呼号已达10个，请删除后新增')
        return
      }
      if (data.value && data.value.length > 0) {
        this.user = data.value
        this.addForm.userId = this.user[0].userId
      } else {
        this.user = []
      }
    },
    // 获取验证码
    getCode() {
      sendCode(this.addForm.mobile, 'identity').then(res => {
        if (res.code === 0) {
          this.$message.success('发送成功！')
          this.getList()
        } else {
          this.$message.error('发送失败')
        }
      })
    },
    // 新增外呼号码
    comfirmAdd() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUserPhone(this.addForm).then(res => {
            if (res.code === 0) {
              this.$message.success('添加成功！')
            } else {
              this.$message.error('添加失败！')
            }
            this.dialogFormVisible = false
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
@import './index.scss';
.form-wrap {
  width: 330px;
}
/deep/ .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}
.page-container {
  > div.body {
    .el-row {
      margin-top: 0.5em;
      &.list-search-condition {
        margin-left: -0.5em;
        .el-col {
          margin-bottom: 0.5em;
          padding: 0 0.5em;
          width: 200px;
        }
      }
      &.list-handle-bar {
        border: 1px solid rgb(145, 213, 255);
        background: rgb(230, 247, 255);
        width: 100%;
        height: 40px;
        border-radius: 0.25em;
        color: #666;
        line-height: 40px;
        padding: 0 1em;
        > span {
          font {
            display: inline-block;
            padding: 0 0.25em;
            color: $primaryColor;
          }
        }
        > button {
          margin-left: 1em;
          color: #666;
          i {
            display: inline-block;
            padding: 0 0.25em;
          }
          &:hover {
            color: $primaryColor;
          }
        }
      }
      &.pagination-area {
        margin-top: 2em;
        text-align: center;
      }
    }
  }
}
</style>
