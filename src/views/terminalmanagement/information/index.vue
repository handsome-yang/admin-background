<template>
  <section class="container">
    <div v-if="isShowMain" class="list page">
      <div class="page-header">
        <div class="title" style="float: none;">
          <h3>
            终端信息
            <small>共{{total}}条</small>
          </h3>
        </div>
        <div class="pull-right"></div>
      </div>
      <div class="page-body">
        <div class="table-area">
          <div class="toolbar" style="display: flex;">
            <el-input
              placeholder="请输入设备手机号或车牌号查询"
              type="text"
              v-model="pageInfo.terminal_sim"
              class="fr"
              size="small"
              @keyup.enter.native="search()"
              clearable
              style="flex: 1;padding-right: 10px;"
            >
              <el-button slot="append" icon="el-icon-search" size="small" @click="search()"></el-button>
            </el-input>

            <el-button class="fr" size="small" @click="queryTableData">
              <i class="el-icon-refresh"></i>
            </el-button>
          </div>
          <el-table
            ref="table"
            :data="tableData"
            tooltip-effect="dark"
            stripe
            fit
            v-loading="tableLoading"
            style="width: 100%"
            :height="tableHeight"
            @sort-change="sortChange"
            @selection-change="selectionChange"
          >
            <el-table-column align="center" prop="terminal_sim" label="设备手机号"></el-table-column>

            <el-table-column align="center" prop="terminal_id" label="设备ID"></el-table-column>

            <el-table-column align="center" prop="vno" label="车牌号"></el-table-column>

            <el-table-column align="center" fixed="right" label="操作" width="80">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">关联</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              class="hidden-sm-and-up"
              style="text-align: center;"
              background
              layout=" prev, pager, next,jumper"
              @size-change="sizeChange"
              @current-change="currentChange"
              :current-page="pageInfo.page"
              :page-sizes="pageInfo.sizes"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isShowMain" class="editor page">
      <div class="page-header">
        <div class="title">
          <span class="title-span">{{title}}</span>
        </div>
      </div>
      <div class="page-body" ref="page-body" v-loading="loading">
        <el-scrollbar class="scrollbar-wrapper" :noresize="true" :native="false">
          <el-form
            :model="form"
            label-position="right"
            ref="form"
            label-width="100px"
            :rules="rules"
          >
            <div class="title">
              <span class="title-span">一、设置终端信息</span>
            </div>
            <div class="content">
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item size="small" prop="terminal_id" label-width="135px" label="终端设备ID">
                    <el-input v-model="form.terminal_id" placeholder="填写终端设备ID" disabled clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item size="small" prop="terminal_sim" label="终端手机号" label-width="135px">
                    <el-input v-model="form.terminal_sim" placeholder="填写终端手机号" disabled clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="8"></el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="8"></el-col>
              </el-row>
            </div>
            <div class="title">
              <span class="title-span">二、设置投保信息</span>
            </div>
            <div class="content">
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item size="small" prop="car_insure">
                    <el-checkbox v-model="form.car_insure" :true-label="1" :false-label="0">是否投保</el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="title">
              <span class="title-span">三、车辆相关信息</span>
              <span class="sub-title-span"></span>
            </div>
            <div class="content">
              <el-row>
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item size="small" prop="company" label-width="135px" label="所属物流企业">
                    <el-input v-model="form.company" placeholder="填写物流企业" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item size="small" prop="vno" label-width="135px" label="车牌号">
                    <el-input v-model="form.vno" placeholder="填写车牌号" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item size="small" prop="vcolor" label-width="135px" label="车牌颜色">
                    <el-select v-model="form.vcolor" style="width: 100%" filterable>
                      <el-option
                        v-for="a in vcolorList"
                        :label="a.name"
                        :value="a.value"
                        :key="a.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24">
                  <el-form-item size="small" prop="car_photo" label-width="135px" label="车辆图片">
                    <el-upload
                      ref="upload"
                      list-type="picture-card"
                      :limit="4"
                      :multiple="true"
                      :action="uploadImgUrl"
                      :data="{terminal_sim:terminal_sim}"
                      :file-list="carPhotoList"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleRemove"
                      :before-remove="handleBeforeRemove"
                      :on-exceed="handlEexceed"
                    >
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                      <img width="100%" :src="dialogImageUrl" alt />
                    </el-dialog>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="title">
              <span class="title-span">四、行驶证信息</span>
              <span class="sub-title-span"></span>
            </div>
            <div class="content">
              <el-row>
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item
                    size="small"
                    prop="driving_license_info.vin"
                    label-width="135px"
                    label="车辆识别代号"
                  >
                    <el-input
                      v-model="form.driving_license_info.vin"
                      placeholder="填写车辆识别代号(VIN)"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item
                    size="small"
                    prop="driving_license_info.engine_no"
                    label-width="135px"
                    label="发动机号"
                  >
                    <el-input
                      v-model="form.driving_license_info.engine_no"
                      placeholder="填写车辆发动机号"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item
                    size="small"
                    prop="driving_license_info.car_type"
                    label-width="135px"
                    label="车辆类型"
                  >
                    <el-select
                      v-model="form.driving_license_info.car_type"
                      style="width: 100%"
                      filterable
                    >
                      <el-option v-for="item in vTypes" :label="item" :value="item" :key="item"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item
                    size="small"
                    prop="driving_license_info.car_length"
                    label-width="135px"
                    label="车辆长度"
                  >
                    <el-select
                      v-model="form.driving_license_info.car_length"
                      style="width: 100%"
                      filterable
                    >
                      <el-option
                        v-for="(len,i) in carLength"
                        :label="len.name"
                        :value="len.value"
                        :key="len.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item
                    size="small"
                    prop="driving_license_info.use_property"
                    label-width="135px"
                    label="使用性质"
                  >
                    <el-select
                      v-model="form.driving_license_info.use_property"
                      style="width:100%"
                      filterable
                    >
                      <el-option
                        v-for="item in useProperties"
                        :label="item"
                        :value="item"
                        :key="item"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item
                    size="small"
                    prop="driving_license_info.brand"
                    label-width="135px"
                    label="品牌型号"
                  >
                    <el-input
                      v-model="form.driving_license_info.brand"
                      placeholder="品牌型号"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item
                    size="small"
                    prop="driving_license_info.owner"
                    label-width="135px"
                    label="所有人"
                  >
                    <el-input
                      v-model="form.driving_license_info.owner"
                      placeholder="填写行驶证所有人"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item
                    label="注册日期"
                    prop="driving_license_info.registration_date"
                    label-width="135px"
                  >
                    <el-date-picker
                      size="small"
                      v-model="form.driving_license_info.registration_date"
                      :picker-options="pickerOptions"
                      type="date"
                      style="width: 100%"
                      format="yyyy年MM月dd日"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item
                    label="发证日期"
                    prop="driving_license_info.registration_date"
                    label-width="135px"
                  >
                    <el-date-picker
                      size="small"
                      v-model="form.driving_license_info.licence_issued"
                      :picker-options="pickerOptions"
                      type="date"
                      style="width: 100%"
                      format="yyyy年MM月dd日"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24">
                  <el-form-item
                    size="small"
                    prop="driving_license_info.address"
                    label-width="135px"
                    label="住址"
                  >
                    <el-input
                      type="textarea"
                      v-model="form.driving_license_info.address"
                      style="max-width: 100%"
                      placeholder="输入住址"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="title">
              <span class="title-span">五、联系信息</span>
              <span class="sub-title-span"></span>
            </div>
            <div class="content">
              <el-row>
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item
                    size="small"
                    prop="driver_contact.team_name"
                    label-width="135px"
                    label="车队编号"
                  >
                    <el-input v-model="form.driver_contact.team_name" placeholder="车队编号" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item
                    size="small"
                    prop="driver_contact.team_leader"
                    label-width="135px"
                    label="车队负责人"
                  >
                    <el-input
                      v-model="form.driver_contact.team_leader"
                      placeholder="车队负责人"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item
                    size="small"
                    prop="driver_contact.car_number"
                    label-width="135px"
                    label="车辆编号"
                  >
                    <el-input v-model="form.driver_contact.car_number" placeholder="车辆编号" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item
                    size="small"
                    prop="driver_contact.driver_name"
                    label-width="135px"
                    label="联系人"
                  >
                    <el-input v-model="form.driver_contact.driver_name" placeholder="联系人" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="8">
                  <el-form-item
                    size="small"
                    prop="driver_contact.driver_phone"
                    label-width="135px"
                    label="联系人电话"
                  >
                    <el-input
                      v-model="form.driver_contact.driver_phone"
                      placeholder="联系人电话"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </el-scrollbar>
      </div>
      <p class="btn-group">
        <el-button class="fr" size="small" icon="el-icon-close" @click.stop="carClose">关闭</el-button>
        <el-button size="small" class="fr" type="primary" icon="hr-icon-save" @click="save">保存</el-button>
      </p>
    </div>
  </section>
</template>

<script>
import {
  QueryCarInfo,
  UpdateCarInfo,
  GetCarInfoDetialBySIM,
  GetCarPhotosBySIM,
  DeleteCarPhoto
} from "./api";
export default {
  inject:["reload"],
  name: "Information",
  data() {
    return {
      total: 999,
      pageInfo: {
        terminal_sim: ""
      },
      tableData: [],
      tableLoading: false,
      tableHeight: 300,
      isShowMain: true,

      // 编辑 data
      title: "关联车辆信息",
      loading: false,
      form: {
        vno: "",
        vcolor: 2,
        terminal_id: "",
        terminal_sim: "",
        driving_license: "",
        company: "",
        car_photo: "",
        load: 0,
        car_insure: 0,
        driving_license_info: {
          vin: "",
          engine_no: "",
          car_type: "",
          car_length: 8700,
          licence_issued: Date.now(),
          registration_date: Date.now()
        },
        driver_contact: {
          team_name: "",
          team_leader: "",
          car_number: 1,
          driver_name: "",
          driver_phone: ""
        }
      },
      rules: {
        terminal_id: [
          {
            required: true,
            message: "设备号必填哦！",
            trigger: "blur"
          }
        ],
        terminal_sim: [
          {
            required: true,
            message: "设备手机号必填哦！",
            trigger: "blur"
          }
        ]
      },
      vcolorList: [
        {
          name: "蓝色",
          value: 1
        },
        {
          name: "黄色",
          value: 2
        },
        {
          name: "黑色",
          value: 3
        },
        {
          name: "白色",
          value: 4
        },
        {
          name: "其他",
          value: 0
        }
      ],

      uploadImgUrl: window.API_ROOT + "/JT808WebApi/Vehicle/UploadCarPhoto",
      dialogImageUrl: "",
      dialogVisible: false,
      terminal_sim: "",
      carPhotoList: [],
      carLength: [
                {
                    name:'未知',
                    value:0
                },
                {
                    name:'8.7米',
                    value:870
                },{
                    name:'9.6米',
                    value:960
                },{
                    name:'11.7米',
                    value:1170
                },{
                    name:'12.5米',
                    value:1250
                },{
                    name:'13米',
                    value:1300
                },{
                    name:'15米',
                    value:1500
                },{
                    name:'16米',
                    value:1600
                },{
                    name:'17.5米',
                    value:1750
                }
            ],
      vTypes: [
        "重型半挂牵引车",
        "重型全挂牵引车",
        "平板车",
        "高栏车",
        "箱式车",
        "自卸车",
        "集装箱车",
        "冷藏车"
      ],

      useProperties: ["货运", "客运", "租赁"],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  created() {
    this.$nextTick(() => {
      this.resizeTable();
    });
  },
  mounted() {
    this.queryTableData();
    window.addEventListener("resize", () => {
      this.resizeTable();
    });
    this.$once("hooks:beforeDestory", () => {
      window.removeEventListener("resize", this.resizeTable);
    });
  },
  methods: {
    search() {
      this.pageInfo.page = 1;
      this.queryTableData();
    },
    queryTableData() {
      QueryCarInfo({
        page: this.pageInfo.page,
        page_size: this.pageInfo.pageSize,
        terminal_sim: this.pageInfo.terminal_sim
      })
        .then(res => {
          if (res.data) {
            this.total = res.count;
            this.tableData = res.data;
          }
        })
        .catch(error => {
          this.$message(error);
          console.log(error);
        });
    },
    sortChange(column) {
      if (column.prop) {
        this.pageInfo.orders = [
          {
            property: column.prop,
            direction: column.order == "ascending" ? "asc" : "desc"
          }
        ];
      } else {
        this.pageInfo.orders = [
          {
            property: "ts",
            direction: "desc"
          }
        ];
      }
      this.queryTableData();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    handleClick(row) {
      this.terminal_sim = row.terminal_sim;
      this.isShowMain = false;
      this.getCarInfo();
      this.getCarImg();
    },
    sizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.pageInfo.page = 1;
      this.queryTableData();
    },
    currentChange(page) {
      this.pageInfo.page = page;
      this.queryTableData();
    },
    resizeTable() {
      let desHeight = document.querySelector(".page-header").offsetHeight;
      let marginBottom = getComputedStyle(
        document.querySelector(".page-header h3"),
        false
      )["marginBottom"];
      let str = parseInt(marginBottom) * 2;
      this.tableHeight =
        document.querySelector(".app-main").offsetHeight -
        desHeight -
        str -
        130;
      console.log(document.querySelector(".app-main").offsetHeight);
    },

    // 编辑
    carClose() {
      this.carPhotoList = [];
      this.$refs.upload.clearFiles();
      this.isShowMain = true;
    },
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          UpdateCarInfo(this.form).then(res => {
            this.$message("关联成功!");
            this.reload()
          });
        } else {
          return false;
        }
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlEexceed(file, fileList) {
      this.$message({
        type: "warning",
        message: "图片最多可选4张哦"
      });
    },
    handleRemove(file, fileList) {
      deletePhoto()
        .then(response => {
          if (response.data) {
            this.carPhotoList = this.carPhotoList.filter(item => {
              return item.uid != file.uid;
            });
          }
        })
        .catch(error => {
          this.$message({
            type: "error",
            message: error
          });
        });
    },
    handleBeforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    getCarImg() {
      GetCarPhotosBySIM({terminal_sim: this.terminal_sim})
        .then(response => {
          if (response) {
            this.carPhotoList = [];
            response.forEach((item, index, arr) => {
              this.carPhotoList.push({
                name: item.filename,
                url: item.data_base64,
                uid: item.file_id
              });
            });
          }
        })
        .catch(error => {
          this.$message(error);
        });
    },
    getCarInfo() {
      GetCarInfoDetialBySIM({terminal_sim: this.terminal_sim})
        .then(response => {
          if (response) {
            this.form = response;
          }
        })
        .catch(error => {
          this.$message(error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 10px;
}
.pagination-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.btn-group {
  text-align: center;
  margin-top: 30px;
}

::v-deep .el-input__inner {
  height: 40px;
  line-height: 40px;
}
::v-deep .el-form-item__label {
  line-height: 40px;
  height: 40px;
}
.editor {
  .page-body {
    overflow-x: hidden;
  }
  .title {
    font-size: 24px;
    margin: 15px 0;
  }
}
.scrollbar-wrapper {
  overflow-x: hidden;
}
</style>