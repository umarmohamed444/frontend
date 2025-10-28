import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET jobs with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get all jobs first
    let jobs = await prisma.job.findMany({
      include: {
        company: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
      },
      orderBy: {
        postedAt: 'desc',
      },
    });

    // Apply filters if they exist
    const title = searchParams.get('title');
    const workMode = searchParams.get('workMode');
    const location = searchParams.get('location');
    const jobType = searchParams.get('jobType');
    const minSalary = searchParams.get('minSalary');
    const maxSalary = searchParams.get('maxSalary');

    // Filter by title
    if (title) {
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    // Filter by work mode
    if (workMode) {
      jobs = jobs.filter(job => job.workMode === workMode);
    }

    // Filter by location
    if (location) {
      jobs = jobs.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by job type
    if (jobType) {
      jobs = jobs.filter(job => job.jobType === jobType);
    }

    // Filter by salary range
    if (minSalary || maxSalary) {
      jobs = jobs.filter(job => {
        const meetsMinSalary = !minSalary || job.minSalary >= parseFloat(minSalary);
        const meetsMaxSalary = !maxSalary || job.maxSalary <= parseFloat(maxSalary);
        return meetsMinSalary && meetsMaxSalary;
      });
    }

    // Filter published jobs by default
    jobs = jobs.filter(job => job.status === 'PUBLISHED');

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST new job
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      // Company data
      companyName,
      companyLogoUrl,
      
      // Job data
      title,
      location,
      description,
      minExperience,
      maxExperience,
      minSalary,
      maxSalary,
      jobType,
      workMode,
      applicationDeadline,
      status = 'DRAFT', // Default to DRAFT if not specified
    } = body;

    // Use transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // First, try to find existing company
      let company = await tx.company.findUnique({
        where: { name: companyName },
      });

      // If company doesn't exist, create it
      if (!company) {
        company = await tx.company.create({
          data: {
            name: companyName,
            logoUrl: companyLogoUrl,
          },
        });
      }

      // Create the job using the company ID
      const job = await tx.job.create({
        data: {
          title,
          location,
          description,
          minExperience,
          maxExperience,
          minSalary,
          maxSalary,
          jobType,
          workMode,
          companyId: company.id,
          applicationDeadline: new Date(applicationDeadline),
          status,
        },
        include: {
          company: {
            select: {
              name: true,
              logoUrl: true,
            },
          },
        },
      });

      return { job, company };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Company name already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create job and company' },
      { status: 500 }
    );
  }
}