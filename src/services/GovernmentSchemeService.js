import api from './api'

const GovernmentSchemeService = {

  // Get all government schemes
  getAll: async () => {
    const response = await api.get('/schemes')
    return response.data
  },

  // Get one scheme by ID
  getById: async (id) => {
    const response = await api.get(`/schemes/${id}`)
    return response.data
  },

  // Get schemes by category
  getByCategory: async (category) => {
    const response = await api.get('/schemes', {
      params: {
        category
      }
    })

    return response.data
  },

  // Get schemes by state
  getByState: async (state) => {
    const response = await api.get('/schemes', {
      params: {
        state
      }
    })

    return response.data
  },

  // Get schemes using category + state
  getFiltered: async (category, state) => {
    const response = await api.get('/schemes', {
      params: {
        ...(category && { category }),
        ...(state && { state })
      }
    })

    return response.data
  }

}

export default GovernmentSchemeService