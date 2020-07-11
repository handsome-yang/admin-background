import request from '@/utils/request'

// 轨迹查询
export const QueryTrack = data => request({url:'/JT808WebApi/Vehicle/QueryTrack',method:'post',data})


// SIM查询
export const QuerySIM = data => request({url:'/JT808WebApi/Vehicle/QuerySIM',method:'post',data})