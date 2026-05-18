import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
// createSlice — создаёт место в хранилище
// PayloadAction — тип , строгая типизация движущихся данных
import { type User } from '../types'


interface UserState {
  currentUser: User | null
  isAuthenticated: boolean
  isAdmin: boolean
}

// начальное состояние, юзер еще не залогинен
const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  isAdmin: false,
}


const userSlice = createSlice({
  name: 'user',
  initialState,

  //reducer это как views.py (обработчик)
  reducers: {
    //залогинился
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
      state.isAuthenticated = true
      state.isAdmin = action.payload.is_admin
    },

    //выход
    clearUser: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      state.isAdmin = false
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer

//аналог модели в питоне 