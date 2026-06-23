import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.college.createMany({
    data: [
      { name: "IIT Bombay", location: "Mumbai", state: "Maharashtra", fees: 200000, rating: 4.8, overview: "Premier engineering institute in India", courses: ["B.Tech", "M.Tech", "MBA", "PhD"], placements: "Average 18 LPA, Highest 1.2 CR", imageUrl: "" },
      { name: "IIT Delhi", location: "New Delhi", state: "Delhi", fees: 200000, rating: 4.7, overview: "Top engineering institute in the capital", courses: ["B.Tech", "M.Tech", "MBA", "PhD"], placements: "Average 17 LPA, Highest 1.5 CR", imageUrl: "" },
      { name: "IIT Madras", location: "Chennai", state: "Tamil Nadu", fees: 200000, rating: 4.9, overview: "Ranked #1 engineering institute in India", courses: ["B.Tech", "M.Tech", "PhD"], placements: "Average 20 LPA, Highest 2 CR", imageUrl: "" },
      { name: "NIT Trichy", location: "Tiruchirappalli", state: "Tamil Nadu", fees: 150000, rating: 4.5, overview: "Top NIT known for excellent placements", courses: ["B.Tech", "M.Tech", "MCA"], placements: "Average 12 LPA, Highest 45 LPA", imageUrl: "" },
      { name: "BITS Pilani", location: "Pilani", state: "Rajasthan", fees: 500000, rating: 4.6, overview: "Top private engineering college in India", courses: ["B.Tech", "M.Tech", "MBA"], placements: "Average 15 LPA, Highest 1 CR", imageUrl: "" },
      { name: "VIT Vellore", location: "Vellore", state: "Tamil Nadu", fees: 350000, rating: 4.2, overview: "Popular private university with good placements", courses: ["B.Tech", "M.Tech", "MBA", "MCA"], placements: "Average 8 LPA, Highest 44 LPA", imageUrl: "" },
      { name: "COEP Pune", location: "Pune", state: "Maharashtra", fees: 120000, rating: 4.1, overview: "One of the oldest engineering colleges in Asia", courses: ["B.Tech", "M.Tech"], placements: "Average 7 LPA, Highest 32 LPA", imageUrl: "" },
      { name: "SRM University", location: "Chennai", state: "Tamil Nadu", fees: 300000, rating: 4.0, overview: "Large private university with diverse programs", courses: ["B.Tech", "M.Tech", "MBA", "MCA"], placements: "Average 6 LPA, Highest 40 LPA", imageUrl: "" },
      { name: "Manipal Institute", location: "Manipal", state: "Karnataka", fees: 400000, rating: 4.1, overview: "Well known private university with global exposure", courses: ["B.Tech", "M.Tech", "MBA", "MBBS"], placements: "Average 7 LPA, Highest 35 LPA", imageUrl: "" },
      { name: "DTU Delhi", location: "New Delhi", state: "Delhi", fees: 170000, rating: 4.3, overview: "Top state university for engineering in Delhi", courses: ["B.Tech", "M.Tech", "MBA"], placements: "Average 10 LPA, Highest 60 LPA", imageUrl: "" },
    ]
  })
  console.log('✅ Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())