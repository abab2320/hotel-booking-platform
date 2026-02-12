package com.example.ctrip_android.ui.pages

import android.icu.text.Transliterator
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
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.ctrip_android.data.model.SearchForm
import com.example.ctrip_android.data.repository.MockHotelRepository
import com.example.ctrip_android.ui.components.CtripColors
import kotlinx.coroutines.launch
import java.util.Locale

private val HanToLatin: Transliterator by lazy {
    Transliterator.getInstance("Han-Latin; Latin-ASCII")
}

private data class CitySection(
    val key: String,
    val title: String,
    val cities: List<String>
)

@OptIn(ExperimentalLayoutApi::class)
@Composable
internal fun CitySelectPageScreen(
    form: SearchForm,
    onFormChange: (SearchForm) -> Unit,
    onBack: () -> Unit
) {
    val allCities = remember {
        MockHotelRepository.all()
            .map { it.city }
            .distinct()
            .sortedBy { citySortKey(it) }
    }
    val hotCities = remember(allCities) {
        val preset = listOf("上海", "北京", "广州", "深圳", "杭州", "成都", "三亚")
        preset.filter { it in allCities }.ifEmpty { allCities.take(6) }
    }

    var query by remember { mutableStateOf("") }
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()

    val filteredCities = remember(allCities, query) {
        if (query.isBlank()) allCities
        else allCities.filter { it.contains(query.trim(), ignoreCase = true) }
    }
    val sections = remember(filteredCities, hotCities, query) {
        val grouped = filteredCities
            .groupBy { cityInitial(it).toString() }
            .toSortedMap()
            .map { (letter, cities) ->
                CitySection(key = letter, title = letter, cities = cities.sortedBy { citySortKey(it) })
            }
            .toMutableList()
        if (query.isBlank() && hotCities.isNotEmpty()) {
            grouped.add(0, CitySection(key = "HOT", title = "热门城市", cities = hotCities))
        }
        grouped.toList()
    }
    val sectionStart = remember(sections) {
        val start = mutableMapOf<String, Int>()
        var index = 0
        sections.forEach { section ->
            start[section.key] = index
            index += 1 + section.cities.size
        }
        start.toMap()
    }
    val rightIndexKeys = remember(sections, query) {
        buildList {
            if (query.isBlank() && sections.any { it.key == "HOT" }) add("热门")
            addAll(sections.filter { it.key != "HOT" }.map { it.key })
        }
    }

    Column(modifier = Modifier.fillMaxSize().background(Color.White)) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                modifier = Modifier.weight(1f),
                singleLine = true,
                placeholder = { Text("全球城市/区域/位置/酒店") }
            )
            Spacer(modifier = Modifier.width(10.dp))
            Text(
                "取消",
                color = Color(0xFF59647A),
                style = MaterialTheme.typography.titleMedium,
                modifier = Modifier.clickable(onClick = onBack)
            )
        }

        Box(modifier = Modifier.fillMaxSize()) {
            LazyColumn(
                state = listState,
                modifier = Modifier
                    .fillMaxSize()
                    .padding(end = 36.dp)
            ) {
                sections.forEach { section ->
                    item(key = "header-${section.key}") {
                        Text(
                            text = section.title,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = if (section.key == "HOT") CtripColors.Blue else Color(0xFF475467),
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFFF8FAFC))
                                .padding(horizontal = 14.dp, vertical = 8.dp)
                        )
                    }
                    if (section.key == "HOT") {
                        item(key = "hot-grid") {
                            FlowRow(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 12.dp, vertical = 10.dp),
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                section.cities.forEach { city ->
                                    Box(
                                        modifier = Modifier
                                            .background(
                                                color = if (city == form.city) Color(0xFFE7F0FF) else Color(0xFFF2F4F7),
                                                shape = RoundedCornerShape(8.dp)
                                            )
                                            .clickable {
                                                onFormChange(form.copy(city = city))
                                                onBack()
                                            }
                                            .padding(horizontal = 12.dp, vertical = 8.dp)
                                    ) {
                                        Text(city, color = if (city == form.city) CtripColors.Blue else Color(0xFF344054))
                                    }
                                }
                            }
                            HorizontalDivider(color = Color(0xFFEEF2F7))
                        }
                    } else {
                        items(section.cities.size, key = { idx -> "${section.key}-${section.cities[idx]}" }) { idx ->
                            val city = section.cities[idx]
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        onFormChange(form.copy(city = city))
                                        onBack()
                                    }
                                    .padding(horizontal = 14.dp, vertical = 16.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    city,
                                    style = MaterialTheme.typography.titleLarge,
                                    color = if (city == form.city) CtripColors.Blue else Color.Black
                                )
                            }
                            HorizontalDivider(color = Color(0xFFEEF2F7))
                        }
                    }
                }
            }

            Column(
                modifier = Modifier
                    .align(Alignment.CenterEnd)
                    .fillMaxHeight()
                    .padding(end = 6.dp, top = 20.dp, bottom = 20.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                rightIndexKeys.forEach { key ->
                    Text(
                        text = key,
                        color = CtripColors.Blue,
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier
                            .padding(vertical = 2.dp)
                            .clickable {
                                val sectionKey = if (key == "热门") "HOT" else key
                                sectionStart[sectionKey]?.let { target ->
                                    scope.launch { listState.animateScrollToItem(target) }
                                }
                            }
                    )
                }
            }

            if (sections.isEmpty()) {
                Column(
                    modifier = Modifier
                        .align(Alignment.Center)
                        .padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("未找到城市", style = MaterialTheme.typography.titleLarge)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text("换个关键词试试", color = Color(0xFF667085))
                }
            }
        }
    }
}

private fun cityInitial(city: String): Char {
    val latin = HanToLatin.transliterate(city).uppercase(Locale.ROOT)
    val firstLetter = latin.firstOrNull { it in 'A'..'Z' }
    return firstLetter ?: '#'
}

private fun citySortKey(city: String): String {
    return HanToLatin.transliterate(city).lowercase(Locale.ROOT)
}
