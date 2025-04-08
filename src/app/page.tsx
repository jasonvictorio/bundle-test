'use client'

import { useEffect, useRef, useState } from 'react'

type TaskStatus = 'processing' | 'success' | 'failed' | 'cancelled'

type Task = {
  id: number
  status: TaskStatus
  createdAt?: string
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const pollingControllers = useRef<Map<number, AbortController>>(new Map())

  const fetchTasks = async () => {
    const res = await fetch('/api/task')
    const data: Task[] = await res.json()
    setTasks(data)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    for (const task of tasks) {
      console.log('poll task ', task.id)
      if (['processing'].includes(task.status)) {
        const controller = new AbortController()
        pollingControllers.current.set(task.id, controller)
        startPolling(task.id, controller)
      }
    }
    return () => {
      for (const controller of pollingControllers.current.values()) {
        controller.abort()
      }
    }
  }, [tasks])

  const checkStatus = async (taskId: number): Promise<TaskStatus> => {
    console.log('checkstatus', taskId)
    const res = await fetch(`/api/status/${taskId}`)
    if (!res.ok) {
      throw new Error('Network error')
    }
    const data = await res.json()
    return data.status
  }

  const startPolling = (taskId: number, controller: AbortController) => {
    let retries = 0

    const poll = async () => {
      if (controller.signal.aborted) {
        return
      }

      try {
        const status = await checkStatus(taskId)
        if (['pending', 'processing'].includes(status)) {
          setTimeout(poll, 3000)
        } else {
          pollingControllers.current.delete(taskId)
          setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)))
        }
      } catch (_error) {
        if (retries < 3) {
          retries++
          setTimeout(poll, 3000)
        } else {
          setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: 'failed' } : t)))
        }
      }
    }

    poll()
  }

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

  const handleCancel = async (taskId: number) => {
    // TODO: implement api
    console.log(taskId)
  }

  return (
    <main className='p-6 max-w-xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>File Task Manager</h1>

      <div className='mb-4'>
        <input type='file' ref={fileInputRef} accept='.pdf,image/*' />
        <button onClick={handleSubmit} type='submit' className='ml-2 bg-blue-500 text-white px-4 py-1 rounded'>
          Submit
        </button>
      </div>

      <div>
        <h2 className='text-xl font-semibold mb-2'>Tasks</h2>
        <ul className='space-y-2'>
          {tasks.map((task) => (
            <li key={task.id} className='border p-3 rounded flex justify-between items-center'>
              <div>
                <strong>Task: {task.id}</strong> — <em>{task.status}</em>
              </div>
              {['processing', 'pending'].includes(task.status) && (
                <button onClick={() => handleCancel(task.id)} type='button' className='text-red-500'>
                  Cancel
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
