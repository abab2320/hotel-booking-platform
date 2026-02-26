/**
 * 图片上传组件
 * 支持多图上传、拖拽排序、预览和删除  */
import React, { useState, useEffect } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { uploadImage } from '@/services/upload';
import './index.css';

export interface ImageUploadProps {
  /** 已上传的图片URL列表 */
  value?: string[];
  /** 上传完成回调 */
  onChange?: (urls: string[]) => void;
  /** 最大上传数量 */
  maxCount?: number;
  /** 是否禁用 */
  disabled?: boolean;
}

/** 将URL转换为Upload组件需要的文件对象 */
const urlsToFileList = (urls: string[]): UploadFile[] => {
  return urls.map((url, index) => ({
    uid: `-${index}`,
    name: `image-${index}`,
    status: 'done',
    url,
  }));
};

/** 从文件列表中提取URL */
const fileListToUrls = (fileList: UploadFile[]): string[] => {
  return fileList
    .filter((file) => file.status === 'done')
    .map((file) => {
      // 优先使用 file.url，其次使用 file.response?.url（新上传的文件）
      return file.url || (file.response as any)?.url;
    })
    .filter(Boolean) as string[];
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  value = [],
  onChange,
  maxCount = 8,
  disabled = false,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>(() => urlsToFileList(value));
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [uploading, setUploading] = useState(false);

  // 当外部 value 变化时（例如表单重置或编辑模式加载数据），同步到 fileList
  useEffect(() => {
    // 只有当外部 value 的 URL 列表与当前 fileList 的 URL 列表不一致时才更新
    const currentUrls = fileListToUrls(fileList);
    const valueUrls = value.filter(Boolean);
    
    // 比较两个数组是否相同
    const isDifferent = 
      currentUrls.length !== valueUrls.length ||
      currentUrls.some((url, index) => url !== valueUrls[index]);
    
    if (isDifferent) {
      setFileList(urlsToFileList(valueUrls));
    }
  }, [value]);

  /** 自定义上传处理 */
  const handleUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;

    if (!(file instanceof File)) {
      return;
    }

    try {
      setUploading(true);
      
      // 调用上传接口
      const result = await uploadImage(file);
      
      // 上传成功
      onSuccess?.(result);
      message.success('图片上传成功');
    } catch (error) {
      onError?.(error as Error);
      message.error('图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  /** 文件列表变化时 */
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // 更新本地状态
    setFileList(newFileList);
    
    // 提取所有已上传完成的图片URL
    const urls = fileListToUrls(newFileList);
    
    // 通知父组件
    onChange?.(urls);
  };

  /** 预览图片 */
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      return;
    }
    setPreviewImage(file.url || file.preview || '');
    setPreviewOpen(true);
  };

  /** 关闭预览 */
  const handleCancelPreview = () => {
    setPreviewOpen(false);
  };

  /** 上传前的校验 */
  const beforeUpload = (file: File) => {
    // 检查文件类型
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件！');
      return false;
    }

    // 检查文件大小（限制5MB）
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过 5MB！');
      return false;
    }

    return true;
  };

  // 上传按钮
  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        customRequest={handleUpload}
        onChange={handleChange}
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
        maxCount={maxCount}
        disabled={disabled}
        multiple
        accept="image/*"
        className="hotel-image-upload"
      >
        {fileList.length >= maxCount ? null : uploadButton}
      </Upload>

      {/* 图片预览弹窗 */}
      <Modal
        open={previewOpen}
        title="图片预览"
        footer={null}
        onCancel={handleCancelPreview}
        width={800}
        centered
      >
        <img
          alt="preview"
          style={{ width: '100%' }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};

export default ImageUpload;
