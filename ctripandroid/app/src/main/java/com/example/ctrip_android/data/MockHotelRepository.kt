package com.example.ctrip_android.data

import kotlin.math.min

object MockHotelRepository {
    private val allHotels: List<Hotel> = listOf(
        Hotel(
            id = "h1",
            nameCn = "浦东云景国际酒店",
            nameEn = "Skyline International Hotel Pudong",
            address = "上海市浦东新区张江高科路188号",
            city = "上海",
            star = 5,
            rating = 4.8,
            openYear = 2019,
            tags = listOf("豪华", "免费停车场", "亲子"),
            nearby = listOf("上海迪士尼", "张江科学城", "世纪公园"),
            discounts = listOf("春节限时8折", "机酒套餐立减260元"),
            facilities = listOf("免费停车", "健身房", "泳池", "行政酒廊"),
            roomTypes = listOf(
                RoomType("高级大床房", 898),
                RoomType("豪华双床房", 1099),
                RoomType("行政套房", 1680)
            ),
            bannerTitles = listOf("酒店外观", "大堂", "客房", "自助早餐")
        ),
        Hotel(
            id = "h2",
            nameCn = "静安都会精选酒店",
            nameEn = "Metropolitan Select Hotel Jing'an",
            address = "上海市静安区南京西路888号",
            city = "上海",
            star = 4,
            rating = 4.6,
            openYear = 2017,
            tags = listOf("商务", "近地铁", "健身房"),
            nearby = listOf("静安寺", "恒隆广场", "上海展览中心"),
            discounts = listOf("连住2晚每晚减80元"),
            facilities = listOf("健身房", "洗衣房", "会议室"),
            roomTypes = listOf(
                RoomType("精选大床房", 568),
                RoomType("城景双床房", 699),
                RoomType("家庭房", 860)
            ),
            bannerTitles = listOf("门头", "客房", "会议室")
        ),
        Hotel(
            id = "h3",
            nameCn = "虹桥空港快捷酒店",
            nameEn = "Hongqiao Airport Express Hotel",
            address = "上海市长宁区空港一路66号",
            city = "上海",
            star = 3,
            rating = 4.3,
            openYear = 2015,
            tags = listOf("机场接送", "免费停车场", "经济"),
            nearby = listOf("虹桥机场", "国家会展中心"),
            discounts = listOf("早鸟优惠95折"),
            facilities = listOf("接送机", "自助早餐"),
            roomTypes = listOf(
                RoomType("标准大床房", 328),
                RoomType("标准双床房", 358)
            ),
            bannerTitles = listOf("大厅", "客房", "接驳车")
        ),
        Hotel(
            id = "h4",
            nameCn = "外滩滨江艺术酒店",
            nameEn = "Bund Riverside Art Hotel",
            address = "上海市黄浦区中山东一路128号",
            city = "上海",
            star = 5,
            rating = 4.9,
            openYear = 2021,
            tags = listOf("豪华", "江景", "情侣"),
            nearby = listOf("外滩", "南京路步行街", "豫园"),
            discounts = listOf("节假日礼遇85折"),
            facilities = listOf("江景餐厅", "酒吧", "SPA"),
            roomTypes = listOf(
                RoomType("经典江景房", 1280),
                RoomType("外滩景观套房", 1880),
                RoomType("艺术主题套房", 2280)
            ),
            bannerTitles = listOf("夜景", "江景房", "餐厅")
        ),
        Hotel(
            id = "h5",
            nameCn = "杭州西湖悦榕酒店",
            nameEn = "West Lake Banyan Retreat Hangzhou",
            address = "杭州市西湖区灵隐路66号",
            city = "杭州",
            star = 5,
            rating = 4.7,
            openYear = 2020,
            tags = listOf("亲子", "豪华", "园林"),
            nearby = listOf("西湖", "灵隐寺", "龙井村"),
            discounts = listOf("机票+酒店套餐减320元"),
            facilities = listOf("儿童乐园", "茶室", "室内泳池"),
            roomTypes = listOf(
                RoomType("园景大床房", 980),
                RoomType("湖景双床房", 1180),
                RoomType("亲子套房", 1580)
            ),
            bannerTitles = listOf("园林", "亲子区", "湖景")
        ),
        Hotel(
            id = "h6",
            nameCn = "北京国贸云端酒店",
            nameEn = "CBD Cloudview Hotel Beijing",
            address = "北京市朝阳区建国门外大街66号",
            city = "北京",
            star = 4,
            rating = 4.5,
            openYear = 2018,
            tags = listOf("商务", "近地铁", "免费停车场"),
            nearby = listOf("国贸商城", "央视大楼", "三里屯"),
            discounts = listOf("周末特惠立减120元"),
            facilities = listOf("会议中心", "健身房", "洗衣服务"),
            roomTypes = listOf(
                RoomType("商务大床房", 760),
                RoomType("行政双床房", 920),
                RoomType("城景套房", 1360)
            ),
            bannerTitles = listOf("城市天际线", "会议室", "客房")
        )
    )

    fun all(): List<Hotel> = allHotels

    fun findById(hotelId: String): Hotel? = allHotels.firstOrNull { it.id == hotelId }

    fun search(form: SearchForm): List<Hotel> {
        return allHotels.filter { hotel ->
            val cityMatched = form.city.isBlank() || hotel.city.contains(form.city)
            val keywordMatched = form.keyword.isBlank() ||
                hotel.nameCn.contains(form.keyword, ignoreCase = true) ||
                hotel.nameEn.contains(form.keyword, ignoreCase = true)
            val starMatched = form.starFilters.isEmpty() || hotel.star in form.starFilters
            val priceMatched = hotel.roomTypes.minOf { it.price } <= form.maxPrice
            val tagMatched = form.quickTags.isEmpty() || form.quickTags.any { it in hotel.tags }
            cityMatched && keywordMatched && starMatched && priceMatched && tagMatched
        }
    }

    fun pagedSearch(form: SearchForm, page: Int, pageSize: Int): List<Hotel> {
        val filtered = search(form)
        if (page <= 0 || pageSize <= 0) return emptyList()
        val from = (page - 1) * pageSize
        if (from >= filtered.size) return emptyList()
        val to = min(from + pageSize, filtered.size)
        return filtered.subList(from, to)
    }
}
