<!-- 话单 -->
<template>
  <div>
    <c-r-m-list-head
      :search.sync="search"
      :crm-type="crmType"
      :is-seas="true"
      title="话单"
      placeholder="请输入主叫人姓名/主叫号码/被叫号码"
      @on-handle="listHeadHandle"
      @on-search="crmSearch"
      @on-export="exportInfos"
    />
    <!-- 是否有权限提示框 -->
    <el-card
      v-empty="!crm.call.index"
      xs-empty-icon="nopermission"
      xs-empty-text="暂无权限"
      class="crm-container"
    >
      <!-- 筛选条件 -->
      <c-r-m-table-head
        ref="crmTableHead"
        :crm-type="crmType"
        @filter="handleFilter"
        @exportData="exportData"
        @handle="handleHandle"
        @scene="handleScene"
      />
      <!-- 表格 -->
      <el-table
        v-loading="loading"
        id="crm-table"
        :data="list"
        :cell-style="cellStyle"
        class="n-table--border"
        highlight-current-row
        style="width: 100%"
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
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.recordUrl.length !== 0">
              <el-link href="javascript:;" :underline="false" type="primary" @click.native="handlePlay(scope.row)">播放</el-link>
              <el-link href="javascript:;" :underline="false" type="primary" @click.native="downLoadAudio(scope.row)">下载</el-link>
            </div>
            <span v-else>--</span>
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
      <div v-show="playNow" class="audio-wrap">
        <el-link :underline="false" @click="hideAudio">X</el-link>
        <audio ref='audio' controls>
          <!-- <source :src="recordUrl" type="audio/ogg" />
          <source :src="recordUrl" type="audio/ogg" />-->
          <!-- <source :src="recordUrl" type="audio/mp3" />您的浏览器不支持 audio 元素。 -->
          <source :src="recordUrl" type="audio/mpeg" />您的浏览器不支持 audio 元素。
        </audio>
      </div>
    </el-card>
  </div>
</template>

<script>
import table from '../mixins/table'
import { talkingList } from '@/api/customermanagement/call'
// import { downLoadFileMp3 } from "@/utils"
import saveAs from 'file-saver'
var FileSaver = require('file-saver')
export default {
  mixins: [table],
  data() {
    return {
      crmType: 'call',
      playNow: false, // 播放音频
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
        }
      ],
      recordUrl: ''
    }
  },

  created() {},

  mounted() {
    // this.getTalkingList()
  },

  methods: {
    getTalkingList() {
      talkingList(this.talkingParams).then(res => {
        if (res.code === 0) {
          const { pageSize, totalPage, list } = res.data
          this.pageSize = pageSize
          this.total = totalPage
          this.list = list
        } else {
          this.$message.error('请求失败')
        }
      })
    },
    handlePlay(row) {
      // console.log(row.recordUrl)
      this.$refs.audio.src = row.recordUrl
      // this.$refs.audio.src = 'http://49.235.157.137:8182/files/callrecord/20200629/6998d7cd-688f-4eab-bf2a-d0e83731828e.mp3'
      this.$refs.audio.play()
      // this.recordUrl = row.recordUrl.split('?')[0]
      this.playNow = true
    },
    hideAudio() {
      this.$refs.audio.pause()
      this.playNow = false
    },
    crmSearch() {
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
    downLoadAudio(row) {
      // downLoadFileMp3(row.recordUrl,'mp3文件','application/octet-stream')
      FileSaver.saveAs(row.recordUrl)
    }
  }
}
</script>
<style lang='scss' scoped>
/deep/ .el-table thead th.is-leaf,
.el-table td {
  background-color: #fafafa;
  color: #333;
}
.audio-wrap {
  position: absolute;
  right: 20px;
  bottom: 20px;
  a {
    position: absolute;
    right: 8px;
    top: -20px;
    display: flex;
    width: 20px;
    height: 20px;
  }
}
</style>
