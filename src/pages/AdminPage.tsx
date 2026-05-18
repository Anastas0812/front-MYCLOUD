import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { type User } from '../types'
import { getUser, deleteUser, toggleUser } from '../api/api'


export default function AdminPage() {
  const navigate = useNavigate()
  const { currentUser } = useAppSelector(state => state.user)

  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, []) //пустой массив вторым аргументом, сработает только при монтировании те один раз

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await getUser() //api
      setUsers(response.data)
    } catch {
      showNotification('Ошибка загрузки пользователей')
    } finally {
      setIsLoading(false)
    }
  }

   //покажем уведомление (в зависимости от того, что произошло) на 3 сек
   const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  //удаление пользователя
  const handleDelete = async (id: number, username: string) => {
    //админ не может удалить сам себя
    if (id === currentUser?.id) {
      showNotification('Вы не можете удалить свой аккаунт')
      return
    }
    if (!window.confirm(`Вы уверены, что хотите удалить пользователя ${username}?`))
    return

    try {
      await deleteUser(id) //api
      //удаляем
      setUsers(prev => prev.filter(u => u.id !== id))
      showNotification(`Пользователь ${username} удален`)
    } catch {
      showNotification('Ошибка удаления пользователя')
    }
  }

  const handleToggleAdmin = async (id: number, username: string) => {
    if (id === currentUser?.id) {
      showNotification('Доступ к изменениям прав админа закрыт')
      return
    }
    try {
      const response = await toggleUser(id) //api
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_admin: response.data.is_admin } : u))
      const status = response.data.is_admin ? 'Администратор' : 'Пользователь'
      showNotification(`${username} теперь ${status}`)
    } catch {
      showNotification('Ошибка изменения прав')
    }
  }

  //форматирование хранилища
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} Б`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
    return `${(bytes / 1024 / 1024).toFixed(1)} МБ`
  }

  return (
    <div className='page'>

      <div className='admin-container'>
        <h2 className='admin-title'>
          Панель управления админа {currentUser?.username}
        </h2>
        {/* Уведомление */}
        {notification && (
          <div className='notification'>{notification}</div>
        )}

        {isLoading && (
          <div className='message'>Загружаем пользователей...</div>
        )}

        {/* Таблица пользователей */}
        {!isLoading && (
          <div className='table-wrapper'>
            <table className='table'>
              <thead>
                <tr className='header-row'>
                  <th>Пользователь</th>
                  <th>Email</th>
                  <th>Полное имя</th>
                  <th>Файлы</th>
                  <th>Размер</th>
                  <th>Хранилище</th>
                  <th>Админ</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr
                    key={user.id}
                  >
                    {/* Логин */}
                    <td>
                      <strong>{user.username}</strong>
                      {user.id === currentUser?.id && (
                        <span className='your-badge'> (вы)</span>
                      )}
                    </td>

                    {/* Email */}
                    <td>{user.email}</td>

                    {/* Полное имя */}
                    <td>{user.full_name || '—'}</td>

                    {/* Количество файлов */}
                    <td>
                      {user.storage?.files_count ?? 0} шт.
                    </td>

                    {/* Размер хранилища */}
                    <td>
                      {formatSize(user.storage?.total_size ?? 0)}
                    </td>

                    {/* Ссылка на хранилище */}
                    <td>
                      <button className='btn-open-storage'
                        onClick={() => navigate(`/storage/${user.id}`)}
                      >
                        Открыть
                      </button>
                    </td>

                    {/* Признак администратора */}
                    <td>
                      <span className='badge'>
                        {user.is_admin ? 'Да' : 'Нет'}
                      </span>
                    </td>

                    {/* Действия */}
                    <td>
                      <div className='actions'>
                        <button className='btn-right'
                          onClick={() => handleToggleAdmin(user.id, user.username)}
                          disabled={user.id === currentUser?.id}
                        >
                          {user.is_admin ? 'Снять права' : 'Дать права'}
                        </button>
                        <button className='btn-delete-admin'
                          onClick={() => handleDelete(user.id, user.username)}
                          disabled={user.id === currentUser?.id}
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}