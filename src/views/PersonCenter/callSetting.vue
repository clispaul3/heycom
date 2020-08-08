<!-- 实时账单 -->
<template>
  <div v-loading="loading" class="main-container">
    <h3 class="title">外呼号码设置</h3>
    <el-card>
      <div class="form-wrap">
        <el-input v-model="mobile" placeholder="请输入外呼号码"></el-input>
        <el-select v-model="status" placeholder="审核状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="searchClick">搜索</el-button>
        <el-button type="primary" style="float: right;" v-if="showSave" @click="handelAddPhone">新增外呼号码</el-button>
      </div>
      <!-- 表格 -->
      <el-table
        id="crm-table"
        :data="list"
        :cell-style="cellStyle"
        class="n-table--border"
        highlight-current-row
        style="width: 100%; margin-top: 20px"
        @row-click="handleRowClick"
        @sort-change="sortChange"
        @header-dragend="handleHeaderDragend"
      >
        <!-- <el-table-column
          v-for="(item, index) in fieldList"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>-->
        <el-table-column prop="mobile" label="外呼号码" sortable></el-table-column>
        <el-table-column label="备注名称">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.remark }}</span>
            <i class="el-icon-edit-outline" v-if="showUpdate" style="color: #659ded; cursor: pointer;" @click="handleEdit(scope.row)"></i>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.status===0" style="color: #909399">未通过</span>
            <span v-if="scope.row.status===1" style="color: #67C23A">已通过</span>
            <span v-if="scope.row.status===2" style="color: #F56C6C">待审核</span>
          </template>
        </el-table-column>
        <el-table-column label="默认外呼号" sortable>
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.row.default" :disabled="scope.row.status===1 ? false : true" @change.native="getCurrentRow(scope.row)">
              是
            </el-radio>
            <!-- <el-radio v-model="radio" :label="scope.$index" v-if="scope.row.default===1">是</el-radio>
            <el-radio v-model="radio" :label="scope.$index" v-if="scope.row.default===0">否</el-radio> -->
          </template>
        </el-table-column>
        <el-table-column label="添加时间" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | filterTimestampToFormatTime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="showDelete" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="scope.row.type !== 1" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="p-contianer">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size.sync="pageSize"
          :total="total"
          class="p-bar"
          background
          layout="total, prev, pager, next, sizes, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增外呼号码 -->
    <el-dialog title="新增外呼号码(添加后请通知管理员审核)" :visible.sync="dialogFormVisible">
      <el-form ref="addForm" :model="addForm" :rules="addRules" class="form-wrap">
        <el-form-item label="外呼号码：" prop="mobile" :label-width="formLabelWidth">
          <el-input v-model="addForm.mobile" autocomplete="off" placeholder="请输入外呼号码"></el-input>
        </el-form-item>
        <el-form-item label="验证码：" prop="code" :label-width="formLabelWidth" class="phone-code">
          <el-input v-model="addForm.code" placeholder="手机验证码"></el-input>
          <!-- 验证码倒计时 -->
          <countDown :moblieValue="addForm.mobile" @sendCode="getCode" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmAdd()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增号码达到上限提醒 -->
    <el-dialog
      title="新增外呼号码已达上限"
      :visible.sync="dialogVisible"
      width="30%">
      <span>每用户只能新增10个外呼号码（不含注册手机号），您可删除不用的号码后再新增</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">我知道了</el-button>
      </span>
    </el-dialog>
    <!-- 修改备注 -->
    <el-dialog
      title="修改备注名称"
      :visible.sync="dialogEditVisible"
      width="30%">
      <el-form ref="editForm" :model="editForm" :rules="editRules" class="form-wrap">
        <el-form-item label="备注名称：" prop="remark" :label-width="formLabelWidth">
          <el-input v-model="editForm.remark" autocomplete="off" placeholder="请输入备注名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmEdit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import base from '@/views/businessIntelligence/mixins/base'
import table from '@/views/customermanagement/mixins/table'
import CountDown from '@/views/login/countDown'
import { regexIsNumber } from '@/utils'
import { sendCode } from '@/api/login'
import { addPhone, updatePhone, deletePhone } from '@/api/customermanagement/call'
import { mapGetters } from 'vuex'
export default {
  mixins: [base, table],
  components: {
    CountDown
  },
  data() {
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
    const validateRemark = (rule, value, callback) => {
      if (value.length > 10) {
        callback(new Error('限制输入10个汉字内'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      crmType: 'callSetting',
      mobile: '',
      radio: 1,
      options: [
        {
          value: '',
          label: '全部'
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
      status: '',
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialogVisible: false,
      dialogEditVisible: false,
      addForm: {
        mobile: '',
        code: ''
      },
      addRules: {
        mobile: [
          { required: true, trigger: 'blur', validator: validateMobile }
        ],
        code: [
          { required: true, trigger: 'blur', validator: validateCode }
        ]
      },
      editForm: {
        id: '',
        remark: '',
        default: ''
      },
      editRules: {
        remark: [
          { trigger: 'blur', validator: validateRemark }
        ]
      }
    }
  },

  created() {},

  mounted() {
    // this.costByCurrentMonth()
  },

  computed: {
    ...mapGetters(['crm']),
    // 展示新增
    showSave() {
      return this.crm.call.save
    },
    // 展示删除
    showDelete() {
      return this.crm.call.delete
    },
    // 展示编辑
    showUpdate() {
      return this.crm.call.update
    }
  },

  methods: {
    searchClick() {
      this.getList()
    },
    /** 通过回调控制style */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'leadsName') {
        return { color: '#3E84E9', cursor: 'pointer' }
      } else {
        return ''
      }
    },
    handelAddPhone() {
      if (this.list.length > 10) {
        this.dialogVisible = true
      } else {
        this.dialogFormVisible = true
      }
    },
    comfirmAdd() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addPhone(this.addForm).then(res => {
            if (res.code === 0) {
              this.$message.success('添加成功！')
              this.getList()
            } else {
              this.$message.error('添加失败！')
            }
            this.dialogFormVisible = false
          })
        } else {
          return false
        }
      })
    },
    // 获取验证码
    getCode() {
      sendCode(this.addForm.mobile, 'identity').then(res => {
        if (res.code === 0) {
          this.$message.success('发送成功！')
        } else {
          this.$message.error('发送失败')
        }
      })
    },
    handleEdit(row) {
      this.dialogEditVisible = true
      this.editForm.id = row.id
      this.editForm.remark = row.remark
      this.editForm.default = row.default
    },
    comfirmEdit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updatePhone(this.editForm).then(res => {
            if (res.code === 0) {
              this.$message.success('添加成功！')
              this.getList()
            } else {
              this.$message.error('添加失败！')
            }
            this.dialogEditVisible = false
          })
        } else {
          return false
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.type === 1) {
          this.$message.error('不能删除默认号码！')
        } else {
          deletePhone({id: row.id}).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })       
      })
    },
    getCurrentRow(row) {
      if (row.status !== 1) {
        this.$message.error('只有审核通过的手机号才能设置为默认外呼号码')
        return
      }
      this.editForm.id = row.id
      this.editForm.remark = row.remark
      this.editForm.default = 1

      updatePhone(this.editForm).then(res => {
        if (res.code === 0) {
          this.$message.success('修改成功！')
          // this.getList()
          // window.reload()
        } else {
          this.$message.error('修改失败！')
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
/deep/ .el-input {
  width: 200px;
}
/deep/ .el-select {
  margin-left: 10px;
  margin-right: 10px;
}
.form-wrap /deep/ .el-form-item {
  width: 320px;
}
.p-contianer {
  display: none;
}
.phone-code {
  position: relative;
  /deep/ .el-input__inner {
    padding-right: 90px;
  }
}
.title {
  font-weight: normal;
  margin-bottom: 10px;
  font-size: 18px;
}
.realTime-title {
  margin-top: 20px;
}
.filtrate-content {
  padding: 0;
}
/deep/ .el-table thead th.is-leaf,
.el-table td {
  background-color: #fafafa;
  font-weight: bold;
  color: #333;
}
</style>
