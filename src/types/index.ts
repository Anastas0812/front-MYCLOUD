export interface User {
  id: number
  username: string
  full_name: string
  email: string
  is_admin: boolean
  storage?: {
    files_count: number
    total_size: number
  }
}

export interface FileItem {
  id: number
  original_name: string
  size: number
  upload_date: string
  last_download: string | null
  comment: string
  special_link: string
}

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  full_name: string
  email: string
  password: string
}

export interface RenameData {
  new_name?: string
  comment?: string
}