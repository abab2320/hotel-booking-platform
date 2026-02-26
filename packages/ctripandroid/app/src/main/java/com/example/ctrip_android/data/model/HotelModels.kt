package com.example.ctrip_android.data.model

data class RoomType(
    val id: Int = -1,
    val name: String,
    val bedType: String = "",
    val maxGuests: Int = 2,
    val area: Int? = null,
    val price: Int,
    val originalPrice: Int? = null,
    val breakfast: String? = null,
    val images: List<String> = emptyList(),
    val discountDesc: String? = null
)

data class Hotel(
    val id: Int,
    val nameZh: String,
    val nameEn: String,
    val address: String,
    val city: String,
    val star: Int,
    val openDate: String? = null,
    val images: List<String> = emptyList(),
    val facilities: List<String> = emptyList(),
    val tags: List<String> = emptyList(),
    val nearbyAttractions: String = "",
    val nearbyTransport: String = "",
    val description: String = "",
    val rating: Double,
    val rooms: List<RoomType> = emptyList(),
    val minPrice: Int? = null,
    val maxPrice: Int? = null
) {
    val nameCn: String
        get() = nameZh

    val roomTypes: List<RoomType>
        get() = if (rooms.isNotEmpty()) rooms else listOfNotNull(minPrice?.let { RoomType(id = -1, name = "标准房", price = it) })

    val openYear: Int
        get() = openDate?.take(4)?.toIntOrNull() ?: 0

    val nearby: List<String>
        get() = listOf(nearbyAttractions, nearbyTransport)
            .flatMap { raw ->
                raw.split("、", ",", "，", ";", "；", "|")
                    .map(String::trim)
                    .filter(String::isNotBlank)
            }

    val discounts: List<String>
        get() = roomTypes.mapNotNull(RoomType::discountDesc).distinct()

    val bannerTitles: List<String>
        get() = if (images.isEmpty()) {
            listOf("酒店实拍")
        } else {
            images.map { path ->
                path.substringAfterLast('/').substringBeforeLast('.').ifBlank { "酒店实拍" }
            }
        }

    fun displayMinPrice(): Int = minPrice ?: roomTypes.minOfOrNull { it.price } ?: 0
}

enum class SortType {
    SMART,
    RATING_DESC,
    STAR_DESC,
    PRICE_ASC,
    PRICE_DESC
}

data class SearchForm(
    val city: String = "上海",
    val keyword: String = "",
    val checkInDateMillis: Long,
    val checkOutDateMillis: Long,
    val nearbyFilters: Set<String> = emptySet(),
    val starFilters: Set<Int> = emptySet(),
    val maxPrice: Int = 2000,
    val quickTags: Set<String> = emptySet(),
    val sortType: SortType = SortType.SMART
)
