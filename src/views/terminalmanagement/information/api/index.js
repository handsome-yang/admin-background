
import request from '@/utils/request'
// 终端信息查询
export const QueryCarInfo = data => request({url:"/JT808WebApi/Vehicle/QueryCarInfo",method:'post',data})

// 关联
export const UpdateCarInfo = data => request({url:"/JT808WebApi/Vehicle/UpdateCarInfo",method:'post',data})
