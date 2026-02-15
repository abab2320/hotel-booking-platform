package com.example.ctrip_android.data.model

enum class AuthRole {
    MERCHANT,
    ADMIN
}

data class AuthUser(
    val id: Int,
    val username: String,
    val email: String,
    val role: AuthRole,
    val emailVerified: Boolean
)

data class AuthSession(
    val token: String,
    val user: AuthUser
)
