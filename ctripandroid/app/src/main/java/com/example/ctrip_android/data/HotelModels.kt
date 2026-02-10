package com.example.ctrip_android.data

data class RoomType(
    val name: String,
    val price: Int
)

data class Hotel(
    val id: String,
    val nameCn: String,
    val nameEn: String,
    val address: String,
    val city: String,
    val star: Int,
    val rating: Double,
    val openYear: Int,
    val tags: List<String>,
    val nearby: List<String>,
    val discounts: List<String>,
    val facilities: List<String>,
    val roomTypes: List<RoomType>,
    val bannerTitles: List<String>
)

data class SearchForm(
    val city: String = "上海",
    val keyword: String = "",
    val checkInDateMillis: Long,
    val checkOutDateMillis: Long,
    val starFilters: Set<Int> = emptySet(),
    val maxPrice: Int = 2000,
    val quickTags: Set<String> = emptySet()
)
