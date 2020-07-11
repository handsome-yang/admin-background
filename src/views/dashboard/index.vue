<template>
  <div class="dashboard-container">
    <div class="rules">
      <el-button class="add-user" @click="openAddDialog">新增</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column min-width="20%" align="center" prop="display_name" label="用户名称" width="180"></el-table-column>
      <el-table-column min-width="20%" align="center" prop="user_name" label="账号名称" width="180"></el-table-column>
      <el-table-column min-width="20%" align="center" prop="user_type" label="用户类型">
        <template slot-scope="scope">
          <span>{{userTypeRules[scope.row.user_type - 1]}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="20%" align="center" prop="user_status" label="用户状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.user_status === 1 ? 'success' : 'primary'"
            disable-transitions
          >{{userStatusRules[scope.row.user_status - 1]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="20%" align="center" label="操作">
        <template slot-scope="scope">
          <el-link @click="editorUserInfo(scope.row)" icon="el-icon-edit">编辑</el-link>
          <el-link
            class="editor-password"
            @click="editorPassword(scope.row)"
            icon="el-icon-lock"
          >修改密码</el-link>
          <el-link @click="updataUserStatus(scope.row)" icon="el-icon-delete">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <AddDialog :dialogInfo="dialogInfo" ref="add-dialog" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AddDialog from "./components/AddDialog";
import { searchUser, UpdateUserStatus, UpdatePassword } from "./api";
export default {
  name: "Dashboard",
  inject: ["reload"],
  computed: {},
  components: {
    AddDialog
  },
  data() {
    return {
      isShowAddDialog: false,
      dialogInfo: {
        type: "add",
        info: null
      },
      tableData: [],
      searchRules: {
        search: ""
      },
      userStatusRules: ["正常", "禁用", "删除"],
      userTypeRules: ["管理员", "普通用户", "监管用户"]
    };
  },
  created() {
    this.$nextTick(() => {
      searchUser(this.searchRules).then(res => {
        this.tableData = res;
      });
    });
  },
  computed: {},
  methods: {
    openAddDialog() {
      this.dialogInfo.type = "add";
      this.$refs["add-dialog"].isShowAddDialog = true;
    },
    editorUserInfo(row) {
      // "id": "string",
      // "user_name": "string",
      // "display_name": "string",
      // "phone": "string",
      // "user_type": 1,
      // "wxmini_openid": "string",
      // "wx_openid": "string"
      this.dialogInfo.type = "editor";
      this.dialogInfo.info = row;
      this.$refs["add-dialog"].isShowAddDialog = true;
    },
    editorPassword(row) {
      // UpdatePassword
      this.$prompt("请输入新密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "password",
        inputPattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/,
        inputErrorMessage: "密码由字母和数字组成，且不少于6位"
      })
        .then(({ value }) => {
          UpdatePassword({ id: row._id, password: md5(value) }).then(res => {
            if (res) {
              this.$message.success("修改成功");
            } else {
              this.$message.error("修改失败");
            }
          });
        })
        .catch(() => {});
    },
    updataUserStatus(row) {
      let params = {
        id: row._id,
        user_status: 2
      };
      this.confirmDialog(
        "该条数据将被删除,请确认是否删除",
        UpdateUserStatus,
        params
      );
    },
    confirmDialog(des, callback, params) {
      this.$confirm(`${des}`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        callback(params).then(res => {
          this.$refs["add-dialog"].isShowAddDialog = false;
          if (res) {
            this.$message.success("成功!");
            this.reload();
          } else {
            this.$message.error("失败!");
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
  box-sizing: border-box;
}
.rules {
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .add-user {
    height: 40px;
  }
}
::v-deep.editor-password {
  margin: 0 5px;
}
</style>
