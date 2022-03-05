<template>
  <div class="app-container">
    <div class="top">
      <div class="name">理财报表</div>
      <div class="wrap">
        <span>总入金：{{ parseFloat(totalData.TotalDeposite) || 0 }} USDT</span>
        <span>总出金：{{ parseFloat(totalData.TodayWithdraw) || 0 }} USDT</span>
        <span>今日入金：{{ parseFloat(totalData.TodayDeposit) || 0 }} USDT</span>
        <span>今日出金：{{ parseFloat(totalData.TotalWithdraw) || 0 }} USDT</span>
        <span>总待审核入金人数：{{ totalData.TodayPendingWithDrawUser || 0 }} 人</span>
        <span>今日待审核入金人数：{{ totalData.TodayPendingWithDrawUser || 0 }} 人</span>
        <span>今日出金待审核：{{ parseFloat(totalData.TodayPendingWithDraw) || 0 }} USDT</span>
      </div>
      <div class="search">
        <label>代理ID</label>
        <el-input v-model="searchValue" placeholder="请输入代理ID" style="width: 200px"></el-input>
        <el-button size="small" type="primary" @click="searchHandle()" style="width: 100px">搜索</el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="代理ID">
        <template slot-scope="scope">
          {{ scope.row.Id }}
        </template>
      </el-table-column>
      <el-table-column label="账号" align="center">
        <template slot-scope="scope">
          {{ scope.row.UserName }}
        </template>
      </el-table-column>
      <el-table-column label="代理类型" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.AgentId !== 0 ? '官代' : '玩家'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="上级代理" align="center">
        <template slot-scope="scope">
          {{ scope.row.UpName }}
        </template>
      </el-table-column>
      <el-table-column label="推广人数" align="center">
        <template slot-scope="scope">
          {{ scope.row.HasMember }}
        </template>
      </el-table-column>
      <el-table-column label="账户余额(USDT)" align="center">
        <template slot-scope="scope">
          {{ parseFloat(scope.row.Balance) }}
        </template>
      </el-table-column>
      <el-table-column label="充值金额(USDT)" align="center">
        <template slot-scope="scope">
          {{ parseFloat(scope.row.Deposit) }}
        </template>
      </el-table-column>
      <el-table-column label="提现金额(USDT)" align="center">
        <template slot-scope="scope">
          {{ parseFloat(scope.row.Withdraw) }}
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { reportView } from "@/api/agency";

export default {
  data() {
    return {
      list: null,
      listLoading: false,
      params: {
        page: 1,
        page_size: 10,
        Id: null,
      },
      searchValue: "",
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
    this.params.Id = parseInt(this.$route.query.id) || null;
    this.fetchData();
    console.log(999);
    console.log(this.$route.query.id);
  },
  methods: {
    //调整每页展示的条数
    handleSizeChange(val) {
      this.modelPageOptions.pageSize = val;
      this.getList();
    },

        //当前的页数
    handleCurrentChange(val) {
      this.modelPageOptions.page = val;
      this.getList();
    },

    fetchData() {
      this.listLoading = true;
      reportView(this.params).then((response) => {
        this.listLoading = false;
        this.modelPageOptions.total = response.Data.ListData.total;
        this.totalData = response.Data.Sum;
        this.list = response.Data.ListData.data;
      });
    },
    searchHandle() {
      this.params.id = parseInt(this.searchValue);
      this.fetchData();
    },
  },
};
</script>
<style scoped lang="scss">
.top {
  font-size: 16px;
  margin-bottom: 30px;
  .name {
    font-weight: bold;
    margin-bottom: 10px;
  }
  .wrap {
    span {
      display: inline-block;
      margin: 0 150px 10px 0;
      line-height: 30px;
    }
  }
  .search {
    display: flex;
    label {
      line-height: 40px;
    }
    .el-input {
      margin: 0 20px 0 10px;
    }
  }
}
</style>
