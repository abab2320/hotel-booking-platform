package com.example.ctrip_android.data.repository

import com.example.ctrip_android.data.model.Hotel
import com.example.ctrip_android.data.model.RoomType
import com.example.ctrip_android.data.model.SearchForm
import com.example.ctrip_android.data.model.SortType
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class RemoteHotelPage(
    val list: List<Hotel>,
    val page: Int,
    val totalPages: Int
)

// 仅负责“网络请求 + JSON 映射”，不处理 UI 状态和分页缓存。
object HotelApiClient {
    // 10.0.2.2 供 Android 模拟器访问宿主机 localhost 使用。
    // 真机联调时通常要改成后端同学机器的局域网 IP，或公司测试环境域名。
    private val baseUrls = listOf(
        "http://10.0.2.2:3000/api/v1",
        "http://localhost:3000/api/v1"
    )

    // 列表接口：GET /hotels
    // query 参数和 API_SPECIFICATION.md 保持一致，供后端同学对照排查。
    suspend fun fetchHotels(form: SearchForm, page: Int, pageSize: Int): RemoteHotelPage? = withContext(Dispatchers.IO) {
        baseUrls.firstNotNullOfOrNull { baseUrl ->
            runCatching {
                val query = buildList {
                    add("city" to form.city)
                    add("checkIn" to toDateString(form.checkInDateMillis))
                    add("checkOut" to toDateString(form.checkOutDateMillis))
                    if (form.starFilters.isNotEmpty()) add("star" to form.starFilters.sorted().joinToString(","))
                    add("maxPrice" to form.maxPrice.toString())
                    if (form.keyword.isNotBlank()) add("keyword" to form.keyword.trim())
                    if (form.quickTags.isNotEmpty()) add("tags" to form.quickTags.toSortedSet().joinToString(","))
                    add("page" to page.toString())
                    add("pageSize" to pageSize.toString())
                    form.sortType.toRemoteSort()?.let { add("sort" to it) }
                }

                val body = doGet("$baseUrl/hotels?${query.toQueryString()}") ?: return@runCatching null
                val root = JSONObject(body)
                if (root.optInt("code", -1) != 0) return@runCatching null

                val data = root.optJSONObject("data") ?: return@runCatching null
                val list = data.optJSONArray("list").toHotelSummaryList()
                val pagination = data.optJSONObject("pagination")
                val currentPage = pagination?.optInt("page", page) ?: page
                val totalPages = pagination?.optInt("totalPages", currentPage) ?: currentPage

                RemoteHotelPage(
                    list = list,
                    page = currentPage,
                    totalPages = totalPages
                )
            }.getOrNull()
        }
    }

    suspend fun fetchHotelDetail(hotelId: Int): Hotel? = withContext(Dispatchers.IO) {
        baseUrls.firstNotNullOfOrNull { baseUrl ->
            runCatching {
                val body = doGet("$baseUrl/hotels/$hotelId") ?: return@runCatching null
                val root = JSONObject(body)
                if (root.optInt("code", -1) != 0) return@runCatching null
                val data = root.optJSONObject("data") ?: return@runCatching null
                data.toHotelDetail()
            }.getOrNull()
        }
    }

    private fun doGet(url: String): String? {
        val connection = (URL(url).openConnection() as HttpURLConnection).apply {
            requestMethod = "GET"
            connectTimeout = 8000
            readTimeout = 8000
            setRequestProperty("Accept", "application/json")
        }

        return try {
            // 后端失败时读取 errorStream，方便定位接口问题。
            val stream = if (connection.responseCode in 200..299) connection.inputStream else connection.errorStream
            stream?.bufferedReader()?.use { reader -> reader.readText() }
        } finally {
            connection.disconnect()
        }
    }

    private fun List<Pair<String, String>>.toQueryString(): String {
        return joinToString("&") { (k, v) ->
            "${URLEncoder.encode(k, Charsets.UTF_8.name())}=${URLEncoder.encode(v, Charsets.UTF_8.name())}"
        }
    }

    private fun SortType.toRemoteSort(): String? {
        return when (this) {
            SortType.RATING_DESC -> "rating_desc"
            SortType.PRICE_ASC -> "price_asc"
            SortType.PRICE_DESC -> "price_desc"
            else -> null
        }
    }

    private fun JSONArray?.toHotelSummaryList(): List<Hotel> {
        if (this == null) return emptyList()
        return buildList {
            for (i in 0 until length()) {
                val item = optJSONObject(i) ?: continue
                add(item.toHotelSummary())
            }
        }
    }

    private fun JSONObject.toHotelSummary(): Hotel {
        return Hotel(
            id = optValueAsInt("id"),
            nameZh = optString("nameZh"),
            nameEn = optString("nameEn"),
            address = optString("address"),
            city = optString("city"),
            star = optInt("star", 0),
            images = optJSONArray("images").toStringList(),
            tags = optJSONArray("tags").toStringList(),
            rating = optDouble("rating", 0.0),
            minPrice = optIntOrNull("minPrice"),
            maxPrice = optIntOrNull("maxPrice")
        )
    }

    private fun JSONObject.toHotelDetail(): Hotel {
        val rooms = optJSONArray("rooms").toRoomList()
        val minPrice = rooms.minOfOrNull { it.price }
        val maxPrice = rooms.maxOfOrNull { it.price }
        return Hotel(
            id = optValueAsInt("id"),
            nameZh = optString("nameZh"),
            nameEn = optString("nameEn"),
            address = optString("address"),
            city = optString("city"),
            star = optInt("star", 0),
            openDate = optStringOrNull("openDate"),
            images = optJSONArray("images").toStringList(),
            facilities = optJSONArray("facilities").toStringList(),
            tags = optJSONArray("tags").toStringList(),
            nearbyAttractions = optString("nearbyAttractions"),
            nearbyTransport = optString("nearbyTransport"),
            description = optString("description"),
            rating = optDouble("rating", 0.0),
            rooms = rooms,
            minPrice = minPrice,
            maxPrice = maxPrice
        )
    }

    private fun JSONArray?.toRoomList(): List<RoomType> {
        if (this == null) return emptyList()
        return buildList {
            for (i in 0 until length()) {
                val item = optJSONObject(i) ?: continue
                add(
                    RoomType(
                        id = item.optValueAsInt("id"),
                        name = item.optString("name"),
                        bedType = item.optString("bedType"),
                        maxGuests = item.optInt("maxGuests", 2),
                        area = item.optIntOrNull("area"),
                        price = item.optInt("price", 0),
                        originalPrice = item.optIntOrNull("originalPrice"),
                        breakfast = item.optStringOrNull("breakfast"),
                        images = item.optJSONArray("images").toStringList(),
                        discountDesc = item.optStringOrNull("discountDesc")
                    )
                )
            }
        }
    }

    private fun JSONArray?.toStringList(): List<String> {
        if (this == null) return emptyList()
        return buildList {
            for (i in 0 until length()) {
                val value = optString(i)
                if (value.isNotBlank()) add(value)
            }
        }
    }

    private fun JSONObject.optValueAsInt(key: String): Int {
        val raw = opt(key) ?: return -1
        return when (raw) {
            is Number -> raw.toInt()
            is String -> raw.toIntOrNull() ?: -1
            else -> -1
        }
    }

    private fun JSONObject.optStringOrNull(key: String): String? {
        if (isNull(key)) return null
        val value = optString(key)
        return value.takeIf { it.isNotBlank() }
    }

    private fun JSONObject.optIntOrNull(key: String): Int? {
        if (!has(key) || isNull(key)) return null
        return runCatching { getInt(key) }.getOrNull()
    }

    private fun toDateString(millis: Long): String {
        val format = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        return format.format(Date(millis))
    }
}
