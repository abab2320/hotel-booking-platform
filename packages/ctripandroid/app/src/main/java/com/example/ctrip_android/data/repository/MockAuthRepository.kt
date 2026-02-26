package com.example.ctrip_android.data.repository

import com.example.ctrip_android.data.model.AuthRole
import com.example.ctrip_android.data.model.AuthSession
import com.example.ctrip_android.data.model.AuthUser

object MockAuthRepository {
    private val emailRegex = Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")
    private val usernameRegex = Regex("^[A-Za-z0-9_]{3,50}$")
    private val passwordRegex = Regex("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")

    private val users = mutableListOf(
        AuthUser(
            id = 1,
            username = "merchant001",
            email = "merchant@example.com",
            role = AuthRole.MERCHANT,
            emailVerified = true
        ),
        AuthUser(
            id = 2,
            username = "admin001",
            email = "admin@example.com",
            role = AuthRole.ADMIN,
            emailVerified = true
        )
    )
    private val passwordsByEmail = mutableMapOf(
        "merchant@example.com" to "Password123!",
        "admin@example.com" to "Password123!"
    )
    private var nextUserId = 3

    data class AuthResponse<T>(
        val code: Int,
        val message: String,
        val data: T? = null
    )

    fun register(email: String, username: String, password: String, role: AuthRole): AuthResponse<AuthUser> {
        val normalizedEmail = email.trim().lowercase()
        val normalizedUsername = username.trim()

        if (!emailRegex.matches(normalizedEmail)) {
            return AuthResponse(code = 1, message = "邮箱格式不正确")
        }
        if (!usernameRegex.matches(normalizedUsername)) {
            return AuthResponse(code = 1, message = "用户名需为3-50位字母/数字/下划线")
        }
        if (!passwordRegex.matches(password)) {
            return AuthResponse(code = 1, message = "密码至少8位，且包含大小写字母和数字")
        }
        if (users.any { it.email.equals(normalizedEmail, ignoreCase = true) }) {
            return AuthResponse(code = 1, message = "邮箱已注册")
        }
        if (users.any { it.username.equals(normalizedUsername, ignoreCase = true) }) {
            return AuthResponse(code = 1, message = "用户名已存在")
        }

        val created = AuthUser(
            id = nextUserId++,
            username = normalizedUsername,
            email = normalizedEmail,
            role = role,
            emailVerified = false
        )
        users += created
        passwordsByEmail[normalizedEmail] = password
        return AuthResponse(code = 0, message = "注册成功，请前往邮箱完成验证", data = created)
    }

    fun login(email: String, password: String): AuthResponse<AuthSession> {
        val normalizedEmail = email.trim().lowercase()
        val user = users.firstOrNull { it.email.equals(normalizedEmail, ignoreCase = true) }
            ?: return AuthResponse(code = 1, message = "账号或密码错误")

        if (passwordsByEmail[normalizedEmail] != password) {
            return AuthResponse(code = 1, message = "账号或密码错误")
        }

        if (!user.emailVerified) {
            return AuthResponse(code = 1, message = "邮箱未验证，请先完成邮箱验证")
        }

        val token = "mock-token-${user.id}-${System.currentTimeMillis()}"
        return AuthResponse(code = 0, message = "登录成功", data = AuthSession(token = token, user = user))
    }

    fun resendVerification(email: String): AuthResponse<Unit> {
        val normalizedEmail = email.trim().lowercase()
        if (!emailRegex.matches(normalizedEmail)) {
            return AuthResponse(code = 1, message = "邮箱格式不正确")
        }

        val index = users.indexOfFirst { it.email.equals(normalizedEmail, ignoreCase = true) }
        if (index < 0) {
            return AuthResponse(code = 1, message = "用户不存在")
        }

        val user = users[index]
        users[index] = user.copy(emailVerified = true)
        return AuthResponse(code = 0, message = "验证邮件已发送（Mock已自动验证，可直接登录）")
    }
}
