package com.example.ctrip_android.ui.pages

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.ctrip_android.data.model.AuthSession
import com.example.ctrip_android.data.model.SearchForm
import com.example.ctrip_android.data.repository.MockHotelRepository

private object AppRoute {
    const val Auth = "auth"
    const val Home = "home"
    const val HotelList = "hotel_list"
    const val CitySelect = "city_select"
    const val HotelDetail = "hotel_detail/{hotelId}"
    const val HotelDetailPrefix = "hotel_detail"
}

@Composable
fun CtripApp() {
    val navController = rememberNavController()
    var authSession by remember { mutableStateOf<AuthSession?>(null) }
    val now = remember { System.currentTimeMillis() }
    var form by remember {
        mutableStateOf(
            SearchForm(checkInDateMillis = now, checkOutDateMillis = now + 24L * 60L * 60L * 1000L)
        )
    }

    NavHost(
        navController = navController,
        startDestination = if (authSession == null) AppRoute.Auth else AppRoute.Home
    ) {
        composable(AppRoute.Auth) {
            AuthPageScreen(
                onLoginSuccess = { session ->
                    authSession = session
                    navController.navigate(AppRoute.Home) {
                        popUpTo(AppRoute.Auth) { inclusive = true }
                    }
                }
            )
        }

        composable(AppRoute.Home) {
            HomePageScreen(
                form = form,
                onFormChange = { form = it },
                onSearch = { navController.navigate(AppRoute.HotelList) },
                onCityClick = { navController.navigate(AppRoute.CitySelect) },
                onBannerClick = { navController.navigate("${AppRoute.HotelDetailPrefix}/$it") }
            )
        }

        composable(AppRoute.HotelList) {
            HotelListPageScreen(
                form = form,
                onFormChange = { form = it },
                onBack = { navController.popBackStack() },
                onCityClick = { navController.navigate(AppRoute.CitySelect) },
                onHotelClick = { navController.navigate("${AppRoute.HotelDetailPrefix}/$it") }
            )
        }

        composable(AppRoute.CitySelect) {
            CitySelectPageScreen(
                form = form,
                onFormChange = { form = it },
                onBack = { navController.popBackStack() }
            )
        }

        composable(
            route = AppRoute.HotelDetail,
            arguments = listOf(navArgument("hotelId") { type = NavType.IntType })
        ) {
            val hotelId = it.arguments?.getInt("hotelId") ?: -1
            var hotel by remember(hotelId) { mutableStateOf(MockHotelRepository.findById(hotelId)) }
            var loading by remember(hotelId) { mutableStateOf(true) }

            LaunchedEffect(hotelId) {
                loading = true
                // 先用列表缓存秒开，再异步请求详情接口补全 rooms/description 等字段。
                hotel = MockHotelRepository.getHotelDetail(hotelId) ?: hotel
                loading = false
            }

            when {
                hotel != null -> {
                    HotelDetailPageScreen(
                        hotel = hotel!!,
                        form = form,
                        onBack = { navController.popBackStack() }
                    )
                }

                loading -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator()
                    }
                }

                else -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text("酒店信息加载失败")
                    }
                }
            }
        }
    }
}
