import request from '@/utils/request'

export function auditList(data) {
  return request({
    url: '/agent/deposit_checklist',
    method: 'post',
    data
  })
}
export function auditHandel(data) {
  return request({
    url: '/agent/deposit_check',
    method: 'post',
    data
  })
}
export function withdrawauditList(data) {
  return request({
    url: '/agent/withdraw_checklist',
    method: 'post',
    data
  })
}
export function withdrawauditHandel(data) {
  return request({
    url: '/agent/withdraw_check',
    method: 'post',
    data
  })
}