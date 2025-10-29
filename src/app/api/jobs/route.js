import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET jobs with filters (optimized with Prisma `where` clause)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Build the filter object for Prisma
    const filters = {};

    const title = searchParams.get('title');
    if (title) {
      filters.title = {
        contains: title,
        mode: 'insensitive', // Case-insensitive search
      };
    }

    const workMode = searchParams.get('workMode');
    if (workMode) {
      filters.workMode = workMode;
    }

    const location = searchParams.get('location');
    if (location) {
      filters.location = {
        contains: location,
        mode: 'insensitive',
      };
    }

    const jobType = searchParams.get('jobType');
    if (jobType) {
      // Assuming jobType in DB is like 'FULL_TIME' and from client is 'fulltime'
      filters.jobType = jobType.toUpperCase().replace(' ', '_');
    }

    const minSalary = searchParams.get('minSalary');
    if (minSalary) {
      filters.minSalary = {
        gte: parseFloat(minSalary),
      };
    }

    const maxSalary = searchParams.get('maxSalary');
    if (maxSalary) {
      filters.maxSalary = {
        // If a job's max salary is 0 or null, it might be unpaid.
        // We include it unless a specific max is set.
        lte: parseFloat(maxSalary) || undefined,
      };
    }

    // Always filter for published jobs on the main listing
    filters.status = 'PUBLISHED';

    // Fetch jobs directly with the applied filters
    const jobs = await prisma.job.findMany({
      where: filters,
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