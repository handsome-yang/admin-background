import request from '@/utils/request'
// 新增用户
export const addUser = data => request({url: '/JT808WebApi/User/Create',method: 'post',data})

// 查询用户列表
export const searchUser = data => request({url: '/JT808WebApi/User/QueryUser',method: 'post',data})

// 修改用户基础信息
export const upDateBasicsInfo = data => request({url:"/JT808WebApi/User/Update",method:'post',data})

// 修改用户密码
export const UpdatePassword = data => request({url:"/JT808WebApi/User/UpdatePassword",method:'post',data})

// 修改用户状态
export const UpdateUserStatus = data => request({url:"/JT808WebApi/User/UpdateUserStatus",method:'post',data})

