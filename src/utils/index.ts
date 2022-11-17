import { decode, encode } from 'js-base64'

/**
 * 基于base64的basic auth解密
 * @param base64
 */
export function decryptBASE64AsBasicAuth(base64: string) {
  return decode(base64)
}

/**
 * 基于base64的basic auth加密
 * @param username 账号
 * @param password 密码
 */
export function encryptBASE64AsBasicAuth(username: string, password: string) {
  const key = `${username}:${password}`
  return encode(key)
}
