import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { setUser } from '../store/userSlice'
import { registerUser, loginUser } from '../api/api'


export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  //переносим валидацию на фронт для улучшения UX
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    //login
    if (!/^[a-zA-Z][a-zA-Z0-9]{3,19}$/.test(formData.username)) {
      newErrors.username = 'Только латиница и цифры, первый символ — буква, длина от 4 до 20 символов'
    }

    //email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Необходимо ввести корректный email'
    }

    //password
    if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Пароль должен содержать хотя бы одну заглавную букву'
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Пароль должен содержать хотя бы одну цифру'
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = 'Пароль должен содержать хотя бы один специальный символ, (например, !, @, #, $, %, ^, &, *, (, )'
    }

    //full name
    if (formData.full_name.trim().length < 1) {
      newErrors.full_name = 'Введите ваше полное имя'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))

    //юзер исправляет ошибку, удаляем предупреждение
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    //валидация данных
    if (!validateForm) return

    setIsLoading(true)

    try{
      //регистрация
      await registerUser(formData)

      // заходим в ЛК хранилища после регистрации
      const loginResponse = await loginUser({
        username: formData.username,
        password: formData.password,
      })

      dispatch(setUser(loginResponse.data.user))
      navigate('/storage')
    } catch (err: any) {
      if (err.response?.data) {
        const backendErrors: Record<string, string> = {}
        Object.entries(err.response.data).forEach(([key, value]) => {
          backendErrors[key] = Array.isArray(value)
          ? value[0] as string
          : value as string
        })
        setErrors(backendErrors)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='page'>
      <div className='card'>

        <div className='logo-inside'>☁️ MyCloud</div>
        <h2 className='tittle-inside'>Добро пожаловать!</h2>

        <form onSubmit={handleSubmit} className='form'>

          <div className='field'>
            <label className='label'>
              Придумайте логин
            </label>
            <input className={`input ${errors.username ? 'input-error' : ''}`}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Только латиница и цифры, от 4 до 20 символов"
            />
            {errors.username && (
              <span className='field-error'>{errors.username}</span>
            )}
          </div>

          <div className='field'>
            <label className='label'>Фамилия и имя</label>
            <input className={`input ${errors.username ? 'input-error' : ''}`}
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Например: Иванова Анастасия"
            />
            {errors.full_name && (
              <span className='field-error'>{errors.full_name}</span>
            )}
          </div>

          <div className='field'>
            <label className='label'>Email</label>
            <input className={`input ${errors.username ? 'input-error' : ''}`}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.ru"
            />
            {errors.email && (
              <span className='field-error'>{errors.email}</span>
            )}
          </div>

          <div className='field'>
            <label className='label'>Пароль</label>
            <input className={`input ${errors.username ? 'input-error' : ''}`}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Мин. 6 символов, заглавная буква, цифра, спецсимвол"
            />
            {errors.password && (
              <span className='field-error'>{errors.password}</span>
            )}
          </div>

          {/* общая ошибка если есть */}
          {errors.non_field_errors && (
            <div className='error'>
              {errors.non_field_errors}
            </div>
          )}

          <button className='btn-register-login'
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Регистрируем...' : 'Продолжить'}
          </button>

        </form>

        <p className='footer'>
          Уже есть аккаунт?{' '}
          <Link to="/login" className='link-footer'>
            Войти
          </Link>
        </p>

      </div>
    </div>
  )
}