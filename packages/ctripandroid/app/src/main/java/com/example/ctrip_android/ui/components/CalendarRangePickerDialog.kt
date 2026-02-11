package com.example.ctrip_android.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

private const val DAY_MILLIS = 24L * 60L * 60L * 1000L

private data class CalendarCell(
    val millis: Long,
    val dayOfMonth: Int,
    val inCurrentMonth: Boolean,
    val enabled: Boolean
)

@Composable
internal fun CalendarRangePickerDialog(
    visible: Boolean,
    checkInMillis: Long,
    checkOutMillis: Long,
    onDismiss: () -> Unit,
    onConfirmRange: (Long, Long) -> Unit
) {
    if (!visible) return

    val today = remember { startOfDayMillis(System.currentTimeMillis()) }
    val maxDate = remember(today) { addDays(today, 90) }
    val monthStarts = remember(today, maxDate) { buildMonthStartList(today, maxDate) }

    var localCheckIn by remember(checkInMillis, today, maxDate) {
        mutableLongStateOf(checkInMillis.coerceIn(today, maxDate))
    }
    var localCheckOut by remember(checkOutMillis, today, maxDate) {
        mutableLongStateOf(checkOutMillis.coerceIn(today, maxDate))
    }
    if (localCheckOut <= localCheckIn) {
        localCheckOut = addDays(localCheckIn, 1).coerceAtMost(maxDate)
    }
    var awaitingCheckout by remember { mutableStateOf(false) }

    Dialog(onDismissRequest = onDismiss) {
        Card(shape = RoundedCornerShape(20.dp), modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("选择日期", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                Text(
                    "${formatMonthDay(localCheckIn)} 入住 - ${formatMonthDay(localCheckOut)} 离店  ·  ${daysBetween(localCheckIn, localCheckOut)}晚",
                    color = Color(0xFF5B6578)
                )

                val initialPage = remember(monthStarts, localCheckIn) { monthStarts.indexOfFirst { it == monthStartMillis(localCheckIn) }.coerceAtLeast(0) }
                val pagerState = rememberPagerState(initialPage = initialPage, pageCount = { monthStarts.size })

                HorizontalPager(state = pagerState, modifier = Modifier.fillMaxWidth()) { page ->
                    val monthStart = monthStarts[page]
                    val cells = remember(monthStart, today, maxDate) { buildMonthCells(monthStart, today, maxDate) }

                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(
                            SimpleDateFormat("yyyy年M月", Locale.CHINA).format(Date(monthStart)),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                        WeekHeaderRow()
                        repeat(6) { row ->
                            Row(modifier = Modifier.fillMaxWidth()) {
                                repeat(7) { col ->
                                    val index = row * 7 + col
                                    val cell = cells[index]
                                    DayCell(
                                        cell = cell,
                                        checkIn = localCheckIn,
                                        checkOut = localCheckOut,
                                        min = today,
                                        max = maxDate,
                                        onClick = { clicked ->
                                            val date = clicked.coerceIn(today, maxDate)
                                            if (!awaitingCheckout) {
                                                localCheckIn = date
                                                localCheckOut = addDays(date, 1).coerceAtMost(maxDate)
                                                awaitingCheckout = true
                                            } else if (date > localCheckIn) {
                                                localCheckOut = date
                                                awaitingCheckout = false
                                            } else {
                                                localCheckIn = date
                                                localCheckOut = addDays(date, 1).coerceAtMost(maxDate)
                                                awaitingCheckout = true
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    }
                }

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                    TextButton(onClick = onDismiss) { Text("取消") }
                    Spacer(modifier = Modifier.width(8.dp))
                    Button(
                        onClick = { onConfirmRange(localCheckIn, localCheckOut) },
                        colors = ButtonDefaults.buttonColors(containerColor = CtripColors.Red)
                    ) { Text("确定") }
                }
            }
        }
    }
}

@Composable
private fun WeekHeaderRow() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        listOf("日", "一", "二", "三", "四", "五", "六").forEach { day ->
            Box(
                modifier = Modifier
                    .width(40.dp)
                    .height(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(day, color = Color(0xFF7A8396))
            }
        }
    }
}

@Composable
private fun DayCell(
    cell: CalendarCell,
    checkIn: Long,
    checkOut: Long,
    min: Long,
    max: Long,
    onClick: (Long) -> Unit
) {
    val inRange = cell.millis in (checkIn + 1) until checkOut
    val isCheckIn = cell.millis == checkIn
    val isCheckOut = cell.millis == checkOut
    val clickable = cell.enabled && cell.inCurrentMonth && cell.millis in min..max

    val containerColor = when {
        isCheckIn || isCheckOut -> CtripColors.Blue
        inRange -> Color(0xFFEAF2FF)
        else -> Color.Transparent
    }
    val textColor = when {
        !clickable -> Color(0xFFC4C9D4)
        isCheckIn || isCheckOut -> Color.White
        else -> Color.Black
    }

    Box(
        modifier = Modifier
            .width(44.dp)
            .height(44.dp)
            .padding(1.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(containerColor)
            .clickable(enabled = clickable) { onClick(cell.millis) },
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(cell.dayOfMonth.toString(), color = textColor, style = MaterialTheme.typography.bodyMedium)
            if (isCheckIn || isCheckOut) {
                Text(if (isCheckIn) "入住" else "离店", color = textColor, style = MaterialTheme.typography.labelSmall)
            } else if (isToday(cell.millis)) {
                Box(modifier = Modifier.size(4.dp).clip(CircleShape).background(Color(0xFF8FA5CC)))
            } else {
                Spacer(modifier = Modifier.height(4.dp))
            }
        }
    }
}

private fun buildMonthStartList(min: Long, max: Long): List<Long> {
    val result = mutableListOf<Long>()
    var cursor = monthStartMillis(min)
    val end = monthStartMillis(max)
    while (cursor <= end) {
        result += cursor
        cursor = addMonths(cursor, 1)
    }
    return result
}

private fun buildMonthCells(monthStart: Long, min: Long, max: Long): List<CalendarCell> {
    val firstWeekOffset = dayOfWeekOffset(monthStart)
    val gridStart = addDays(monthStart, -firstWeekOffset)
    return List(42) { idx ->
        val day = addDays(gridStart, idx)
        CalendarCell(
            millis = day,
            dayOfMonth = dayOfMonth(day),
            inCurrentMonth = monthOf(day) == monthOf(monthStart) && yearOf(day) == yearOf(monthStart),
            enabled = day in min..max
        )
    }
}

private fun monthStartMillis(timeMillis: Long): Long {
    val calendar = Calendar.getInstance()
    calendar.timeInMillis = timeMillis
    calendar.set(Calendar.DAY_OF_MONTH, 1)
    calendar.set(Calendar.HOUR_OF_DAY, 0)
    calendar.set(Calendar.MINUTE, 0)
    calendar.set(Calendar.SECOND, 0)
    calendar.set(Calendar.MILLISECOND, 0)
    return calendar.timeInMillis
}

private fun startOfDayMillis(timeMillis: Long): Long {
    val calendar = Calendar.getInstance()
    calendar.timeInMillis = timeMillis
    calendar.set(Calendar.HOUR_OF_DAY, 0)
    calendar.set(Calendar.MINUTE, 0)
    calendar.set(Calendar.SECOND, 0)
    calendar.set(Calendar.MILLISECOND, 0)
    return calendar.timeInMillis
}

private fun addDays(timeMillis: Long, days: Int): Long {
    val calendar = Calendar.getInstance()
    calendar.timeInMillis = timeMillis
    calendar.add(Calendar.DAY_OF_MONTH, days)
    return startOfDayMillis(calendar.timeInMillis)
}

private fun addMonths(timeMillis: Long, months: Int): Long {
    val calendar = Calendar.getInstance()
    calendar.timeInMillis = timeMillis
    calendar.add(Calendar.MONTH, months)
    calendar.set(Calendar.DAY_OF_MONTH, 1)
    return startOfDayMillis(calendar.timeInMillis)
}

private fun dayOfWeekOffset(timeMillis: Long): Int {
    val calendar = Calendar.getInstance()
    calendar.timeInMillis = timeMillis
    return calendar.get(Calendar.DAY_OF_WEEK) - 1
}

private fun dayOfMonth(timeMillis: Long): Int {
    val calendar = Calendar.getInstance()
    calendar.timeInMillis = timeMillis
    return calendar.get(Calendar.DAY_OF_MONTH)
}

private fun monthOf(timeMillis: Long): Int {
    val calendar = Calendar.getInstance()
    calendar.timeInMillis = timeMillis
    return calendar.get(Calendar.MONTH)
}

private fun yearOf(timeMillis: Long): Int {
    val calendar = Calendar.getInstance()
    calendar.timeInMillis = timeMillis
    return calendar.get(Calendar.YEAR)
}

private fun isToday(timeMillis: Long): Boolean {
    return startOfDayMillis(timeMillis) == startOfDayMillis(System.currentTimeMillis())
}

private fun daysBetween(start: Long, end: Long): Long = ((end - start) / DAY_MILLIS).coerceAtLeast(1L)
