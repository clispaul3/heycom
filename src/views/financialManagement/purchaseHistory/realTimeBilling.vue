<!-- 实时账单 -->
<template>
  <div v-loading="loading" class="main-container">
    <h3 class="title">实时账单</h3>
    <el-card>
      <div class="realTime-title">
        本月实时消费：
        <span>￥{{ currentMounthBill }}</span>
      </div>
      <el-divider></el-divider>
      <filtrate-handle-view class="filtrate-bar" module-type="customer" @change="searchClick">
        <span slot="title" style="margin-right: 10px">本月账单明细</span>
        <el-button type="primary" style="float: right; display: none">导出</el-button>
      </filtrate-handle-view>
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
        @selection-change="handleSelectionChange"
      >
        <!--<el-table-column show-overflow-tooltip type="selection" align="center" width="55" />-->
        <el-table-column
          v-for="(item, index) in fieldList"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :sortable="true"
          show-overflow-tooltip
        ></el-table-column>
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
  </div>
</template>

<script>
import base from '@/views/businessIntelligence/mixins/base'
import table from '@/views/customermanagement/mixins/table'
import { queryCostByCurrentMonth } from '@/api/financeManagement'
export default {
  mixins: [base, table],
  data() {
    return {
      loading: false,
      crmType: 'spend',
      // 实际开发在table.js中配置
      list: [],
      // 实际开发在table.js中配置
      fieldList: [
        {
          prop: 'callStarttime',
          label: '通话时间',
          width: ''
        },
        {
          prop: 'userName',
          label: '主叫人姓名',
          width: ''
        },
        {
          prop: 'caller',
          label: '主叫号码',
          width: ''
        },
        {
          prop: 'callee',
          label: '被叫号码',
          width: ''
        },
        {
          prop: 'callDurationFormat',
          label: '通话时长',
          width: ''
        },
        {
          prop: 'billDurationFormat',
          label: '计费时长',
          width: ''
        },
        {
          prop: 'realBill',
          label: '账单金额',
          width: ''
        }
      ],
      deptId: '1',
      userId: '',
      currentMounthBill: ''
    }
  },

  created() {},

  mounted() {
    this.costByCurrentMonth()
  },

  methods: {
    searchClick(params) {
      this.deptId = params.deptId
      this.userId = params.userId
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
    // 本月实时消费
    costByCurrentMonth() {
      queryCostByCurrentMonth().then(res => {
        if (res.code === 0) {
          this.currentMounthBill = res.data.bill
        } else {
          this.$message.error('请求失败')
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
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
  color: #333;
}
</style>
