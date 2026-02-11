package com.example.ctrip_android.ui.pages

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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.ctrip_android.data.model.SearchForm
import com.example.ctrip_android.data.repository.MockHotelRepository
import com.example.ctrip_android.ui.components.CalendarRangePickerDialog
import com.example.ctrip_android.ui.components.CircleBtn
import com.example.ctrip_android.ui.components.CtripColors
import com.example.ctrip_android.ui.components.formatMonthDay
import kotlin.math.max

private const val ONE_DAY_MILLIS = 24L * 60L * 60L * 1000L

@OptIn(ExperimentalLayoutApi::class)
@Composable
internal fun HomePageScreen(
    form: SearchForm,
    onFormChange: (SearchForm) -> Unit,
    onSearch: () -> Unit,
    onBannerClick: (String) -> Unit
) {
    val context = androidx.compose.ui.platform.LocalContext.current
    val allHotels = remember { MockHotelRepository.all() }
    val bannerHotels = remember(allHotels) { allHotels.take(5) }
    val cityOptions = remember(allHotels) { allHotels.map { it.city }.distinct() }
    val quickTags = remember(allHotels) { allHotels.flatMap { it.tags }.distinct().take(12) }
    val maxSelectablePrice = remember(allHotels) {
        allHotels.maxOfOrNull { hotel -> hotel.roomTypes.minOf { room -> room.price } }?.plus(500) ?: 3000
    }

    var showCalendar by remember { mutableStateOf(false) }
    var cityMenuExpanded by remember { mutableStateOf(false) }
    var showAdvancedOptions by remember { mutableStateOf(false) }

    val nights = max(1, ((form.checkOutDateMillis - form.checkInDateMillis) / ONE_DAY_MILLIS).toInt())

    val locationLauncher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        if (granted) {
            val lm = context.getSystemService(LocationManager::class.java)
            if (lm?.isProviderEnabled(LocationManager.NETWORK_PROVIDER) == true) {
                onFormChange(form.copy(city = "上海"))
            }
        }
    }

    Scaffold(containerColor = CtripColors.Bg) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                HomeTopBanner(
                    bannerHotels = bannerHotels,
                    onBannerClick = onBannerClick
                )
            }

            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp),
                    shape = RoundedCornerShape(18.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text("城市", color = Color.Gray)
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(form.city, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                "定位",
                                color = CtripColors.Blue,
                                modifier = Modifier.clickable { locationLauncher.launch(Manifest.permission.ACCESS_COARSE_LOCATION) }
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Box {
                                Text(
                                    "切换城市",
                                    color = CtripColors.Blue,
                                    modifier = Modifier.clickable { cityMenuExpanded = true }
                                )
                                DropdownMenu(expanded = cityMenuExpanded, onDismissRequest = { cityMenuExpanded = false }) {
                                    cityOptions.forEach { city ->
                                        DropdownMenuItem(
                                            text = { Text(city) },
                                            onClick = {
                                                onFormChange(form.copy(city = city))
                                                cityMenuExpanded = false
                                            }
                                        )
                                    }
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))
                        Text("位置/品牌/酒店", color = Color.Gray)
                        OutlinedTextField(
                            value = form.keyword,
                            onValueChange = { onFormChange(form.copy(keyword = it)) },
                            placeholder = { Text("输入酒店名称或地址") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )

                        HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp), color = Color(0xFFE9EDF5))
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { showCalendar = true },
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                "${formatMonthDay(form.checkInDateMillis)} 入住 - ${formatMonthDay(form.checkOutDateMillis)} 离店",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                            Text(nights.toString() + "晚")
                        }

                        HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp), color = Color(0xFFE9EDF5))
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { showAdvancedOptions = !showAdvancedOptions },
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("高级选项", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                            Text(if (showAdvancedOptions) "收起 ↑" else "展开 ↓", color = CtripColors.Blue)
                        }

                        if (showAdvancedOptions) {
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("星级", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                listOf(3, 4, 5).forEach { star ->
                                    FilterChip(
                                        selected = star in form.starFilters,
                                        onClick = {
                                            val next = form.starFilters.toMutableSet()
                                            if (!next.add(star)) next.remove(star)
                                            onFormChange(form.copy(starFilters = next))
                                        },
                                        label = { Text(star.toString() + "星") }
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))
                            Text("价格区间：¥0 - ¥${form.maxPrice}", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                            Slider(
                                value = form.maxPrice.toFloat().coerceIn(300f, maxSelectablePrice.toFloat()),
                                onValueChange = { onFormChange(form.copy(maxPrice = it.toInt())) },
                                valueRange = 300f..maxSelectablePrice.toFloat()
                            )

                            Spacer(modifier = Modifier.height(8.dp))
                            Text("快捷标签", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                quickTags.forEach { tag ->
                                    FilterChip(
                                        selected = tag in form.quickTags,
                                        onClick = {
                                            val next = form.quickTags.toMutableSet()
                                            if (!next.add(tag)) next.remove(tag)
                                            onFormChange(form.copy(quickTags = next))
                                        },
                                        label = { Text(tag) }
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))
                        Button(
                            onClick = onSearch,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(50.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = CtripColors.Red)
                        ) {
                            Text("查询", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }

    CalendarRangePickerDialog(
        visible = showCalendar,
        checkInMillis = form.checkInDateMillis,
        checkOutMillis = form.checkOutDateMillis,
        onDismiss = { showCalendar = false },
        onConfirmRange = { checkIn, checkOut ->
            onFormChange(form.copy(checkInDateMillis = checkIn, checkOutDateMillis = checkOut))
            showCalendar = false
        }
    )
}

@Composable
private fun HomeTopBanner(
    bannerHotels: List<com.example.ctrip_android.data.model.Hotel>,
    onBannerClick: (String) -> Unit
) {
    val pageCount = max(1, bannerHotels.size)
    val pagerState = rememberPagerState(pageCount = { pageCount })

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
        HorizontalPager(state = pagerState, modifier = Modifier.fillMaxWidth()) { page ->
            val hotel = bannerHotels.getOrNull(page)
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable(enabled = hotel != null) { hotel?.let { onBannerClick(it.id) } },
                colors = CardDefaults.cardColors(containerColor = Color(0xFFE7C1A3)),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(hotel?.bannerTitles?.firstOrNull() ?: "精选酒店", style = MaterialTheme.typography.titleMedium, color = Color(0xFF8B1912), fontWeight = FontWeight.Bold)
                    Text(hotel?.nameCn ?: "暂无推荐", style = MaterialTheme.typography.headlineSmall, color = Color(0xFF8B1912), fontWeight = FontWeight.ExtraBold)
                    Text(hotel?.address ?: "", color = Color(0xFF6B2A1D))
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center) {
            repeat(pageCount) { index ->
                Box(
                    modifier = Modifier
                        .padding(horizontal = 3.dp)
                        .size(if (pagerState.currentPage == index) 8.dp else 6.dp)
                        .clip(CircleShape)
                        .background(if (pagerState.currentPage == index) CtripColors.Red else Color(0xFFCFB9A6))
                )
            }
        }
    }
}
