import { ref } from 'vue'

const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_user') : null
const userRef = ref(stored ? JSON.parse(stored) : null)

export function useAuth() {
  function setUser(u) {
    userRef.value = u
    if (typeof localStorage !== 'undefined') {
      if (u) localStorage.setItem('auth_user', JSON.stringify(u))
      else localStorage.removeItem('auth_user')
    }
  }
  function logout() { setUser(null) }
  return { user: userRef, setUser, logout }
}
