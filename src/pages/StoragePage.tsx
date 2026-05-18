import { useState, useEffect, useRef } from 'react'
import { useAppSelector } from '../store/hooks'
import FileItem from '../components/FileItem'
import { type FileItem as FileItemType } from '../types'
import { useParams } from 'react-router-dom'
import {
  getFiles,
  uploadFile,
  deleteFile,
  renameFile,
  downloadFile,
  getSpecialLink,
  getFilesByUser,
} from '../api/api'


export default function StoragePage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { userId } = useParams()
  const { currentUser, isAdmin } = useAppSelector(state => state.user)
  const [files, setFiles] = useState<FileItemType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  //загрузка нового файла
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [comment, setComment] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  //увеломление
  const [notification, setNotification] = useState<string | null>(null)

  //страница открывается, загрузка файла 
  useEffect(() => {
    fetchFiles()
  }, []) //пустой массив вторым аргументом, сработает только при монтировании те один раз

  const fetchFiles = async () => {
    try {
      setIsLoading(true)
      //если передан userId и мы=админ, доступна зазгрузка чужих файлов
      const response = userId && isAdmin 
      ? await getFilesByUser(Number(userId)) 
      : await getFiles()

      setFiles(response.data)
    } catch {
      setError('Ошибка при загрузке файла')
      console.log('error api GET')
    } finally {
      setIsLoading(false)
    }
  }

  //покажем уведомление (в зависимости от того, что произошло) на 3 сек
  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  //логика загрузки файла
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedFile) return

    //отправка файла
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('comment', comment)

    try {
      setIsUploading(true)
      await uploadFile(formData)
      setSelectedFile(null)
      setComment('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      await fetchFiles() 
      showNotification('Файл загружен')
    } catch {
      showNotification('Ошибка загрузки файла')
    } finally {
      setIsUploading(false)
    }
  }

  //удаление 
  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что файл нужно удалить?')) return
    try {
      await deleteFile(id)
      // убираем файл из списка без запроса к серверу
      setFiles(prev => prev.filter(f => f.id !== id))
      showNotification('Файл успешно удален')
    } catch {
      showNotification('Ошибка, не удалось удалить файл')
    }
  }

  //переименование
  const handleRename = async (id: number, newName: string, newComment: string) => {
    try {
      const response = await renameFile(id, {
        new_name: newName,
        comment: newComment,
      })
      //обновление списка файлов
      setFiles(prev => prev.map(f => f.id === id ? response.data : f))
      showNotification('Файл успешно обновлен')
    } catch {
      showNotification('Ошибка при переименовании файла')
    }
  }

  //скачивание файла
  const handleDownload = async (id: number) => {
    try {
      const response = await downloadFile(id)
      //блоб оборачивает байты от бэка, строгий тип, чтобы отдавал не текст а картинки при скачивании
      const blob = new Blob([response.data], {
        type: response.headers['content-type'] as string
      })
      //создание объекта, ссылки для скачивания
      const url = window.URL.createObjectURL(blob) 
      const link = document.createElement('a') //создание ссылки
      const file = files.find(f => f.id === id)
      link.href = url
      link.setAttribute('download', file?.original_name || 'file')
      document.body.append(link)
      link.click() //программный клик
      link.remove()
      window.URL.revokeObjectURL(url) //чистим временную ссылку 
      fetchFiles() //обновление последней загрузки
    } catch {
      showNotification('Не удалось скачать файл')
    }
  }

  //копирование спец ссылки
  const handleCopyLink = async (id: number) => {
    try {
      const response = await getSpecialLink(id)
      // crl C :)
      await navigator.clipboard.writeText(response.data.special_link)
      showNotification('Ссылка скопирована')
    } catch {
      showNotification('Не удалось скопировать ссылку ')
    }
  }

  return (
    <div className='page'>
      {/* Уведомление */}
      

      <div className='storage-container'>
        <h2 className='tittle-inside '>
          Хранилище — {currentUser?.username}
        </h2>

        {/* Форма загрузки файла */}
        <div className='upload-card'>
          <h3 className='subtitle'>Загрузить файл</h3>
          <form onSubmit={handleUpload} className='upload-form'>
            <input className='input-file'
              type="file"
              ref={fileInputRef}
              onChange={e => setSelectedFile(e.target.files?.[0] || null)}
            />
            <input className='input'
              type="text"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Комментарий (необязательно)"
            />
            <button className='btn-sbmt'
              type="submit"
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? 'Загружаем...' : 'Загрузить'}
            </button>
            {notification && (
              <div className='notification'>
                {notification}
              </div>
            )}
          </form>
        </div>

        {/* Список файлов */}
        <div className='file-list'>
          <h3 className='subtitle'>
            Мои файлы {files.length > 0 && `(${files.length})`}
          </h3>

          {/* Состояния загрузки */}
          {isLoading && <div className='message'>Загружаем файлы...</div>}
          {error && <div className='error'>{error}</div>}

          {!isLoading && files.length === 0 && (
            <div className='message'>
              Файлов пока нет. Загрузите первый!
            </div>
          )}

          {/* Сами файлы */}
          {files.map(file => (
            <FileItem
              key={file.id}
              file={file}
              onDelete={handleDelete}
              onRename={handleRename}
              onDownload={handleDownload}
              onCopyLink={handleCopyLink}
            />
          ))}
        </div>

      </div>
    </div>
  )
  
}

