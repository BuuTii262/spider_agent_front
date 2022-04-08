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
        <el-table-column label="id" align="center" prop="id" />
        <el-table-column label="username" align="center" prop="username" />
        <el-table-column label="nickname" align="center" prop="nickname" />
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
            disabled
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMembersDetail } from "@/api/agency";

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
      if (this.addParams.id) {
        myParams += `&agent_id=${this.addParams.id}`;
      }
      if (this.dateValue.length) {
        myParams += `&start_date=${this.dateValue[0]} 00:00:00&end_date=${this.dateValue[1]} 23:59:59`;
      }
      this.listLoading = true;
      getMembersDetail(myParams).then((res) => {
        if (res.err_code == 0) {
          this.modelPageOptions.total = res.data.total;
          this.dataList = res.data;
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
