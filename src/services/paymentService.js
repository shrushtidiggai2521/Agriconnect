import api from './api'

const PaymentService = {
  create(payload) {
    return api.post('/payments/create', payload).then((res) => res.data.data)
  },
  success(payload) {
    return api.post('/payments/success', payload).then((res) => res.data.data)
  },
  failure(payload) {
    return api.post('/payments/failure', payload).then((res) => res.data.data)
  },
  getByOrder(orderId) {
    return api.get(`/payments/${orderId}`).then((res) => res.data.data)
  },
}

export default PaymentService
