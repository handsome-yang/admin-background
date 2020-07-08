<template>
  <el-dialog :title="dialogInfo.type == 'editor' ? '编辑' : '新增'" :visible.sync="isShowAddDialog">
    <el-form ref="formData" :model="formData" :rules="rules" label-width="110px" class="demo-form">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="用户账号" prop="user_name">
            <el-input v-model="formData.user_name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="select-input" label="用户类型">
            <el-select v-model="formData.user_type" placeholder="用户类型">
              <el-option
                v-for="item in user_type_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="用户名称" prop="display_name">
            <el-input v-model="formData.display_name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phone">
            <el-input type="password" v-model="formData.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" v-if="dialogInfo.type == 'add'">
        <el-col :span="12">
          <el-form-item label="用户密码" prop="password">
            <el-input type="password" v-model="formData.password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  addUser,
  upDateBasicsInfo,
  UpdatePassword,
  UpdateUserStatus
} from "../api";
import md5 from "md5";
import axios from "axios";
export default {
  props: {
    dialogInfo: {
      type: Object,
      default: () => {
        return {
          type: "add",
          info: null
        };
      }
    }
  },
  data() {
    return {
      isShowAddDialog: false,
      formData: this.getFormData(),
      user_type_list: [
        {
          label: "普通用户",
          value: 2
        },
        {
          label: "监管用户",
          value: 3
        }
      ],
      rules: {
        user_name: [
          { required: true, message: "请输入账户名称", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        display_name: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        phone: [
          { required: false, message: "请输入正确的手机号码", trigger: "blur" }
        ],
        wxmini_openid: [
          { required: true, message: "请输入小程序用户ID", trigger: "blur" }
        ],
        wx_openid: [
          { required: true, message: "请输入公众号ID", trigger: "blur" }
        ]
      }
    };
  },
  computed: {},
  created() {},
  methods: {
    getFormData() {
      return {
        _id: "",
        user_name: "",
        display_name: "",
        phone: "",
        // password: "",
        user_type: "",
        // wxmini_openid: "",
        // wx_openid: "",
        // terminal_sims: [],
        user_status: 1
        // create_time: ""
      };
    },
    confirm() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          this.formData.create_time = this.$moment().format(
            "YYYY-MM-DD HH:MM:SS"
          );
          if (this.dialogInfo.type === "add") {
            addUser(this.formData).then(res => {
              if (res) {
                this.$message("新增成功");
                this.isShowAddDialog = false;
                this.$parent.reload();
              } else {
                this.$message("新增失败");
              }
            });
          } else if (this.dialogInfo.type === "editor") {
            // 更新用户基础信息
            let p1 = {
              id: "",
              user_name: "",
              display_name: "",
              phone: "",
              user_type: 1,
              wxmini_openid: "",
              wx_openid: ""
            };
            for (let key in p1) {
              p1[key] = this.formData[key];
            }
            // // 更新用户密码
            // let p2 = {
            //   id: "",
            //   password: ""
            // };
            // // 更新用户状态
            // let p3 = {
            //   id: "",
            //   user_status: ""
            // };
            p1["id"] = this.formData._id;
            // p2["id"] = this.formData._id;
            // p3["id"] = this.formData._id;
            // p2["password"] = md5(this.formData.password);
            // p3["user_status"] = this.formData.user_status;
            upDateBasicsInfo(p1).then(res => {
              if (res) {
                this.$message.success("修改成功");
                this.isShowAddDialog = false;
                this.$parent.reload();
              } else {
                this.$message.error("修改失败");
              }
            });
            //   axios
            //     .all([
            //       upDateBasicsInfo(p1),
            //       UpdatePassword(p2),
            //       UpdateUserStatus(p3)
            //     ])
            //     .then(
            //       axios.spread((res1, res2, res3) => {
            //         if (res1 && res2 && res3) {
            //           this.$message.success("修改成功");
            //           this.isShowAddDialog = false;
            //           this.$parent.reload();
            //         } else {
            //           this.$message.error("修改失败");
            //           this.isShowAddDialog = false;
            //         }
            //       })
            //     );
          }
        } else {
          return false;
        }
      });
    },
    closeDialog() {
      this.$refs["formData"].resetFields();
      this.isShowAddDialog = false;
    }
  },
  watch: {
    isShowAddDialog: function(newVal, oldVal) {
      if (newVal && this.dialogInfo.type == "editor") {
        this.formData = this.dialogInfo.info;
      } else if (this.dialogInfo.type == "add") {
        this.formData = this.getFormData();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__footer {
  text-align: center;
}
.select-input{
  .el-select{
    width: 100%;
  }
}
</style>