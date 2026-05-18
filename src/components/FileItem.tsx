import { type FileItem as FileItemType } from '../types'
import { useState } from 'react'

interface Props {
  file: FileItemType
  onDelete: (id: number) => void
  onRename: (id: number, newName: string, comment: string) => void
  onDownload: (id: number) => void
  onCopyLink: (id: number) => void
}

export default function FileItem({ file, onDelete, onRename, onDownload, onCopyLink}: Props) {
  //размер файла на данном этапе сохранялся в байтах без единиц измерения, форматируем
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} Б`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
    return `${(bytes / 1024 / 1024).toFixed(1)} МБ`
  }

  //форматирование даты
  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return 'Файл еще не скачивали'
    return new Date(dateStr).toLocaleString('ru-RU')
  }

  //состояние - переименование файла
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(file.original_name)
  const [newComment, setNewComment] = useState(file.comment)

  const handleRenameSubmit = () => {
    onRename(file.id, newName, newComment)
    setIsRenaming(false)
  }

  return (
    <div className='file-card'>

      {/* Режим просмотра */}
      {!isRenaming ? (
        <>
          <div className='file-info'>
            <div className='file-name'>{file.original_name}</div>
            <div className='meta'>
              <span>💾 {formatSize(file.size)}</span>
              <span>📅 {formatDate(file.upload_date)}</span>
              <span>⬇️ {formatDate(file.last_download)}</span>
            </div>
            {file.comment && (
              <div className='file-comment'>💬 {file.comment}</div>
            )}
          </div>

          {/* Кнопки действий */}
          <div className='actions'>
            <button className='btn-download'
              onClick={() => onDownload(file.id)}
            >
              Скачать
            </button>
            <button className='btn-rename'
              onClick={() => setIsRenaming(true)}
            >
              Изменить
            </button>
            <button className='btn-copy'
              onClick={() => onCopyLink(file.id)}
            >
              Копировать ссылку
            </button>
            <button className='btn-delete'
              onClick={() => onDelete(file.id)}
            >
              Удалить
            </button>
          </div>
        </>
      ) : (
        /* Режим переименования */
        <div className='rename-form'>
          <input className='input-rename'
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Новое имя файла"
          />
          <input className='input-rename'
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Комментарий"
          />
          <div className='actions'>
            <button className='btn-save'
              onClick={handleRenameSubmit}
            >
              Сохранить
            </button>
            <button className='btn-cancel'
              onClick={() => setIsRenaming(false)}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
