import request from '@/utils/request'

export function getAgencyList(data) {
  console.log(data)
  console.log(20)
  return request({
    url: '/agents/directs' + data,
    method: 'get',
  })
}
//代理转移
export function agentTrans(data) {
  return request({
    url: '/agent/agent_trans',
    method: 'post',
    data
  })
}
//修改密码
export function changePsw(data) {
  return request({
    url: '/agent/agent_change_pass',
    method: 'post',
    data
  })
}
//普通会员转成自己的代理
export function agentToagent(data) {
  return request({
    url: '/agent/agent_user2agent',
    method: 'post',
    data
  })
}
//添加代理
export function addAgent(data) {
  return request({
    url: '/agent/agent_add',
    method: 'post',
    data
  })
}

export function reportView(data) {
  return request({
    url: '/agent/report_view',
    method: 'post',
    data
  })
}

export function getOrders(data) {
  console.log(data)
  console.log(20)
  return request({
    url: '/agents/orders' + data,
    method: 'get',
  })
}
export function getMembersDetail(data) {
  return request({
    url: '/agents/members' + data,
    method: 'get',
  })
}
export function getFinanceDetail(data) {
  return request({
    url: '/agents/financial' + data,
    method: 'get',
  })
}
export function getAgentOrders(data) {
  return request({
    url: '/agents/agent_orders' + data,
    method: 'get',
  })
}
