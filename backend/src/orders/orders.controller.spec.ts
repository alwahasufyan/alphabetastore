import { OrdersController } from './orders.controller';

describe('OrdersController', () => {
  const ordersService = {
    createOrder: jest.fn(),
    findAll: jest.fn(),
    findMine: jest.fn(),
    findOneForUser: jest.fn(),
    updateStatus: jest.fn(),
  };

  const controller = new OrdersController(ordersService as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates an order for authenticated user with optional session id', async () => {
    const dto = {
      fullName: 'User A',
      phone: '+218911111111',
      city: 'طرابلس',
      address: 'Street 1',
      items: [{ productId: 'product-1', quantity: 1 }],
    };

    const expected = { id: 'order-1' };
    ordersService.createOrder.mockResolvedValue(expected);

    await expect(
      controller.create({ user: { sub: 'user-1' } } as any, 'session-1', dto as any),
    ).resolves.toEqual(expected);

    expect(ordersService.createOrder).toHaveBeenCalledWith(
      {
        userId: 'user-1',
        sessionId: 'session-1',
      },
      dto,
    );
  });

  it('creates a guest order using session id identity', async () => {
    const dto = {
      fullName: 'Guest User',
      phone: '+218922222222',
      city: 'بنغازي',
      address: 'Street 2',
      items: [{ productId: 'product-2', quantity: 2 }],
    };

    ordersService.createOrder.mockResolvedValue({ id: 'order-2' });

    await controller.create({ user: null } as any, 'guest-session', dto as any);

    expect(ordersService.createOrder).toHaveBeenCalledWith(
      {
        userId: null,
        sessionId: 'guest-session',
      },
      dto,
    );
  });
});
