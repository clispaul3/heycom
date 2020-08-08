import request from '@/utils/request'

export function login(username, password, keep) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username,
      password,
      keep
    }
  })
}

// 验证码登录
export function loginByMobile(mobile, code, keep) {
  return request({
    url: '/loginByMobile',
    method: 'post',
    data: {
      mobile,
      code,
      keep
    }
  })
}

// 获取验证码
export function sendCode(mobile, type) {
  return request({
    url: '/public/sms/sendCode',
    method: 'post',
    data: {
      mobile,
      type
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: {
      token
    }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 企业注册
export function register(data) {
  return request({
    url: '/system/company/register',
    method: 'post',
    data: data
  })
}

// 重置密码
export function resetPassword(data) {
  return request({
    url: '/resetPassword',
    method: 'post',
    data: data
  })
}

// 用户协议
export function agreement() {
  return request({
    url: '/public/info/agreement',
    method: 'post'
  })
}
