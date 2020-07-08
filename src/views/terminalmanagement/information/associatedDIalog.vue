<template>
  <section>
    <div class="editer page">
      <div class="page-header">
        <div class="title">
          <span class="title-span">{{title}}</span>
        </div>
        <el-button class="fr" size="small" icon="el-icon-close" @click.stop="carClose">关闭</el-button>
        <el-button size="small" class="fr" type="primary" icon="hr-icon-save" @click="save">保存</el-button>
      </div>
      <div class="page-body" ref="page-body" v-loading="loading">
        <!-- :style="{'height':bodyHeight-20+'px'}" -->
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
    </div>
    
  </section>
</template>
<script>
export default {
  data() {
    return {
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

      uploadImgUrl: "/JT808WebApi/Vehicle/UploadCarPhoto",
      dialogImageUrl: "",
      dialogVisible: false,
      terminal_sim: "",
      carPhotoList: [],
      carLength: [
        {
          name: "未知",
          value: 0
        },
        {
          name: "8.7米",
          value: 8700
        },
        {
          name: "9.6米",
          value: 9600
        },
        {
          name: "11.7米",
          value: 11700
        },
        {
          name: "12.5米",
          value: 12500
        },
        {
          name: "13米",
          value: 13000
        },
        {
          name: "15米",
          value: 15000
        },
        {
          name: "16米",
          value: 16000
        },
        {
          name: "17.5米",
          value: 17500
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
  methods: {
    carClose() {
      this.carPhotoList = [];
      this.$refs.upload.clearFiles();
    },
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          UpdateCarInfo(this.form).then(res => {
            this.$message("关联成功!");
            this.$router.back(-1);
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
      axios
        .post(BaseAPI + "/JT808WebApi/Vehicle/DeleteCarPhoto", {
          file_id: file.uid,
          terminal_sim: this.terminal_sim
        })
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
    }
  }
};
</script>
<style lang="scss" scoped>
</style>