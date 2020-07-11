<template>
  <el-dialog :visible.sync="isShowAddDialog">
    <el-transfer
      filterable
      filter-placeholder="请输入SIM号"
      v-model="addData"
      :data="unAddData"
      :titles="['未分配','已分配']"
    ></el-transfer>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { QueryUserBelongedCar, QuerySIM, DispatchUserCars } from "../api";
export default {
  props: ["userid"],
  data() {
    return {
      isShowAddDialog: false,
      unAddData: [],
      addData: []
    };
  },
  methods: {
    closeDialog() {
      this.isShowAddDialog = false;
    },
    confirm() {
      const params = {
        id: this.userid,
        sims: this.addData
      };
      DispatchUserCars(params).then(res => {
        if(res){
          this.$message.success("分配成功")
          this.isShowAddDialog = false
          this.$parent.reload()
        }
      });
    }
  },
  computed: {
    getUserId() {
      return this.userid;
    }
  },
  watch: {
    getUserId: function(newVal, oldVal) {
      const _this = this;
      if (newVal) {
        QueryUserBelongedCar({ userid: newVal }).then(res => {
          this.addData = res;
        });
        QuerySIM().then(res => {
          const _unAddData = res.map(item => {
            return { label: item, key: item };
          });
          this.unAddData = _unAddData;
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-transfer {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
::v-deep .el-dialog__footer {
  text-align: center;
}
</style>