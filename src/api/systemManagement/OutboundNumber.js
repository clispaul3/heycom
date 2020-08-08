import request from '@/utils/request'

//获取电话号码列表
export function getPhoneList(data) {
  return request({
    url: 'system/call/queryUserPhonePage',
    method: 'POST',
    data: data
  })
}

//审核
export function checkUserPhone(data) {
  return request({
    url: 'system/call/checkUserPhone',
    method: 'POST',
    data: data
  })
}

//新增外呼号码
export function addUserPhone(data) {
  return request({
    url: 'system/call/addUserPhone',
    method: 'POST',
    data: data
  })
}

// 删除外呼号码
export function deleteUserPhone(data) {
  return request({
    url: 'system/call/deleteUserPhone',
    method: 'POST',
    data: data
  })
}