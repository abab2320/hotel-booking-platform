# Android 酒店模块联调说明

## 1. 跑通范围

- 列表：`GET /hotels`
- 详情：`GET /hotels/:id`
- 列表支持分页加载（下滑加载更多）
- 详情进入后会二次请求补全房型和描述

## 2. 参考代码位置，优先级从高到低

- 网络请求与字段映射：
  - `app/src/main/java/com/example/ctrip_android/data/repository/HotelApiClient.kt`
  - 重点方法：`fetchHotels`、`fetchHotelDetail`
- 分页与缓存逻辑：
  - `app/src/main/java/com/example/ctrip_android/data/repository/MockHotelRepository.kt`
  - 重点方法：`loadNextBatch`、`hasMoreFor`、`getHotelDetail`
- 列表页触发请求时机：
  - `app/src/main/java/com/example/ctrip_android/ui/pages/HotelListPageScreen.kt`
- 详情页二次请求：
  - `app/src/main/java/com/example/ctrip_android/ui/pages/CtripApp.kt`
- 数据模型：
  - `app/src/main/java/com/example/ctrip_android/data/model/HotelModels.kt`

## 3. 联调参数（当前前端发送）

`GET /hotels`：
- `city`
- `checkIn`（`YYYY-MM-DD`）
- `checkOut`（`YYYY-MM-DD`）
- `star`（多值逗号分隔）
- `maxPrice`
- `keyword`
- `tags`（多值逗号分隔）
- `page`
- `pageSize`
- `sort`（`rating_desc` / `price_asc` / `price_desc`）

`GET /hotels/:id`：
- `id` 使用 number（前端已按 `Int` 处理）

## 4. 本地联调最小要求

1. 后端启动在 `3000` 端口，基础路径为 `/api/v1`
2. 模拟器联调用：`http://10.0.2.2:3000/api/v1`
3. 先用以下接口自测：
- `/api/v1/hotels?city=上海&page=1&pageSize=6`
- `/api/v1/hotels/1`

