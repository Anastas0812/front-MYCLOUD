import axios from 'axios'
import type { LoginData, RegisterData, RenameData } from '../types'


// базовый урл бэкенда
const api = axios.create({
  baseURL: 'http://168.222.142.98/api',
  withCredentials: true,  //cookies с сессией
})

// USER запросы
export const registerUser = (data: RegisterData) => api.post('/users/register/', data)
export const loginUser = (data: LoginData) => api.post('/users/login/', data)
export const logoutUser = () => api.post('/users/logout/')
export const getUser = () => api.get('/users/')
export const deleteUser = (id: number) => api.delete(`/users/${id}/`)
export const toggleUser = (id: number) => api.patch(`/users/${id}/toggle-admin/`)

// Storage запросы
export const getFiles = () => api.get('/storage/')
export const getFilesByUser = (userId: number) => api.get(`/storage/user/${userId}`)
export const uploadFile = (formData: FormData) => api.post(`/storage/upload/`, formData)
export const deleteFile = (id: number) => api.delete(`/storage/${id}/delete/`)
export const renameFile = (id: number, data: RenameData) => api.patch(`/storage/${id}/rename/`, data)
export const downloadFile = (id: number) => api.get(`/storage/${id}/download/`, {responseType: 'blob'}) //на файл бинарная обработка
export const getSpecialLink = (id: number) => api.get(`/storage/${id}/link/`)
