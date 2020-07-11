import request from '@/utils/request'

// 查询用户列表
export const searchUser = data => request({url: '/JT808WebApi/User/QueryUser',method: 'post',data})


// 查询该用户已分配车辆
export const QueryUserBelongedCar = data => request({url: '/JT808WebApi/User/QueryUserBelongedCar',method: 'post',data})

// SIM查询
export const QuerySIM = data => request({url:'/JT808WebApi/Vehicle/QuerySIM',method:'post',data})

// 分配车辆
export const DispatchUserCars = data => request({url:'/JT808WebApi/User/DispatchUserCars',method:'post',data})