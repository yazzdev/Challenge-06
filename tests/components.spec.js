const { components } = require('../controllers');
const { truncateComponent } = require('../utils/truncate');

const mockRequest = (body = {}, params = {}) => ({ body, params });
const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

let componentId;

beforeAll(async () => {
  await truncateComponent();
});

//TODO Test Store Fungction
describe('(Components) Test Store Function', () => {

  //Positive Testing
  test('(Positive Testing) with message: "Component added successfully"', async () => {
    const req = mockRequest({
      name: 'Component Name',
      description: 'Component Address'
    });
    const res = mockResponse();

    await components.store(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      message: 'Component added successfully',
      data: expect.objectContaining({
        id: expect.any(Number),
        name: 'Component Name',
        description: 'Component Address'
      })
    });

    componentId = res.json.mock.calls[0][0].data.id;
  });

  //Negative Testing
  test('(Negative Testing) with message: "Component Name and Description is required!"', async () => {
    const req = mockRequest({
      name: '',
      description: ''
    });
    const res = mockResponse();

    await components.store(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: 'Component Name and Description is required!',
      data: null
    });
  });
});

/// TODO Test Update Function
describe('(Components) Test Update Function', () => {
  // Positive Testing
  test('(Positive Testing) with message: "Component updated successfully"', async () => {
    const updateReq = mockRequest({
      name: 'Updated Component Name',
      description: 'Updated Component Address'
    }, { id: componentId });
    const updateRes = mockResponse();

    await components.update(updateReq, updateRes);

    expect(updateRes.status).toHaveBeenCalledWith(200);
    expect(updateRes.json).toHaveBeenCalledWith({
      status: true,
      message: 'Component updated successfully',
      data: null
    });
  });

  // Negative Testing
  test('(Negative Testing) with message: "Component not found!"', async () => {
    const updateReq = mockRequest({
      name: 'Updated Component Name',
      description: 'Updated Component Address'
    }, { id: 9999 });
    const updateRes = mockResponse();

    await components.update(updateReq, updateRes);

    expect(updateRes.status).toHaveBeenCalledWith(404);
    expect(updateRes.json).toHaveBeenCalledWith({
      status: false,
      message: 'Component not found!',
      data: null
    });
  });
});

// TODO Test Destroy Function
describe('(Components) Test Destroy Function', () => {
  //Positive Testing
  test('(Positive Testing) Component deleted successfully', async () => {
    const destroyReq = mockRequest({}, { id: componentId });
    const destroyRes = mockResponse();

    await components.destroy(destroyReq, destroyRes);

    expect(destroyRes.status).toHaveBeenCalledWith(200);
    expect(destroyRes.json).toHaveBeenCalledWith({
      status: true,
      message: 'Component deleted successfully',
      data: null
    });
  });

  // Negative Testing
  test('(Negative Testing) with message: "Component not found!"', async () => {
    const destroyReq = mockRequest({}, { id: 9999 });
    const destroyRes = mockResponse();

    await components.destroy(destroyReq, destroyRes);

    expect(destroyRes.status).toHaveBeenCalledWith(404);
    expect(destroyRes.json).toHaveBeenCalledWith({
      status: false,
      message: 'Component not found!',
      data: null
    });
  });
});