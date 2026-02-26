import { useState, useEffect } from 'react';
import { message } from 'antd';
import { getMerchantHotelDetail, getAdminHotelDetail } from '@/services/hotel';
import { getMockHotelDetail } from '@/mock/hotel';
import type { Hotel } from '@/types';

interface UseHotelDetailOptions {
  id: string | undefined;
  /** 加载成功后的回调 */
  onSuccess?: (hotel: Hotel) => void;
  /** 是否自动加载 */
  autoLoad?: boolean;
  /** 是否使用 Mock 数据 */
  useMock?: boolean;
  /** 是否使用管理员 API（默认使用商户 API） */
  useAdminApi?: boolean;
}

interface UseHotelDetailReturn {
  loading: boolean;
  hotel: Hotel | null;
  error: Error | null;
  reload: () => Promise<void>;
}

/**
 * 酒店详情加载 Hook
 * 提供统一的酒店详情加载逻辑
 */
export const useHotelDetail = (
  options: UseHotelDetailOptions
): UseHotelDetailReturn => {
  const { id, onSuccess, autoLoad = true, useMock = false, useAdminApi = false } = options;
  
  const [loading, setLoading] = useState(false);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const loadHotelDetail = async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      if (useMock) {
        const data = getMockHotelDetail(Number(id));
        setHotel(data);
        onSuccess?.(data);
      } else {
        // 根据 useAdminApi 参数选择使用管理员 API 或商户 API
        const apiCall = useAdminApi ? getAdminHotelDetail : getMerchantHotelDetail;
        const data = await apiCall(Number(id));
        setHotel(data);
        onSuccess?.(data);
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      message.error('加载酒店信息失败');
      console.error('Load hotel error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoLoad) {
      loadHotelDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, autoLoad]);

  return {
    loading,
    hotel,
    error,
    reload: loadHotelDetail,
  };
};
