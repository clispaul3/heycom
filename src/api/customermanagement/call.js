import request from '@/utils/request'

// 拨号
export function callSend(data) {
  return request({
    url: 'crm/call/send',
    method: 'post',
    data: data
  })
}

// 预警设置
export function talkingList(data) {
  return request({
    url: 'crm/call/queryRecord',
    method: 'post',
    data: data
  })
}

// 获取外呼号码列表
export function queryPhoneByUser(data) {
  return request({
    url: 'crm/call/queryPhoneByUser',
    method: 'post',
    data: data
  })
}

// 添加外呼号码
export function addPhone(data) {
  return request({
    url: 'crm/call/addPhone',
    method: 'post',
    data: data
  })
}

// 编辑外呼号码
export function updatePhone(data) {
  return request({
    url: 'crm/call/updatePhone',
    method: 'post',
    data: data
  })
}

// 删除外呼号码
export function deletePhone(data) {
  return request({
    url: 'crm/call/deletePhone',
    method: 'post',
    data: data
  })
}

// 获取系统来电号码
export function querySystemPhone(data) {
  return request({
    url: 'crm/call/querySystemPhone',
    method: 'post',
    data: data
  })
}

// 客服支持
export function customerService() {
  return request({
    url: 'crm/base/customerService',
    method: 'post'
  })
}
