
import {generateProduct} from './productFactory'

export function getAllProducts() {
  return cy.request({
    method: 'GET',
    url: '/products',
    failOnStatusCode: false
  });
}

export function getProductById(id) {
  return cy.request({
    method: 'GET',
    url: `/products/${id}`,
    failOnStatusCode: false
  });
}

export function getFirstProductId() {
  return getAllProducts().then((res) => res.body.products[0].id);
}

export function getSecondProductId() {
  return getAllProducts().then((res) => res.body.products[1].id);
}

export function getProductPaginationLimit() {
  return getAllProducts().then((res) => res.body.limit);
}

export function getProductTotal() {
  return getAllProducts().then((res) => res.body.total);
}

export function assertProductFields(product) {
  const requiredFields = [
    'id',
    'title',
    'description',
    'price',
    'discountPercentage',
    'rating',
    'stock',
    'brand',
    'category',
    'thumbnail'
  ];

  requiredFields.forEach((field) => {
    expect(product).to.have.property(field);
  });
}
