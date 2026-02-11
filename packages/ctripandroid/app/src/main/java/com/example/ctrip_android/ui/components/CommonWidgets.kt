package com.example.ctrip_android.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

internal object CtripColors {
    val Bg = Color(0xFFF1F4FA)
    val Blue = Color(0xFF1677FF)
    val Red = Color(0xFFD70016)
    val GrayTag = Color(0xFFF3F5F9)
}

@Composable
internal fun CircleBtn(text: String, onClick: () -> Unit = {}) {
    Box(
        modifier = Modifier.size(40.dp).clip(CircleShape).background(Color(0x744A4A4A)).clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) { Text(text, color = Color.White) }
}

internal fun formatDashDate(millis: Long): String = SimpleDateFormat("MM-dd", Locale.CHINA).format(Date(millis))
internal fun formatMonthDay(millis: Long): String = SimpleDateFormat("M月d日", Locale.CHINA).format(Date(millis))
