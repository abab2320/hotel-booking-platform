package com.example.ctrip_android.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import com.example.ctrip_android.data.model.AuthRole
import com.example.ctrip_android.data.model.AuthSession
import com.example.ctrip_android.data.repository.MockAuthRepository
import com.example.ctrip_android.ui.components.CtripColors

@Composable
internal fun AuthPageScreen(
    onLoginSuccess: (AuthSession) -> Unit
) {
    var isLoginMode by rememberSaveable { mutableStateOf(true) }
    var email by rememberSaveable { mutableStateOf("") }
    var username by rememberSaveable { mutableStateOf("") }
    var password by rememberSaveable { mutableStateOf("") }
    var confirmPassword by rememberSaveable { mutableStateOf("") }
    var passwordVisible by rememberSaveable { mutableStateOf(false) }
    var message by remember { mutableStateOf<String?>(null) }
    var isError by remember { mutableStateOf(false) }

    fun showMessage(text: String, error: Boolean) {
        message = text
        isError = error
    }

    val inputColors = TextFieldDefaults.colors(
        focusedContainerColor = Color(0xFFF5F7FB),
        unfocusedContainerColor = Color(0xFFF5F7FB),
        disabledContainerColor = Color(0xFFF5F7FB),
        focusedIndicatorColor = Color.Transparent,
        unfocusedIndicatorColor = Color.Transparent,
        disabledIndicatorColor = Color.Transparent
    )

    Scaffold(containerColor = Color.White) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFFF5F7FB))
                        .padding(14.dp)
                ) {
                    Text("易宿酒店预订", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                    Text(
                        if (isLoginMode) "欢迎回来，请登录后继续预订" else "注册后可收藏酒店、查看订单",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color(0xFF667085)
                    )
                }
            }

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                FilterChip(
                    selected = isLoginMode,
                    onClick = {
                        isLoginMode = true
                        message = null
                    },
                    label = { Text("登录") }
                )
                FilterChip(
                    selected = !isLoginMode,
                    onClick = {
                        isLoginMode = false
                        message = null
                    },
                    label = { Text("注册") }
                )
            }

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp)
            ) {
                Column(
                    modifier = Modifier.padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    TextField(
                        value = email,
                        onValueChange = { email = it },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("请输入邮箱") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                        colors = inputColors
                    )

                    if (!isLoginMode) {
                        TextField(
                            value = username,
                            onValueChange = { username = it },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth(),
                            placeholder = { Text("用户名（3-50位字母/数字/下划线）") },
                            colors = inputColors
                        )
                    }

                    TextField(
                        value = password,
                        onValueChange = { password = it },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("请输入密码") },
                        visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                        colors = inputColors
                    )

                    if (!isLoginMode) {
                        TextField(
                            value = confirmPassword,
                            onValueChange = { confirmPassword = it },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth(),
                            placeholder = { Text("请再次输入密码") },
                            visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                            colors = inputColors
                        )
                    }

                    Text(
                        text = if (passwordVisible) "隐藏密码" else "显示密码",
                        color = CtripColors.Blue,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { passwordVisible = !passwordVisible }
                    )

                    Button(
                        onClick = {
                            if (isLoginMode) {
                                val result = MockAuthRepository.login(email = email, password = password)
                                if (result.code == 0 && result.data != null) {
                                    showMessage(result.message, false)
                                    onLoginSuccess(result.data)
                                } else {
                                    showMessage(result.message, true)
                                }
                            } else {
                                if (password != confirmPassword) {
                                    showMessage("两次输入的密码不一致", true)
                                    return@Button
                                }
                                val result = MockAuthRepository.register(
                                    email = email,
                                    username = username,
                                    password = password,
                                    role = AuthRole.MERCHANT
                                )
                                showMessage(result.message, result.code != 0)
                                if (result.code == 0) {
                                    isLoginMode = true
                                    password = ""
                                    confirmPassword = ""
                                }
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = CtripColors.Blue)
                    ) {
                        Text(if (isLoginMode) "登录" else "注册")
                    }

                    if (isLoginMode) {
                        Button(
                            onClick = {
                                val result = MockAuthRepository.resendVerification(email)
                                showMessage(result.message, result.code != 0)
                            },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color(0xFFF3F5F9),
                                contentColor = Color.Black
                            )
                        ) {
                            Text("重新发送验证邮件")
                        }
                    }
                }
            }

            message?.let {
                Text(
                    text = it,
                    color = if (isError) Color(0xFFB42318) else Color(0xFF027A48),
                    style = MaterialTheme.typography.bodyMedium
                )
            }

            Text(
                text = "说明：移动端仅提供用户注册登录，不提供管理员入口。",
                style = MaterialTheme.typography.bodySmall,
                color = Color(0xFF667085)
            )
            Spacer(modifier = Modifier.height(6.dp))
        }
    }
}
