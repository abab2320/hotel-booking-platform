# 易宿酒店预订平台 - 后端 API 接口文档

**基础 URL**：`http://localhost:3000/api/v1`  
**Content-Type**：`application/json`

---

## 目录

1. [认证接口](#认证接口)
2. [用户端接口](#用户端接口-只读)
3. [商户端接口](#商户端接口-merchant)
4. [管理员端接口](#管理员端接口-admin)
5. [文件上传接口](#文件上传接口)
6. [响应格式说明](#响应格式说明)

---

## 认证接口

### POST /auth/register
用户注册（商户或管理员，邮箱验证）

**请求参数**：
```json
{
  "email": "user@example.com",
  "username": "merchant001",
  "password": "Password123!",
  "role": "merchant"  // 可选值: merchant | admin
}
```

**响应示例**：
```json
{
  "code": 0,
  "message": "注册成功，请前往邮箱完成验证",
  "data": {
    "id": 1,
    "username": "merchant001",
    "email": "user@example.com",
    "role": "merchant"
  }
}
```

**验证规则**：
- email: 必填，邮箱格式
- username: 3-50字符，只能包含字母、数字、下划线
- password: 至少8字符，需包含大小写字母和数字
- role: 必须为 merchant 或 admin

---

### GET /auth/verify-email
邮箱验证

**请求参数**（Query）：
- token [string] - 邮箱验证链接中的 token

**响应示例**：
```json
{
  "code": 0,
  "message": "邮箱验证成功"
}
```
失败示例：
```json
{
  "code": 1,
  "message": "邮箱验证失败或链接已失效"
}
```

---

### POST /auth/login
用户登录

**请求参数**：
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**响应示例**：
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "merchant001",
      "email": "user@example.com",
      "role": "merchant"
    }
  }
}
```
**注意**：未完成邮箱验证的用户无法登录，接口会返回相应提示。

---

### POST /auth/resend-verification
重新发送邮箱验证邮件

**请求参数**：
```json
{
  "email": "user@example.com"
}
```

**响应示例**：
```json
{
  "code": 0,
  "message": "验证邮件已发送"
}
```

---

### GET /auth/profile
获取当前用户信息

**认证**：✅ 需要（Bearer Token）

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "username": "merchant001",
    "email": "user@example.com",
    "role": "merchant",
    "createdAt": "2026-02-08T00:00:00.000Z"
  }
}
```

---

## 用户端接口（只读）

### GET /hotels
获取酒店列表（已发布）

**认证**：❌ 否

**查询参数**：
```
city        [string]  - 城市名称（必填）
checkIn     [date]    - 入住日期，格式: YYYY-MM-DD（可选，用于显示）
checkOut    [date]    - 退房日期，格式: YYYY-MM-DD（可选，用于显示）
star        [number]  - 星级(1-5)，可多选用逗号分隔（可选）
minPrice    [number]  - 最低价格（可选）
maxPrice    [number]  - 最高价格（可选）
keyword     [string]  - 搜索关键词（酒店名称、地址）（可选）
tags        [string]  - 标签，多个用逗号分隔（可选）
page        [number]  - 页码，默认1（可选）
pageSize    [number]  - 每页数量，默认10（可选）
sort        [string]  - 排序，支持: rating_desc | price_asc | price_desc（可选）
```

**请求示例**：
```
GET /hotels?city=北京&star=4,5&minPrice=500&maxPrice=1500&page=1&pageSize=10
```

**响应示例**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "nameZh": "北京万豪酒店",
        "nameEn": "Beijing Marriott Hotel",
        "address": "北京市朝阳区建国路88号",
        "city": "北京",
        "star": 5,
        "rating": 4.8,
        "images": [
          "/uploads/hotel_1_1.jpg",
          "/uploads/hotel_1_2.jpg"
        ],
        "tags": ["商务", "豪华", "近地铁"],
        "minPrice": 688,
        "maxPrice": 1288
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

---

### GET /hotels/:id
获取酒店详情

**认证**：❌ 否

**路径参数**：
- `id` [number] - 酒店ID

**响应示例**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "nameZh": "北京万豪酒店",
    "nameEn": "Beijing Marriott Hotel",
    "address": "北京市朝阳区建国路88号",
    "city": "北京",
    "star": 5,
    "openDate": "2020-01-01",
    "images": ["/uploads/hotel_1_1.jpg", "/uploads/hotel_1_2.jpg"],
    "facilities": ["wifi", "停车场", "游泳池", "健身房"],
    "tags": ["商务", "豪华"],
    "nearbyAttractions": "国贸商城、CBD核心区",
    "nearbyTransport": "地铁1号线国贸站步行5分钟",
    "description": "北京万豪酒店位于CBD核心区...",
    "rating": 4.8,
    "rooms": [
      {
        "id": 1,
        "name": "豪华大床房",
        "bedType": "1.8m大床",
        "maxGuests": 2,
        "area": 45,
        "price": 688,
        "originalPrice": 888,
        "breakfast": "double",
        "images": ["/uploads/room_1_1.jpg"]
      }
    ]
  }
}
```

---

### GET /hotels/:id/rooms
获取酒店房型列表

**认证**：❌ 否

**路径参数**：
- `id` [number] - 酒店ID

**响应示例**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "豪华大床房",
        "images": ["/uploads/room_1_1.jpg"],
        "bedType": "1.8m大床",
        "maxGuests": 2,
        "area": 45,
        "price": 688,
        "originalPrice": 888,
        "breakfast": "double",
        "discountDesc": "新春特惠8折"
      }
    ]
  }
}
```

---

### GET /banners
获取 Banner 列表

**认证**：❌ 否

**响应示例**：
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "image": "/uploads/banner_1.jpg",
      "hotelId": 1,
      "title": "北京万豪酒店新春特惠"
    }
  ]
}
```

---

### GET /cities
获取城市列表

**认证**：❌ 否

**查询参数**：
```
hot [boolean] - 仅显示热门城市（可选）
```

**响应示例**：
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "北京",
      "pinyin": "beijing",
      "hot": true
    },
    {
      "id": 2,
      "name": "上海",
      "pinyin": "shanghai",
      "hot": true
    }
  ]
}
```

---

## 商户端接口（Merchant）

所有商户端接口都需要 JWT 认证，且用户角色必须为 `merchant`

### POST /merchant/hotels
新增酒店

**认证**：✅ 需要 (role: merchant)

**请求参数**：
```json
{
  "nameZh": "北京万豪酒店",
  "nameEn": "Beijing Marriott Hotel",
  "address": "北京市朝阳区建国路88号",
  "city": "北京",
  "star": 5,
  "openDate": "2020-01-01",
  "images": ["/uploads/hotel_1_1.jpg"],
  "facilities": ["wifi", "parking"],
  "tags": ["商务", "豪华"],
  "nearbyAttractions": "国贸商城",
  "nearbyTransport": "地铁1号线",
  "description": "酒店简介..."
}
```

**响应示例**：
```json
{
  "code": 0,
  "message": "酒店创建成功",
  "data": {
    "id": 1,
    "merchantId": 1,
    "nameZh": "北京万豪酒店",
    "status": "draft",
    "createdAt": "2026-02-08T00:00:00.000Z"
  }
}
```

---

### GET /merchant/hotels
获取我的酒店列表

**认证**：✅ 需要 (role: merchant)

**查询参数**：
```
status   [string] - 酒店状态: draft | pending | approved | rejected | published | offline
page     [number] - 页码，默认1
pageSize [number] - 每页数量，默认10
```

**响应示例**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "nameZh": "北京万豪酒店",
        "city": "北京",
        "star": 5,
        "status": "draft",
        "createdAt": "2026-02-08T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

---

### GET /merchant/hotels/:id
获取我的酒店详情

**认证**：✅ 需要 (role: merchant)

**路径参数**：
- `id` [number] - 酒店ID

**响应**：同 `/hotels/:id`，但包含所有信息（包括草稿）

---

### PUT /merchant/hotels/:id
编辑酒店信息

**认证**：✅ 需要 (role: merchant)

**请求参数**：同 POST 创建酒店

**响应示例**：
```json
{
  "code": 0,
  "message": "酒店更新成功",
  "data": {
    "id": 1,
    "status": "draft"
  }
}
```

---

### DELETE /merchant/hotels/:id
删除草稿酒店

**认证**：✅ 需要 (role: merchant)

**限制**：仅能删除状态为 `draft` 的酒店

**响应示例**：
```json
{
  "code": 0,
  "message": "酒店删除成功"
}
```

---

### POST /merchant/hotels/:hotelId/rooms
添加房型

**认证**：✅ 需要 (role: merchant)

**请求参数**：
```json
{
  "name": "豪华大床房",
  "images": ["/uploads/room_1_1.jpg"],
  "bedType": "1.8m大床",
  "maxGuests": 2,
  "area": 45,
  "price": 688,
  "originalPrice": 888,
  "breakfast": "double",
  "totalRooms": 20,
  "discountType": "percentage",
  "discountValue": 20,
  "discountDesc": "新春特惠8折"
}
```

**响应示例**：
```json
{
  "code": 0,
  "message": "房型创建成功",
  "data": {
    "id": 1,
    "hotelId": 1,
    "name": "豪华大床房"
  }
}
```

---

### PUT /merchant/hotels/:hotelId/rooms/:roomId
编辑房型

**认证**：✅ 需要 (role: merchant)

**请求参数**：同添加房型

---

### DELETE /merchant/hotels/:hotelId/rooms/:roomId
删除房型

**认证**：✅ 需要 (role: merchant)

---

## 管理员端接口（Admin）

所有管理员端接口都需要 JWT 认证，且用户角色必须为 `admin`

### GET /admin/hotels/pending
获取待审核酒店列表

**认证**：✅ 需要 (role: admin)

**查询参数**：
```
page     [number] - 页码，默认1
pageSize [number] - 每页数量，默认10
```

**响应示例**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "nameZh": "北京万豪酒店",
        "city": "北京",
        "merchant": {
          "id": 1,
          "username": "merchant001"
        },
        "createdAt": "2026-02-08T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

---

### GET /admin/hotels/:id
获取酒店审核详情

**认证**：✅ 需要 (role: admin)

**路径参数**：
- `id` [number] - 酒店ID

**响应**：完整的酒店信息，包括所有字段

---

### POST /admin/hotels/:id/approve
审核通过

**认证**：✅ 需要 (role: admin)

**请求参数**：
```json
{
  "remark": "审核通过"  // 可选
}
```

**状态转换**：pending → approved

**响应示例**：
```json
{
  "code": 0,
  "message": "审核通过"
}
```

---

### POST /admin/hotels/:id/reject
审核拒绝

**认证**：✅ 需要 (role: admin)

**请求参数**：
```json
{
  "rejectReason": "图片不清晰，请重新上传"  // 必填
}
```

**状态转换**：pending → rejected

**响应示例**：
```json
{
  "code": 0,
  "message": "审核拒绝"
}
```

---

### POST /admin/hotels/:id/publish
发布酒店

**认证**：✅ 需要 (role: admin)

**前置条件**：酒店状态必须为 `approved`

**状态转换**：approved → published

**响应示例**：
```json
{
  "code": 0,
  "message": "酒店已发布"
}
```

---

### POST /admin/hotels/:id/offline
下线酒店

**认证**：✅ 需要 (role: admin)

**前置条件**：酒店状态必须为 `published`

**状态转换**：published → offline

**响应示例**：
```json
{
  "code": 0,
  "message": "酒店已下线"
}
```

---

### POST /admin/hotels/:id/restore
恢复酒店

**认证**：✅ 需要 (role: admin)

**前置条件**：酒店状态必须为 `offline`

**状态转换**：offline → published

**响应示例**：
```json
{
  "code": 0,
  "message": "酒店已恢复"
}
```

---

## 文件上传接口

### POST /upload/image
上传图片

**认证**：✅ 需要

**Content-Type**：multipart/form-data

**请求参数**：
```
file [file] - 图片文件（必填）
type [string] - 图片类型: hotel | room | banner（可选，用于分类存储）
```

**响应示例**：
```json
{
  "code": 0,
  "message": "上传成功",
  "data": {
    "url": "/uploads/hotel_20260208_123456.jpg",
    "filename": "hotel_20260208_123456.jpg",
    "size": 245632,
    "uploadedAt": "2026-02-08T12:34:56.000Z"
  }
}
```

**验证规则**：
- 支持格式：jpg, jpeg, png, webp
- 最大大小：5MB
- 自动压缩优化

---

## 响应格式说明

### 成功响应
```json
{
  "code": 0,
  "message": "操作成功",
  "data": { /* 数据内容 */ }
}
```

### 失败响应
```json
{
  "code": 1,
  "message": "错误描述信息"
}
```

### 分页响应
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [ /* 数据数组 */ ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

### 常见错误码
| 错误码 | 含义 | HTTP状态码 |
|--------|------|----------|
| 0 | 成功 | 200 |
| 1 | 一般错误 | 400 |
| 401 | 未认证（无token或token无效） | 401 |
| 403 | 无权限（角色不符） | 403 |
| 404 | 资源不存在 | 404 |
| 500 | 服务器内部错误 | 500 |

---

## 开发提示

✅ **权限检查**：
- 商户只能看到自己的酒店
- 管理员可以看到所有待审核的酒店
- 用户端只能看到已发布的酒店

✅ **数据验证**：
- 所有输入都需要验证（长度、格式、范围）
- 日期格式统一为 YYYY-MM-DD
- 价格保留两位小数

✅ **CORS 配置**：
- 允许来自前端的跨域请求
- 支持 OPTIONS 预检请求

✅ **日志记录**：
- 记录所有重要操作（登录、审核、发布等）
- 记录错误堆栈用于调试

---

**更新日期**：2026年2月8日  
**API版本**：v1  
**文档维护人**：后端团队
