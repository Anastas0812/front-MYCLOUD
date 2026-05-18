import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { setUser } from '../store/userSlice'
import { loginUser } from '../api/api'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  //ошибки от бэка
  const [error, setError] = useState<string | null>(null)

  //блок кнопки, пока не получен ответ
  const [isLoading, setIsLoading] = useState(false)

  //обновление поля формы, когда юзер печатает
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev, //остальные поля не трогаем
      [e.target.name]: e.target.value //меняем поле, в котором печатают
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // не даем странице перезагрузиться
    setError(null) //очищаем предыдущие ошибки
    setIsLoading(true) // блок кнопки

    try {
      //идем на бэк
      const response = await loginUser(formData)

      //сохраняем юзера в редакс
      dispatch(setUser(response.data.user))

      //смотрим, это юзер обычный или админ? отправляем куда надо 
      if (response.data.user.is_admin) {
        navigate('/admin')
      } else {
        navigate('/storage')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка входа')
    } finally {
      setIsLoading(false) //снять блок с кнопки, которая ждала ответ при загрузке инфы
    }
  }

  return (
    <div className='page'>
      <div className='card'>

        <div className='logo-inside'>☁️ MyCloud</div>
        <h2 className='tittle-inside'>Добро пожаловать!</h2>

        <form onSubmit={handleSubmit} className='form'>
          <div className='field'>
            <label className='label'>Логин</label>
            <input className='input'
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Введите логин"
              required
            />
          </div>

          <div className='field'>
            <label className='label'>Пароль</label>
            <input className='input'
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              required
            />
          </div>

          {error && (
            <div className='error'>
              {error}
            </div>
          )}

          <button className='btn-register-login'
            type="submit"
            disabled={isLoading}    // блок
          >
            {isLoading ? 'Входим...' : 'Продолжить'}
          </button>
        </form>

        <p className='footer'>
          Еще не зарегистрированы?{' '}
          <Link to='/register' className='link-footer'>
            Зарегистрироваться
          </Link>
        </p>

      </div>
    </div>
  )
}