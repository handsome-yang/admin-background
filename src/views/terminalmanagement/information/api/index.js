
import request from '@/utils/request'
// 终端信息查询
export const QueryCarInfo = data => request({url:"/JT808WebApi/Vehicle/QueryCarInfo",method:'post',data})

// 关联
export const UpdateCarInfo = data => request({url:"/JT808WebApi/Vehicle/UpdateCarInfo",method:'post',data})

// 获取车辆详情
export const GetCarInfoDetialBySIM = data => request({url:"/JT808WebApi/Vehicle/GetCarInfoDetialBySIM",method:'post',data})

// 获取车辆图片
export const GetCarPhotosBySIM = data => request({url:"/JT808WebApi/Vehicle/GetCarPhotosBySIM",method:'post',data})

// 删除车辆图片
export const DeleteCarPhoto = data => request({url:"/JT808WebApi/Vehicle/DeleteCarPhoto",method:'post',data})
