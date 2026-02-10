package com.example.ctrip_android.ui

import android.Manifest
import android.location.LocationManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.ctrip_android.data.Hotel
import com.example.ctrip_android.data.MockHotelRepository
import com.example.ctrip_android.data.RoomType
import com.example.ctrip_android.data.SearchForm
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlin.math.max

private object AppRoute {
    const val Search = "search"
    const val List = "list"
    const val Detail = "detail/{hotelId}"
    const val DetailPrefix = "detail"
}

private object CtripColors {
    val Bg = Color(0xFFF1F4FA)
    val Blue = Color(0xFF1677FF)
    val Red = Color(0xFFD70016)
    val GrayTag = Color(0xFFF3F5F9)
}

@Composable
fun CtripApp() {
    val navController = rememberNavController()
    val now = remember { System.currentTimeMillis() }
    var form by remember {
        mutableStateOf(
            SearchForm(checkInDateMillis = now, checkOutDateMillis = now + 24L * 60L * 60L * 1000L)
        )
    }

    NavHost(navController = navController, startDestination = AppRoute.Search) {
        composable(AppRoute.Search) {
            SearchScreen(
                form = form,
                onFormChange = { form = it },
                onSearch = { navController.navigate(AppRoute.List) },
                onBannerClick = { navController.navigate("${AppRoute.DetailPrefix}/$it") }
            )
        }
        composable(AppRoute.List) {
            HotelListScreen(
                form = form,
                onBack = { navController.popBackStack() },
                onHotelClick = { navController.navigate("${AppRoute.DetailPrefix}/$it") }
            )
        }
        composable(
            route = AppRoute.Detail,
            arguments = listOf(navArgument("hotelId") { type = NavType.StringType })
        ) {
            val hotel = MockHotelRepository.findById(it.arguments?.getString("hotelId").orEmpty())
            if (hotel != null) HotelDetailScreen(hotel = hotel, form = form, onBack = { navController.popBackStack() })
        }
    }
}

@OptIn(ExperimentalLayoutApi::class, ExperimentalMaterial3Api::class)
@Composable
private fun SearchScreen(
    form: SearchForm,
    onFormChange: (SearchForm) -> Unit,
    onSearch: () -> Unit,
    onBannerClick: (String) -> Unit
) {
    val context = LocalContext.current
    val hotels = remember { MockHotelRepository.all().take(4) }
    var showDatePicker by remember { mutableStateOf(false) }
    val locationLauncher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        if (granted) {
            val lm = context.getSystemService(LocationManager::class.java)
            if (lm?.isProviderEnabled(LocationManager.NETWORK_PROVIDER) == true) onFormChange(form.copy(city = "上海"))
        }
    }

    Scaffold(containerColor = CtripColors.Bg) { padding ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Brush.verticalGradient(listOf(Color(0xFFF7DECC), Color(0xFFF6E9DE))))
                        .padding(12.dp)
                ) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        CircleBtn("<")
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) { CircleBtn("◎"); CircleBtn("...") }
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    Card(
                        modifier = Modifier.fillMaxWidth().clickable { hotels.firstOrNull()?.let { onBannerClick(it.id) } },
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFE7C1A3)),
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Text("新年暖家寄情网", style = MaterialTheme.typography.headlineLarge, fontWeight = FontWeight.ExtraBold, color = Color(0xFF8B1912))
                            Text("今年拜年打电话，祝福就要亲口说", color = Color(0xFF6B2A1D))
                        }
                    }
                }
            }
            item {
                Card(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp),
                    shape = RoundedCornerShape(18.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(14.dp)).background(CtripColors.GrayTag).padding(8.dp), horizontalArrangement = Arrangement.SpaceEvenly) {
                            listOf("国内", "海外", "民宿", "钟点房").forEachIndexed { i, s ->
                                Text(s, color = if (i == 0) CtripColors.Blue else Color.Black, fontWeight = if (i == 0) FontWeight.Bold else FontWeight.Normal)
                            }
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        Text("城市", color = Color.Gray)
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(form.city, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("定位", color = CtripColors.Blue, modifier = Modifier.clickable { locationLauncher.launch(Manifest.permission.ACCESS_COARSE_LOCATION) })
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("位置/品牌/酒店", color = Color.Gray)
                        Text(if (form.keyword.isBlank()) "上海虹桥站" else form.keyword, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                        HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp), color = Color(0xFFE9EDF5))
                        Row(modifier = Modifier.fillMaxWidth().clickable { showDatePicker = true }, horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("${md(form.checkInDateMillis)} 今天 - ${md(form.checkOutDateMillis)} 明天", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                            Text("共1晚")
                        }
                        HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp), color = Color(0xFFE9EDF5))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("1间房  3成人  0儿童", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                            Text("价格/星级", color = Color(0xFF9AA3B5))
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            listOf("上海迪士尼度假区", "上海浦东国际机场", "上海虹桥站").forEach {
                                Box(modifier = Modifier.clip(RoundedCornerShape(8.dp)).background(CtripColors.GrayTag).padding(horizontal = 10.dp, vertical = 7.dp)) { Text(it) }
                            }
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        Button(
                            onClick = onSearch,
                            modifier = Modifier.fillMaxWidth().height(50.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = CtripColors.Red)
                        ) { Text("查询", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold) }
                    }
                }
            }
        }
    }

    if (showDatePicker) {
        val pickerState = rememberDatePickerState(initialSelectedDateMillis = form.checkInDateMillis)
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(onClick = {
                    val selected = pickerState.selectedDateMillis ?: return@TextButton
                    onFormChange(form.copy(checkInDateMillis = selected, checkOutDateMillis = selected + 24L * 60L * 60L * 1000L))
                    showDatePicker = false
                }) { Text("确定") }
            },
            dismissButton = { TextButton(onClick = { showDatePicker = false }) { Text("取消") } }
        ) { DatePicker(state = pickerState) }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun HotelListScreen(
    form: SearchForm,
    onBack: () -> Unit,
    onHotelClick: (String) -> Unit
) {
    val listState = rememberLazyListState()
    val loaded = remember { mutableStateListOf<Hotel>() }
    var page by remember { mutableIntStateOf(1) }
    var hasMore by remember { mutableStateOf(true) }
    val pageSize = 4

    fun loadNext() {
        val pageData = MockHotelRepository.pagedSearch(form, page, pageSize)
        if (pageData.isEmpty()) {
            hasMore = false
        } else {
            loaded.addAll(pageData)
            page += 1
        }
    }

    LaunchedEffect(form.city, form.keyword, form.maxPrice, form.quickTags, form.starFilters) {
        loaded.clear()
        page = 1
        hasMore = true
        loadNext()
    }
    LaunchedEffect(listState.layoutInfo.visibleItemsInfo.lastOrNull()?.index, hasMore) {
        val lastVisible = listState.layoutInfo.visibleItemsInfo.lastOrNull()?.index ?: 0
        if (hasMore && lastVisible >= loaded.size - 2) loadNext()
    }

    Scaffold(containerColor = Color.White) { padding ->
        Column(modifier = Modifier.fillMaxSize().padding(padding)) {
            Row(modifier = Modifier.fillMaxWidth().padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                Text("<", modifier = Modifier.clickable(onClick = onBack), style = MaterialTheme.typography.titleLarge)
                Spacer(modifier = Modifier.width(10.dp))
                Row(
                    modifier = Modifier.weight(1f).clip(RoundedCornerShape(12.dp)).background(CtripColors.GrayTag).padding(horizontal = 10.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(form.city, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("${d(form.checkInDateMillis)}\n${d(form.checkOutDateMillis)}")
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("1间\n3人")
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(if (form.keyword.isBlank()) "上海虹桥站" else form.keyword, maxLines = 1, overflow = TextOverflow.Ellipsis)
                }
            }

            Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                listOf("智能排序 ▾", "位置距离 ▾", "价格/星级 ▾", "筛选 ▾").forEachIndexed { i, t ->
                    Text(t, color = if (i < 2) CtripColors.Blue else Color.Black, fontWeight = FontWeight.SemiBold)
                }
            }

            FlowRow(modifier = Modifier.padding(12.dp), horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("房间布局", "近地铁", "接送机服务", "电竞酒店", "含早餐").forEach {
                    Box(modifier = Modifier.clip(RoundedCornerShape(8.dp)).background(CtripColors.GrayTag).padding(horizontal = 10.dp, vertical = 7.dp)) { Text(it) }
                }
            }

            LazyColumn(state = listState, modifier = Modifier.fillMaxSize()) {
                items(loaded, key = { it.id }) { hotel ->
                    HotelResultItem(hotel = hotel, onClick = { onHotelClick(hotel.id) })
                }
                item {
                    Text(
                        if (hasMore) "加载中..." else "没有更多酒店了",
                        modifier = Modifier.fillMaxWidth().padding(14.dp),
                        color = Color.Gray
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun HotelDetailScreen(hotel: Hotel, form: SearchForm, onBack: () -> Unit) {
    val rooms = remember(hotel.roomTypes) { hotel.roomTypes.sortedBy(RoomType::price) }
    val pagerState = rememberPagerState(pageCount = { max(1, hotel.bannerTitles.size) })
    Scaffold(
        containerColor = CtripColors.Bg,
        bottomBar = {
            Row(modifier = Modifier.fillMaxWidth().background(Color.White).padding(horizontal = 12.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                Column(modifier = Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("问酒店", color = Color(0xFF6E768A))
                    Text("¥${rooms.firstOrNull()?.price ?: 0}起", color = CtripColors.Blue, fontWeight = FontWeight.Bold)
                }
                Button(
                    onClick = {},
                    modifier = Modifier.weight(2f).height(50.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = CtripColors.Blue)
                ) { Text("查看房型", style = MaterialTheme.typography.titleLarge) }
            }
        }
    ) { padding ->
        LazyColumn(modifier = Modifier.fillMaxSize().padding(padding), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            item {
                Box(modifier = Modifier.fillMaxWidth()) {
                    HorizontalPager(state = pagerState, modifier = Modifier.height(300.dp)) { page ->
                        Box(
                            modifier = Modifier.fillMaxWidth().height(300.dp)
                                .background(Brush.verticalGradient(listOf(Color(0xFF7DA3CF), Color(0xFF3F5D7B))))
                                .padding(18.dp)
                        ) {
                            Column {
                                Text("酒店实拍", color = Color.White)
                                Text(hotel.bannerTitles.getOrElse(page) { "封面" }, style = MaterialTheme.typography.headlineMedium, color = Color.White, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                    Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 16.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                        CircleBtn("<", onClick = onBack)
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) { CircleBtn("☆"); CircleBtn("↗"); CircleBtn("...") }
                    }
                }
            }
            item {
                Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 10.dp), shape = RoundedCornerShape(20.dp)) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(hotel.nameCn, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                        Text("${hotel.openYear}年开业", color = Color(0xFF9A7D55))
                        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            hotel.facilities.take(5).forEach { Box(modifier = Modifier.clip(RoundedCornerShape(8.dp)).background(CtripColors.GrayTag).padding(horizontal = 8.dp, vertical = 5.dp)) { Text(it) } }
                        }
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Card(modifier = Modifier.weight(1f), colors = CardDefaults.cardColors(containerColor = Color(0xFFF1F6FF))) {
                                Column(modifier = Modifier.padding(10.dp)) {
                                    Text("${hotel.rating} 超棒", color = CtripColors.Blue, fontWeight = FontWeight.Bold)
                                    Text("服务很热情，很周到")
                                }
                            }
                            Card(modifier = Modifier.weight(1f), colors = CardDefaults.cardColors(containerColor = Color(0xFFF2F8F5))) {
                                Column(modifier = Modifier.padding(10.dp)) {
                                    Text("距上海虹桥站驾车5.4公里", fontWeight = FontWeight.SemiBold)
                                    Text(hotel.address, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                }
                            }
                        }
                    }
                }
            }
            item {
                Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 10.dp), shape = RoundedCornerShape(16.dp)) {
                    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("${md(form.checkInDateMillis)} - ${md(form.checkOutDateMillis)}", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                        Text("共1晚   1间 3人 0儿童")
                        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            listOf("双床房", "含早餐", "家庭房", "大床房", "免费取消").forEach {
                                Box(modifier = Modifier.clip(RoundedCornerShape(8.dp)).background(CtripColors.GrayTag).padding(horizontal = 10.dp, vertical = 6.dp)) { Text(it) }
                            }
                        }
                    }
                }
            }
            items(rooms) { RoomTypeCard(it) }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun HotelResultItem(hotel: Hotel, onClick: () -> Unit) {
    Row(modifier = Modifier.fillMaxWidth().clickable(onClick = onClick).padding(horizontal = 12.dp, vertical = 10.dp)) {
        Box(
            modifier = Modifier.size(width = 110.dp, height = 130.dp).clip(RoundedCornerShape(12.dp))
                .background(Brush.verticalGradient(listOf(Color(0xFF9CB4CD), Color(0xFF6A819B), Color(0xFF4A5F72)))),
            contentAlignment = Alignment.Center
        ) { Text("酒店图片", color = Color.White) }
        Spacer(modifier = Modifier.width(10.dp))
        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(5.dp)) {
            Text(hotel.nameCn, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, maxLines = 2, overflow = TextOverflow.Ellipsis)
            Text("${hotel.rating} 超棒  ·  ${hotel.tags.size * 80}点评", color = Color(0xFF26569A))
            Text("距上海虹桥站驾车5.4公里", color = Color(0xFF565E6F))
            FlowRow(horizontalArrangement = Arrangement.spacedBy(5.dp), verticalArrangement = Arrangement.spacedBy(5.dp)) {
                hotel.facilities.take(4).forEach {
                    Box(modifier = Modifier.clip(RoundedCornerShape(6.dp)).background(Color(0xFFF4F6FA)).padding(horizontal = 6.dp, vertical = 3.dp)) {
                        Text(it, color = Color(0xFF5D6779), style = MaterialTheme.typography.labelSmall)
                    }
                }
            }
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                Text("¥${hotel.roomTypes.minOf { it.price }}起", color = CtripColors.Blue, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            }
        }
    }
    HorizontalDivider(color = Color(0xFFEEF2F7))
}

@Composable
private fun RoomTypeCard(room: RoomType) {
    Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 10.dp), shape = RoundedCornerShape(14.dp), border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFF0F3F8))) {
        Row(modifier = Modifier.padding(12.dp)) {
            Box(modifier = Modifier.size(width = 95.dp, height = 88.dp).clip(RoundedCornerShape(10.dp)).background(Color(0xFFEDEFF4)), contentAlignment = Alignment.Center) { Text("房型图") }
            Spacer(modifier = Modifier.width(10.dp))
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(5.dp)) {
                Text(room.name, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                Text("1张1.35米双人床 及 1张1.8米大床 30-32㎡")
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                    Text("¥${room.price}起", color = CtripColors.Blue, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
private fun CircleBtn(text: String, onClick: () -> Unit = {}) {
    Box(
        modifier = Modifier.size(40.dp).clip(CircleShape).background(Color(0x744A4A4A)).clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) { Text(text, color = Color.White) }
}

private fun d(millis: Long): String = SimpleDateFormat("MM-dd", Locale.CHINA).format(Date(millis))
private fun md(millis: Long): String = SimpleDateFormat("M月d日", Locale.CHINA).format(Date(millis))
