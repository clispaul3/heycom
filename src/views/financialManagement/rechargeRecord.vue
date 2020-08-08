<!-- 历史账单 -->
<template>
  <div v-loading="loading" class="main-container">
    <h3 class="title">充值记录</h3>
    <el-card>
      <filtrate-handle-view
        :show-user-select="false"
        :show-dep-select="false"
        :show-date-range="true"
        value-format="yyyy-MM-dd"
        class="filtrate-bar"
        module-type="customer"
        @change="searchClick"
      >
        <span slot="title" style="margin-right: 10px">选择时间范围</span>
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
        <!-- <el-table-column show-overflow-tooltip type="selection" align="center" width="55" /> -->
        <el-table-column label="充值时间" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.createdAt | filterTimestampToFormatTime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in fieldList"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          sortable="custom"
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
export default {
  mixins: [base, table],
  data() {
    return {
      loading: false,
      crmType: 'chargeRecord',
      startDate: '',
      endDate: '',
      fieldList: [
        {
          prop: 'detailNo',
          label: '充值单号',
          width: ''
        },
        {
          prop: 'eventFormat',
          label: '充值方式',
          width: ''
        },
        {
          prop: 'amount',
          label: '充值金额',
          width: ''
        },
        {
          prop: 'note',
          label: '备注',
          width: ''
        }
      ]
    }
  },

  created() {},

  mounted() {},

  methods: {
    searchClick(params) {
      this.startDate = params.dateRange[0]
      this.endDate = params.dateRange[1]
      this.getList()
    },
    /** 通过回调控制style */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'leadsName') {
        return { color: '#3E84E9', cursor: 'pointer' }
      } else {
        return ''
      }
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
