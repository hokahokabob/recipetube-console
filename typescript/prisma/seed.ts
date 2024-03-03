import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const seedNotifications: Prisma.notificationsCreateInput[] = [
  {
    title: 'Admin console for Development env released',
    content: 'オタクの皆様、お待たせしました。開発環境用の管理画面がリリースされました。',
    notification_div: 'GENERAL',
    important: true,
    start_at: new Date('2024-02-15T19:00'),
    end_at: new Date('2024-03-15T19:00'),
  }
]

async function main() {
  console.log(`Start seeding ...`)
  for (const n of seedNotifications) {
    const notification = await prisma.notifications.create({
      data: n,
    })
    console.log(`Created notification with id: ${notification.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
