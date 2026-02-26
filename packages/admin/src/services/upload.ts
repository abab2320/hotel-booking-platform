import request from '@/utils/request';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

/** 上传单张图片 */
export const uploadImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return request.post<UploadResult>('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/** 批量上传图片 */
// TODO: 后端未实现批量上传接口，需要后端添加 POST /upload/images 路由
// 临时方案：循环调用单个上传接口
export const uploadImages = async (files: File[]): Promise<UploadResult[]> => {
  // 使用 Promise.all 并发上传多个文件
  const uploadPromises = files.map(file => uploadImage(file));
  return Promise.all(uploadPromises);
};
