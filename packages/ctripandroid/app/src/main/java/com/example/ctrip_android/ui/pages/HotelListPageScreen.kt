package com.example.ctrip_android.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.example.ctrip_android.data.model.Hotel
import com.example.ctrip_android.data.model.SearchForm
import com.example.ctrip_android.data.model.SortType
import com.example.ctrip_android.data.repository.MockHotelRepository
import com.example.ctrip_android.ui.components.CalendarRangePickerDialog
import com.example.ctrip_android.ui.components.CtripColors
import com.example.ctrip_android.ui.components.formatDashDate
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private const val DEFAULT_MAX_PRICE = 2000
private const val LIST_BATCH_SIZE = 6

@OptIn(ExperimentalLayoutApi::class)
@Composable
internal fun HotelListPageScreen(
    form: SearchForm,
    onFormChange: (SearchForm) -> Unit,
    onBack: () -> Unit,
    onCityClick: () -> Unit,
    onHotelClick: (String) -> Unit
) {
    val allHotels = remember { MockHotelRepository.all() }
    val nearbyOptions = remember(allHotels) { allHotels.flatMap { it.nearby }.distinct().take(16) }
    val tagOptions = remember(allHotels) { allHotels.flatMap { it.tags }.distinct().take(16) }
    val maxSelectablePrice = remember(allHotels) {
        allHotels.maxOfOrNull { hotel -> hotel.roomTypes.minOf { room -> room.price } }?.plus(500) ?: 3000
    }

    val listState = rememberLazyListState()
    val loaded = remember { mutableStateListOf<Hotel>() }
    var hasMore by remember { mutableStateOf(true) }
    var isInitialLoading by remember { mutableStateOf(true) }
    var isPaging by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    var showDatePicker by remember { mutableStateOf(false) }
    var sortMenuExpanded by remember { mutableStateOf(false) }

    var showFilterPanel by remember { mutableStateOf(false) }
    var activeFilterTab by remember { mutableIntStateOf(0) }
    var draftNearbyFilters by remember { mutableStateOf(form.nearbyFilters) }
    var draftStarFilters by remember { mutableStateOf(form.starFilters) }
    var draftQuickTags by remember { mutableStateOf(form.quickTags) }
    var draftMaxPrice by remember { mutableIntStateOf(form.maxPrice) }

    val filterCount = form.nearbyFilters.size + form.starFilters.size + form.quickTags.size + if (form.maxPrice != DEFAULT_MAX_PRICE) 1 else 0
    fun refreshLoadedFromRepository() {
        loaded.clear()
        loaded.addAll(MockHotelRepository.loadedSearch(form))
    }

    fun CoroutineScope.loadMore() {
        launch {
            if (isInitialLoading || isPaging || !hasMore) return@launch
            isPaging = true
            delay(280)
            MockHotelRepository.loadNextBatch(form, LIST_BATCH_SIZE)
            refreshLoadedFromRepository()
            hasMore = MockHotelRepository.hasMoreFor(form)
            isPaging = false
        }
    }

    fun openFilterPanel(tab: Int) {
        activeFilterTab = tab
        draftNearbyFilters = form.nearbyFilters
        draftStarFilters = form.starFilters
        draftQuickTags = form.quickTags
        draftMaxPrice = form.maxPrice
        showFilterPanel = true
    }

    LaunchedEffect(
        form.city,
        form.keyword,
        form.checkInDateMillis,
        form.checkOutDateMillis,
        form.nearbyFilters,
        form.starFilters,
        form.maxPrice,
        form.quickTags,
        form.sortType
    ) {
        isInitialLoading = true
        isPaging = false
        delay(350)

        MockHotelRepository.resetLoadedFor(form)
        MockHotelRepository.loadNextBatch(form, LIST_BATCH_SIZE)
        refreshLoadedFromRepository()
        hasMore = MockHotelRepository.hasMoreFor(form)
        isInitialLoading = false
    }

    LaunchedEffect(listState.layoutInfo.visibleItemsInfo.lastOrNull()?.index, hasMore, isInitialLoading, isPaging, loaded.size) {
        val lastVisible = listState.layoutInfo.visibleItemsInfo.lastOrNull()?.index ?: 0
        if (!isInitialLoading && !isPaging && hasMore && loaded.isNotEmpty() && lastVisible >= loaded.size - 2) {
            scope.loadMore()
        }
    }

    Scaffold(containerColor = Color.White) { padding ->
        Box(modifier = Modifier.fillMaxSize().padding(padding)) {
            Column(modifier = Modifier.fillMaxSize()) {
                HotelListHeader(
                    form = form,
                    onFormChange = onFormChange,
                    onBack = onBack,
                    onCityClick = onCityClick,
                    onDateClick = { showDatePicker = true }
                )

                HotelListTopFilterBar(
                    sortType = form.sortType,
                    sortMenuExpanded = sortMenuExpanded,
                    onSortMenuExpandedChange = { sortMenuExpanded = it },
                    onSortChange = { onFormChange(form.copy(sortType = it)) },
                    nearbyCount = form.nearbyFilters.size,
                    filterCount = filterCount,
                    onNearbyClick = { openFilterPanel(1) },
                    onPriceStarClick = { openFilterPanel(2) },
                    onMoreClick = { openFilterPanel(0) }
                )

                when {
                    isInitialLoading -> {
                        LazyColumn(modifier = Modifier.fillMaxSize()) {
                            items(5) { SkeletonHotelCard() }
                        }
                    }

                    loaded.isEmpty() -> {
                        EmptyState(modifier = Modifier.fillMaxSize())
                    }

                    else -> {
                        LazyColumn(state = listState, modifier = Modifier.fillMaxSize()) {
                            items(loaded, key = { it.id }) { hotel ->
                                HotelResultItem(hotel = hotel, onClick = { onHotelClick(hotel.id) })
                            }
                            item {
                                PagingFooter(
                                    hasMore = hasMore,
                                    isPaging = isPaging,
                                    onLoadMore = { scope.loadMore() }
                                )
                            }
                        }
                    }
                }
            }

            if (showFilterPanel) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0x66000000))
                        .clickable { showFilterPanel = false }
                )
                FilterPanelDropdown(
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .padding(top = 98.dp)
                        .fillMaxWidth()
                        .fillMaxHeight(0.78f),
                    initialTab = activeFilterTab,
                    nearbyOptions = nearbyOptions,
                    tagOptions = tagOptions,
                    maxSelectablePrice = maxSelectablePrice,
                    selectedNearby = draftNearbyFilters,
                    selectedStars = draftStarFilters,
                    selectedTags = draftQuickTags,
                    selectedMaxPrice = draftMaxPrice,
                    onNearbyChange = { draftNearbyFilters = it },
                    onStarsChange = { draftStarFilters = it },
                    onTagsChange = { draftQuickTags = it },
                    onMaxPriceChange = { draftMaxPrice = it },
                    onClear = {
                        draftNearbyFilters = emptySet()
                        draftStarFilters = emptySet()
                        draftQuickTags = emptySet()
                        draftMaxPrice = DEFAULT_MAX_PRICE
                    },
                    onDone = {
                        onFormChange(
                            form.copy(
                                nearbyFilters = draftNearbyFilters,
                                starFilters = draftStarFilters,
                                quickTags = draftQuickTags,
                                maxPrice = draftMaxPrice
                            )
                        )
                        showFilterPanel = false
                    }
                )
            }
        }
    }

    CalendarRangePickerDialog(
        visible = showDatePicker,
        checkInMillis = form.checkInDateMillis,
        checkOutMillis = form.checkOutDateMillis,
        onDismiss = { showDatePicker = false },
        onConfirmRange = { checkIn, checkOut ->
            onFormChange(form.copy(checkInDateMillis = checkIn, checkOutDateMillis = checkOut))
            showDatePicker = false
        }
    )

}

@Composable
private fun HotelListHeader(
    form: SearchForm,
    onFormChange: (SearchForm) -> Unit,
    onBack: () -> Unit,
    onCityClick: () -> Unit,
    onDateClick: () -> Unit
) {
    Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 10.dp), verticalAlignment = Alignment.CenterVertically) {
        Text("<", modifier = Modifier.clickable(onClick = onBack), style = MaterialTheme.typography.titleLarge)
        Spacer(modifier = Modifier.width(10.dp))
        Row(
            modifier = Modifier
                .weight(1f)
                .clip(RoundedCornerShape(12.dp))
                .background(CtripColors.GrayTag)
                .padding(horizontal = 10.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box {
                Text(form.city, fontWeight = FontWeight.Bold, modifier = Modifier.clickable(onClick = onCityClick))
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column(modifier = Modifier.clickable(onClick = onDateClick)) {
                Text("入住 ${formatDashDate(form.checkInDateMillis)}", style = MaterialTheme.typography.bodySmall)
                Text("离店 ${formatDashDate(form.checkOutDateMillis)}", style = MaterialTheme.typography.bodySmall)
            }
            Spacer(modifier = Modifier.width(10.dp))
            TextField(
                value = form.keyword,
                onValueChange = { onFormChange(form.copy(keyword = it)) },
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(10.dp)),
                singleLine = true,
                placeholder = { Text("搜索酒店名称或地点") },
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color(0xFFF5F7FB),
                    unfocusedContainerColor = Color(0xFFF5F7FB),
                    disabledContainerColor = Color(0xFFF5F7FB),
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent,
                    disabledIndicatorColor = Color.Transparent
                )
            )
        }
    }
}

@Composable
private fun HotelListTopFilterBar(
    sortType: SortType,
    sortMenuExpanded: Boolean,
    onSortMenuExpandedChange: (Boolean) -> Unit,
    onSortChange: (SortType) -> Unit,
    nearbyCount: Int,
    filterCount: Int,
    onNearbyClick: () -> Unit,
    onPriceStarClick: () -> Unit,
    onMoreClick: () -> Unit
) {
    Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 8.dp), horizontalArrangement = Arrangement.SpaceBetween) {
        Box {
            Text(
                "${sortType.label()} ▾",
                color = CtripColors.Blue,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.clickable { onSortMenuExpandedChange(true) }
            )
            DropdownMenu(expanded = sortMenuExpanded, onDismissRequest = { onSortMenuExpandedChange(false) }) {
                SortType.entries.forEach { item ->
                    DropdownMenuItem(
                        text = { Text(item.label()) },
                        onClick = {
                            onSortChange(item)
                            onSortMenuExpandedChange(false)
                        }
                    )
                }
            }
        }
        Text(
            if (nearbyCount > 0) "位置距离(${nearbyCount}) ▾" else "位置距离 ▾",
            color = CtripColors.Blue,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.clickable(onClick = onNearbyClick)
        )
        Text("价格/星级 ▾", color = Color.Black, fontWeight = FontWeight.SemiBold, modifier = Modifier.clickable(onClick = onPriceStarClick))
        Text(
            if (filterCount > 0) "筛选(${filterCount}) ▴" else "筛选 ▴",
            color = CtripColors.Blue,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.clickable(onClick = onMoreClick)
        )
    }
}

private fun SortType.label(): String {
    return when (this) {
        SortType.SMART -> "智能排序"
        SortType.RATING_DESC -> "评分优先"
        SortType.STAR_DESC -> "高星优先"
        SortType.PRICE_ASC -> "低价优先"
        SortType.PRICE_DESC -> "高价优先"
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun FilterPanelDropdown(
    modifier: Modifier = Modifier,
    initialTab: Int,
    nearbyOptions: List<String>,
    tagOptions: List<String>,
    maxSelectablePrice: Int,
    selectedNearby: Set<String>,
    selectedStars: Set<Int>,
    selectedTags: Set<String>,
    selectedMaxPrice: Int,
    onNearbyChange: (Set<String>) -> Unit,
    onStarsChange: (Set<Int>) -> Unit,
    onTagsChange: (Set<String>) -> Unit,
    onMaxPriceChange: (Int) -> Unit,
    onClear: () -> Unit,
    onDone: () -> Unit
) {
    val leftTabs = listOf("热门筛选", "位置距离", "价格/星级", "酒店特色")
    var selectedTab by remember(initialTab) { mutableIntStateOf(initialTab.coerceIn(0, leftTabs.lastIndex)) }
    val expanded = remember {
        mutableStateMapOf(
            "热门筛选" to false,
            "位置距离" to false,
            "酒店特色" to false
        )
    }

    Card(modifier = modifier, shape = RoundedCornerShape(bottomStart = 14.dp, bottomEnd = 14.dp)) {
        Column(modifier = Modifier.fillMaxSize()) {
            Row(modifier = Modifier.weight(1f)) {
                Column(
                    modifier = Modifier
                        .width(104.dp)
                        .fillMaxHeight()
                        .background(Color(0xFFF5F7FB))
                ) {
                    leftTabs.forEachIndexed { index, tab ->
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { selectedTab = index }
                                .background(if (selectedTab == index) Color.White else Color(0xFFF5F7FB))
                                .padding(horizontal = 12.dp, vertical = 16.dp)
                        ) {
                            Text(
                                tab,
                                color = if (selectedTab == index) Color.Black else Color(0xFF667085),
                                fontWeight = if (selectedTab == index) FontWeight.Bold else FontWeight.Normal
                            )
                        }
                    }
                }

                LazyColumn(modifier = Modifier.weight(1f).padding(12.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                        when (selectedTab) {
                            0 -> {
                                item {
                                    ExpandableChipSection(
                                        title = "热门筛选",
                                        options = (tagOptions + nearbyOptions).distinct(),
                                        selected = selectedTags + selectedNearby,
                                        expanded = expanded["热门筛选"] == true,
                                        onExpandChange = { expanded["热门筛选"] = it },
                                        onToggle = { option ->
                                            if (option in nearbyOptions) {
                                                val next = selectedNearby.toMutableSet()
                                                if (!next.add(option)) next.remove(option)
                                                onNearbyChange(next)
                                            } else {
                                                val next = selectedTags.toMutableSet()
                                                if (!next.add(option)) next.remove(option)
                                                onTagsChange(next)
                                            }
                                        }
                                    )
                                }
                            }

                            1 -> {
                                item {
                                    ExpandableChipSection(
                                        title = "位置距离",
                                        options = nearbyOptions,
                                        selected = selectedNearby,
                                        expanded = expanded["位置距离"] == true,
                                        onExpandChange = { expanded["位置距离"] = it },
                                        onToggle = { nearby ->
                                            val next = selectedNearby.toMutableSet()
                                            if (!next.add(nearby)) next.remove(nearby)
                                            onNearbyChange(next)
                                        }
                                    )
                                }
                            }

                            2 -> {
                                item {
                                    Text("星级", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                                    Spacer(modifier = Modifier.height(8.dp))
                                    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                        listOf(3, 4, 5).forEach { star ->
                                            FilterChip(
                                                selected = star in selectedStars,
                                                onClick = {
                                                    val next = selectedStars.toMutableSet()
                                                    if (!next.add(star)) next.remove(star)
                                                    onStarsChange(next)
                                                },
                                                label = { Text("${star}星") }
                                            )
                                        }
                                    }
                                }
                                item {
                                    Text("价格区间：¥0 - ¥${selectedMaxPrice}", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                                    Spacer(modifier = Modifier.height(8.dp))
                                    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                        listOf(500, 800, 1200, 2000).forEach { price ->
                                            FilterChip(
                                                selected = selectedMaxPrice == price,
                                                onClick = { onMaxPriceChange(price) },
                                                label = { Text("¥$price") }
                                            )
                                        }
                                    }
                                    Slider(
                                        value = selectedMaxPrice.toFloat().coerceIn(300f, maxSelectablePrice.toFloat()),
                                        onValueChange = { onMaxPriceChange(it.toInt()) },
                                        valueRange = 300f..maxSelectablePrice.toFloat()
                                    )
                                }
                            }

                            else -> {
                                item {
                                    ExpandableChipSection(
                                        title = "酒店特色",
                                        options = tagOptions,
                                        selected = selectedTags,
                                        expanded = expanded["酒店特色"] == true,
                                        onExpandChange = { expanded["酒店特色"] = it },
                                        onToggle = { tag ->
                                            val next = selectedTags.toMutableSet()
                                            if (!next.add(tag)) next.remove(tag)
                                            onTagsChange(next)
                                        }
                                    )
                                }
                            }
                        }
                }
            }

            HorizontalDivider(color = Color(0xFFE8ECF3))
            Row(modifier = Modifier.fillMaxWidth().padding(12.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Button(
                    onClick = onClear,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF3F5F9), contentColor = Color.Black)
                ) {
                    Text("清空")
                }
                Button(
                    onClick = onDone,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = CtripColors.Blue)
                ) {
                    Text("完成")
                }
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ExpandableChipSection(
    title: String,
    options: List<String>,
    selected: Set<String>,
    expanded: Boolean,
    onExpandChange: (Boolean) -> Unit,
    onToggle: (String) -> Unit
) {
    val collapsedCount = 6
    val visibleOptions = if (expanded) options else options.take(collapsedCount)

    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
            if (options.size > collapsedCount) {
                Text(if (expanded) "收起 ↑" else "展开 ↓", color = CtripColors.Blue, modifier = Modifier.clickable { onExpandChange(!expanded) })
            }
        }
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            visibleOptions.forEach { option ->
                FilterChip(
                    selected = option in selected,
                    onClick = { onToggle(option) },
                    label = { Text(option) }
                )
            }
        }
    }
}

@Composable
private fun EmptyState(modifier: Modifier = Modifier) {
    Box(modifier = modifier, contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text("(＞﹏＜)", style = MaterialTheme.typography.headlineLarge)
            Spacer(modifier = Modifier.height(8.dp))
            Text("没有找到符合条件的酒店", color = Color(0xFF70798B))
            Text("请尝试调整筛选条件", color = Color(0xFF9AA3B5))
        }
    }
}

@Composable
private fun PagingFooter(
    hasMore: Boolean,
    isPaging: Boolean,
    onLoadMore: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(14.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        when {
            isPaging -> {
                CircularProgressIndicator(modifier = Modifier.size(16.dp), strokeWidth = 2.dp)
                Spacer(modifier = Modifier.width(8.dp))
                Text("加载更多中...", color = Color.Gray)
            }

            hasMore -> Text("上滑或点击加载更多", color = CtripColors.Blue, modifier = Modifier.clickable(onClick = onLoadMore))
            else -> Text("没有更多酒店了", color = Color.Gray)
        }
    }
}

@Composable
private fun SkeletonHotelCard() {
    Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 10.dp)) {
        Box(
            modifier = Modifier
                .size(width = 110.dp, height = 130.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0xFFEDEFF4))
        )
        Spacer(modifier = Modifier.width(10.dp))
        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Box(modifier = Modifier.fillMaxWidth(0.7f).height(18.dp).clip(RoundedCornerShape(6.dp)).background(Color(0xFFEDEFF4)))
            Box(modifier = Modifier.fillMaxWidth(0.5f).height(14.dp).clip(RoundedCornerShape(6.dp)).background(Color(0xFFEDEFF4)))
            Box(modifier = Modifier.fillMaxWidth(0.9f).height(14.dp).clip(RoundedCornerShape(6.dp)).background(Color(0xFFEDEFF4)))
            Box(modifier = Modifier.fillMaxWidth(0.4f).height(18.dp).clip(RoundedCornerShape(6.dp)).background(Color(0xFFEDEFF4)))
        }
    }
    HorizontalDivider(color = Color(0xFFEEF2F7))
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun HotelResultItem(hotel: Hotel, onClick: () -> Unit) {
    val minPrice = hotel.roomTypes.minOf { it.price }
    Row(modifier = Modifier.fillMaxWidth().clickable(onClick = onClick).padding(horizontal = 12.dp, vertical = 10.dp)) {
        Box(
            modifier = Modifier.size(width = 110.dp, height = 130.dp).clip(RoundedCornerShape(12.dp))
                .background(Brush.verticalGradient(listOf(Color(0xFF9CB4CD), Color(0xFF6A819B), Color(0xFF4A5F72)))),
            contentAlignment = Alignment.Center
        ) {
            Text(hotel.bannerTitles.firstOrNull() ?: "酒店首图", color = Color.White, maxLines = 2, overflow = TextOverflow.Ellipsis)
        }
        Spacer(modifier = Modifier.width(10.dp))
        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(5.dp)) {
            Text(hotel.nameCn, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, maxLines = 2, overflow = TextOverflow.Ellipsis)
            Text("${"★".repeat(hotel.star)}  ${hotel.rating}分", color = Color(0xFFF59E0B), maxLines = 1)
            Text(hotel.address, color = Color(0xFF565E6F), maxLines = 1, overflow = TextOverflow.Ellipsis)
            if (hotel.discounts.isNotEmpty()) {
                FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    hotel.discounts.take(2).forEach { discount ->
                        Box(modifier = Modifier.clip(RoundedCornerShape(6.dp)).background(Color(0xFFFFF1F2)).padding(horizontal = 6.dp, vertical = 3.dp)) {
                            Text(discount, color = Color(0xFFB42318), style = MaterialTheme.typography.labelSmall)
                        }
                    }
                }
            }
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                Text("¥${minPrice}起", color = CtripColors.Blue, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            }
        }
    }
    HorizontalDivider(color = Color(0xFFEEF2F7))
}
