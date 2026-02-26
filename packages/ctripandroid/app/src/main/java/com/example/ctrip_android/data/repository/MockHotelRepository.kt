package com.example.ctrip_android.data.repository

import com.example.ctrip_android.data.model.Hotel
import com.example.ctrip_android.data.model.RoomType
import com.example.ctrip_android.data.model.SearchForm
import com.example.ctrip_android.data.model.SortType
import kotlin.math.min

object MockHotelRepository {
    // 本地兜底数据：后端不可达/联调中断时仍可演示页面流程。
    private val fallbackHotels: List<Hotel> = listOf(
        Hotel(
            id = 1,
            nameZh = "浦东云景国际酒店",
            nameEn = "Skyline International Hotel Pudong",
            address = "上海市浦东新区张江高科路188号",
            city = "上海",
            star = 5,
            openDate = "2019-06-01",
            images = listOf("/uploads/hotel_h1_1.jpg", "/uploads/hotel_h1_2.jpg"),
            facilities = listOf("免费停车", "健身房", "泳池", "行政酒廊"),
            tags = listOf("豪华", "亲子", "商务"),
            nearbyAttractions = "上海迪士尼、张江科学城、世纪公园",
            nearbyTransport = "地铁2号线张江高科站",
            description = "位于张江核心区，适合商务与亲子出行。",
            rating = 4.8,
            rooms = listOf(
                RoomType(id = 101, name = "高级大床房", bedType = "1.8m大床", maxGuests = 2, area = 40, price = 898, originalPrice = 1098, breakfast = "double", discountDesc = "限时优惠"),
                RoomType(id = 102, name = "豪华双床房", bedType = "2张1.2m单床", maxGuests = 2, area = 46, price = 1099, breakfast = "double")
            )
        ),
        Hotel(
            id = 2,
            nameZh = "北京国贸云端酒店",
            nameEn = "CBD Cloudview Hotel Beijing",
            address = "北京市朝阳区建国门外大街66号",
            city = "北京",
            star = 4,
            openDate = "2018-09-10",
            images = listOf("/uploads/hotel_h2_1.jpg"),
            facilities = listOf("会议中心", "健身房"),
            tags = listOf("商务", "近地铁"),
            nearbyAttractions = "国贸商城、央视大楼",
            nearbyTransport = "地铁1号线国贸站",
            description = "国贸商圈高层景观酒店。",
            rating = 4.5,
            rooms = listOf(
                RoomType(id = 201, name = "商务大床房", bedType = "1.8m大床", maxGuests = 2, area = 35, price = 760, breakfast = "single")
            )
        ),
        Hotel(
            id = 3,
            nameZh = "深圳湾海景度假酒店",
            nameEn = "Shenzhen Bay Seaview Resort Hotel",
            address = "深圳市南山区滨海大道1888号",
            city = "深圳",
            star = 5,
            openDate = "2022-03-18",
            images = listOf("/uploads/hotel_h3_1.jpg"),
            facilities = listOf("无边泳池", "儿童乐园", "SPA"),
            tags = listOf("海景", "亲子", "度假"),
            nearbyAttractions = "深圳湾公园、欢乐海岸",
            nearbyTransport = "地铁9号线深圳湾公园站",
            description = "主打海景与亲子度假体验。",
            rating = 4.7,
            rooms = listOf(
                RoomType(id = 301, name = "海景双床房", bedType = "2张1.2m单床", maxGuests = 2, area = 42, price = 1280, originalPrice = 1580, breakfast = "double")
            )
        ),
        Hotel(
            id = 4,
            nameZh = "成都太古里轻奢酒店",
            nameEn = "Taikoo Li Boutique Hotel Chengdu",
            address = "成都市锦江区东大街77号",
            city = "成都",
            star = 4,
            openDate = "2019-04-01",
            images = listOf("/uploads/hotel_h4_1.jpg"),
            facilities = listOf("酒吧", "健身房"),
            tags = listOf("设计感", "近商圈", "美食"),
            nearbyAttractions = "太古里、春熙路、IFS",
            nearbyTransport = "地铁2号线春熙路站",
            description = "位于太古里商圈，步行可达核心购物区。",
            rating = 4.6,
            rooms = listOf(
                RoomType(id = 401, name = "设计大床房", bedType = "1.8m大床", maxGuests = 2, area = 30, price = 688)
            )
        )
    )

    private val loadedHotels = mutableListOf<Hotel>()
    private val cachedHotels = linkedMapOf<Int, Hotel>()

    private var activeQueryKey: String? = null
    private var activePage = 1
    private var activeTotalPages = Int.MAX_VALUE
    private var fallbackCursor = 0
    private var usingFallbackPaging = false

    fun all(): List<Hotel> {
        // 合并顺序：兜底 < 已缓存远端 < 当前查询已加载列表
        // 后写入同 id 会覆盖前者，保证详情补全后可立即生效。
        val merged = linkedMapOf<Int, Hotel>()
        fallbackHotels.forEach { merged[it.id] = it }
        cachedHotels.values.forEach { merged[it.id] = it }
        loadedHotels.forEach { merged[it.id] = it }
        return merged.values.toList()
    }

    fun findById(hotelId: Int): Hotel? {
        return loadedHotels.firstOrNull { it.id == hotelId }
            ?: cachedHotels[hotelId]
            ?: fallbackHotels.firstOrNull { it.id == hotelId }
    }

    suspend fun getHotelDetail(hotelId: Int): Hotel? {
        val local = findById(hotelId)
        val remote = HotelApiClient.fetchHotelDetail(hotelId)
        if (remote == null) return local

        val merged = if (local == null) {
            remote
        } else {
            remote.copy(
                minPrice = remote.minPrice ?: local.minPrice,
                maxPrice = remote.maxPrice ?: local.maxPrice,
                tags = if (remote.tags.isNotEmpty()) remote.tags else local.tags,
                images = if (remote.images.isNotEmpty()) remote.images else local.images
            )
        }

        upsertLoaded(merged)
        cachedHotels[merged.id] = merged
        return merged
    }

    fun resetLoadedFor(form: SearchForm) {
        activeQueryKey = queryKey(form)
        activePage = 1
        activeTotalPages = Int.MAX_VALUE
        fallbackCursor = 0
        usingFallbackPaging = false
        loadedHotels.clear()
    }

    suspend fun loadNextBatch(form: SearchForm, batchSize: Int): List<Hotel> {
        if (batchSize <= 0) return emptyList()
        val key = queryKey(form)
        if (activeQueryKey != key) {
            // 搜索条件变化后，必须重置分页游标，否则会串页。
            resetLoadedFor(form)
        }

        // 第一优先级：走后端分页。
        if (activePage <= activeTotalPages) {
            val remotePage = HotelApiClient.fetchHotels(form, activePage, batchSize)
            if (remotePage != null) {
                usingFallbackPaging = false
                activePage = remotePage.page + 1
                activeTotalPages = remotePage.totalPages.coerceAtLeast(remotePage.page)

                remotePage.list.forEach { hotel ->
                    cachedHotels[hotel.id] = hotel
                    upsertLoaded(hotel)
                }

                return remotePage.list
            }
        }

        // 第二优先级：后端不可用时走本地分页兜底，保证页面不白屏。
        usingFallbackPaging = true
        val filtered = sortHotels(fallbackHotels.filter { it.matches(form) }, form.sortType)
        if (fallbackCursor >= filtered.size) return emptyList()

        val to = min(fallbackCursor + batchSize, filtered.size)
        val next = filtered.subList(fallbackCursor, to)
        next.forEach { upsertLoaded(it) }
        fallbackCursor = to
        return next
    }

    fun hasMoreFor(form: SearchForm): Boolean {
        val key = queryKey(form)
        if (activeQueryKey != key) return true
        if (usingFallbackPaging) {
            val fallbackTotal = fallbackHotels.count { it.matches(form) }
            return fallbackCursor < fallbackTotal
        }
        return activePage <= activeTotalPages
    }

    fun loadedSearch(form: SearchForm): List<Hotel> {
        val key = queryKey(form)
        if (activeQueryKey != key) return emptyList()
        return sortHotels(loadedHotels.filter { it.matches(form) }, form.sortType)
    }

    fun search(form: SearchForm): List<Hotel> {
        return sortHotels(all().filter { it.matches(form) }, form.sortType)
    }

    fun pagedSearch(form: SearchForm, page: Int, pageSize: Int): List<Hotel> {
        val filtered = search(form)
        if (page <= 0 || pageSize <= 0) return emptyList()
        val from = (page - 1) * pageSize
        if (from >= filtered.size) return emptyList()
        val to = min(from + pageSize, filtered.size)
        return filtered.subList(from, to)
    }

    private fun Hotel.matches(form: SearchForm): Boolean {
        val cityMatched = form.city.isBlank() || city.contains(form.city)
        val keywordMatched = form.keyword.isBlank() ||
            nameCn.contains(form.keyword, ignoreCase = true) ||
            nameEn.contains(form.keyword, ignoreCase = true) ||
            address.contains(form.keyword, ignoreCase = true)

        val nearbyMatched = form.nearbyFilters.isEmpty() ||
            nearby.isEmpty() ||
            form.nearbyFilters.any { filter ->
                nearby.any { value -> value.contains(filter, ignoreCase = true) }
            }

        val starMatched = form.starFilters.isEmpty() || star in form.starFilters
        val priceMatched = displayMinPrice() <= form.maxPrice
        val tagMatched = form.quickTags.isEmpty() || form.quickTags.any { tag -> tag in tags }
        return cityMatched && keywordMatched && nearbyMatched && starMatched && priceMatched && tagMatched
    }

    private fun queryKey(form: SearchForm): String {
        return listOf(
            form.city.trim(),
            form.keyword.trim().lowercase(),
            form.nearbyFilters.toSortedSet().joinToString(","),
            form.starFilters.toSortedSet().joinToString(","),
            form.maxPrice.toString(),
            form.quickTags.toSortedSet().joinToString(","),
            form.sortType.name
        ).joinToString("|")
    }

    private fun sortHotels(hotels: List<Hotel>, sortType: SortType): List<Hotel> {
        return when (sortType) {
            SortType.SMART -> hotels.sortedByDescending { it.rating * 10 + it.star }
            SortType.RATING_DESC -> hotels.sortedByDescending { it.rating }
            SortType.STAR_DESC -> hotels.sortedWith(compareByDescending<Hotel> { it.star }.thenByDescending { it.rating })
            SortType.PRICE_ASC -> hotels.sortedBy(Hotel::displayMinPrice)
            SortType.PRICE_DESC -> hotels.sortedByDescending(Hotel::displayMinPrice)
        }
    }

    private fun upsertLoaded(hotel: Hotel) {
        val index = loadedHotels.indexOfFirst { it.id == hotel.id }
        if (index == -1) {
            loadedHotels.add(hotel)
        } else {
            loadedHotels[index] = hotel
        }
    }
}
