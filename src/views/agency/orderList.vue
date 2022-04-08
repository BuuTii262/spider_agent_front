<template>
  <div class="app-container">
    <div class="search-wrap wrap">
      <p class="title">订单列表</p>

      <el-form
        label-position="top"
        label-width="300px"
        style="margin-left: 10px; display: flex; flex-wrap: wrap"
      >
        <el-form-item
          label="用户类型 "
          label-width="150px"
          style="margin-right: 30px; min-width: 200px"
        >
          <el-select
            v-model="user_type"
            :multiple="false"
            filterable
            allow-create
            default-first-option
            placeholder="请选择币种"
          >
            <el-option
              v-for="(item, index) in User_Type"
              :key="index"
              :value="item.value"
              :label="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="用户UID"
          label-width="150px"
          style="margin-right: 30px; min-width: 200px"
        >
          <el-input v-model="uid" placeholder="请输入用户UID"></el-input>
        </el-form-item>
        <el-form-item
          label="产品名称"
          label-width="150px"
          style="margin-right: 30px; min-width: 200px"
        >
          <el-input
            v-model="product_status"
            placeholder="输入产品名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="订单状态 "
          label-width="150px"
          style="margin-right: 30px; min-width: 200px"
        >
          <el-select
            v-model="product_status"
            :multiple="false"
            filterable
            allow-create
            default-first-option
            placeholder="订单状态"
          >
            <el-option
              v-for="(item, index) in Order_Status"
              :key="index"
              :value="item.value"
              :label="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="开始日期"
          label-width="150px"
          style="margin-right: 30px; min-width: 200px"
        >
          <el-date-picker
            v-model="formOptions.TimeStart"
            type="date"
            placeholder="选择开始日期"
            value-format="yyyy-MM-dd"
            @change="optionsTimeStratChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="结束日期"
          label-width="150px"
          style="margin-right: 30px; min-width: 200px"
        >
          <el-date-picker
            v-model="formOptions.TimeEnd"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间"
            @change="optionsTimeEndChange"
          ></el-date-picker>
        </el-form-item>
        <div style="margin-top: 50px" class="buttonBox">
          <el-button type="primary" @click="fetchData(true)">搜索</el-button>
        </div>
      </el-form>
    </div>
    <div class="wrap">
      <p class="title">数据列表</p>
      <el-table
        v-loading="listLoading"
        :data="dataList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="用户信息" align="center">
          <template slot-scope="scope">
            <div><span>所属代理 : </span>{{ scope.row.username }}</div>
            <div><span>用户UID : </span>{{ scope.row.user_id }}</div>
          </template>
        </el-table-column>
        <el-table-column label="产品信息" align="center">
          <template slot-scope="scope">
            <div>产品名称 : {{ scope.row.finance_name }}</div>
            <div>投资金额 : {{ scope.row.single_amount }}</div>
            <div>开始时间 : {{ scope.row.finance_start_time }}</div>
            <div>
              结束时间 :
              {{
                scope.row.finance_end_time ? scope.row.finance_end_time : "--"
              }}
            </div>
            <div>产品分类 : {{ scope.row.finance_type }}</div>
            <div>买入时间 : {{ scope.row.finance_buy_time }}</div>
          </template>
        </el-table-column>
        <el-table-column label="天数" align="center">
          <template slot-scope="scope">
            <div><span>自动续约 : </span>{{ scope.row.is_renew }}</div>
            <div><span>自动审核 : </span>{{ scope.row.is_audit }}</div>
            <div><span>派息时间 : </span>{{ scope.row.payout_time }}</div>
            <div><span>最后派息 : </span>{{ scope.row.last_payout_time }}</div>
            <div><span>理财周期 : </span>1 {{ scope.row.billing_cycle | billingCycle }}</div>
            <div>
              <span>总派次数 : </span>{{ scope.row.billing_cycle_total }}
            </div>
            <div><span>已派次数 : </span>{{ scope.row.have_payout }}</div>
          </template>
        </el-table-column>
        <el-table-column label="审核结果" align="center">
          <template slot-scope="scope">
            <div><span>类型 : </span>{{ scope.row.order_status }}</div>
            <div><span>结果 : </span>{{ scope.row.result }}</div>
            <div><span>用户 : </span>{{ scope.row.username }}</div>
            <div><span> 时间 : </span>{{ scope.row.order_end_time }}</div>
            <div><span>说明 : </span>{{ scope.row.user_id }}</div>
          </template>
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
import { getAgentOrders } from "@/api/agency";

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
      user_type: "",
      uid: "",
      product_status: "",
      order_status: "",
      formOptions: {
        TimeStart: "",
        TimeEnd: "",
      },
    };
  },
  filters: {
    billingCycle(val) {
      switch (val) {
        case "min":
          return "分钟";
        case "hour":
          return "小时";
        case "day":
          return "天";
        case "mon":
          return "月";
      }
    }
  },
  computed: {
    User_Type() {
      let result = [
        {
          value: "",
          label: "全部",
        },
        {
          value: "1",
          label: "会员",
        },
        {
          value: "2",
          label: "代理",
        },
      ];
      return result;
    },
    Order_Status() {
      let result = [
        {
          value: "",
          label: "全部",
        },
        {
          value: "1",
          label: "进行中",
        },
        {
          value: "2",
          label: "完成",
        },
        {
          value: "3",
          label: "已赎回",
        },
        {
          value: "4",
          label: "拒绝",
        },
        {
          value: "5",
          label: "待审核",
        },
      ];
      return result;
    },
  },
  created() {
    // console.log();

    this.fetchData();
  },
  mounted() {
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
      }
    },
    flowFilter(val) {
      switch (val) {
        case 0:
          return "-";
        case 1:
          return "增加";
        case 2:
          return "减少";
      }
    },
  },
  methods: {
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
    fetchData(offset) {
      console.log(this.dateValue);
      let myParams = `?`;
      if (this.addParams.id) {
        myParams += `uid=${this.addParams.id}`;
      }
      myParams += `&page=${this.query.page}&page_size=${this.query.page_size}`;

      // let myParams = {};
      // if (offset) {
      //   myParams["page"] = 1;
      // } else {
      //   const offset = this.query.page;
      //   myParams["page"] = offset;
      // }
      // if (this.query.pageSize) {
      //   myParams["page_size"] = this.query.pageSize;
      // }
      // if (this.user_type) {
      //   myParams["user_type"] = this.user_type;
      // // myParams +=
      // }
      // if (this.uid) {
      //   myParams["uid"] = this.uid;
      // }
      // if (this.product_status) {
      //   myParams["product_status"] = this.product_status;
      // }
      // if (this.order_status) {
      //   myParams["order_status"] = this.order_status;
      // }
      // if (this.formOptions.TimeStart) {
      //   myParams["start_date"] = this.formOptions.TimeStart;
      // }
      // if (this.formOptions.TimeEnd) {
      //   myParams["end_date"] = this.formOptions.TimeEnd;
      // }
      // console.log(myParams)
      this.listLoading = true;
      getAgentOrders(myParams).then((res) => {
        if (res.err_code == 0) {
          this.modelPageOptions.total = res.data.total;
          this.dataList = res.data.orders;

          this.listLoading = false;
        }
      });
    },
    optionsTimeStratChange(val) {
      this.formOptions.TimeStart = `${val} 00:00:00`;
      console.log(this.formOptions.TimeStart);
    },
    optionsTimeEndChange(val) {
      this.formOptions.TimeEnd = `${val} 23:59:59`;
      console.log(this.formOptions.TimeEnd);
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
