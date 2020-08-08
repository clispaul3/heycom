import request from '@/utils/request'

/**
 * 接通率
 */
export function queryCallChart(data) {
  return request({
    url: 'biStatistics/queryCallChart',
    method: 'post',
    data: data
  })
}

export function queryCallChartDetail(data) {
  return request({
    url: 'biStatistics/queryCallChartDetail',
    method: 'post',
    data: data
  })
}
