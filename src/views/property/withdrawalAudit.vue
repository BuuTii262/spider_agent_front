<template>
  <div class="wrap">
    <el-card style="margin-bottom: 10px">
      <!-- 顶部操作区域 -->
      <el-form style=" margin-left: 10px;display: flex; align-items: center;margin:50px; flex-wrap: wrap;">
        <!-- 币种 -->
        <el-form-item label="币种" style="width:400px">
          <el-input v-model="coin_code" placeholder="请输入币种" style="width: 200px" />
        </el-form-item>
        <!-- 充值状态 -->
        <el-form-item label="审核状态" style="width:400px">
          <el-select v-model="status" placeholder="请选择充值状态">
            <el-option v-for="(item, index) in statusList" :key="index" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间" style="min-width:500px">
          <el-date-picker
            v-model="formOptions.TimeStart"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 200px; margin-right: 30px"
            @change="optionsTimeStratChange"
          />
          <el-date-picker
            v-model="formOptions.TimeEnd"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 200px"
            @change="optionsTimeEndChange"
          />
        </el-form-item>
      </el-form>
      <div style="margin-top: 34px" class="buttonBox">
        <el-button type="primary" @click="getList(true)">搜索</el-button>
      </div>
    </el-card>
    <el-card>
      <el-table v-loading="loading" :data="tableData" style="width: 100%" empty-text="暂无数据">
        <el-table-column prop="list1" label="入账时间" min-width="150" fit />
        <!-- <el-table-column prop="list2" label="到账时间" width="180"></el-table-column> -->
        <el-table-column prop="list3" label="UID" min-width="200" fit>
          <template slot-scope="scope">
            {{ scope.row.list3 |formatDate }}
            <!-- <el-button type="text" @click="checkUserInfo(scope.row.list3)">{{

            }}</el-button> -->
            <!-- <i v-clipboard:copy="scope.row.list3" v-clipboard:success="onCopy" v-clipboard:error="onError"></i> -->
          </template>
        </el-table-column>
        <el-table-column prop="list19" label="用户名" min-width="200" fit />
        <el-table-column prop="amount" label="金额" min-width="200" fit />

        <!-- <el-table-column prop="list13" label="账户信息" min-width="170" :show-overflow-tooltip="true" fit>
          <template slot-scope="{row}">
            <span>{{row.list13}}</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="list9" label="流水ID" min-width="150" :show-overflow-tooltip="true" fit>
          <template slot-scope="{row}">
            <span>{{row.list9}}</span>
            <i v-clipboard:copy="row.list9" v-clipboard:success="onCopy" v-clipboard:error="onError"></i>
          </template>
        </el-table-column> -->
        <el-table-column prop="list4" label="币种" min-width="100" fit />
        <el-table-column prop="list14" label="到账地址" width="150" fit :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.list14 }}</span>
            <!-- <i v-clipboard:copy="scope.row.list14" v-clipboard:success="onCopy" v-clipboard:error="onError"></i> -->
          </template>
        </el-table-column>
        <!-- <el-table-column prop="list15" label="类型" min-width="150" fit>
          <template slot-scope="scope">
            <span v-if="scope.row.list16 == 2">
              {{ scope.row.list15 }}
              <el-button type="text" @click="checkUserInfo(scope.row.list3)">{{
                scope.row.list3
              }}</el-button>
            </span>
            <span v-else>{{ scope.row.list15 }}</span>
            <i v-if="scope.row.list16 == 2" v-clipboard:copy="scope.row.list3" v-clipboard:success="onCopy"
              v-clipboard:error="onError"></i>
          </template>
        </el-table-column> -->
        <el-table-column prop="list11" label="状态" min-width="120" fit align="center">
          <template slot-scope="scope">
            <span :style="getStatusColor(scope.row.list11)">{{
              scope.row.list11
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120" fit align="center">
          <template slot-scope="scope">

            <el-button v-if="scope.row.list11!=='审核成功'" type="primary" size="small" @click="auditBtn(scope.row)">
              {{ scope.row.list11==='待审核'&&scope.row.list11!=='审核成功'?'审核':'重新审核' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" style="margin-bottom: 20px">
        <div class="block">
          <el-pagination
            :page-sizes="modelPageOptions.pageList"
            :page-size="modelPageOptions.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="modelPageOptions.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
    <!-- 发布广告 -->
    <el-dialog
      title="提现审核"
      :visible.sync="visible"
      width="40%"
      top="5vh"
      :before-close="hideCreate"
      :close-on-click-modal="false"
    >
      <el-form ref="createForm" :model="createForm" label-width="120px" class="modifyForm">
        <el-form-item label="币种" prop="coin_code">
          <!-- <el-select v-model="createForm.coin_code" :multiple="false" filterable allow-create default-first-option
            placeholder="请选择币种">
            <el-option v-for="(item, index) in addcoinList" :key="index" :value="item.value" :label="item.label">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="提现金额" prop="amount">
          <el-input v-model="createForm.amount" show-word-limit placeholder="请输入审核金额" />
        </el-form-item>
        <el-form-item label="拒绝理由" prop="remark">
          <el-input v-model="createForm.remark" show-word-limit placeholder="请输入拒绝理由" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="submit('reject')">拒绝</el-button>
        <el-button type="success" @click="submit('pass')">通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { withdrawauditList, withdrawauditHandel } from '@/api/audit'
import { formatTime } from '@/utils/utils'
// import exportExcel1 from "@/utils/exportExcel1";
// import moment from "moment";
export default {
  filters: {
    formatDate: function(value) {
      const date = new Date(value)
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let m = date.getMinutes()
      m = m < 10 ? '0' + m : m
      let s = date.getSeconds()
      s = s < 10 ? '0' + s : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    }
  },
  data() {
    return {
      visible: false,
      tx_id: '',
      status: 'all',
      formOptions: {
        TimeStart: '',
        TimeEnd: ''
      },
      createForm: {
        amount: '',
        coin_code: '',
        remark: '',
        action: null,
        order_id: null
      },
      deposit_type: '',
      loading: false,
      coin_code: '',
      key: '',
      formOptions: {
        region: ''
      },
      tableData: [],
      modelPageOptions: {
        page: 1, // 列表 -- 当前页码
        total: 0, // 列表 -- 数据总数
        pageSize: 10, // 列表 -- 页码大小
        pageList: [10, 20, 60, 80, 100] // 列表 -- 当页显示多少数据
      }
    }
  },
  computed: {
    // 充值状态
    statusList() {
      //           1:已上链
      // 2:链上确认到账
      // 3:增加资产中
      // 4:充值成功
      // 5:充值失败
      const result = [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: '0',
          label: '未审核'
        },
        {
          value: '1',
          label: '已通过'
        },
        {
          value: '2',
          label: '已拒绝'
        }
      ]
      return result
    },
    // 类型
    typeList() {
      const result = [
        {
          value: '',
          label: '全部'
        },
        {
          value: 1,
          label: '外部'
        },
        {
          value: 2,
          label: '内部'
        }
      ]
      return result
    }
  },
  mounted() {
    this.getList()
    // this.$store.dispatch("wallet/getCoinList");
  },
  methods: {
    onCopy(e) {
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    },
    onError(e) {
      this.$message({
        type: 'error',
        message: '复制失败'
      })
    },
    // 调整每页展示的条数
    handleSizeChange(val) {
      this.modelPageOptions.pageSize = val
      this.getList()
    },
    // 当前的页数
    handleCurrentChange(val) {
      this.modelPageOptions.page = val
      this.getList()
    },
    // 操作 -- 导出
    handleExport() {
      const url = 'deposit_history'
      const data = {
        is_export: 2
      }
      if (this.coin_code) {
        data['coin_code'] = this.coin_code
      }
      if (this.key) {
        data['key'] = this.key
      }
      if (this.status) {
        data['status'] = this.status
      }
      if (this.tx_id) {
        data['tx_id'] = this.tx_id
      }
      if (this.deposit_type) {
        data['deposit_type'] = this.deposit_type
      }
      if (this.formOptions.TimeStart) {
        let start = formatTime(this.formOptions.TimeStart)
        const dateBegin = new Date(start.replace(/-/g, '/'))
        start = Number(Date.parse(dateBegin)) * 1000
        data['create_start'] = start
      }
      if (this.formOptions.TimeEnd) {
        let end = formatTime(this.formOptions.TimeEnd)
        const dateEnd = new Date(end.replace(/-/g, '/'))
        end = Number(Date.parse(dateEnd)) * 1000
        data['create_end'] = end
      }
      if (!this.formOptions.TimeEnd && !this.formOptions.TimeStart) {
        this.outputDialog = true
      } else {
        const startTime = new Date(this.formOptions.TimeStart) * 1 * 1000
        const endTime = new Date(this.formOptions.TimeEnd) * 1 * 1000
        if (endTime - startTime > 2592000) {
          this.$message({
            type: 'error',
            message: this.$t('swap.action.outputMsg')
          })
        } else {
          this.$message({
            type: 'success',
            message: this.$t('swap.action.outputing')
          })
          this.output(url, data)
          this.outputDialog = false
          this.formOptions.TimeEnd = ''
          this.formOptions.TimeStart = ''
        }
      }
      // if (this.formOptions.TimeStart) {
      //   let start = formatTime(this.formOptions.TimeStart);
      //   const dateBegin = new Date(start.replace(/-/g, '/'));
      //   start = Number(Date.parse(dateBegin)) / 1000;
      //   data['create_start'] = start;
      // }
      // if (this.formOptions.TimeEnd) {
      //   let end = formatTime(this.formOptions.TimeEnd);
      //   const dateEnd = new Date(end.replace(/-/g, '/'));
      //   end = Number(Date.parse(dateEnd)) / 1000;
      //   data['create_end'] = end;
      // }
    },
    cancalExport() {
      this.outputDialog = false
      this.formOptions = {
        TimeStart: '',
        TimeEnd: ''
      }
    },
    // output(url, data) {
    //   exportExcel1({ url, method: "get", data, fileName: "充值记录" });
    // },
    auditBtn(row) {
      console.log(row)
      this.visible = true
      this.createForm.coin_code = row.coinCode
      this.createForm.amount = row.amount
      this.createForm.remark = row.remark
      this.createForm.order_id = row.order_id
    },
    submit(type) {
      if (
        (type == 'reject' && this.createForm.remark == '') ||
        (type == 'reject' && this.createForm.remark == undefined)
      ) {
        this.$message({
          type: 'warning',
          message: '请填写拒绝原因'
        })
        return false
      }
      if (this.createForm.amount == '') {
        this.$message({
          type: 'warning',
          message: '请输入金额'
        })
        return false
      }
      if (this.createForm.coin_code == '') {
        this.$message({
          type: 'warning',
          message: '请选择币种'
        })
        return false
      }

      if (type == 'pass') {
        var msg = '审核通过!'
        this.createForm.action = 1
        this.createForm.remark = ''
      } else {
        var msg = '审核拒绝!'
        this.createForm.action = 2
      }
      const data = JSON.parse(JSON.stringify(this.createForm))
      withdrawauditHandel(data).then((res) => {
        if (res.err_code === 0) {
          this.$message.success(msg)
          this.getList()
          this.hideCreate()
        } else {
          this.$message.error(res.err_msg)
        }
      })
    },
    hideCreate() {
      this.visible = false
      this.createForm = {
        coin_code: '',
        amount: '',
        remark: '',
        action: null,
        order_id: null
      }
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.createForm.resetFields()
        }, 500)
      })
    },
    getList(offset) {
      // this.loading = true;
      const data = {}
      if (offset) {
        data['offset'] = 0
      } else {
        const offset =
          (this.modelPageOptions.page - 1) * this.modelPageOptions.pageSize
        data['offset'] = offset
      }
      if (this.modelPageOptions.pageSize) {
        data['limit'] = this.modelPageOptions.pageSize
      }
      if (this.coin_code) {
        data['coin_code'] = this.coin_code
      }
      if (this.key) {
        data['key'] = this.key
      }
      if (this.status) {
        console.log(this.status, 'status')
        data['status'] = this.status
      }
      if (this.tx_id) {
        data['tx_id'] = this.tx_id
      }
      if (this.deposit_type) {
        data['deposit_type'] = this.deposit_type
      }
      if (this.formOptions.TimeStart) {
        let start = formatTime(this.formOptions.TimeStart)
        const dateBegin = new Date(start.replace(/-/g, '/'))
        start = Number(Date.parse(dateBegin)) / 1000
        data['create_start'] = start
      }
      if (this.formOptions.TimeEnd) {
        let end = formatTime(this.formOptions.TimeEnd)
        const dateEnd = new Date(end.replace(/-/g, '/'))
        end = Number(Date.parse(dateEnd)) / 1000
        data['create_end'] = end
      }
      withdrawauditList(data).then(({ err_code, msg, data }) => {
        console.log(data)
        if (err_code == '0' && data.data.length > 0) {
          const list = data.data || []
          this.modelPageOptions.total = data.total
          const result = []
          list.forEach((ele) => {
            result.push({
              list1: ele.createAt ? formatTime(ele.createAt) : '--', // 入账时间
              // list2: '', //到账时间
              list3: ele.userID, // uid
              list4: ele.coinCode, // 币种
              list5: ele.coin_group, // 主链
              list6: ele.amount, // 数量
              list7: ele.fromAddress ? ele.fromAddress : '--', // 来源地址
              list8: ele.memo, // 其他信息
              list9: ele.id, // 流水id
              list11: this.getStatus(ele.statu), // 状态
              list18: ele.status,
              list10: ele.block_id ? ele.block_id : '--', // 区块
              list12: ele.tx_hash,
              list13: ele.account_key,
              list14: ele.toAddress, // 到账地址
              list15: ele.deposit_type == 1 ? '外部' : '内部', // 类型((1:外部转账 2:内部转账))
              list16: ele.deposit_type,
              list17: ele.tx_browser,
              list19: ele.userName ? ele.userName : '--',
              amount: ele.amount,
              order_id: ele.id,
              coinCode: ele.coinCode,
              remark: ele.remark
            })
          })
          if (result.length > 0) {
            this.tableData = result
            this.loading = false
          } else {
            this.tableData = []
            this.loading = false
          }
        } else {
          this.tableData = []
          this.modelPageOptions.total = data.total
        }
      })
    },
    getStatus(type) {
      switch (type) {
        // 状态 0 待审核 1 审核成功 2 审核拒绝 3 交易成功 4 交易失敗 5已撤销 6支付中 7待解锁
        case 0:
          return '待审核'
        case 1:
          return '审核成功'
        case 2:
          return '审核拒绝'
        case '3':
          return '交易成功'
        case '4':
          return '交易失敗'
        case '5':
          return '已撤销'
        case '6':
          return '支付中'
        case '7':
          return '待解锁'
      }
    },

    // 数量排序
    volumeAllSort(val) {
      switch (val) {
        case 1:
          this.order_type = 2
          this.order_by = 4
          this.getList()
          break
        case 2:
          this.order_type = 1
          this.order_by = 4
          this.getList()
          break
      }
    },
    // 时间初始化
    optionsTimeStratChange(val) {
      this.formOptions.TimeStart = val
      if (
        this.formOptions.TimeStart &&
        this.formOptions.TimeStart.toString().length
      ) {
        const start = Number(moment(this.formOptions.TimeStart).valueOf())
        const end = Number(moment(this.formOptions.TimeEnd).valueOf())
        if (start > end) {
          this.$message({
            type: 'warning',
            message: this.$t('noteList.text2')
          })
          this.formOptions.TimeStart = ''
        }
      }
    },
    optionsTimeEndChange(val) {
      this.formOptions.TimeEnd = val
      if (
        this.formOptions.TimeEnd &&
        this.formOptions.TimeEnd.toString().length
      ) {
        const start = Number(moment(this.formOptions.TimeStart).valueOf())
        const end = Number(moment(this.formOptions.TimeEnd).valueOf())
        if (start > end) {
          this.$message({
            type: 'warning',
            message: this.$t('noteList.text2')
          })
          this.formOptions.TimeEnd = ''
        }
      }
    },
    goUrl(url) {
      if (url.indexOf('https') < 0) {
        this.$message({
          type: 'warning',
          message: '当前资产未配置区块浏览器地址'
        })
        return false
      } else {
        window.open(url)
      }
    },
    checkUserInfo(uid) {
      this.$router.push({
        path: '/userinfo',
        query: {
          uid: uid
        }
      })
    },
    getStatusColor(status) {
      switch (status) {
        case 0:
          return { color: 'black' }
        case 1:
          return { color: 'yellowgreen' }
        case 2:
          return { color: 'red' }
        default:
          return ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep.el-table--enable-row-transition .el-table__body td {
  overflow: hidden;
  text-overflow: ellipsis;
}
.status-color {
  color: red;
}
::v-deep.el-table .cell.el-tooltip span {
  display: inline-block;
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.el-row {
  display: flex;
  width: 100%;
  .el-col {
    flex: 1;
  }
}
</style>
