<template>
  <div class="app-container">
    <div class="wrap">
      <el-table
        v-loading="listLoading"
        :data="dataList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="用户ID" align="center" prop="id" />
        <el-table-column label="金额" align="center" prop="amount" />
        <el-table-column label="账变类型" align="center">
          <template slot-scope="scope">
            {{ scope.row.flow_type | flowFilter }}
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="status">
          <template slot-scope="scope">
            {{ scope.row.status | statusFilter }}
          </template>
        </el-table-column>
        <el-table-column label="币" align="center" prop="symbol" />
        <el-table-column label="账变时间" align="center" prop="created_at" />
      </el-table>

      <div class="pagination" style="margin-bottom: 20px">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="modelPageOptions.pageList"
            :page-size="modelPageOptions.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="modelPageOptions.total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFinanceDetail } from "@/api/agency";

export default {
  filters: {},
  data() {
    return {
      query: {
        page: 1,
        page_size: 10,
      },
      addParams: {
        start_date: "",
        end_date: "",
        id: "",
      },
      dataList: [],
      listLoading: true,
      dateValue: [],
      modelPageOptions: {
        page: 1, //列表 -- 当前页码
        total: 0, //列表 -- 数据总数
        pageSize: 10, //列表 -- 页码大小
        pageList: [10, 20, 60, 80, 100], //列表 -- 当页显示多少数据
      },
    };
  },
  created() {
    console.log(this.$route.query.id + " = H ah aha ha");

    this.$route.query.id ? (this.addParams.id = this.$route.query.id) : "";

    this.$route.query.startDate && this.$route.query.endDate
      ? (this.dateValue = [
          this.$route.query.startDate,
          this.$route.query.endDate,
        ])
      : (this.dateValue = []);

    this.fetchData();
  },
  filters: {
    statusFilter(val) {
      switch (val) {
        case 1:
          return "购买";
        case 2:
          return "(赎回)违约";
        case 3:
          return "正常到期赎回";
        case 4:
          return "派息";
        case 11:
          return "从现货转入";
        case 12:
          return "从来理财转出";
        default:
          return "--";
      }
    },
    flowFilter(val) {
      switch (val) {
        case 1:
          return "增加";
        case 2:
          return "减少";
        default:
          return "--";
      }
    },
  },
  methods: {
    searchHandle() {
      this.query.page = 1;
      this.fetchData();
    },
    //调整每页展示的条数
    handleSizeChange(val) {
      this.query.page_size = val;
      console.log(val);
      this.fetchData();
    },
    //当前的页数
    handleCurrentChange(val) {
      this.query.page = val;
      this.fetchData();
    },
    fetchData() {
      console.log(this.dateValue);
      let myParams = `?`;
      if (this.addParams.id) {
        myParams += `uid=${this.addParams.id}`;
      }
      const date = localStorage.getItem("searchDate");
      console.log(date)
      console.log(JSON.parse(date));
      if (this.date) {
        myParams += `&start_date=${JSON.parse(date)[0]} 00:00:00`;
        myParams += `&end_date=${JSON.parse(date)[1]} 23:59:59`;
      }
      myParams += `&page=${this.query.page}&page_size=${this.query.page_size}`;
      this.listLoading = true;
      getFinanceDetail(myParams).then((res) => {
        if (res.err_code == 0) {
          this.modelPageOptions.total = res.data.total;
          this.dataList = res.data.finances;
          this.listLoading = false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.blue {
  color: blue;
  text-decoration: underline;
}
.wrap {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 20px;
  .title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .data-group {
    font-size: 0;
    .data-item {
      display: inline-block;
      font-size: 16px;
      line-height: 30px;
      margin-right: 40px;
    }
  }
}
</style>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
