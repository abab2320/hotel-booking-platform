package com.example.ctrip_android.ui.pages

import androidx.compose.foundation.BorderStroke
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
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import com.example.ctrip_android.data.model.Hotel
import com.example.ctrip_android.data.model.RoomType
import com.example.ctrip_android.data.model.SearchForm
import com.example.ctrip_android.ui.components.CalendarRangePickerDialog
import com.example.ctrip_android.ui.components.CtripColors
import com.example.ctrip_android.ui.components.formatMonthDay
import kotlin.math.max
import kotlin.math.min

private const val DAY_MILLIS = 24L * 60L * 60L * 1000L

@OptIn(ExperimentalLayoutApi::class)
@Composable
internal fun HotelDetailPageScreen(hotel: Hotel, form: SearchForm, onBack: () -> Unit) {
    val rooms = remember(hotel.roomTypes) { hotel.roomTypes.sortedBy(RoomType::price) }
    val pagerState = rememberPagerState(pageCount = { max(1, hotel.bannerTitles.size) })

    var showDatePicker by remember { mutableStateOf(false) }
    var showGuestDialog by remember { mutableStateOf(false) }
    var selectedCheckIn by remember { mutableStateOf(form.checkInDateMillis) }
    var selectedCheckOut by remember { mutableStateOf(form.checkOutDateMillis) }
    var roomCount by remember { mutableIntStateOf(1) }
    var adultCount by remember { mutableIntStateOf(2) }
    var childCount by remember { mutableIntStateOf(0) }

    val nights = max(1, ((selectedCheckOut - selectedCheckIn) / DAY_MILLIS).toInt())

    Scaffold(
        containerColor = CtripColors.Bg,
        bottomBar = {
            Row(
                modifier = Modifier.fillMaxWidth().background(Color.White).padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f), horizontalAlignment = Alignment.Start) {
                    Text("¥${rooms.firstOrNull()?.price ?: hotel.displayMinPrice()} 起", color = CtripColors.Blue, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleLarge)
                    val stayText = "共" + nights + "晚 · " + roomCount + "间 " + adultCount + "成人" + if (childCount > 0) " " + childCount + "儿童" else ""
                    Text(stayText, color = Color(0xFF6E768A))
                }
                Button(
                    onClick = {},
                    modifier = Modifier.height(46.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = CtripColors.Blue)
                ) {
                    Text("立即预订", style = MaterialTheme.typography.titleMedium)
                }
            }
        }
    ) { padding ->
        LazyColumn(modifier = Modifier.fillMaxSize().padding(padding), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            item {
                TopNavBar(hotelName = hotel.nameCn, onBack = onBack)
            }
            item {
                HotelImageBanner(hotel = hotel, pagerState = pagerState)
            }
            item {
                HotelBasicInfoCard(hotel = hotel)
            }
            item {
                StaySelectorCard(
                    checkIn = selectedCheckIn,
                    checkOut = selectedCheckOut,
                    nights = nights,
                    roomCount = roomCount,
                    adultCount = adultCount,
                    childCount = childCount,
                    onDateClick = { showDatePicker = true },
                    onGuestClick = { showGuestDialog = true }
                )
            }
            itemsIndexed(rooms, key = { _, room -> if (room.id > 0) room.id else room.name + room.price.toString() }) { index, room ->
                RoomTypeBookingCard(room = room, index = index)
            }
        }
    }

    CalendarRangePickerDialog(
        visible = showDatePicker,
        checkInMillis = selectedCheckIn,
        checkOutMillis = selectedCheckOut,
        onDismiss = { showDatePicker = false },
        onConfirmRange = { checkIn, checkOut ->
            selectedCheckIn = checkIn
            selectedCheckOut = checkOut
            showDatePicker = false
        }
    )

    if (showGuestDialog) {
        GuestSelectorDialog(
            roomCount = roomCount,
            adultCount = adultCount,
            childCount = childCount,
            onChangeRoom = { roomCount = it },
            onChangeAdult = { adultCount = it },
            onChangeChild = { childCount = it },
            onDismiss = { showGuestDialog = false }
        )
    }
}

@Composable
private fun TopNavBar(hotelName: String, onBack: () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth().background(Color.White).padding(horizontal = 12.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text("<", modifier = Modifier.clickable(onClick = onBack), style = MaterialTheme.typography.titleLarge)
        Spacer(modifier = Modifier.width(10.dp))
        Text(hotelName, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, maxLines = 1, overflow = TextOverflow.Ellipsis)
    }
}

@Composable
private fun HotelImageBanner(hotel: Hotel, pagerState: androidx.compose.foundation.pager.PagerState) {
    Box(modifier = Modifier.fillMaxWidth()) {
        HorizontalPager(state = pagerState, modifier = Modifier.fillMaxWidth().height(260.dp)) { page ->
            Box(
                modifier = Modifier.fillMaxWidth().height(260.dp)
                    .background(Brush.verticalGradient(listOf(Color(0xFF7DA3CF), Color(0xFF3F5D7B))))
                    .padding(18.dp)
            ) {
                Column {
                    Text("酒店实拍", color = Color.White)
                    Text(hotel.bannerTitles.getOrElse(page) { "封面" }, style = MaterialTheme.typography.headlineMedium, color = Color.White, fontWeight = FontWeight.Bold)
                }
            }
        }
        Row(modifier = Modifier.align(Alignment.BottomEnd).padding(10.dp).clip(RoundedCornerShape(10.dp)).background(Color(0x66000000)).padding(horizontal = 8.dp, vertical = 4.dp)) {
            Text("${pagerState.currentPage + 1}/${max(1, hotel.bannerTitles.size)}", color = Color.White)
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun HotelBasicInfoCard(hotel: Hotel) {
    Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 10.dp), shape = RoundedCornerShape(16.dp)) {
        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(hotel.nameCn, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            Text(hotel.nameEn, color = Color(0xFF667085))
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("${"★".repeat(hotel.star)}", color = Color(0xFFF59E0B))
                Text("${hotel.rating} 分", color = CtripColors.Blue, fontWeight = FontWeight.Bold)
                if (hotel.openYear > 0) {
                    Text("${hotel.openYear}年开业", color = Color(0xFF9A7D55))
                }
            }
            Text(hotel.address, color = Color(0xFF475467))
            if (hotel.nearbyAttractions.isNotBlank()) {
                Text("周边景点：${hotel.nearbyAttractions}", color = Color(0xFF667085))
            }
            if (hotel.nearbyTransport.isNotBlank()) {
                Text("交通信息：${hotel.nearbyTransport}", color = Color(0xFF667085))
            }
            if (hotel.description.isNotBlank()) {
                Text(hotel.description, color = Color(0xFF475467), maxLines = 3, overflow = TextOverflow.Ellipsis)
            }
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                hotel.facilities.take(8).forEach {
                    Box(modifier = Modifier.clip(RoundedCornerShape(8.dp)).background(CtripColors.GrayTag).padding(horizontal = 8.dp, vertical = 5.dp)) {
                        Text(it)
                    }
                }
            }
        }
    }
}

@Composable
private fun StaySelectorCard(
    checkIn: Long,
    checkOut: Long,
    nights: Int,
    roomCount: Int,
    adultCount: Int,
    childCount: Int,
    onDateClick: () -> Unit,
    onGuestClick: () -> Unit
) {
    Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 10.dp), shape = RoundedCornerShape(14.dp)) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Text("日期与人数", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                Text("修改", color = CtripColors.Blue)
            }
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Box(modifier = Modifier.weight(1f).clip(RoundedCornerShape(10.dp)).background(Color(0xFFF5F7FB)).clickable(onClick = onDateClick).padding(10.dp)) {
                    Column {
                        Text("📅 ${formatMonthDay(checkIn)} - ${formatMonthDay(checkOut)}")
                        Text("共" + nights + "晚", color = Color(0xFF667085))
                    }
                }
                Box(modifier = Modifier.weight(1f).clip(RoundedCornerShape(10.dp)).background(Color(0xFFF5F7FB)).clickable(onClick = onGuestClick).padding(10.dp)) {
                    Column {
                        Text("👥 ${roomCount}间 ${adultCount}成人${if (childCount > 0) " ${childCount}儿童" else ""}")
                        Text("可点击修改", color = Color(0xFF667085))
                    }
                }
            }
        }
    }
}

@Composable
private fun GuestSelectorDialog(
    roomCount: Int,
    adultCount: Int,
    childCount: Int,
    onChangeRoom: (Int) -> Unit,
    onChangeAdult: (Int) -> Unit,
    onChangeChild: (Int) -> Unit,
    onDismiss: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Card(shape = RoundedCornerShape(14.dp)) {
            Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text("入住人数", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                CountRow("房间", roomCount, minValue = 1, maxValue = 5, onChange = onChangeRoom)
                CountRow("成人", adultCount, minValue = 1, maxValue = 8, onChange = onChangeAdult)
                CountRow("儿童", childCount, minValue = 0, maxValue = 6, onChange = onChangeChild)
                Button(onClick = onDismiss, modifier = Modifier.fillMaxWidth(), colors = ButtonDefaults.buttonColors(containerColor = CtripColors.Blue)) {
                    Text("完成")
                }
            }
        }
    }
}

@Composable
private fun CountRow(label: String, value: Int, minValue: Int, maxValue: Int, onChange: (Int) -> Unit) {
    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
        Text(label)
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(modifier = Modifier.size(30.dp).clip(RoundedCornerShape(6.dp)).background(Color(0xFFF0F3F8)).clickable(enabled = value > minValue) { onChange(max(minValue, value - 1)) }, contentAlignment = Alignment.Center) { Text("-") }
            Spacer(modifier = Modifier.width(12.dp))
            Text(value.toString(), fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.width(12.dp))
            Box(modifier = Modifier.size(30.dp).clip(RoundedCornerShape(6.dp)).background(Color(0xFFF0F3F8)).clickable(enabled = value < maxValue) { onChange(min(maxValue, value + 1)) }, contentAlignment = Alignment.Center) { Text("+") }
        }
    }
}

@Composable
private fun RoomTypeBookingCard(room: RoomType, index: Int) {
    val display = remember(room, index) { buildRoomDisplayInfo(room, index) }

    Card(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 10.dp),
        shape = RoundedCornerShape(14.dp),
        border = BorderStroke(1.dp, Color(0xFFF0F3F8))
    ) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Row {
                Box(
                    modifier = Modifier.size(width = 102.dp, height = 92.dp).clip(RoundedCornerShape(10.dp)).background(Color(0xFFEDEFF4)),
                    contentAlignment = Alignment.Center
                ) {
                    Text("房型图", color = Color(0xFF667085))
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(room.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                    Text(display.bedType, color = Color(0xFF475467))
                    Text("可住${display.capacity}人 · ${display.breakfast}", color = Color(0xFF475467))
                    display.area?.let { Text("面积 $it", color = Color(0xFF667085)) }
                }
            }

            HorizontalDivider(color = Color(0xFFF1F3F8))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Column {
                    Row(verticalAlignment = Alignment.Bottom, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text("¥${room.price}", color = CtripColors.Blue, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                        display.originalPrice?.let {
                            Text("¥$it", color = Color(0xFF98A2B3), textDecoration = TextDecoration.LineThrough)
                        }
                    }
                    Text(if (display.originalPrice != null) "限时优惠" else "可免费取消", color = Color(0xFF667085), style = MaterialTheme.typography.bodySmall)
                }
                Button(
                    onClick = {},
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = CtripColors.Red)
                ) {
                    Text("预订")
                }
            }
        }
    }
}

private data class RoomDisplayInfo(
    val bedType: String,
    val capacity: Int,
    val breakfast: String,
    val area: String?,
    val originalPrice: Int?
)

private fun buildRoomDisplayInfo(room: RoomType, index: Int): RoomDisplayInfo {
    val bedType = when {
        room.bedType.isNotBlank() -> room.bedType
        room.name.contains("双") -> "2张单人床"
        room.name.contains("家庭") -> "1张大床 + 1张单人床"
        else -> "1张大床"
    }

    val capacity = when {
        room.maxGuests > 0 -> room.maxGuests
        room.name.contains("家庭") -> 3
        room.name.contains("套") -> 4
        else -> 2
    }

    val breakfast = when (room.breakfast) {
        "double" -> "含2份早餐"
        "single" -> "含1份早餐"
        "none" -> "不含早餐"
        else -> if (index % 2 == 0) "含2份早餐" else "不含早餐"
    }

    val area = room.area?.let { "${it}㎡" } ?: if (index % 3 == 0) "30-35㎡" else "25-30㎡"
    val originalPrice = room.originalPrice ?: if (index % 2 == 0) room.price + 180 else null

    return RoomDisplayInfo(
        bedType = bedType,
        capacity = capacity,
        breakfast = breakfast,
        area = area,
        originalPrice = originalPrice
    )
}
