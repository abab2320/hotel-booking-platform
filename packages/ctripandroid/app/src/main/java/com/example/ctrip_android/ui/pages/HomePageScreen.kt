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
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
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
    onCityClick: () -> Unit,
    onBannerClick: (String) -> Unit
) {
    val context = androidx.compose.ui.platform.LocalContext.current
    val allHotels = remember { MockHotelRepository.all() }
    val bannerHotels = remember(allHotels) { allHotels.take(5) }
    val quickTags = remember(allHotels) { allHotels.flatMap { it.tags }.distinct().take(12) }
    val maxSelectablePrice = remember(allHotels) {
        allHotels.maxOfOrNull { hotel -> hotel.roomTypes.minOf { room -> room.price } }?.plus(500) ?: 3000
    }

    var showCalendar by remember { mutableStateOf(false) }
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

    Scaffold(containerColor = Color.White) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            item {
                HomeTopBanner(
                    bannerHotels = bannerHotels,
                    onBannerClick = onBannerClick
                )
            }
            item {
                HomeSearchCard(
                    form = form,
                    nights = nights,
                    showAdvancedOptions = showAdvancedOptions,
                    maxSelectablePrice = maxSelectablePrice,
                    quickTags = quickTags,
                    onFormChange = onFormChange,
                    onSearch = onSearch,
                    onCityClick = onCityClick,
                    onDateClick = { showCalendar = true },
                    onToggleAdvanced = { showAdvancedOptions = !showAdvancedOptions },
                    onLocate = { locationLauncher.launch(Manifest.permission.ACCESS_COARSE_LOCATION) }
                )
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

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun HomeSearchCard(
    form: SearchForm,
    nights: Int,
    showAdvancedOptions: Boolean,
    maxSelectablePrice: Int,
    quickTags: List<String>,
    onFormChange: (SearchForm) -> Unit,
    onSearch: () -> Unit,
    onCityClick: () -> Unit,
    onDateClick: () -> Unit,
    onToggleAdvanced: () -> Unit,
    onLocate: () -> Unit
) {
    val inputColors = TextFieldDefaults.colors(
        focusedContainerColor = Color(0xFFF5F7FB),
        unfocusedContainerColor = Color(0xFFF5F7FB),
        disabledContainerColor = Color(0xFFF5F7FB),
        focusedIndicatorColor = Color.Transparent,
        unfocusedIndicatorColor = Color.Transparent,
        disabledIndicatorColor = Color.Transparent
    )

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp, vertical = 8.dp),
        shape = RoundedCornerShape(14.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFFF5F7FB))
                    .padding(horizontal = 10.dp, vertical = 10.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(form.city, fontWeight = FontWeight.Bold, modifier = Modifier.clickable(onClick = onCityClick))
                    Spacer(modifier = Modifier.width(10.dp))
                    Text("定位", color = CtripColors.Blue, modifier = Modifier.clickable(onClick = onLocate))
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "${formatMonthDay(form.checkInDateMillis)} - ${formatMonthDay(form.checkOutDateMillis)}",
                        color = Color(0xFF344054),
                        modifier = Modifier.clickable(onClick = onDateClick)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("${nights}晚", color = Color(0xFF667085))
                }
            }

            TextField(
                value = form.keyword,
                onValueChange = { onFormChange(form.copy(keyword = it)) },
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp)),
                singleLine = true,
                placeholder = { Text("搜索酒店名称或地点") },
                colors = inputColors
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable(onClick = onToggleAdvanced),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("筛选条件", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                Text(if (showAdvancedOptions) "收起 ↑" else "展开 ↓", color = CtripColors.Blue)
            }

            if (showAdvancedOptions) {
                HorizontalDivider(color = Color(0xFFE8ECF3))
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
                            label = { Text("${star}星") }
                        )
                    }
                }

                Text("价格区间：¥0 - ¥${form.maxPrice}", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                Slider(
                    value = form.maxPrice.toFloat().coerceIn(300f, maxSelectablePrice.toFloat()),
                    onValueChange = { onFormChange(form.copy(maxPrice = it.toInt())) },
                    valueRange = 300f..maxSelectablePrice.toFloat()
                )

                Text("酒店特色", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
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

            Button(
                onClick = onSearch,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                shape = RoundedCornerShape(10.dp),
                colors = ButtonDefaults.buttonColors(containerColor = CtripColors.Blue)
            ) {
                Text("查询酒店", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            }
        }
    }
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
            .padding(horizontal = 12.dp)
            .padding(bottom = 16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text("精选推荐", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)

        HorizontalPager(state = pagerState, modifier = Modifier.fillMaxWidth()) { page ->
            val hotel = bannerHotels.getOrNull(page)
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable(enabled = hotel != null) { hotel?.let { onBannerClick(it.id) } },
                colors = CardDefaults.cardColors(containerColor = Color.Transparent),
                shape = RoundedCornerShape(14.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Brush.verticalGradient(listOf(Color(0xFF9CB4CD), Color(0xFF6A819B), Color(0xFF4A5F72))))
                        .padding(14.dp)
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(
                            hotel?.bannerTitles?.firstOrNull() ?: "精选酒店",
                            style = MaterialTheme.typography.titleSmall,
                            color = Color(0xFFE5ECF5)
                        )
                        Text(
                            hotel?.nameCn ?: "暂无推荐",
                            style = MaterialTheme.typography.titleLarge,
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                        Text(hotel?.address ?: "", color = Color(0xFFD6E0EC))
                    }
                }
            }
        }

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center) {
            repeat(pageCount) { index ->
                Box(
                    modifier = Modifier
                        .padding(horizontal = 3.dp)
                        .size(if (pagerState.currentPage == index) 8.dp else 6.dp)
                        .clip(CircleShape)
                        .background(if (pagerState.currentPage == index) CtripColors.Blue else Color(0xFFC8D2DF))
                )
            }
        }
    }
}
