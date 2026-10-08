import api from './api'

const UserService = {
  getMyProfile() {
    return api.get('/users/me').then((res) => res.data)
  },

  update(id, payload) {
    return api.put(`/users/${id}`, payload).then((res) => res.data)
  },
}

export default UserService