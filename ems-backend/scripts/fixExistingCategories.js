import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixExistingCategories() {
  console.log('🔧 Fixing existing seat categories...\n');

  // Get all categories
  const categories = await prisma.seatCategory.findMany({
    include: {
      seats: true,
    },
  });

  for (const category of categories) {
    const existingSeats = category.seats.length;
    const neededSeats = category.maxSeats - existingSeats;

    if (neededSeats <= 0) {
      console.log(`✅ ${category.name}: Already has enough seats`);
      continue;
    }

    console.log(`📝 ${category.name}: Creating ${neededSeats} seats...`);

    const seatsToCreate = [];
    const prefix = category.name.substring(0, 1).toUpperCase();

    for (let i = existingSeats + 1; i <= category.maxSeats; i++) {
      seatsToCreate.push({
        venueId: category.venueId,
        categoryId: category.id,
        label: `${prefix}${i}`,
        status: 'AVAILABLE',
      });
    }

    await prisma.seat.createMany({
      data: seatsToCreate,
    });

    console.log(`✅ Created ${neededSeats} seats for ${category.name}`);
  }

  console.log('\n🎉 Done! All categories now have seats.');
}

fixExistingCategories()
  .catch(console.error)
  .finally(() => prisma.$disconnect());