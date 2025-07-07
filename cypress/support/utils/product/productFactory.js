import { faker } from '@faker-js/faker'

export function generateProduct(type = 'random') {
  if (type === 'documented') {
    return {
      title: 'Perfume Oil',
      description: 'Mega Discount, Impression of A...',
      price: 13,
      discountPercentage: 8.4,
      rating: 4.26,
      stock: 65,
      brand: 'Impression of Acqua Di Gio',
      category: 'fragrances',
      thumbnail: 'https://i.dummyjson.com/data/products/11/thumnail.jpg'
    }
  }

  return {
    title: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    price: faker.number.float({ min: 10, max: 500, precision: 0.01 }),
    discountPercentage: faker.number.float({ min: 5, max: 50, precision: 0.01 }),
    rating: faker.number.float({ min: 1, max: 5, precision: 0.01 }),
    stock: faker.number.int({ min: 1, max: 100 }),
    brand: faker.company.name(),
    category: faker.commerce.department(),
    thumbnail: faker.image.url()
  }
}
