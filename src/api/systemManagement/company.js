import request from '@/utils/request'

// 获取企业信息
export function getCompanyInfo(data) {
  return request({
    url: 'system/company',
    method: 'post',
    data: data
  })
}

//更新企业信息
export function updateCompany(data) {
  return request({
    url: 'system/company/update',
    method: 'post',
    data: data
  })
}

//获取企业认证信息
export function getAuthinfo(data) {
  return request({
    url: 'system/company/authinfo',
    method: 'post',
    data: data
  })
}

//提交审核
export function saveAuth(data) {
  return request({
    url: 'system/company/auth/save',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}





