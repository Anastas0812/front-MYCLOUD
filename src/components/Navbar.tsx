import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearUser } from '../store/userSlice'
import { logoutUser } from '../api/api'

export default function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  //читаем из Redux, юзер залогинился? он  админ?
  const { isAuthenticated, isAdmin, currentUser } = useAppSelector(
    state => state.user
  )

  const handleLogout = async () => {
    try {
      await logoutUser()
      dispatch(clearUser())
      navigate('/')
    } catch (error) {
      console.error('Ошибка выхода:', error)
    }
  }

  return (
    <div className='nav'>
      <Link to="/" className='logo'>
      ☁️ MyCloud
      </Link>

      <div className='links'>
        {!isAuthenticated && (
          <>
            <Link to="/register" className='link'>
              Регистрация
            </Link>
            <Link to="/login" className='link'>
              Вход
            </Link>
          </>
        )}

        {isAuthenticated && (
          <>
            <span className='username'>
            Привет, {currentUser?.username}
            </span>

            <Link to="/storage" className='link'>
              MY STORAGE
            </Link>

            {isAdmin && (
              <Link to="/admin" className='link'>
                ADMIN ZONE
              </Link>
            )}

            <button onClick={handleLogout} className='btn-exit'>
              EXIT
            </button>
          </>
        )}
      </div>
    </div>
  )
}