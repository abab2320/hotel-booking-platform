/**
 * 酒店管理相关的 Mock 数据和函数
 * 用于模拟管理员审核、发布、下线等操作
 */

/**
 * Mock 响应类型
 */
export interface MockResponse {
  success: boolean;
  message: string;
}

/**
 * 创建 Mock 响应的工厂函数
 * @param action - 操作名称
 * @param id - 酒店ID
 * @param extraParams - 额外参数
 */
const createMockResponse = (
  action: string,
  id: number,
  extraParams?: Record<string, any>
): MockResponse => {
  const logMessage = extraParams
    ? `Mock: ${action}酒店 ${id}, 额外参数: ${JSON.stringify(extraParams)}`
    : `Mock: ${action}酒店 ${id}`;
  
  console.log(logMessage);
  
  return {
    success: true,
    message: getSuccessMessage(action),
  };
};

/**
 * 根据操作类型获取成功消息
 */
const getSuccessMessage = (action: string): string => {
  const messageMap: Record<string, string> = {
    '审核通过': '审核通过',
    '审核拒绝': '已拒绝',
    '发布': '发布成功',
    '下线': '已下线',
    '恢复': '已恢复上线',
  };
  
  return messageMap[action] || '操作成功';
};

/**
 * Mock 审核通过酒店
 */
export const mockApproveHotel = (id: number): MockResponse => {
  return createMockResponse('审核通过', id);
};

/**
 * Mock 审核拒绝酒店
 */
export const mockRejectHotel = (id: number, reason: string): MockResponse => {
  return createMockResponse('审核拒绝', id, { reason });
};

/**
 * Mock 发布酒店
 */
export const mockPublishHotel = (id: number): MockResponse => {
  return createMockResponse('发布', id);
};

/**
 * Mock 下线酒店
 */
export const mockOfflineHotel = (id: number): MockResponse => {
  return createMockResponse('下线', id);
};

/**
 * Mock 恢复酒店上线
 */
export const mockRestoreHotel = (id: number): MockResponse => {
  return createMockResponse('恢复', id);
};

/**
 * 统一导出所有 Mock 函数
 */
export const hotelAdminMock = {
  approveHotel: mockApproveHotel,
  rejectHotel: mockRejectHotel,
  publishHotel: mockPublishHotel,
  offlineHotel: mockOfflineHotel,
  restoreHotel: mockRestoreHotel,
};
