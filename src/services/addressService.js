import api from './api'

const AddressService = {
  async getAll() {
    const res = await api.get('/addresses')

    // Backend: ApiResponse -> data
    return res.data?.data ?? []
  },

  async create(payload) {
    const res = await api.post('/addresses', payload)

    // Backend: ApiResponse -> data
    return res.data?.data
  },

  async getById(id) {
    const res = await api.get(`/addresses/${id}`)
    return res.data?.data
  },

  async update(id, payload) {
    const res = await api.put(`/addresses/${id}`, payload)
    return res.data?.data
  },

  async remove(id) {
    const res = await api.delete(`/addresses/${id}`)
    return res.data?.data
  },
}

export default AddressService
