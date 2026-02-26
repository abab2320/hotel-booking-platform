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
  /** 固定状态筛选（例如：草稿箱固定为 'draft'） */
  fixedStatus?: HotelStatus;
  /** 排除的状态列表（例如：酒店列表排除 'draft'） */
  excludeStatuses?: HotelStatus[];
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
  const { 
    useMock = false, 
    initialPageSize = 10,
    fixedStatus,
    excludeStatuses = [],
  } = options;

  // 状态管理
  const [loading, setLoading] = useState(false);
  const [hotelList, setHotelList] = useState<Hotel[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  // 如果设置了 fixedStatus，则使用固定状态，否则使用用户设置的状态
  const [statusFilter, setStatusFilter] = useState<HotelStatus | undefined>(fixedStatus);
  const [searchKeyword, setSearchKeyword] = useState('');

  /**
   * 加载酒店列表
   */
  const loadHotelList = async () => {
    setLoading(true);
    try {
      // 确定最终使用的状态筛选
      let finalStatus = fixedStatus || statusFilter;
      
      if (useMock) {
        // 使用 Mock 数据
        const res = getMockHotelList({
          page: currentPage,
          pageSize,
          status: finalStatus,
        });
        
        // 如果设置了排除状态，则过滤掉这些状态的数据
        let filteredList = res.list;
        if (excludeStatuses.length > 0 && !finalStatus) {
          filteredList = res.list.filter(hotel => !excludeStatuses.includes(hotel.status));
        }
        
        setHotelList(filteredList);
        setTotal(filteredList.length);
      } else {
        // 使用真实 API
        const res = await getMerchantHotels({
          page: currentPage,
          pageSize,
          status: finalStatus,
        });
        
        // 如果设置了排除状态，则过滤掉这些状态的数据
        let filteredList = res.list;
        if (excludeStatuses.length > 0 && !finalStatus) {
          filteredList = res.list.filter(hotel => !excludeStatuses.includes(hotel.status));
        }
        
        setHotelList(filteredList);
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
