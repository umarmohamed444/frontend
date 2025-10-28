import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH - Update job status
export async function PATCH(request, { params }) {
  try {
    const jobId = params.jobId;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { status },
    });

    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    console.error('Error updating job status:', error);
    return NextResponse.json(
      { error: 'Failed to update job status' },
      { status: 500 }
    );
  }
}