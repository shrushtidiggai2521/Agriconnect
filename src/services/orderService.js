import api from './api'

const OrderService = {
  place(payload) {
    return api.post('/orders/place', payload).then((res) => res.data.data)
  },
  myOrders() {
    return api.get('/orders/my-orders').then((res) => res.data.data)
  },
  getById(id) {
    return api.get(`/orders/${id}`).then((res) => res.data.data)
  },
  cancel(id) {
    return api.put(`/orders/cancel/${id}`).then((res) => res.data.data)
  },
  farmerOrders() {
    return api.get('/farmer/orders').then((res) => res.data.data)
  },
  accept(id) {
    return api.put(`/farmer/orders/${id}/accept`).then((res) => res.data.data)
  },
  reject(id) {
    return api.put(`/farmer/orders/${id}/reject`).then((res) => res.data.data)
  },
  ship(id) {
    return api.put(`/farmer/orders/${id}/ship`).then((res) => res.data.data)
  },
  deliver(id) {
    return api.put(`/farmer/orders/${id}/deliver`).then((res) => res.data.data)
  },
}

export default OrderService
