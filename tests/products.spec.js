const { products } = require('../controllers');
const { Components, Products } = require('../models');
const { truncateProduct, truncateProductComponents } = require('../utils/truncate');

const mockRequest = (body = {}, params = {}) => ({ body, params });
const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

let component;
let productID;

beforeAll(async () => {
  await truncateProduct();
  await truncateProductComponents();
});

beforeEach(async () => {
  component = await Components.create({
    name: 'Component Name',
    description: 'Component Address'
  });
});


// Positive Testing
describe('(Products) Test Store Function', () => {
  test('(Positive Testing) with valid data', async () => {
    const req = mockRequest({
      name: 'Product Name',
      quantity: 12,
      component_id: component.id
    });
    const res = mockResponse();

    await products.store(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      message: 'Product added successfully',
      data: expect.objectContaining({
        product: expect.objectContaining({
          id: expect.any(Number),
          name: 'Product Name',
          quantity: 12,
        }),
        product_components: expect.objectContaining({
          id: expect.any(Number),
          product_id: expect.any(Number),
          component_id: component.id
        })
      })
    });

    productID = res.json.mock.calls[0][0].data.product.id;
  });

  test('(Negative Testing) with invalid component_id', async () => {
    const req = mockRequest({
      name: 'Product Name',
      quantity: 12,
      component_id: 9999
    });
    const res = mockResponse();

    await products.store(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: 'component_id does not exist!!',
      data: null
    });
  });

  test('(Negative Testing) with missing name and quantity', async () => {
    const req = mockRequest({
      component_id: component.id
    });
    const res = mockResponse();

    await products.store(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: 'name product and quantity is required!',
      data: null
    });
  });
});

// Update Function
describe('(Products) Test Update Function', () => {
  test('(Positive Testing) with valid data', async () => {
    const req = mockRequest({
      name: 'Updated Product Name',
      quantity: 20
    }, { id: productID });
    const res = mockResponse();

    await products.update(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      message: 'Product updated successfully',
      data: null
    });
  });

  test('(Negative Testing) with invalid id product', async () => {
    const req = mockRequest({
      name: 'Updated Product Name',
      quantity: 20
    }, { id: 9999 });
    const res = mockResponse();

    await products.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: 'Product not found!',
      data: null
    });
  });
});
