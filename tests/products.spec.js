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

//TODO Test Store Function
describe('(Products) Test Store Function', () => {
  // Positive Testing
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

// TODO Test Index Function
describe('(Products) Test Index Function', () => {
  // Positive Testing
  test('(Positive Testing) with message: "success"', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await products.index(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      message: 'success',
      data: expect.any(Array)
    });
  });
});

// TODO Test Show Function
describe('(Products) Test Show Function', () => {
  // Positive Testing
  test('(Positive Testing) with message: "success"', async () => {
    const req = mockRequest({}, { id: productID });
    const res = mockResponse();

    await products.show(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      message: 'success',
      data: expect.objectContaining({
        id: expect.any(Number),
        name: 'Product Name',
        quantity: 12,
        product_components: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            components: expect.objectContaining({
              id: expect.any(Number),
              name: 'Component Name',
              description: 'Component Address',
            }),
          }),
        ]),
      }),
    });
  });

  // Negative Testing
  test('(Negative Testing) with message: "Product not found!"', async () => {
    const req = mockRequest({}, { id: 9999 });
    const res = mockResponse();

    await products.show(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Can't find data with id 9999",
      data: null
    });
  });
});

//TODO Test Update Function
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
