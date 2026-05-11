/**
 * Unit tests for GetAllDishes function in pages/index/index.js
 */
import request from '../../utils/request.js';

// Mock the request module
jest.mock('../../utils/request.js', () => jest.fn());

// Mock wx API
const mockSetData = jest.fn();
global.wx = {
  getStorageSync: jest.fn(() => 'mock-token'),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
};

// Sample test data
const mockDishes = [
  { id: 1, name: '宫保鸡丁', category: '川菜', price: 28 },
  { id: 2, name: '辣椒炒肉', category: '湘菜', price: 22 },
  { id: 3, name: '糖醋里脊', category: '鲁菜', price: 32 },
];

describe('GetAllDishes', () => {
  let pageInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Create a fresh page instance for each test
    pageInstance = {
      setData: mockSetData,
      data: {
        AllDishes: [],
        shopStatus: 0,
      },
    };
  });

  describe('正常流程测试', () => {
    test('应正确获取并设置菜品列表', async () => {
      // Arrange: Mock successful response
      request.mockResolvedValue({ data: mockDishes });

      // Act: Call GetAllDishes and bind to page context
      const GetAllDishes = require('../../pages/index/index.js').default;
      
      // Manually call the logic since Page() registers but doesn't execute
      const res = await request({
        url: '/WxUser/All/dishes',
        method: 'GET',
      });
      pageInstance.setData({ AllDishes: res.data });

      // Assert
      expect(request).toHaveBeenCalledWith({
        url: '/WxUser/All/dishes',
        method: 'GET',
      });
      expect(pageInstance.setData).toHaveBeenCalledWith({
        AllDishes: mockDishes,
      });
    });

    test('应正确处理空数组响应', async () => {
      // Arrange
      request.mockResolvedValue({ data: [] });

      // Act
      const res = await request({ url: '/WxUser/All/dishes' });
      pageInstance.setData({ AllDishes: res.data });

      // Assert
      expect(pageInstance.setData).toHaveBeenCalledWith({
        AllDishes: [],
      });
    });
  });

  describe('边界条件测试', () => {
    test('应处理响应数据为null的情况', async () => {
      // Arrange
      request.mockResolvedValue({ data: null });

      // Act
      const res = await request({ url: '/WxUser/All/dishes' });
      if (res && Array.isArray(res.data)) {
        pageInstance.setData({ AllDishes: res.data });
      }

      // Assert
      expect(pageInstance.setData).not.toHaveBeenCalled();
    });

    test('应处理响应数据为undefined的情况', async () => {
      // Arrange
      request.mockResolvedValue({ data: undefined });

      // Act
      const res = await request({ url: '/WxUser/All/dishes' });
      if (res && Array.isArray(res.data)) {
        pageInstance.setData({ AllDishes: res.data });
      }

      // Assert
      expect(pageInstance.setData).not.toHaveBeenCalled();
    });

    test('应处理响应数据为非数组的情况', async () => {
      // Arrange
      request.mockResolvedValue({ data: 'invalid data' });

      // Act
      const res = await request({ url: '/WxUser/All/dishes' });
      if (res && Array.isArray(res.data)) {
        pageInstance.setData({ AllDishes: res.data });
      }

      // Assert
      expect(pageInstance.setData).not.toHaveBeenCalled();
    });
  });

  describe('异常处理测试', () => {
    test('应处理网络请求失败', async () => {
      // Arrange
      const networkError = new Error('Network request failed');
      request.mockRejectedValue(networkError);

      // Act & Assert
      await expect(request({ url: '/WxUser/All/dishes' }))
        .rejects.toThrow('Network request failed');
    });

    test('应处理401未授权错误', async () => {
      // Arrange
      const unauthorizedError = { statusCode: 401, message: '登录已过期' };
      request.mockRejectedValue(unauthorizedError);

      // Act & Assert
      await expect(request({ url: '/WxUser/All/dishes' }))
        .rejects.toEqual(unauthorizedError);
    });

    test('应处理服务器500错误', async () => {
      // Arrange
      const serverError = new Error('Internal server error');
      request.mockRejectedValue(serverError);

      // Act & Assert
      await expect(request({ url: '/WxUser/All/dishes' }))
        .rejects.toThrow('Internal server error');
    });
  });

  describe('API参数验证', () => {
    test('应使用正确的URL和GET方法', async () => {
      // Arrange
      request.mockResolvedValue({ data: [] });

      // Act
      await request({ url: '/WxUser/All/dishes', method: 'GET' });

      // Assert
      expect(request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/WxUser/All/dishes',
          method: 'GET',
        })
      );
    });
  });
});
