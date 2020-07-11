<template>
  <div class="container">
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
          <el-button size="mini" @click="openDialog(scope.row._id)" type="primary">车辆分配</el-button>
        </template>
      </el-table-column>
    </el-table>
    <modify-dialog :userid="userid" ref="modify-dialog"></modify-dialog>
  </div>
</template>

<script>
import { searchUser } from "./api";
import modifyDialog from "./components/modifyDialog";
export default {
  inject:["reload"],
  name: "Cardistribution",
  components: {
    modifyDialog
  },
  data() {
    return {
      tableData: [],
      userTypeRules: ["管理员", "普通用户", "监管用户"],
      userStatusRules: ["正常", "禁用", "删除"],
      userid:null
    };
  },
  methods: {
    getUserList() {
      const params = {
        search: ""
      };
      searchUser(params).then(res => {
        this.tableData = res;
      });
    },
    openDialog(id) {
      this.userid = id
      this.$refs["modify-dialog"].isShowAddDialog = true;
    }
  },
  mounted() {
    this.getUserList();
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 50px);
  // background: url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594272814607&di=6da9cf4441ae23714be034dfc4aa64a1&imgtype=0&src=http%3A%2F%2Fwww.foxuc.com%2Fimages%2Fsorry_building.jpg")
  //   no-repeat center center;
}
</style>