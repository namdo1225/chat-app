import axios from 'axios'
import { BACKEND_URL } from './config'

const apiClient = axios.create({
  baseURL: BACKEND_URL,
})

export default apiClient