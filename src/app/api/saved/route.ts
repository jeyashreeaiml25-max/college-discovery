import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '../../lib/prisma'

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { saved: { include: { college: true } } }
  })

  return NextResponse.json(user?.saved.map(s => s.college) || [])
}

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { collegeId } = await request.json()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const existing = await prisma.savedCollege.findUnique({
    where: { userId_collegeId: { userId: user.id, collegeId } }
  })

  if (existing) {
    await prisma.savedCollege.delete({
      where: { userId_collegeId: { userId: user.id, collegeId } }
    })
    return NextResponse.json({ saved: false })
  }

  await prisma.savedCollege.create({
    data: { userId: user.id, collegeId }
  })

  return NextResponse.json({ saved: true })
}