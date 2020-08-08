import request from '@/utils/request'

/**
 *
 * @param {*} data
 */
export function usersList(data) {
  return request({
    url: 'system/user/queryUserList',
    method: 'post',
    data: data
  })
}

/**
 * type
 * @param {*} data
 */
export function depList(data) {
  return request({
    url: 'system/dept/queryDeptTree',
    method: 'post',
    data: data
  })
}

// 获取权限范围内部门接口
export function adminStructuresSubIndex(data) {
  return request({
    // url: 'system/dept/queryDeptByAuth',
    url: 'finance/filter',
    method: 'post',
    data: data
  })
}
// 获取权限范围内部门接口
export function getUserByDeptId(data) {
  return request({
    url: 'system/user/queryUserByDeptId',
    method: 'post',
    data: data
  })
}


// 部门下的员工
export function userListByStructid(data) {
  return request({
    url: 'admin/users/userListByStructid',
    method: 'post',
    data: data
  })
}

/**
 *
 * @param {*} data
 */
export const crmFileSaveUrl = process.env.BASE_API + 'file/upload'

export function crmFileSave(data) {
  var param = new FormData()
  Object.keys(data).forEach(key => {
    param.append(key, data[key])
  })
  return request({
    url: 'file/upload',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function crmFileFormDataSave(data) {
  return request({
    url: 'file/upload',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 附件列表
export function crmFileIndex(data) {
  return request({
    url: 'file/queryByBatchId',
    method: 'post',
    data: data
  })
}

/** 暂时客户管理里面也有 */
// 附件删除接口
export function crmFileDelete(data) {
  return request({
    url: 'file/removeById',
    method: 'post',
    data: data
  })
}

// 附件重命名
export function crmFileUpdate(data) {
  return request({
    url: 'file/renameFileById',
    method: 'post',
    data: data
  })
}

// crm 自定义字段的添加
/**
 *
 * @param {*} data
 */
export function filedGetField(data) {
  return request({
    url: 'field/queryField',
    method: 'post',
    data: data
  })
}

// 权限数据返回
export function adminIndexAuthList(data) {
  return request({
    url: 'system/role/auth',
    method: 'post',
    data: data
  })
}

//上传文件
export function uploadFile(imageBlob, path){
  if(typeof imageBlob === 'object' && imageBlob !== null){
    const formData = new FormData();
    if(path){
        formData.append('path', path);
    }
    if(imageBlob && imageBlob.blob){
      //文件blob
      formData.append('file', imageBlob.blob, imageBlob.file.name);
    }else if(Object.prototype.toString.call(imageBlob) === '[object File]'){
      //文件file
      formData.append('file', imageBlob);
    }else{
      //如果是base64，那么就使用转码上传
      var array = [];
      for(var i = 0; i < bytes.length; i++){
          array.push(bytes.charCodeAt(i));
      }
      formData.append('file', new Blob([new Uint8Array(array)], {type: 'image/jpeg'}), Date.now() + '.jpg');
    }
    return request({
      url: 'public/file/upload',
      method: 'post',
      data: formData,  
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });  
  }else{
    return new Promise((resolve, reject)=> {
      reject('文件为空，无需上传');
    })
  }
}