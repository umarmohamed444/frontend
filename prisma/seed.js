const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const companies = [
  {
    name: 'Amazon',
    logoUrl: 'https://spotfluencerbucket.s3.ap-south-1.amazonaws.com/profile-pictures/amazon.png',
    jobs: [
      {
        title: 'Full Stack Developer',
        location: 'Bangalore',
        description: 'Join our team to build scalable web applications using React and Node.js. Experience with AWS services and microservices architecture is a plus.',
        minExperience: 1,
        maxExperience: 3,
        minSalary: 800000,
        maxSalary: 1200000,
        jobType: 'FULL_TIME',
        workMode: 'ONSITE',
        status: 'PUBLISHED',
        applicationDeadline: new Date('2026-01-15'),
      },
      {
        title: 'DevOps Engineer',
        location: 'Bangalore',
        description: 'Looking for an experienced DevOps engineer to help us scale our infrastructure. Knowledge of AWS, Kubernetes, and CI/CD pipelines required.',
        minExperience: 3,
        maxExperience: 6,
        minSalary: 2000000,
        maxSalary: 3500000,
        jobType: 'FULL_TIME',
        workMode: 'HYBRID',
        status: 'PUBLISHED',
        applicationDeadline: new Date('2026-02-01'),
      }
    ]
  },
  {
    name: 'Tesla',
    logoUrl: 'https://spotfluencerbucket.s3.ap-south-1.amazonaws.com/profile-pictures/tesla.png',
    jobs: [
      {
        title: 'Frontend Developer',
        location: 'Hyderabad',
        description: 'Join our Azure team to build modern web interfaces. Strong experience with React, TypeScript, and modern frontend practices required. You will work on creating intuitive user experiences for cloud services.',
        minExperience: 2,
        maxExperience: 5,
        minSalary: 1800000,
        maxSalary: 3000000,
        jobType: 'FULL_TIME',
        workMode: 'ONSITE',
        status: 'PUBLISHED',
        applicationDeadline: new Date('2026-01-30'),
      },
      {
        title: 'Backend Developer',
        location: 'Chennai',
        description: 'Build high-performance microservices for our food delivery platform. Experience with Node.js, PostgreSQL, and Redis required. You will work on systems that handle millions of orders daily.',
        minExperience: 3,
        maxExperience: 6,
        minSalary: 1800000,
        maxSalary: 3200000,
        jobType: 'FULL_TIME',
        workMode: 'REMOTE',
        status: 'PUBLISHED',
        applicationDeadline: new Date('2026-01-20'),
      }
    ]
  },
  {
    name: 'Swiggy',
    logoUrl: 'https://spotfluencerbucket.s3.ap-south-1.amazonaws.com/profile-pictures/swiggy.png',
    jobs: [
      {
        title: 'Machine Learning Engineer',
        location: 'Bangalore',
        description: 'Work on cutting-edge AI/ML projects. Experience with TensorFlow, PyTorch, and large-scale machine learning systems required. You will develop and deploy ML models that impact billions of users.',
        minExperience: 4,
        maxExperience: 8,
        minSalary: 3000000,
        maxSalary: 5500000,
        jobType: 'FULL_TIME',
        workMode: 'HYBRID',
        status: 'PUBLISHED',
        applicationDeadline: new Date('2026-02-15'),
      },
      {
        title: 'Software Engineering Intern',
        location: 'Bangalore',
        description: 'Join our internship program to work on real-world projects. Strong CS fundamentals and coding skills required. You will collaborate with experienced engineers and learn about large-scale systems.',
        minExperience: 0,
        maxExperience: 1,
        minSalary: 100000,
        maxSalary: 150000,
        jobType: 'INTERNSHIP',
        workMode: 'ONSITE',
        status: 'PUBLISHED',
        applicationDeadline: new Date('2026-03-01'),
      }
    ]
  },
];

async function main() {
  console.log('Start seeding...');

  // Delete all existing data
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();

  // Create companies and their jobs
  for (const companyData of companies) {
    const { jobs, ...company } = companyData;
    
    const createdCompany = await prisma.company.create({
      data: {
        ...company,
        jobs: {
          create: jobs.map(job => ({
            ...job,
            // Convert decimal values for salary
            minSalary: job.minSalary.toString(),
            maxSalary: job.maxSalary.toString()
          }))
        }
      }
    });

    console.log(`Created company ${createdCompany.name} with ${jobs.length} jobs`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });