export function isEmail(val: string) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
}

export function isStrongPassword(val: string) {
    // 至少8位，包含大小写字母和数字
    return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(val);
}

export default { isEmail, isStrongPassword };
