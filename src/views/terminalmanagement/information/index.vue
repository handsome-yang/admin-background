<template>
  <section class="container">
    <div class="list page">
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
  </section>
</template>

<script>
import { QueryCarInfo } from "./api";
export default {
  name: "Information",
  data() {
    return {
      total: 999,
      pageInfo: {
        terminal_sim: ""
      },
      tableData: [],
      tableLoading: false,
      tableHeight: 300
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
    sortChange() {},
    selectionChange() {},
    handleClick() {},
    sizeChange() {},
    currentChange() {},
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
        100;
      console.log(document.querySelector(".app-main").offsetHeight);
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
</style>