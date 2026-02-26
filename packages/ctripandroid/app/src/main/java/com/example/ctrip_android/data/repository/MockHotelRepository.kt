package com.example.ctrip_android.data.repository

import com.example.ctrip_android.data.model.Hotel
import com.example.ctrip_android.data.model.RoomType
import com.example.ctrip_android.data.model.SearchForm
import com.example.ctrip_android.data.model.SortType
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
        ),
        Hotel(
            id = "h7",
            nameCn = "广州珠江新城雅致酒店",
            nameEn = "Pearl River New Town Elegant Hotel Guangzhou",
            address = "广州市天河区花城大道299号",
            city = "广州",
            star = 4,
            rating = 4.4,
            openYear = 2016,
            tags = listOf("商务", "近地铁", "购物方便"),
            nearby = listOf("广州塔", "花城广场", "太古汇"),
            discounts = listOf("连住3晚每晚减60元"),
            facilities = listOf("健身房", "会议室", "咖啡吧"),
            roomTypes = listOf(
                RoomType("舒适大床房", 620),
                RoomType("城景双床房", 760),
                RoomType("行政大床房", 980)
            ),
            bannerTitles = listOf("前台", "城景房", "餐厅")
        ),
        Hotel(
            id = "h8",
            nameCn = "深圳湾海景度假酒店",
            nameEn = "Shenzhen Bay Seaview Resort Hotel",
            address = "深圳市南山区滨海大道1888号",
            city = "深圳",
            star = 5,
            rating = 4.7,
            openYear = 2022,
            tags = listOf("豪华", "海景", "亲子"),
            nearby = listOf("深圳湾公园", "欢乐海岸", "人才公园"),
            discounts = listOf("暑期亲子套餐减280元"),
            facilities = listOf("无边泳池", "儿童乐园", "SPA", "健身中心"),
            roomTypes = listOf(
                RoomType("海景大床房", 1180),
                RoomType("海景双床房", 1280),
                RoomType("家庭海景套房", 1880)
            ),
            bannerTitles = listOf("海湾日落", "泳池", "亲子房")
        ),
        Hotel(
            id = "h9",
            nameCn = "成都太古里轻奢酒店",
            nameEn = "Taikoo Li Boutique Hotel Chengdu",
            address = "成都市锦江区东大街77号",
            city = "成都",
            star = 4,
            rating = 4.6,
            openYear = 2019,
            tags = listOf("美食", "近商圈", "设计感"),
            nearby = listOf("太古里", "春熙路", "IFS"),
            discounts = listOf("新客下单立减90元"),
            facilities = listOf("酒吧", "健身房", "洗衣服务"),
            roomTypes = listOf(
                RoomType("设计大床房", 688),
                RoomType("精选双床房", 758),
                RoomType("街景套房", 1098)
            ),
            bannerTitles = listOf("设计大堂", "街景窗", "酒吧")
        ),
        Hotel(
            id = "h10",
            nameCn = "三亚亚龙湾海岸酒店",
            nameEn = "Yalong Bay Coast Hotel Sanya",
            address = "三亚市吉阳区亚龙湾路18号",
            city = "三亚",
            star = 5,
            rating = 4.8,
            openYear = 2021,
            tags = listOf("度假", "海景", "蜜月"),
            nearby = listOf("亚龙湾", "热带天堂森林公园", "太阳湾"),
            discounts = listOf("提前14天预订享88折"),
            facilities = listOf("私家沙滩", "潜水中心", "海景餐厅"),
            roomTypes = listOf(
                RoomType("园景大床房", 980),
                RoomType("海景双床房", 1380),
                RoomType("蜜月海景套房", 2180)
            ),
            bannerTitles = listOf("沙滩", "海景房", "日落餐厅")
        ),
        Hotel(
            id = "h11",
            nameCn = "陆家嘴金融城酒店",
            nameEn = "Lujiazui Financial City Hotel",
            address = "上海市浦东新区银城中路501号",
            city = "上海",
            star = 5,
            rating = 4.7,
            openYear = 2020,
            tags = listOf("商务", "江景", "近地铁"),
            nearby = listOf("东方明珠", "上海中心", "国金中心"),
            discounts = listOf("商务专享立减150元"),
            facilities = listOf("行政酒廊", "会议室", "健身房"),
            roomTypes = listOf(
                RoomType("金融城大床房", 1080),
                RoomType("江景双床房", 1290),
                RoomType("行政江景套房", 1980)
            ),
            bannerTitles = listOf("酒店外观", "江景房", "行政酒廊")
        ),
        Hotel(
            id = "h12",
            nameCn = "徐汇滨江雅园酒店",
            nameEn = "Xuhui Riverside Garden Hotel",
            address = "上海市徐汇区龙腾大道899号",
            city = "上海",
            star = 4,
            rating = 4.5,
            openYear = 2018,
            tags = listOf("亲子", "江景", "安静"),
            nearby = listOf("西岸美术馆", "徐汇滨江", "龙美术馆"),
            discounts = listOf("周中入住8.8折"),
            facilities = listOf("儿童活动区", "自助早餐", "洗衣房"),
            roomTypes = listOf(
                RoomType("雅致大床房", 720),
                RoomType("滨江双床房", 860),
                RoomType("家庭江景房", 1180)
            ),
            bannerTitles = listOf("滨江步道", "家庭房", "餐厅")
        ),
        Hotel(
            id = "h13",
            nameCn = "五角场城市精选酒店",
            nameEn = "Wujiaochang Urban Select Hotel",
            address = "上海市杨浦区邯郸路199号",
            city = "上海",
            star = 3,
            rating = 4.2,
            openYear = 2016,
            tags = listOf("经济", "近商圈", "近地铁"),
            nearby = listOf("五角场", "复旦大学", "创智天地"),
            discounts = listOf("学生季优惠9折"),
            facilities = listOf("自助入住", "共享办公区"),
            roomTypes = listOf(
                RoomType("标准大床房", 388),
                RoomType("标准双床房", 428),
                RoomType("轻享家庭房", 560)
            ),
            bannerTitles = listOf("大堂", "客房", "共享区")
        ),
        Hotel(
            id = "h14",
            nameCn = "世博前滩会展酒店",
            nameEn = "Expo Qiantan Convention Hotel",
            address = "上海市浦东新区高青西路88号",
            city = "上海",
            star = 4,
            rating = 4.4,
            openYear = 2021,
            tags = listOf("会展", "商务", "免费停车场"),
            nearby = listOf("前滩太古里", "梅赛德斯奔驰文化中心", "世博园"),
            discounts = listOf("会展季立减100元"),
            facilities = listOf("大型会议厅", "健身房", "停车场"),
            roomTypes = listOf(
                RoomType("会展大床房", 658),
                RoomType("城景双床房", 788),
                RoomType("商务套房", 1260)
            ),
            bannerTitles = listOf("门头", "会议厅", "套房")
        ),
        Hotel(
            id = "h15",
            nameCn = "新天地里弄精品酒店",
            nameEn = "Xintiandi Lane Boutique Hotel",
            address = "上海市黄浦区马当路266号",
            city = "上海",
            star = 5,
            rating = 4.8,
            openYear = 2019,
            tags = listOf("设计感", "情侣", "近商圈"),
            nearby = listOf("新天地", "田子坊", "淮海中路"),
            discounts = listOf("浪漫套餐立减220元"),
            facilities = listOf("酒吧", "法餐厅", "SPA"),
            roomTypes = listOf(
                RoomType("里弄大床房", 1180),
                RoomType("设计双床房", 1380),
                RoomType("浪漫主题套房", 2080)
            ),
            bannerTitles = listOf("石库门外观", "主题套房", "酒吧")
        ),
        Hotel(
            id = "h16",
            nameCn = "嘉定安亭智选酒店",
            nameEn = "Jiading Anting Smart Inn",
            address = "上海市嘉定区安智路88号",
            city = "上海",
            star = 3,
            rating = 4.1,
            openYear = 2014,
            tags = listOf("经济", "免费停车场", "商务"),
            nearby = listOf("上海汽车城", "安亭地铁站"),
            discounts = listOf("连住优惠每晚减40元"),
            facilities = listOf("停车场", "洗衣房", "早餐厅"),
            roomTypes = listOf(
                RoomType("智选大床房", 298),
                RoomType("智选双床房", 338),
                RoomType("商务大床房", 420)
            ),
            bannerTitles = listOf("酒店入口", "早餐厅", "客房")
        ),
        Hotel(
            id = "h17",
            nameCn = "松江大学城悦居酒店",
            nameEn = "Songjiang University Town Joy Hotel",
            address = "上海市松江区文汇路520号",
            city = "上海",
            star = 3,
            rating = 4.0,
            openYear = 2015,
            tags = listOf("经济", "近地铁", "美食"),
            nearby = listOf("松江大学城", "泰晤士小镇"),
            discounts = listOf("周末特惠85折"),
            facilities = listOf("自助洗衣", "简餐厅"),
            roomTypes = listOf(
                RoomType("舒适大床房", 320),
                RoomType("舒适双床房", 360),
                RoomType("家庭房", 520)
            ),
            bannerTitles = listOf("前台", "双床房", "公共区")
        ),
        Hotel(
            id = "h18",
            nameCn = "崇明生态度假酒店",
            nameEn = "Chongming Eco Resort Hotel",
            address = "上海市崇明区东滩大道18号",
            city = "上海",
            star = 4,
            rating = 4.6,
            openYear = 2022,
            tags = listOf("度假", "亲子", "园林"),
            nearby = listOf("东滩湿地", "崇明森林公园"),
            discounts = listOf("家庭套餐减180元"),
            facilities = listOf("儿童乐园", "自行车租赁", "室外草坪"),
            roomTypes = listOf(
                RoomType("生态大床房", 780),
                RoomType("园景双床房", 860),
                RoomType("亲子度假套房", 1280)
            ),
            bannerTitles = listOf("园林草坪", "亲子活动", "客房")
        ),
        Hotel(
            id = "h19",
            nameCn = "七宝古镇庭院酒店",
            nameEn = "Qibao Ancient Town Courtyard Hotel",
            address = "上海市闵行区七莘路1688号",
            city = "上海",
            star = 4,
            rating = 4.3,
            openYear = 2017,
            tags = listOf("古镇", "亲子", "美食"),
            nearby = listOf("七宝古镇", "闵行体育公园"),
            discounts = listOf("古镇联票套餐减70元"),
            facilities = listOf("茶室", "庭院餐厅", "家庭活动区"),
            roomTypes = listOf(
                RoomType("庭院大床房", 560),
                RoomType("庭院双床房", 620),
                RoomType("古镇景观套房", 980)
            ),
            bannerTitles = listOf("庭院", "古镇景", "茶室")
        ),
        Hotel(
            id = "h20",
            nameCn = "临港滴水湖会议酒店",
            nameEn = "Lingang Dishui Lake Conference Hotel",
            address = "上海市浦东新区环湖西一路66号",
            city = "上海",
            star = 5,
            rating = 4.6,
            openYear = 2023,
            tags = listOf("会展", "商务", "湖景"),
            nearby = listOf("滴水湖", "中国航海博物馆", "海昌海洋公园"),
            discounts = listOf("会议团队每间夜减120元"),
            facilities = listOf("国际会议中心", "健身房", "泳池", "停车场"),
            roomTypes = listOf(
                RoomType("湖景大床房", 980),
                RoomType("湖景双床房", 1080),
                RoomType("会议行政套房", 1680)
            ),
            bannerTitles = listOf("滴水湖景", "会议中心", "湖景房")
        )
    )

    fun all(): List<Hotel> = allHotels

    private val loadedHotels = mutableListOf<Hotel>()
    private var activeQueryKey: String? = null
    private var activeCursor = 0

    fun findById(hotelId: String): Hotel? {
        return loadedHotels.firstOrNull { it.id == hotelId } ?: allHotels.firstOrNull { it.id == hotelId }
    }

    fun resetLoadedFor(form: SearchForm) {
        activeQueryKey = queryKey(form)
        activeCursor = 0
        loadedHotels.clear()
    }

    fun loadNextBatch(form: SearchForm, batchSize: Int): List<Hotel> {
        if (batchSize <= 0) return emptyList()
        val key = queryKey(form)
        if (activeQueryKey != key) {
            resetLoadedFor(form)
        }

        val remoteMatched = sortHotels(allHotels.filter { it.matches(form) }, form.sortType)
        if (activeCursor >= remoteMatched.size) return emptyList()

        val to = min(activeCursor + batchSize, remoteMatched.size)
        val next = remoteMatched.subList(activeCursor, to)
        loadedHotels.addAll(next)
        activeCursor = to
        return next
    }

    fun hasMoreFor(form: SearchForm): Boolean {
        val key = queryKey(form)
        if (activeQueryKey != key) return true
        val remoteSize = allHotels.count { it.matches(form) }
        return activeCursor < remoteSize
    }

    fun loadedSearch(form: SearchForm): List<Hotel> {
        val key = queryKey(form)
        if (activeQueryKey != key) return emptyList()
        return sortHotels(loadedHotels.filter { it.matches(form) }, form.sortType)
    }

    fun search(form: SearchForm): List<Hotel> {
        return sortHotels(allHotels.filter { it.matches(form) }, form.sortType)
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
            nameEn.contains(form.keyword, ignoreCase = true)
        val nearbyMatched = form.nearbyFilters.isEmpty() || form.nearbyFilters.any { it in nearby }
        val starMatched = form.starFilters.isEmpty() || star in form.starFilters
        val priceMatched = roomTypes.minOf { it.price } <= form.maxPrice
        val tagMatched = form.quickTags.isEmpty() || form.quickTags.any { it in tags }
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
            SortType.PRICE_ASC -> hotels.sortedBy { hotel -> hotel.roomTypes.minOf { it.price } }
            SortType.PRICE_DESC -> hotels.sortedByDescending { hotel -> hotel.roomTypes.minOf { it.price } }
        }
    }
}

