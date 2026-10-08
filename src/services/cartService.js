import api from './api'

const CartService = {
  getCart() {
    return api.get('/cart').then((res) => res.data)
  },
  addItem(productId, quantity = 1) {
    return api.post(`/cart/add/${productId}`, { quantity }).then((res) => res.data)
  },
  updateItem(payload) {
    return api.put('/cart/update', payload).then((res) => res.data)
  },
  removeItem(cartItemId) {
    return api.delete(`/cart/remove/${cartItemId}`).then((res) => res.data)
  },
  clearCart() {
    return api.delete('/cart/clear').then((res) => res.data)
  },
}

export default CartService
