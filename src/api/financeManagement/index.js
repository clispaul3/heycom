import request from '@/utils/request'

// 财务概览
export function financeAll(data) {
  return request({
    url: 'finance/baseinfo',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 预警设置
export function updateConfig(data) {
  return request({
    url: 'finance/setWarning',
    method: 'post',
    data: data
  })
}

// 实时账单
export function queryRecord(data) {
  return request({
    url: 'crm/call/queryRecord',
    method: 'post',
    data: data
  })
}

// 本⽉实时消费
export function queryCostByCurrentMonth(data) {
  return request({
    url: 'finance/queryCostByCurrentMonth',
    method: 'post',
    data: data
  })
}

// 历史账单
export function queryCallHistory(data) {
  return request({
    url: 'finance/queryCallHistory',
    method: 'post',
    data: data
  })
}

// 账单详情
export function callHistoryDetail(data) {
  return request({
    url: 'finance/callHistoryDetail',
    method: 'post',
    data: data
  })
}

// 统计信息
export function costCurrentMonth(data) {
  return request({
    url: 'finance/queryCostAndDurationByCurrentMonth',
    method: 'post',
    data: data
  })
}

// 充值记录
export function chargeRecord(data) {
  return request({
    url: 'finance/chargeRecord',
    method: 'post',
    data: data
  })
}


