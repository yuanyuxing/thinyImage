import { describe, expect, it } from 'vitest'
import { decryptBASE64AsBasicAuth, encryptBASE64AsBasicAuth } from '~/utils'

const result = 'YXBpOkdWN0pNd3YyV1BockZ4S1BQZk04c3BNNm4xU2ZTOGs4'
const API_KEY = import.meta.env.VITE_THINY_KEY

describe('decrypt and encrypt', () => {
  it('decrypt', () => {
    expect(decryptBASE64AsBasicAuth(result)).toEqual(`api:${API_KEY}`)
  })

  it('encrypt', () => {
    expect(encryptBASE64AsBasicAuth('api', API_KEY)).toEqual(result)
  })
})
