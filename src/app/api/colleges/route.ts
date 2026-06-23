import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const state = searchParams.get('state') || ''
  const minFees = parseInt(searchParams.get('minFees') || '0')
  const maxFees = parseInt(searchParams.get('maxFees') || '9999999')

  const colleges = await prisma.college.findMany({
    where: {
      AND: [
        { name: { contains: search, mode: 'insensitive' } },
        state ? { state: { equals: state } } : {},
        { fees: { gte: minFees, lte: maxFees } },
      ]
    },
    orderBy: { rating: 'desc' }
  })

  return NextResponse.json(colleges)
}