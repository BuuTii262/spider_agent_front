<template>
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-form style=" margin-left: 10px;display: flex; align-items: center;margin:50px">
        <el-form-item label="代理筛选" style="width:400px">
          <el-input v-model="query.id" placeholder="请输入代理账号" style="width: 200px"></el-input>
        </el-form-item>
        <div class="buttonBox" style="margin-bottom:22px">
          <el-button type="primary" @click="fetchData()">搜索</el-button>
          <el-button type="primary" @click="addMember()">添加</el-button>
          <el-button type="primary" @click="mtransferA()">会员转代理</el-button>
        </div>
      </el-form>
    </div>

    <el-table v-loading="listLoading" :data="dataList" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="账号" align="center" prop="UserName">
      </el-table-column>
      <el-table-column label="上级" align="center" prop="UpName">
      </el-table-column>
      <el-table-column label="下级数量" align="center" prop="HasMember">
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="400">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="showDialog('transfer',scope.row)">代理转移</el-button>
          <el-button type="primary" size="small" icon="el-icon-search" @click="showDialog('report',scope.row)">报表
          </el-button>
          <el-button type="success" size="small" icon="el-icon-edit" @click="showDialog('edit',scope.row)">修改密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="代理转移" :visible.sync="TransferDialog" width="40%" top="5vh" :before-close="hideCreate"
      :close-on-click-modal="false">
      <el-form ref="createForm" :model="createForm" :rules="rules" label-width="120px" class="modifyForm">
        <el-form-item label="上级代理账号" prop="agent_id">
          <el-input v-model="createForm.agent_id" show-word-limit placeholder="请输入上级代理账号">
          </el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideCreate">取消</el-button>
        <el-button type="success" @click="submit('transfer')">确定</el-button>
      </span>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="editDialog" width="40%" top="5vh" :before-close="hideCreate"
      :close-on-click-modal="false">
      <el-form ref="createForm" :model="createForm" :rules="pswrules" label-width="120px" class="modifyForm">
        <el-form-item label="密码" prop="password">
          <el-input v-model="createForm.password" show-word-limit placeholder="请输入修改的密码">
          </el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideCreate">取消</el-button>
        <el-button type="success" @click="submit('edit')">确定</el-button>
      </span>
    </el-dialog>
    <!-- 添加会员 -->
    <el-dialog title="添加代理" :visible.sync="addDialog" width="40%" top="5vh" :before-close="hideCreate"
      :close-on-click-modal="false">
      <el-form ref="addForm" :model="addForm" :rules="pswrules" label-width="120px" class="modifyForm">
        <el-form-item label="代理账号" prop="user_name">
          <el-input v-model="addForm.user_name" show-word-limit placeholder="请输入账号">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" show-word-limit placeholder="请输入修改的密码">
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
    <el-dialog title="会员转代理" :visible.sync="memberDialog" width="40%" top="5vh" :before-close="hideCreate"
      :close-on-click-modal="false">
      <el-form ref="createForm" :model="createForm" :rules="rules" label-width="120px" class="modifyForm">
        <el-form-item label="会员ID" prop="memberId">
          <el-input v-model="createForm.memberId" show-word-limit placeholder="请输入会员ID">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideCreate">取消</el-button>
        <el-button type="success" @click="submit('memberTran')">确定</el-button>
      </span>
    </el-dialog>
    <div class="pagination" style="margin-bottom: 20px">
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :page-sizes="modelPageOptions.pageList" :page-size="modelPageOptions.pageSize"
          layout="total, sizes, prev, pager, next" :total="modelPageOptions.total"></el-pagination>
      </div>
    </div>
  </div>

</template>

<script>
import {
  getAgencyList,
  agentTrans,
  changePsw,
  agentToagent,
  addAgent,
} from "@/api/agency";

export default {
  filters: {},
  data() {
    return {
      query: {
        id: null,
        page: 1,
        page_size: 20,
      },
      dataList: [],
      listLoading: true,
      TransferDialog: false,
      editDialog: false,
      addDialog: false,
      memberDialog: false,
      createForm: {
        agent_id: "",
        password: "",
        memberId: "",
      },
      addForm: {
        user_name: "",
        password: "",
      },
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
    this.fetchData();
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
      console.log(this.query.id, "this.query.id");
      if (this.query.id !== null || this.query.id !== "") {
        this.query.id = Number(this.query.id);
      }
      var data = this.query;
      getAgencyList(data).then((res) => {
        if (res.err_code == 0) {
          this.modelPageOptions.total = res.Data.Total;
          this.dataList = res.Data.Data;
          console.log();
          this.listLoading = false;
        } else {
          this.$message({
            message: res.res_msg,
            type: "error",
          });
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
              this.fetchData();
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
              this.fetchData();
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
