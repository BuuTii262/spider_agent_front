<template>
  <div class="app-container">
    <div class="search-wrap wrap">
      <el-form style="display: flex;">
        <el-form-item label="代理筛选" style="width:300px">
          <el-input v-model="addParams.id" placeholder="请输入代理UID" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="" style="width:400px">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            align="right"
            value-format="yyyy-MM-dd"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            >
          </el-date-picker>
        </el-form-item>
        <div class="buttonBox" style="margin-bottom:22px">
          <el-button type="primary" @click="searchHandle()">搜索</el-button>
          <!-- <el-button type="primary" @click="addMember()">添加</el-button>
          <el-button type="primary" @click="mtransferA()">会员转代理</el-button> -->
        </div>
      </el-form>
    </div>
    <div class="wrap">
      <div class="title">数据汇总</div>
      <div class="data-group">
        <div class="data-item">团队总人数：{{ totalData.member_count }}</div>
        <div class="data-item">总充值：{{ totalData.total_deposit }}</div>
        <div class="data-item">总提现：{{ totalData.total_withdraw }}</div>
        <div class="data-item">订单总金额：{{ totalData.order_amount }}</div>
        <div class="data-item">订单总数：{{ totalData.order_count }}</div>
        <div class="data-item">总收益：{{ totalData.income }}</div>
        <div class="data-item">活跃总人数：{{ totalData.order_member_count }}</div>
        <div class="data-item">新增总人数：{{ totalData.new_member }}</div>
      </div>
    </div>
    <div class="wrap">
      <el-table v-loading="listLoading" :data="dataList" element-loading-text="Loading" border fit highlight-current-row @row-click="searchID">
        <el-table-column label="代理ID" align="center" prop="id"></el-table-column>
        <el-table-column label="代理账号" align="center" prop="username" >
        </el-table-column>
        <el-table-column label="团队总人数" align="center" prop="member_count">
        </el-table-column>
        <el-table-column label="总充值" align="center" prop="total_deposit">
        </el-table-column>
        <el-table-column label="总提现" align="center" prop="total_withdraw">
        </el-table-column>
        <el-table-column label="提现中" align="center" prop="total_deposit_pending">
        </el-table-column>
        <el-table-column label="充值差" align="center" prop="benifit">
        </el-table-column>
        <el-table-column label="订单金额" align="center" prop="order_amount">
        </el-table-column>
        <el-table-column label="订单数量" align="center" prop="order_count">
        </el-table-column>
        <el-table-column label="总收益" align="center" prop="income">
        </el-table-column>
        <!-- <el-table-column label="总佣金" align="center" prop="HasMember">
        </el-table-column>
        <el-table-column label="团队佣金" align="center" prop="HasMember"> -->
        <!-- </el-table-column> -->
        <el-table-column label="活跃人数" align="center" prop="order_member_count">
        </el-table-column>
        <el-table-column label="新增人数" align="center" prop="new_member">
        </el-table-column>
      </el-table>
      
      <div class="pagination" style="margin-bottom: 20px">
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :page-sizes="modelPageOptions.pageList" :page-size="modelPageOptions.pageSize"
            layout="total, sizes, prev, pager, next" :total="modelPageOptions.total"></el-pagination>
        </div>
      </div>
    </div>
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
  </div>

</template>

<script>
import { getAgencyList } from '@/api/agency'

export default {
  filters: {},
  data() {
    return {
      query: {
        page: 1,
        page_size: 10,
      },
      addParams: {
        start_date: '',
        end_date: '',
        id: '',
      },
      dataList: [],
      listLoading: true,
      TransferDialog: false,
      editDialog: false,
      addDialog: false,
      memberDialog: false,
      dateValue: [ new Date().toISOString().slice(0, 10), new Date().toISOString().slice(0, 10)],
      createForm: {
        agent_id: '',
        password: '',
        memberId: '',
      },
      addForm: {
        user_name: '',
        password: '',
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
          { required: true, trigger: 'blur', message: '请输入上级代理账号!' },
        ],
        memberId: [
          { required: true, trigger: 'blur', message: '请输入会员ID!' },
        ],

        password: [{ required: true, trigger: 'blur', message: '请输入密码!' }],
      },
      pswrules: {
        password: [{ required: true, trigger: 'blur', message: '请输入密码!' }],
        user_name: [
          { required: true, trigger: 'blur', message: '请输入代理账号!' },
        ],
      },
      selectId: '',
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    //If click it will search that ID's lists
    searchID(row, event, column) {   
      // console.log(row,  event,  column)
      this.addParams.id = row.id;
      this.fetchData()
     },
    searchHandle() {
      this.query.page = 1
      this.fetchData()
    },
    //调整每页展示的条数
    handleSizeChange(val) {
      this.query.page_size = val
      console.log(val)
      this.fetchData()
    },
    //当前的页数
    handleCurrentChange(val) {
      this.query.page = val
      this.fetchData()
    },
    fetchData() {
      console.log(this.dateValue)
      let myParams = `?page=${this.query.page}&page_size=${this.query.page_size}`
      if (this.addParams.id) {
        myParams += `&uid=${this.addParams.id}`
      }
      if (this.dateValue.length) {
        myParams += `&start_date=${this.dateValue[0]} 00:00:00&end_date=${this.dateValue[1]} 23:59:59`
      }
      this.listLoading = true
      getAgencyList(myParams).then((res) => {
        if (res.err_code == 0) {
          this.modelPageOptions.total = res.data.total
          this.dataList = res.data.agents
          this.totalData = res.data.statistics
          this.listLoading = false
        } else {
          this.$message({
            message: res.res_msg,
            type: 'error',
          })
        }
      })
    },
    showDialog(type, row) {
      this.selectId = row.Id
      //转移代理
      if (type == 'transfer') {
        this.TransferDialog = true
      } else if (type == 'edit') {
        //编辑
        this.editDialog = true
      } else {
        //代理报表路由
        this.$router.push({
          path: '/finance',
          query: { id: row.Id },
        })
      }
    },
    addMember() {
      this.addDialog = true
    },
    mtransferA() {
      this.memberDialog = true
    },
    submit(type) {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          if (type == 'transfer') {
            var reqFn = agentTrans
            var parmasData = {
              id: this.selectId,
              agent_id: Number(this.createForm.agent_id),
            }
            var msg = '转移代理成功'
          } else if (type == 'memberTran') {
            var reqFn = agentToagent
            var parmasData = {
              id: Number(this.createForm.memberId),
            }
            var msg = '会员转代理成功！'
          } else {
            var reqFn = changePsw
            var parmasData = {
              agent_id: this.selectId,
              password: this.createForm.password,
            }
            var msg = '修改密码成功'
          }
          reqFn(parmasData).then((res) => {
            if (res.err_code == 0) {
              this.$message.success(msg)
              this.hideCreate()
              this.fetchData()
            } else {
              this.$message.error(res.err_msg)
              this.createForm.agent_id = ''
              this.createForm.password = ''
            }
          })
        }
      })
    },
    submitAdd() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          var parmasData = {
            user_name: this.addForm.user_name,
            password: this.addForm.password,
          }
          addAgent(parmasData).then((res) => {
            console.log(123)
            if (res.err_code == 0) {
              this.$message.success('添加代理成功')
              this.hideAddCreate()
              this.fetchData()
            } else {
              this.addForm.user_name = ''
              this.addForm.password = ''
            }
          })
        }
      })
    },
    hideCreate() {
      this.TransferDialog = false
      this.editDialog = false
      this.memberDialog = false
      this.addDialog = false
      this.createForm = {
        agent_id: '',
        memberId: '',
      }
      this.addForm = {
        user_name: '',
        password: '',
      }
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.createForm.resetFields()
          this.$refs.addForm.resetFields()
        }, 500)
      })
    },
    hideAddCreate() {
      this.addDialog = false
      this.addForm = {
        user_name: '',
        password: '',
      }
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.addForm.resetFields()
        }, 500)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
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
