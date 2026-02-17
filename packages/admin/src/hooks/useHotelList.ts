/**
 * 酒店列表业务逻辑 Hook
 * 提供酒店列表的数据管理和操作方法
 */
import { useState, useEffect } from 'react';
import { message } from 'antd';
import {
  getMerchantHotels,
  deleteHotel,
  submitHotelForReview,
} from '@/services/hotel';
import {
  getMockHotelList,
  mockDeleteHotel,
  mockSubmitHotelForReview,
} from '@/mock/hotel';
import type { Hotel, HotelStatus } from '@/types';

interface UseHotelListOptions {
  useMock?: boolean;
  initialPageSize?: number;
}

interface UseHotelListReturn {
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
  setSearchKeyword: (keyword: string) => void;
  
  // 业务操作方法
  loadHotelList: () => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  handleSubmitReview: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * 酒店列表 Hook
 * @param options 配置选项
 * @returns 酒店列表状态和操作方法
 */
export const useHotelList = (options: UseHotelListOptions = {}): UseHotelListReturn => {
  const { useMock = false, initialPageSize = 10 } = options;

  // 状态管理
  const [loading, setLoading] = useState(false);
  const [hotelList, setHotelList] = useState<Hotel[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [statusFilter, setStatusFilter] = useState<HotelStatus | undefined>();
  const [searchKeyword, setSearchKeyword] = useState('');

  /**
   * 加载酒店列表
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
        // 使用真实 API
        const res = await getMerchantHotels({
          page: currentPage,
          pageSize,
          status: statusFilter,
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
   * 删除酒店
   */
  const handleDelete = async (id: number) => {
    try {
      if (useMock) {
        const res = mockDeleteHotel(id);
        if (res.success) {
          message.success(res.message);
          await loadHotelList();
        } else {
          message.error(res.message);
        }
      } else {
        await deleteHotel(id);
        message.success('删除成功');
        await loadHotelList();
      }
    } catch (error: any) {
      message.error(error?.message || '删除失败');
    }
  };

  /**
   * 提交审核
   */
  const handleSubmitReview = async (id: number) => {
    try {
      if (useMock) {
        const res = mockSubmitHotelForReview(id);
        if (res.success) {
          message.success(res.message);
          await loadHotelList();
        } else {
          message.error(res.message);
        }
      } else {
        await submitHotelForReview(id);
        message.success('已提交审核');
        await loadHotelList();
      }
    } catch (error: any) {
      message.error(error?.message || '提交失败');
    }
  };

  /**
   * 刷新列表（重置到第一页）
   */
  const refresh = async () => {
    setCurrentPage(1);
    await loadHotelList();
  };

  // 监听分页、筛选变化，自动重新加载
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
    setSearchKeyword,
    
    // 业务操作方法
    loadHotelList,
    handleDelete,
    handleSubmitReview,
    refresh,
  };
};
