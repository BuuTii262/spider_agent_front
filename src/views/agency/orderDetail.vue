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
        <el-table-column label="UID" align="center" prop="user_id">
        </el-table-column>
        <el-table-column label="用户名" align="center" prop="username">
        </el-table-column>
        <el-table-column label="所属代理" align="center">
          <template slot-scope="scope">
            <div>
              {{
                scope.row.agent_nickname == "" ? "-" : scope.row.agent_nickname
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单名称" align="center" prop="period">
        </el-table-column>
        <el-table-column label="订单金额" align="center" prop="amount">
        </el-table-column>
        <el-table-column label="订单状态" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 1">正常</div>
            <div v-if="scope.row.status == 2">违约</div>
            <div v-if="scope.row.status == 3">结束</div>
          </template>
        </el-table-column>
        <el-table-column label="是否续约" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.renew == "1" ? "是" : "否" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单开始时间" align="center" prop="created_at">
        </el-table-column>
        <el-table-column label="订单结束时间" align="center" prop="ended_at">
        </el-table-column>
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
import { getOrders } from "@/api/agency";

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
      totalData: {},
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
    this.fetchOrderData();
  },
  methods: {
    searchHandle() {
      this.query.page = 1;
      this.fetchOrderData();
    },
    //调整每页展示的条数
    handleSizeChange(val) {
      this.query.page_size = val;
      console.log(val);
      this.fetchOrderData();
    },
    //当前的页数
    handleCurrentChange(val) {
      this.query.page = val;
      this.fetchOrderData();
    },
    fetchOrderData() {
      console.log(this.dateValue);
      let myParams = `?page=${this.query.page}&page_size=${this.query.page_size}`;

      const date = localStorage.getItem("searchDate");
      console.log(JSON.parse(date));
      if (this.data) {
        myParams += `&start_date=${JSON.parse(date)[0]} 00:00:00`;
        myParams += `&end_date=${JSON.parse(date)[1]} 23:59:59`;
      }
      if (this.addParams.id) {
        myParams += `&agent_id=${this.addParams.id}`;
      } else if (this.$route.query.id) {
        myParams += `&agent_id=${this.$route.query.id}`;
      }
      this.listLoading = true;
      getOrders(myParams).then((res) => {
        if (res.err_code == 0) {
          this.modelPageOptions.total = res.data.total;
          this.dataList = res.data.orders;
          this.totalData = res.data.statistics;
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
