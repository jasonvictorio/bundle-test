'use client'

import { useEffect, useRef, useState } from 'react'

type TaskStatus = 'processing' | 'success' | 'failed' | 'cancelled'

type Task = {
  id: string
  status: TaskStatus
  createdAt?: string
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const fetchTasks = async () => {
    const res = await fetch('/api/task')
    const data: Task[] = await res.json()
    setTasks(data)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const validateFile = (file: File): boolean => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png']
    const maxSize = 2 * 1024 * 1024 // 2MB
    return validTypes.includes(file.type) && file.size <= maxSize
  }

  const submitFile = async (_file: File): Promise<Task> => {
    const res = await fetch('/api/task', { method: 'POST' })
    const data = await res.json()
    return data
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      return alert('Please select a file.')
    }
    if (!validateFile(file)) {
      return alert('Only PDF/JPG/PNG under 2MB allowed.')
    }

    const newTask = await submitFile(file)
    setTasks((prev) => [newTask, ...prev])
  }

  const handleCancel = async (taskId: string) => {
    // TODO: implement api
    console.log(taskId)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor='upload'>Upload file</label>
        <input type='file' name='upload' ref={fileInputRef} />
        <button type='submit'>submit</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            Task - {task.id} {task.status}{' '}
            <button type='button' onClick={() => handleCancel(task.id)}>
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
