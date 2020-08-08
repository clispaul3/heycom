import request from '@/utils/request'

// 通话概况
export function queryCallInfoByMe(data) {
  return request({
    url: 'index/queryCallInfoByMe',
    method: 'post',
    data: data
  })
}

// 整体通话概况
export function queryCallInfoByAll(data) {
  return request({
    url: 'index/queryCallInfoByAll',
    method: 'post',
    data: data
  })
}

// 接通率
export function queryCallChartByAll(data) {
  return request({
    url: 'index/queryCallChartByAll',
    method: 'post',
    data: data
  })
}
