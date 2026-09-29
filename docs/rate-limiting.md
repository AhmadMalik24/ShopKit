# Rate Limiting

ShopKit uses [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) to protect the API from abuse.

## Current Limiters

---

All limiters live in `src/api/middleware/rateLimiter.js`.

| Limiter              | Window | Max | Applies To                 | Purpose                                |
| :------------------- | :----- | :-- | :------------------------- | :------------------------------------- |
| `globalLimiter`      | 15 min | 500 | All `/api/*`               | Safety net — normal users never hit it |
| `loginLimiter`       | 15 min | 5   | `POST /auth/login`         | Brute-force protection                 |
| `registerLimiter`    | 1 hour | 3   | `POST /auth/register`      | Anti-spam                              |
| `refreshLimiter`     | 1 hour | 30  | `POST /auth/refresh-token` | Normal use is ~4/hr                    |
| `uploadLimiter`      | 1 hour | 50  | `POST /uploads/presign`    | Prevent storage abuse                  |
| `publicOrderLimiter` | 1 hour | 20  | `POST /public/orders`      | Anti order spam                        |

---

## Response Format

When a limit is exceeded, the API returns:

```http
HTTP/1.1 429 Too Many Requests
RateLimit-Limit: 5
RateLimit-Remaining: 0
RateLimit-Reset: 900
Content-Type: application/json
```
