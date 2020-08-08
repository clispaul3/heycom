<!-- X月账单明细 -->
<template>
  <div v-loading="loading" class="main-container">
    <h3 class="title">{{ getMonth }}月账单明细</h3>
    <el-card>
      <div class="realTime-title">
        <div>
          {{ getMonth }}月账单金额：
          <span>￥{{ totalBill }}</span>
        </div>
        <div>
          总通话时长：
          <span>{{ totalCallDurationFormat }}</span>
        </div>
        <div>
          总通话费用：
          <span>￥{{ totalCallDuration }}</span>
        </div>
        <div>
          注：
          <span>月最低消费是￥{{ minCost }}</span>
        </div>
      </div>
      <el-divider></el-divider>
      <filtrate-handle-view class="filtrate-bar" module-type="customer" @change="searchClick">
        <span slot="title" style="margin-right: 10px">{{ getMonth }}月账单明细</span>
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
import { costCurrentMonth } from '@/api/financeManagement'
export default {
  mixins: [base, table],
  data() {
    return {
      loading: false,
      crmType: 'callDetail',
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
      date: '',
      totalBill: '',
      totalCallDuration: '',
      minCost: '',
      isMinCost: '',
      totalCallDurationFormat: ''
    }
  },

  computed: {
    getMonth: function() {
      return this.date.split('-')[1]
    }
  },

  created() {
    this.date = this.$route.params.date
  },

  mounted() {
    this.getCostCurrentMonth()
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
    // 统计信息
    getCostCurrentMonth() {
      costCurrentMonth({ date: this.date }).then(res => {
        if (res.code === 0) {
          const {
            totalBill,
            totalCallDuration,
            minCost,
            isMinCost,
            totalCallDurationFormat
          } = res.data
          this.totalBill = totalBill
          this.totalCallDuration = totalCallDuration
          this.minCost = minCost
          this.isMinCost = isMinCost
          this.totalCallDurationFormat = totalCallDurationFormat
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
  display: flex;
  margin-top: 20px;
  > div {
    margin-right: 60px;
  }
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
