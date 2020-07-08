<template>
  <div id="app" class="main">
    <a @mouseover="drawer = true" class="search">
      <icon class="el-icon-search"></icon>
    </a>
    <el-drawer
      ref="drawer"
      title="车辆轨迹查询"
      :modal="false"
      size="360"
      :visible.sync="drawer"
      :wrapperClosable="true"
      direction="ltr"
      custom-class="demo-drawer"
    >
      <div class="demo-drawer__content">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="top">
          <el-form-item label="选择时间">
            <el-date-picker
              v-model="form.start_time"
              :picker-options="startTimeOptions"
              style="width:100%"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择开始日期"
            ></el-date-picker>

            <el-date-picker
              v-model="form.end_time"
              :picker-options="endTimeOptions"
              style="margin-top:10px;width:100%"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择结束日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="SIM卡编号" prop="sim">
            <el-select v-model="form.sim" filterable placeholder="请选择或输入" style="width: 100%">
              <el-option v-for="item in simList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button
            type="primary"
            @click="detail()"
            :loading="!drawer"
          >{{ drawer ? '确 定':'提交中 ...' }}</el-button>
        </div>
      </div>
    </el-drawer>
    <div id="container"></div>
  </div>
</template>
  <script src="./lib/coordtransform.js"></script>
<script>
export default {
  name: "TrankView",
  data() {
    return {
      drawer: true,
      form: {
        start_time: new Date().formatToString("yyyy-MM-dd 00:00:00"),
        end_time: new Date().formatToString("yyyy-MM-dd 23:59:59"),
        sim: ""
      },
      simList: [],
      rules: {
        start_time: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        end_time: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: "change"
          }
        ],
        sim: [
          {
            required: true,
            message: "请选择SIM卡",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    startTimeOptions() {
      return {
        disabledDate: time => {
          let endDateVal = this.form.end_time;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      };
    },
    endTimeOptions() {
      const _this = this;
      return {
        disabledDate: time => {
          let beginDateVal = this.form.start_time;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime();
          }
        }
      };
    }
  },
  methods: {
    handleClose(done) {
      // if (this.loading) {
      //     return;
      // }
      // this.$confirm('确定要提交表单吗？')
      //     .then(_ => {
      //         this.loading = true;
      //         this.timer = setTimeout(() => {
      //             done();
      //             // 动画关闭需要一定的时间
      //             setTimeout(() => {
      //                 this.loading = false;
      //             }, 400);
      //         }, 2000);
      //     })
      //     .catch(_ => {});
    },
    cancelForm() {
      this.drawer = false;
      clearTimeout(this.timer);
    },

    detail() {
      let _this = this;

      _this.$refs["form"].validate(valid => {
        if (valid) {
          // let params = {
          //     "sim": _this.form.sim,
          //     "start_time": _this.form.start_time,
          //     "end_time": _this.form.end_time
          // };
          axios
            .post(
              "http://39.100.78.242:15004/JT808WebApi/Vehicle/QueryTrack",
              _this.form
            )
            .then(function(response) {
              if (response.data) {
                window.pathSimplifierIns.setData([
                  {
                    name: _this.form.sim,
                    path: response.data
                  }
                ]);
                _this.$refs.drawer.closeDrawer();
              } else {
                _this.$message("这辆车没有数据哦！");
              }
            })
            .catch(function(error) {
              _this.$message(error);
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    queryCarList() {
      let _this = this;
      axios
        .post("http://39.100.78.242:15004/JT808WebApi/Vehicle/QuerySIM")
        .then(response => {
          if (response.data) {
            _this.simList = response.data;
          } else {
            _this.$message("这辆车没有数据哦！");
          }
        })
        .catch(error => {
          _this.$message(error);
          console.log(error);
        });
    }
  },
  mounted: function() {
    this.queryCarList();
  },
  created() {
    /**
     * 时间格式化
     *  年 yyyy
     *  月 M 前面不补0；MM  前面补0
     *  日 d 前面不补0；dd  前面补0
     *  时 H 前面补补0；HH  前面补0
     *  分 m 前面不补0；mm  前面补0
     *  秒 s 前面不补0；ss  前面补0
     *  季度
     *  毫秒
     * @param fmt
     * @returns {string}
     */
    Date.prototype.formatToString = function(fmt) {
      //author: meizz
      let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    };
  }
};
</script>
<script>
//创建地图
var map = new AMap.Map("container", {
  zoom: 4
});
AMapUI.load(["ui/misc/PathSimplifier", "lib/$"], function(PathSimplifier, $) {
  if (!PathSimplifier.supportCanvas) {
    alert("当前环境不支持 Canvas！");
    return;
  }
  var pathSimplifierIns = new PathSimplifier({
    zIndex: 100,
    autoSetFitView: true,
    map: map, //所属的地图实例
    getPath: function(pathData, pathIndex) {
      let points = pathData.path,
        lnglatList = [];
      for (let i = 0, len = points.length; i < len; i++) {
        var wgs84togcj02 = coordtransform.wgs84togcj02(
          points[i].longitude,
          points[i].latitude
        );
        lnglatList.push(wgs84togcj02);
      }
      return lnglatList;
    },
    getHoverTitle: function(pathData, pathIndex, pointIndex) {
      if (pointIndex >= 0) {
        //point
        return pathData.name + "," + JSON.stringify(pathData.path[pointIndex]);
      }
      return pathData.name + "，点数量" + pathData.path.length;
    },
    renderOptions: {
      pathLineStyle: {
        strokeStyle: "#3dc115",
        lineWidth: 6,
        dirArrowStyle: true
      },
      renderAllPointsIfNumberBelow: 3000 //绘制路线节点，如不需要可设置为-1
    }
  });
  window.pathSimplifierIns = pathSimplifierIns;
  //设置数据

  //对第一条线路（即索引 0）创建一个巡航器
  // var navg1 = pathSimplifierIns.createPathNavigator(0, {
  //     loop: true, //循环播放
  //     speed: 1000000 //巡航速度，单位千米/小时
  // });
  // navg1.start();
});
</script>
<style lang="scss" scoped>
</style>