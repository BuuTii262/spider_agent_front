<template>
  <div class="app-container">
    <!-- <div class="search-wrap wrap">
      <el-form style="display: flex">
        <el-form-item label="代理筛选" style="width: 300px">
          <el-input
            v-model="addParams.id"
            placeholder="请输入代理UID"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="" style="width: 400px">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            align="right"
            value-format="yyyy-MM-dd"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :editable="false"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <div class="buttonBox" style="margin-bottom: 22px">
          <el-button type="primary" @click="searchHandle()">搜索</el-button>
        </div>
      </el-form>
    </div> -->
    
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
            <div>{{scope.row.agent_nickname == '' ? "-" : scope.row.agent_nickname}}</div>
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
            <div>{{scope.row.renew == '1' ? "是" : "否" }}</div>
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
    <el-dialog
      title="代理转移"
      :visible.sync="TransferDialog"
      width="40%"
      top="5vh"
      :before-close="hideCreate"
      :close-on-click-modal="false"
    >
      <el-form
        ref="createForm"
        :model="createForm"
        :rules="rules"
        label-width="120px"
        class="modifyForm"
      >
        <el-form-item label="上级代理账号" prop="agent_id">
          <el-input
            v-model="createForm.agent_id"
            show-word-limit
            placeholder="请输入上级代理账号"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideCreate">取消</el-button>
        <el-button type="success" @click="submit('transfer')">确定</el-button>
      </span>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="editDialog"
      width="40%"
      top="5vh"
      :before-close="hideCreate"
      :close-on-click-modal="false"
    >
      <el-form
        ref="createForm"
        :model="createForm"
        :rules="pswrules"
        label-width="120px"
        class="modifyForm"
      >
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="createForm.password"
            show-word-limit
            placeholder="请输入修改的密码"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideCreate">取消</el-button>
        <el-button type="success" @click="submit('edit')">确定</el-button>
      </span>
    </el-dialog>
    <!-- 添加会员 -->
    <el-dialog
      title="添加代理"
      :visible.sync="addDialog"
      width="40%"
      top="5vh"
      :before-close="hideCreate"
      :close-on-click-modal="false"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="pswrules"
        label-width="120px"
        class="modifyForm"
      >
        <el-form-item label="代理账号" prop="user_name">
          <el-input
            v-model="addForm.user_name"
            show-word-limit
            placeholder="请输入账号"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="addForm.password"
            show-word-limit
            placeholder="请输入修改的密码"
          >
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="上级" prop="password">
          <el-input v-model="createForm.password" show-word-limit placeholder="请输入上级">
          </el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideAddCreate">取消</el-button>
        <el-button type="success" @click="submitAdd">确定</el-button>
      </span>
    </el-dialog>
    <!-- 会员转代理弹窗 -->
    <el-dialog
      title="会员转代理"
      :visible.sync="memberDialog"
      width="40%"
      top="5vh"
      :before-close="hideCreate"
      :close-on-click-modal="false"
    >
      <el-form
        ref="createForm"
        :model="createForm"
        :rules="rules"
        label-width="120px"
        class="modifyForm"
      >
        <el-form-item label="会员ID" prop="memberId">
          <el-input
            v-model="createForm.memberId"
            show-word-limit
            placeholder="请输入会员ID"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideCreate">取消</el-button>
        <el-button type="success" @click="submit('memberTran')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAgencyList, getOrders } from "@/api/agency";

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
      TransferDialog: false,
      editDialog: false,
      addDialog: false,
      memberDialog: false,
      dateValue: [],
      createForm: {
        agent_id: "",
        password: "",
        memberId: "",
      },
      addForm: {
        user_name: "",
        password: "",
      },
      totalData: {},
      modelPageOptions: {
        page: 1, //列表 -- 当前页码
        total: 0, //列表 -- 数据总数
        pageSize: 10, //列表 -- 页码大小
        pageList: [10, 20, 60, 80, 100], //列表 -- 当页显示多少数据
      },
      rules: {
        agent_id: [
          { required: true, trigger: "blur", message: "请输入上级代理账号!" },
        ],
        memberId: [
          { required: true, trigger: "blur", message: "请输入会员ID!" },
        ],

        password: [{ required: true, trigger: "blur", message: "请输入密码!" }],
      },
      pswrules: {
        password: [{ required: true, trigger: "blur", message: "请输入密码!" }],
        user_name: [
          { required: true, trigger: "blur", message: "请输入代理账号!" },
        ],
      },
      selectId: "",
    };
  },
  created() {
    console.log(this.$route.query.id + " = H ah aha ha");
    this.$route.query.id ? this.addParams.id = this.$route.query.id : "";
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
      } else if (this.$route.query.id) {
        myParams += `&agent_id=${this.$route.query.id}`;
      }
      if (this.dateValue.length) {
        myParams += `&start_date=${this.dateValue[0]} 00:00:00&end_date=${this.dateValue[1]} 23:59:59`;
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
    showDialog(type, row) {
      this.selectId = row.Id;
      //转移代理
      if (type == "transfer") {
        this.TransferDialog = true;
      } else if (type == "edit") {
        //编辑
        this.editDialog = true;
      } else {
        //代理报表路由
        this.$router.push({
          path: "/finance",
          query: { id: row.Id },
        });
      }
    },
    addMember() {
      this.addDialog = true;
    },
    mtransferA() {
      this.memberDialog = true;
    },
    submit(type) {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          if (type == "transfer") {
            var reqFn = agentTrans;
            var parmasData = {
              id: this.selectId,
              agent_id: Number(this.createForm.agent_id),
            };
            var msg = "转移代理成功";
          } else if (type == "memberTran") {
            var reqFn = agentToagent;
            var parmasData = {
              id: Number(this.createForm.memberId),
            };
            var msg = "会员转代理成功！";
          } else {
            var reqFn = changePsw;
            var parmasData = {
              agent_id: this.selectId,
              password: this.createForm.password,
            };
            var msg = "修改密码成功";
          }
          reqFn(parmasData).then((res) => {
            if (res.err_code == 0) {
              this.$message.success(msg);
              this.hideCreate();
              this.fetchOrderData();
            } else {
              this.$message.error(res.err_msg);
              this.createForm.agent_id = "";
              this.createForm.password = "";
            }
          });
        }
      });
    },
    submitAdd() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          var parmasData = {
            user_name: this.addForm.user_name,
            password: this.addForm.password,
          };
          addAgent(parmasData).then((res) => {
            console.log(123);
            if (res.err_code == 0) {
              this.$message.success("添加代理成功");
              this.hideAddCreate();
              this.fetchOrderData();
            } else {
              this.addForm.user_name = "";
              this.addForm.password = "";
            }
          });
        }
      });
    },
    hideCreate() {
      this.TransferDialog = false;
      this.editDialog = false;
      this.memberDialog = false;
      this.addDialog = false;
      this.createForm = {
        agent_id: "",
        memberId: "",
      };
      this.addForm = {
        user_name: "",
        password: "",
      };
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.createForm.resetFields();
          this.$refs.addForm.resetFields();
        }, 500);
      });
    },
    hideAddCreate() {
      this.addDialog = false;
      this.addForm = {
        user_name: "",
        password: "",
      };
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.addForm.resetFields();
        }, 500);
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
