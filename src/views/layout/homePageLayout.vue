<template>
  <el-container>
    <el-header class="nav-container">
      <navbar :nav-index="0" @nav-items-click="navClick" />
    </el-header>
    <el-main>
      <div class="home-page">
        <!-- 我的通话概况 -->
        <div class="call-overview" v-loading="isTodayMeLoading">
          <flexbox justify="space-between" class="title-wrap">
            <span class="title">我的通话概况</span>
            <change-tabs :today.sync="isTodayMe" />
          </flexbox>
          <el-card>
            <flexbox>
              <div class="user-info">
                <div class="avatar">
                  <img src="@/assets/img/examine_head.png" alt />
                </div>
                <div class="info-content-layout">
                  <p>欢迎您，{{ userBasicInfo.realname }}</p>
                  <p>{{ userBasicInfo.dept }}  {{ userBasicInfo.post }}</p>
                </div>
              </div>
              <div class="data-info">
                <div class="info-content-layout">
                  <p>{{ callInfo.on }}</p>
                  <p>接通/全部</p>
                </div>
                <div class="line"></div>
              </div>
              <div class="data-info">
                <div class="info-content-layout">
                  <p>{{ callInfo.onRatio }}</p>
                  <p>接通率</p>
                </div>
                <div class="line"></div>
              </div>
              <div class="data-info">
                <div class="info-content-layout">
                  <p>{{ callInfo.onCallDuration }}</p>
                  <p>总通话时长</p>
                </div>
                <div class="line"></div>
              </div>
              <div class="data-info">
                <div class="info-content-layout">
                  <p>{{ callInfo.onAverageCallDuration }}</p>
                  <p>平均通话时长</p>
                </div>
                <div class="line"></div>
              </div>
              <div class="data-info">
                <div class="info-content-layout">
                  <p>{{ callInfo.oneMinuteRatio }}</p>
                  <p>1分钟内通话占比</p>
                </div>
                <div class="line"></div>
              </div>
              <div class="data-info">
                <div class="info-content-layout">
                  <p>{{ callInfo.threeMinuteRatio }}</p>
                  <p>3分钟以上通话占比</p>
                </div>
              </div>
            </flexbox>
          </el-card>
        </div>
        <!-- 整体通话概况 -->
        <div v-loading="isTodayAllLoading" class="all-call-overview">
          <flexbox justify="space-between" class="title-wrap">
            <span class="title">整体通话概况</span>
            <change-tabs :today.sync="isTodayAll" />
          </flexbox>
          <flexbox justify="space-between" class="content-wrap">
            <el-card>
              <flexbox class="box1" wrap="wrap" justify="center">
                <div class="info-content-layout">
                  <p>{{ callInfoAuth ? callInfoAll.callTotal : '**' }}</p>
                  <p>拨打总次数</p>
                </div>
                <div class="info-content-layout">
                  <p>{{ callInfoAuth ? callInfoAll.onCallNum : '**' }}</p>
                  <p>通话总次数</p>
                </div>
                <div class="info-content-layout">
                  <p>{{ callInfoAuth ? callInfoAll.onRatio : '**' }}</p>
                  <p>接通率</p>
                </div>
                <div class="info-content-layout">
                  <p>{{ callInfoAuth ? callInfoAll.onCallDurationFormat : '**' }}</p>
                  <p>通话总时长</p>
                </div>
                <div class="info-content-layout">
                  <p>{{ callInfoAuth ? callInfoAll.onAverageCallDuration : '**' }}</p>
                  <p>平均通话时长</p>
                </div>
                <div class="info-content-layout">
                  <p>{{ callInfoAuth ? callInfoAll.oneMinuteRatio : '**' }}</p>
                  <p>1分钟内通话占比</p>
                </div>
              </flexbox>
            </el-card>
            <el-card>
              <flexbox class="box1" wrap="wrap" justify="center">
                <div class="info-content-layout">
                  <p>{{ callInfoAuth ? callInfoAll.threeMinuteRatio : '**' }}</p>
                  <p>3分钟以上通话占比</p>
                </div>
                <div class="info-content-layout">
                  <p>{{ callInfoAuth ? callInfoAll.minCallDurationFormat : '**' }}</p>
                  <p>最短通话时长</p>
                </div>
                <div class="info-content-layout">
                  <p>{{ callInfoAuth ? callInfoAll.maxCallDurationFormat : '**' }}</p>
                  <p>最长通话时长</p>
                </div>
                <div class="info-content-layout">
                  <p>{{ callInfoAuth ? callInfoAll.billDurationTotalFormat : '**' }}</p>
                  <p>通话计费时长</p>
                </div>
                <div class="info-content-layout">
                  <p>{{ callInfoAuth ? callInfoAll.realBillTotal : '**' }}</p>
                  <p>产生话费（元）</p>
                </div>
                <div class="info-content-layout">
                  <p>{{ callInfoAuth ? callInfoAll.amount : '**' }}</p>
                  <p>当前话费余额（元）</p>
                </div>
              </flexbox>
            </el-card>
          </flexbox>
        </div>
        <!-- 整体通话趋势 -->
        <div v-loading="isDataListLoading" v-if="callChartAuth" class="all-call-overview">
          <div class="title-wrap">
            <p class="title">整体通话趋势</p>
            <flexbox justify="space-between">
              <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="接通率" name="first"></el-tab-pane>
                <el-tab-pane label="通话时长" name="second"></el-tab-pane>
                <el-tab-pane label="平均通话时长" name="third"></el-tab-pane>
                <el-tab-pane label="1分钟内通话占比" name="fourth"></el-tab-pane>
                <el-tab-pane label="3分钟以上通话占比" name="five"></el-tab-pane>
              </el-tabs>
              <div class="change-item">
                <time-type-select @change="timeTypeChange" />
              </div>
            </flexbox>
            <div id="callLine" style="height: 380px"></div>
          </div>
        </div>
        <!-- 新手超管向导 -->
        <div v-if="loginUserInfo.roleTypes[0] === 999" class="novice-guide">
          <flexbox class="title-wrap">
            <span class="title">新手超管向导</span>
          </flexbox>
          <el-card>
            <flexbox justify="center">
              <div class="guide-item">
                <div>
                  企业认证
                  <p class="line"></p>
                </div>
                <p class="info">准备营业执照、盖章话术等材料</p>
                <router-link to="/manager/systemidentification" style="color: #3E84E9">前往认证</router-link>
              </div>
              <div class="guide-item">
                <div>
                  部门人员权限设置
                  <p class="line"></p>
                </div>
                <p class="info">新建部门、人员、分配权限</p>
                <router-link to="/manager/employee-dep" style="color: #3E84E9">新建部门</router-link>
              </div>
              <div class="guide-item">
                <div>
                  话费充值
                  <p class="line"></p>
                </div>
                <p class="info">企业认证通过后联系客服充值</p>
                <router-link to="/finance/financialOverview" style="color: #3E84E9">前往充值</router-link>
              </div>
              <div class="guide-item">
                <div>业绩倍增</div>
                <p class="info">大功告成，开始倍增业绩</p>
                <span>投产使用</span>
              </div>
            </flexbox>
          </el-card>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { Navbar } from './components'
import Lockr from 'lockr'
import echarts from 'echarts'
import TimeTypeSelect from '@/components/timeTypeSelect'
import ChangeTabs from '@/components/changeTabs'
import {
  queryCallInfoByMe,
  queryCallInfoByAll,
  queryCallChartByAll
} from '@/api/homePage/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Layout',
  components: {
    Navbar,
    TimeTypeSelect,
    ChangeTabs
  },

  data() {
    return {
      axisOption: {},
      axisChart: {},
      callInfo: {},
      userBasicInfo: {},
      loginUserInfo: '',
      callInfoAll: {},
      activeName: 'first',
      value: '',
      tabName: 'first',
      timeTypeValue: {},
      isTodayMe: true,
      isTodayAll: true,
      isTodayMeLoading: false,
      isTodayAllLoading: false,
      isDataListLoading: false
    }
  },

  computed: {
    ...mapGetters(['crm']),
    callInfoAuth() {
      return this.crm && this.crm.index && this.crm.index.callinfo
    },
    callChartAuth() {
      return this.crm && this.crm.index && this.crm.index.callchart
    }
  },

  watch: {
    isTodayMe: function() {
      if (this.isTodayMe) {
        this.queryCallInfoByMe('today')
      } else {
        this.queryCallInfoByMe('yesterday')
      }
    },
    isTodayAll: function() {
      if (this.isTodayAll) {
        this.queryCallInfoByAll('today')
      } else {
        this.queryCallInfoByAll('yesterday')
      }
    }
  },

  created() {
    this.loginUserInfo = Lockr.get('loginUserInfo')
  },

  mounted() {
    if (this.callChartAuth) {
      this.initCallLine()
      this.getDataList('first')
    }
    this.queryCallInfoByMe()
    this.queryCallInfoByAll()
  },

  methods: {
    navClick(index) {},
    handleClick(tab) {
      let name = tab.name
      this.tabName = name
      this.getDataList(name)
    },
    // 整体通话趋势
    getDataList(name) {
      this.isDataListLoading = true
      let newTimeType
      if (name === 'first') {
        newTimeType = this.timeTypeValue
      } else if (name === 'second') {
        newTimeType = { ...this.timeTypeValue, action: 'totalDuration' }
      } else if (name === 'third') {
        newTimeType = { ...this.timeTypeValue, action: 'averageDuration' }
      } else if (name === 'fourth') {
        newTimeType = { ...this.timeTypeValue, action: 'durationRatio', callDurationCondition: '<=',  callDurationValue: 1 }
      } else if (name === 'five') {
        newTimeType = { ...this.timeTypeValue, action: 'durationRatio', callDurationCondition: '>=',  callDurationValue: 3 }
      }
      queryCallChartByAll(newTimeType).then(res => {
        if (res.code === 0) {
          const axisList = res.data || []
          const xAxis = []
          const seriesData = []
          axisList.forEach((element, index) => {
            xAxis.push(element.type)
            if (name === 'second') {
              seriesData.push(element.callDurationTotal)
            } else if (name === 'third') {
              seriesData.push(element.callDurationAvg)
            } else {
              seriesData.push(element.ratio)
            }
          })

          // 重新赋值
          this.axisOption.xAxis[0].data = xAxis
          this.axisOption.series[0].data = seriesData
          let formatLabel, formatterLabel, legendName
          if (name === 'first') {
            formatLabel = '{b} <br/> 接通率 : {c}% '
            formatterLabel = '{value}%'
            legendName = '接通率'
          } else if (name === 'second') {
            formatLabel = '{b} <br/> 通话时长 : {c} 秒'
            formatterLabel = '{value}'
            legendName = '通话总时长'
          } else if (name === 'third') {
            formatLabel = '{b} <br/> 平均通话时长 : {c} 秒'
            formatterLabel = '{value}'
            legendName = '平均通话时长'
          } else if (name === 'fourth') {
            formatLabel = '{b} <br/> 1分钟内通话占比 : {c} %'
            formatterLabel = '{value}%'
            legendName = '1分钟内通话占比'
          } else if (name === 'five') {
            formatLabel = '{b} <br/> 3分钟以上通话占比 : {c} %'
            formatterLabel = '{value}%'
            legendName = '3分钟以上通话占比'
          }
          this.axisOption.tooltip.formatter = formatLabel
          this.axisOption.legend.data[0].name = legendName
          this.axisOption.series[0].name = legendName
          this.axisOption.yAxis[0].axisLabel.formatter = formatterLabel
          this.axisChart.setOption(this.axisOption, true)
        } else {
          this.$message.error('请求失败')
        }
        this.isDataListLoading = false
      })
    },
    initCallLine() {
      const callLineChart = echarts.init(document.getElementById('callLine'))
      // 指定图表的配置项和数据
      const option = {
        color: ['#6ca2ff'],
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'axis',
          formatter: '',
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
              name: '',
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
          left: '30px',
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
            /** 坐标轴刻度相关设置 */
            axisTick: {
              alignWithLabel: true,
              lineStyle: { width: 0 }
            },
            /** 坐标轴文字相关设置 */
            axisLabel: {
              color: '#BDBDBD',
              formatter: ''
            },
            /** 坐标轴轴线相关设置 */
            axisLine: {
              show: false,
              lineStyle: { color: '#BDBDBD' }
            },
            /** 坐标轴在 grid 区域中的分隔线 */
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
            name: '',
            type: 'line',
            data: []
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      callLineChart.setOption(option, true)
      // 设置变量，用于动态改变数据
      this.axisOption = option
      this.axisChart = callLineChart
    },
    // 类型选择
    timeTypeChange(data) {
      if (data.type === 'default') {
        this.timeTypeValue.type = data.value
        delete this.timeTypeValue.startTime
        delete this.timeTypeValue.endTime
      } else {
        delete this.timeTypeValue.type
        this.timeTypeValue.startTime = data.startTime
        this.timeTypeValue.endTime = data.endTime
      }
      this.getDataList(this.tabName)
    },
    // 通话概况
    queryCallInfoByMe(dateType) {
      this.isTodayMeLoading = true
      queryCallInfoByMe({ dateType }).then(res => {
        if (res.code === 0) {
          const { callInfo, userInfo } = res.data
          this.callInfo = callInfo
          this.userBasicInfo = userInfo
        } else {
          this.$message.error('请求失败')
        }
        this.isTodayMeLoading = false
      })
    },
    // 整体通话概况
    queryCallInfoByAll(dateType) {
      this.isTodayAllLoading = true
      queryCallInfoByAll({ dateType }).then(res => {
        if (res.code === 0) {
          this.callInfoAll = res.data
        } else {
          this.$message.error('请求失败')
        }
        this.isTodayAllLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$blue_theme: #409eff;
$gray1: #333;
$gray2: #999;
$gray3: #ccc;
/deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: $blue_theme;
}
.el-header {
  padding: 0;
}
.home-page {
  width: 1200px;
  margin: 0 auto;
  padding-bottom: 20px;
  .title-wrap {
    padding-left: 10px;
    padding-right: 10px;
    margin-top: 30px;
  }
  .title {
    font-size: 16px;
  }
}
.call-overview {
  .title-wra {
    margin-top: 0;
  }
  .user-info {
    flex: 1;
    display: flex;
    align-items: center;
    .avatar {
      margin-right: 10px;
    }
  }
  .data-info {
    position: relative;
    width: 160px;
    .line {
      position: absolute;
      top: 6px;
      right: 0;
      width: 1px;
      height: 30px;
      background-color: $gray3;
    }
  }
}
.all-call-overview {
  .title {
    margin-bottom: 10px;
  }
  .content-wrap {
    .el-card {
      width: 49%;
      padding-top: 25px;
      padding-bottom: 25px;
    }
  }
  .box1 {
    .info-content-layout {
      width: 33%;
      &:nth-child(-n + 3) {
        margin-bottom: 50px;
      }
    }
  }
}
.novice-guide {
  .guide-item {
    width: 25%;
    text-align: center;
    div {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100px;
      margin: 0 auto;
      line-height: 24px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 50%;
      font-size: 14px;
    }
    .info {
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .line {
      position: absolute;
      left: 100px;
      top: 50px;
      width: 185px;
      height: 1px;
      background-color: $gray3;
      &::after {
        content: '';
        position: absolute;
        right: 0;
        top: -5px;
        display: inline-block;
        width: 10px;
        height: 10px;
        border-top: 1px solid #ccc;
        border-right: 1px solid #ccc;
        transform: rotate(45deg);
      }
    }
  }
}
.el-card {
  margin-top: 10px;
}
.info-content-layout {
  text-align: center;
  p:nth-child(1) {
    color: $gray1;
    margin-bottom: 10px;
  }
  p:nth-child(2) {
    color: $gray2;
  }
}
</style>
