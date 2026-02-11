package com.example.ctrip_android.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = CtripBlue,
    secondary = CtripBlueDark,
    tertiary = CtripAccent,
    background = Color(0xFF0E1525),
    surface = Color(0xFF162033),
    onPrimary = Color.White,
    onBackground = Color(0xFFEAF0FF),
    onSurface = Color(0xFFEAF0FF)
)

private val LightColorScheme = lightColorScheme(
    primary = CtripBlue,
    secondary = CtripBlueDark,
    tertiary = CtripAccent,
    background = CtripBackground,
    surface = CtripSurface,
    onPrimary = Color.White,
    onBackground = Color(0xFF1E222A),
    onSurface = Color(0xFF1E222A)
)

@Composable
fun CtripandroidTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
