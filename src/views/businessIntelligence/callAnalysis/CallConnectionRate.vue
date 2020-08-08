<template>
  <div v-loading="loading">
    <filtrate-handle-view
      :show-custom-select="true"
      :show-year-select="true"
      :custom-default="showType"
      :custom-options="[{name:'折线图', value: 'line'},{name:'柱状图', value: 'bar'}]"
      class="filtrate-bar"
      module-type="customer"
      @load="loading=true"
      @change="searchClick"
      @typeChange="showTypeChange"
    />
    <div class="main-container">
      <div class="content">
        <h4 class="axis-title">
          接通率
          <el-tooltip class="item" effect="dark" content="接通率：通话总次数/拨号总次数*100%" placement="top">
            <img src="@/assets/img/question_icon.png" style="width: 20px; height: 20px">
          </el-tooltip>
        </h4>
        <div class="axis-content">
          <div id="axismain" />
        </div>
        <div class="table-content">
          <el-table :data="list" highlight-current-row>
            <el-table-column
              v-for="(item, index) in fieldList"
              :key="index"
              :prop="item.field"
              :label="item.name"
              :sortable="true"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import base from '../mixins/base'
import echarts from 'echarts'
import {
  queryCallChart,
  queryCallChartDetail
} from '@/api/businessIntelligence/calling'
import Lockr from 'lockr'
export default {
  /** 通话分析 */
  name: 'CustomerConversionStatistics',
  mixins: [base],
  data() {
    return {
      loading: false,
      showType: 'line',

      axisOption: null,
      axisChart: null,

      postParams: {}, // 筛选参数
      list: [],
      fieldList: [
        {
          field: 'username',
          name: '员工姓名'
        },
        {
          field: 'callTotal',
          name: '拨打总次数'
        },
        {
          field: 'onCallNum',
          name: '通话总次数'
        },
        {
          field: 'onRatio',
          name: '接通率'
        }
      ],
      currentPage: 1,
      pageSize: Lockr.get('crmPageSizes') || 15,
      pageSizes: [5, 10, 15, 20],
      total: 0
    }
  },
  computed: {},
  mounted() {
    this.initAxis()
  },
  methods: {
    showTypeChange(type) {
      this.showType = type
      this.refreshChartInfo()
    },
    /**
     * 搜索点击
     */
    searchClick(params) {
      this.postParams = { ...params, action: 'on' }
      this.getDataList()
      this.getRecordList()
    },
    refreshChartInfo() {
      this.axisOption.series[0].type = this.showType
      this.axisChart.setOption(this.axisOption, true)
    },
    /**
     * 获取数据
     */
    getDataList() {
      this.loading = true
      queryCallChart(this.postParams)
        .then(res => {
          this.loading = false
          const axisList = res.data.chart || []
          const xAxis = []
          const seriesData = []
          axisList.forEach((element, index) => {
            xAxis.push(element.type)
            seriesData.push(element.ratio)
          })

          // 图形赋值
          this.axisOption.xAxis[0].data = xAxis
          this.axisOption.series[0].data = seriesData
          this.refreshChartInfo()
        })
        .catch(() => {
          this.loading = false
        })
    },
    /**
     * 获取相关列表
     */
    getRecordList(dataIndex) {
      this.list = []
      const page = { page: this.currentPage, limit: this.pageSize }
      let params = {}
      if (typeof dataIndex !== 'undefined') {
        // const dataItem = this.axisList[dataIndex]
        params.userId = this.postParams.userId
        params.deptId = this.postParams.deptId
        params.startTime = dataIndex
        // params.startTime = dataItem.startTime
        // params.endTime = dataItem.endTime
      } else {
        params = this.postParams
      }
      let resultParams = Object.assign(page, params)
      this.loading = true
      queryCallChartDetail(resultParams)
        .then(res => {
          this.loading = false
          this.list = res.data.list
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 柱状图 */
    initAxis() {
      this.axisChart = echarts.init(document.getElementById('axismain'))
      this.axisChart.on('click', params => {
        console.log(params)
        // this.getRecordList(params.dataIndex)
        // this.getRecordList(params.name)
      })
      this.axisOption = {
        color: ['#6ca2ff'],
        tooltip: {
          trigger: 'axis',
          formatter: '{b} <br/> 接通率 : {c}% ',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          itemWidth: 14,
          itemHeight: 2,
          data: [
            {
              name: '接通率',
              // 设置文本为红色
              textStyle: {
                color: '#6ca2ff'
              }
            }
          ],
          icon: 'rect',
          bottom: '5px'
        },
        grid: {
          top: '40px',
          left: '10px',
          right: '50px',
          bottom: '40px',
          containLabel: true,
          borderColor: '#fff'
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true,
              boundaryGap: true
            },
            axisLabel: {
              color: '#BDBDBD'
            },
            /** 坐标轴轴线相关设置 */
            axisLine: {
              lineStyle: { color: '#BDBDBD' }
            },
            splitLine: {
              show: false
            },
            // 两边留白策略
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisTick: {
              alignWithLabel: true,
              lineStyle: { width: 0 }
            },
            axisLabel: {
              color: '#BDBDBD',
              formatter: '{value}%'
            },
            /** 坐标轴轴线相关设置 */
            axisLine: {
              show: false,
              lineStyle: { color: '#BDBDBD' }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#ccc',
                type: 'dashed'
              }
            }
          }
        ],
        series: [
          {
            name: '接通率',
            type: this.showType,
            barWidth: 15,
            data: []
          }
        ]
      }
    },
    // 更改每页展示数量
    handleSizeChange(val) {
      Lockr.set('crmPageSizes', val)
      this.pageSize = val
      this.getRecordList()
    },
    // 更改当前页数
    handleCurrentChange(val) {
      this.currentPage = val
      this.getRecordList()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../styles/detail.scss';
/deep/ .el-table thead th.is-leaf,
.el-table td {
  background-color: #fafafa;
  color: #333;
}
</style>
