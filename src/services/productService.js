import api from './api'
const ProductService = {
  getAll(params = {}) {
    const { sort, ...filters } = params

    let sortBy = 'createdAt'
    let direction = 'desc'

    if (sort === 'price_asc') {
      sortBy = 'price'
      direction = 'asc'
    }

    if (sort === 'price_desc') {
      sortBy = 'price'
      direction = 'desc'
    }

    return api.get('/products/search', {
      params: {
        ...filters,
        sortBy: sortBy,
        direction: direction,
      },
    }).then((res) => res.data)
  }
,
  getById(id) {
    return api.get(`/products/${id}`).then((res) => res.data.data)
  },
  create(payload) {
    return api.post('/products', payload).then((res) => res.data)
  },
  update(id, payload) {
    return api.put(`/products/${id}`, payload).then((res) => res.data)
  },
  remove(id) {
    return api.delete(`/products/${id}`).then((res) => res.data)
  },
}

export default ProductService
