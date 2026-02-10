package com.example.ctrip_android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.example.ctrip_android.ui.CtripApp
import com.example.ctrip_android.ui.theme.CtripandroidTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            CtripandroidTheme {
                CtripApp()
            }
        }
    }
}
