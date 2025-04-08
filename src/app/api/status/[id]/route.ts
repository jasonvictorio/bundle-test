import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params

  const task = await prisma.task.findUnique({
    where: { id: Number(id) },
  })

  if (!task) {
    return new Response('Not found', { status: 404 })
  }

  const rand = Math.random()

  // TOOD: persistent status for "success" and "failed"
  let newStatus = task.status as 'pending' | 'processing' | 'success' | 'failed'
  if (rand < 0.1) {
    return new Response('Simulated network error', { status: 500 })
  }
  if (rand < 0.6) {
    newStatus = 'processing'
  } else if (rand < 0.85) {
    newStatus = 'success'
  } else {
    newStatus = 'failed'
  }

  const updated = await prisma.task.update({
    where: { id: Number(id) },
    data: { status: newStatus },
  })

  return NextResponse.json({ taskId: updated.id, status: updated.status })
}
