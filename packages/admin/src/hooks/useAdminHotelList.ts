/**
 * 管理员酒店审核业务逻辑 Hook
 * 提供管理员审核酒店的数据管理和操作方法
 */
import { useState, useEffect } from 'react';
import { message } from 'antd';
import type { Hotel, HotelStatus } from '@/types';
import { getMockHotelList } from '@/mock/hotel';

interface UseAdminHotelListOptions {
  useMock?: boolean;
  initialPageSize?: number;
}

interface UseAdminHotelListReturn {
  // 状态
  loading: boolean;
  hotelList: Hotel[];
  total: number;
  currentPage: number;
  pageSize: number;
  statusFilter: HotelStatus | undefined;
  
  // 设置状态的方法
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setStatusFilter: (status: HotelStatus | undefined) => void;
  
  // 业务操作方法
  loadHotelList: () => Promise<void>;
  handleApprove: (id: number) => Promise<void>;
  handleReject: (id: number, reason: string) => Promise<void>;
  handlePublish: (id: number) => Promise<void>;
  handleOffline: (id: number) => Promise<void>;
  handleRestore: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Mock 审核通过
 */
const mockApproveHotel = (id: number) => {
  console.log('Mock: 审核通过酒店', id);
  return { success: true, message: '审核通过' };
};

/**
 * Mock 审核拒绝
 */
const mockRejectHotel = (id: number, reason: string) => {
  console.log('Mock: 审核拒绝酒店', id, '原因:', reason);
  return { success: true, message: '已拒绝' };
};

/**
 * Mock 发布酒店
 */
const mockPublishHotel = (id: number) => {
  console.log('Mock: 发布酒店', id);
  return { success: true, message: '发布成功' };
};

/**
 * Mock 下线酒店
 */
const mockOfflineHotel = (id: number) => {
  console.log('Mock: 下线酒店', id);
  return { success: true, message: '已下线' };
};

/**
 * Mock 恢复酒店
 */
const mockRestoreHotel = (id: number) => {
  console.log('Mock: 恢复酒店', id);
  return { success: true, message: '已恢复上线' };
};

/**
 * 管理员酒店审核列表 Hook
 * @param options 配置选项
 * @returns 酒店审核列表状态和操作方法
 */
export const useAdminHotelList = (
  options: UseAdminHotelListOptions = {}
): UseAdminHotelListReturn => {
  const { useMock = false, initialPageSize = 10 } = options;

  // 状态管理
  const [loading, setLoading] = useState(false);
  const [hotelList, setHotelList] = useState<Hotel[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [statusFilter, setStatusFilter] = useState<HotelStatus | undefined>();

  /**
   * 加载酒店列表（管理员查看所有商户的酒店）
   */
  const loadHotelList = async () => {
    setLoading(true);
    try {
      if (useMock) {
        // 使用 Mock 数据
        const res = getMockHotelList({
          page: currentPage,
          pageSize,
          status: statusFilter,
        });
        setHotelList(res.list);
        setTotal(res.pagination.total);
      } else {
        // 使用真实 API（TODO: 实现管理员 API）
        // const res = await getAdminHotels({
        //   page: currentPage,
        //   pageSize,
        //   status: statusFilter,
        // });
        // setHotelList(res.list);
        // setTotal(res.pagination.total);
        message.warning('真实 API 尚未实现，请使用 Mock 模式');
      }
    } catch (error: any) {
      message.error(error?.message || '获取酒店列表失败');
      setHotelList([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 审核通过
   */
  const handleApprove = async (id: number) => {
    try {
      if (useMock) {
        const res = mockApproveHotel(id);
        if (res.success) {
          message.success(res.message);
          await loadHotelList();
        } else {
          message.error(res.message);
        }
      } else {
        // TODO: 实现真实 API
        // await approveHotel(id);
        message.warning('真实 API 尚未实现');
      }
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    }
  };

  /**
   * 审核拒绝
   */
  const handleReject = async (id: number, reason: string) => {
    try {
      if (useMock) {
        const res = mockRejectHotel(id, reason);
        if (res.success) {
          message.success(res.message);
          await loadHotelList();
        } else {
          message.error(res.message);
        }
      } else {
        // TODO: 实现真实 API
        // await rejectHotel(id, reason);
        message.warning('真实 API 尚未实现');
      }
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    }
  };

  /**
   * 发布上线
   */
  const handlePublish = async (id: number) => {
    try {
      if (useMock) {
        const res = mockPublishHotel(id);
        if (res.success) {
          message.success(res.message);
          await loadHotelList();
        } else {
          message.error(res.message);
        }
      } else {
        // TODO: 实现真实 API
        // await publishHotel(id);
        message.warning('真实 API 尚未实现');
      }
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    }
  };

  /**
   * 下线
   */
  const handleOffline = async (id: number) => {
    try {
      if (useMock) {
        const res = mockOfflineHotel(id);
        if (res.success) {
          message.success(res.message);
          await loadHotelList();
        } else {
          message.error(res.message);
        }
      } else {
        // TODO: 实现真实 API
        // await offlineHotel(id);
        message.warning('真实 API 尚未实现');
      }
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    }
  };

  /**
   * 恢复上线
   */
  const handleRestore = async (id: number) => {
    try {
      if (useMock) {
        const res = mockRestoreHotel(id);
        if (res.success) {
          message.success(res.message);
          await loadHotelList();
        } else {
          message.error(res.message);
        }
      } else {
        // TODO: 实现真实 API
        // await restoreHotel(id);
        message.warning('真实 API 尚未实现');
      }
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    }
  };

  /**
   * 刷新列表（重置到第一页）
   */
  const refresh = async () => {
    setCurrentPage(1);
    await loadHotelList();
  };

  // 监听分页和筛选条件变化，自动加载数据
  useEffect(() => {
    loadHotelList();
  }, [currentPage, pageSize, statusFilter]);

  return {
    // 状态
    loading,
    hotelList,
    total,
    currentPage,
    pageSize,
    statusFilter,
    
    // 设置状态的方法
    setCurrentPage,
    setPageSize,
    setStatusFilter,
    
    // 业务操作方法
    loadHotelList,
    handleApprove,
    handleReject,
    handlePublish,
    handleOffline,
    handleRestore,
    refresh,
  };
};
