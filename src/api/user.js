import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/agent/agent_login',
    method: 'post',
    data
  })
}
export function getAgencyList(data) {
  return request({
    url: '/agent/agent_list',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
