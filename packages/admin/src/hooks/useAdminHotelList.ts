/**
 * 管理员酒店审核业务逻辑 Hook
 * 提供管理员审核酒店的数据管理和操作方法
 */
import { useState, useEffect } from 'react';
import { message } from 'antd';
import type { Hotel, HotelStatus } from '@/types';
import { getMockHotelList } from '@/mock/hotel';
import {
  getPendingHotels,
  approveHotel,
  rejectHotel,
  publishHotel,
  offlineHotel,
  restoreHotel,
} from '@/services/hotel';

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
   * 注意：管理员在任何情况下都无法看到草稿状态的酒店
   * 草稿状态的酒店仅对商户自己在草稿箱中可见
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
        
        // 过滤掉草稿状态的酒店（管理员永远不能看到草稿）
        const filteredList = res.list.filter(hotel => hotel.status !== 'draft');
        
        setHotelList(filteredList);
        setTotal(filteredList.length);
      } else {
        // 使用真实 API
        const res = await getPendingHotels({
          page: currentPage,
          pageSize,
          status: statusFilter, // 传递状态筛选参数
        });
        setHotelList(res.list);
        setTotal(res.pagination.total);
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
        await approveHotel(id);
        message.success('审核通过');
        await loadHotelList();
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
        await rejectHotel(id, reason);
        message.success('已拒绝');
        await loadHotelList();
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
        await publishHotel(id);
        message.success('发布成功');
        await loadHotelList();
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
        await offlineHotel(id);
        message.success('已下线');
        await loadHotelList();
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
        await restoreHotel(id);
        message.success('已恢复上线');
        await loadHotelList();
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
