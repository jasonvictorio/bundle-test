import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST() {
  const task = await prisma.task.create({
    data: {
      name: `Task-${Date.now()}`,
      status: 'pending',
    },
  })

  return NextResponse.json({ task_id: task.id })
}

export async function GET() {
  try {
    const projects = await prisma.task.findMany()

    return NextResponse.json(projects)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}
