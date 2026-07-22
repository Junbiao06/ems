# EMS API 文档

> 状态：实现前契约草案  
> Base URL：`http://localhost:4000/api`  
> 本文不使用 `/api/v1`。接口实现时以共享 Zod Contract 为数据结构的唯一事实来源，并同步更新本文。

## 1. 通用协议

### 1.1 请求

- 默认 Content-Type：`application/json; charset=utf-8`。
- 受保护接口发送 `Authorization: Bearer <access-token>`。
- JWT 保存于 `localStorage` 的 `ems_access_token`；不得放入 query、path、日志或错误消息。
- 批量员工接口提交 JSON；CSV/XLSX 原文件不上传服务器。
- 请求 body、params 和 query 均由 Zod 严格校验。

### 1.2 成功响应

单对象或动作：

```json
{
  "ok": true,
  "data": {}
}
```

分页列表：

```json
{
  "ok": true,
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

无额外数据的成功操作返回 `{"ok":true,"data":null}`，不使用空 body。

### 1.3 失败响应

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Some fields are invalid.",
    "fieldErrors": {
      "email": ["Invalid email address"]
    },
    "requestId": "req_01J..."
  }
}
```

前端通过 `code` 判断逻辑，不比较英文 message。生产错误不返回 stack、Mongo 细节、Secret、密码、OTP、token 或第三方完整响应。

### 1.4 状态码

| HTTP | 用途 |
|---:|---|
| 200 | 读取、更新或业务动作成功 |
| 201 | 资源创建成功 |
| 202 | 异步邮件/任务已接受 |
| 400 | 请求语义或一次性凭证无效 |
| 401 | JWT 缺失、非法、过期或已失效 |
| 403 | 角色或账号状态不允许 |
| 404 | 资源不存在或对当前用户不可见 |
| 409 | 唯一键、幂等或状态迁移冲突 |
| 410 | 邀请、OTP 或 proof 已过期 |
| 422 | Zod 字段校验失败 |
| 429 | 限流或尝试次数过多 |
| 500 | 未预期服务端错误 |
| 503 | 数据库、任务系统等关键依赖不可用 |

### 1.5 日期、金额和 ID

- 日期时间：带 offset 的 ISO 8601，例如 `2026-07-22T02:30:00.000Z`。
- 业务日期：`YYYY-MM-DD`，由服务器按 `Asia/Shanghai` 计算。
- 金额：CNY 整数分；`850000` 表示 8,500.00 元。
- ID：不透明字符串，只暴露 `id`。
- 每个响应回传 `X-Request-Id`；错误 body 使用同一个 requestId。

## 2. 鉴权规则

- `Public`：不需要 Authorization。
- `ADMIN`：JWT 对应 ACTIVE 管理员。
- `EMPLOYEE`：JWT 对应 ACTIVE User 且关联可用 Employee。
- `Owner`：除角色外，还必须比较资源 employeeId 与服务器从当前账号映射出的 employeeId。
- 修改/重置密码或停用账号后，旧 JWT 的 `tokenVersion` 不再匹配并返回 401。

## 3. 端点总表

所有路径均接在 `/api` 之后。

| 方法 | 路径 | 权限 | 用途 |
|---|---|---|---|
| GET | `/health` | Public | 健康检查 |
| POST | `/auth/login` | Public | 登录并返回 JWT |
| GET | `/auth/me` | Auth | 返回当前权威用户 |
| POST | `/auth/password/change` | Auth | 修改当前密码并使旧 JWT 失效 |
| POST | `/auth/invitations/inspect` | Public | 检查注册邀请 |
| POST | `/auth/registration/otp/request` | Public | 请求注册 OTP |
| POST | `/auth/registration/otp/verify` | Public | 验证注册 OTP |
| POST | `/auth/registration/complete` | Public | 使用 proof 设置密码并完成注册 |
| POST | `/auth/password-reset/otp/request` | Public | 请求重置密码 OTP |
| POST | `/auth/password-reset/otp/verify` | Public | 验证重置 OTP |
| POST | `/auth/password-reset/complete` | Public | 使用 proof 重置密码 |
| GET | `/dashboard` | Auth | 按角色返回 Dashboard |
| GET | `/employees` | ADMIN | 员工分页列表 |
| POST | `/employees` | ADMIN | 创建员工 |
| POST | `/employees/bulk` | ADMIN | 批量创建员工 |
| GET | `/employees/:id` | ADMIN | 员工详情 |
| PATCH | `/employees/:id` | ADMIN | 编辑员工 |
| PATCH | `/employees/:id/status` | ADMIN | 修改任职状态，最终语义待 P-001 |
| DELETE | `/employees/:id` | ADMIN | 仅用于误建草稿，是否开放待 P-001 |
| POST | `/employees/:id/invitation` | ADMIN | 新建或重发邀请 |
| GET | `/profile` | Auth | 当前用户资料 |
| PATCH | `/profile` | Auth | 修改本人允许字段 |
| GET | `/attendance/me` | EMPLOYEE | 本人考勤 |
| POST | `/attendance/check-in` | EMPLOYEE | 签到 |
| POST | `/attendance/check-out` | EMPLOYEE | 签退 |
| GET | `/attendance` | ADMIN | 组织考勤 |
| GET | `/attendance/:id` | ADMIN/Owner | 考勤详情 |
| GET | `/leaves` | Auth | 按角色列出请假 |
| POST | `/leaves` | EMPLOYEE | 提交请假 |
| GET | `/leaves/:id` | ADMIN/Owner | 请假详情 |
| PATCH | `/leaves/:id/review` | ADMIN | 审批请假 |
| GET | `/payslips` | Auth | 按角色列出工资单 |
| POST | `/payslips` | ADMIN | 创建工资单 |
| GET | `/payslips/:id` | ADMIN/Owner | 工资单详情与打印数据 |
| PUT/POST | `/inngest` | Inngest signature | Inngest serve 路由，不对业务前端开放 |

JWT 无服务端 Session 时，普通“退出”由前端删除 `ems_access_token` 完成，因此暂不定义伪撤销接口。若确认要单设备立即撤销，必须增加 `jti` denylist，并同步更新认证模型与测试。

## 4. Auth

### `POST /auth/login`

请求：

```json
{
  "email": "employee@example.com",
  "password": "correct horse battery staple"
}
```

成功 200：

```json
{
  "ok": true,
  "data": {
    "accessToken": "<jwt>",
    "expiresInSeconds": 86400,
    "user": {
      "id": "user_123",
      "employeeId": "emp_123",
      "email": "employee@example.com",
      "role": "EMPLOYEE",
      "status": "ACTIVE"
    }
  }
}
```

邮箱不存在和密码错误统一返回 401 `INVALID_CREDENTIALS`。账号禁用返回 403 `ACCOUNT_DISABLED`；员工不可用返回 403 `EMPLOYEE_INACTIVE`；请求过快返回 429。

### `GET /auth/me`

成功 200 返回 `user`。每次从数据库检查 User/Employee 状态和 tokenVersion，响应头为 `Cache-Control: no-store`。

### `POST /auth/password/change`

```json
{
  "currentPassword": "old password value",
  "newPassword": "new sufficiently long password",
  "confirmPassword": "new sufficiently long password"
}
```

成功后更新 hash、passwordChangedAt 和 tokenVersion，排队发送改密通知，返回 200 null。客户端删除旧 JWT 并跳转登录。

### 邀请与注册

- `POST /auth/invitations/inspect`：body 为 `{"token":"..."}`，只返回掩码邮箱、员工名和过期时间。
- `POST /auth/registration/otp/request`：body 为 `{"invitationToken":"..."}`，成功 202 返回 challengeId、300 秒有效期和 60 秒重发等待。
- `POST /auth/registration/otp/verify`：body 为 challengeId 与 6 位 code，成功返回 10 分钟有效的一次性 verificationProof。
- `POST /auth/registration/complete`：body 为 proof、password、confirmPassword；原子创建 User、关联并激活 Employee、消费 invitation/challenge/proof，不自动登录。

### 忘记密码

`POST /auth/password-reset/otp/request` 对存在与不存在账号返回完全相同的 202 字段、状态码和文案。verify 成功返回一次性 proof；complete 成功后递增 tokenVersion，使全部旧 JWT 失效，并要求重新登录。

## 5. Employees

### `GET /employees`

Query：`page`、`pageSize`、`search`、`department`、`status`、`sort`、`order`。搜索覆盖姓名、邮箱、电话和职位；服务端必须转义 Regex。默认不显示已软删除记录。

### `POST /employees`

```json
{
  "firstName": "Alice",
  "lastName": "Chen",
  "email": "alice@example.com",
  "phone": "+86 13800000000",
  "position": "Frontend Engineer",
  "department": "Engineering",
  "joinDate": "2026-07-22",
  "basicSalaryMinor": 1200000,
  "allowancesMinor": 100000,
  "deductionsMinor": 0,
  "currency": "CNY",
  "bio": "",
  "sendInvitation": true
}
```

客户端不能提交 password、role、userId 或激活状态。创建成功返回 201 Employee DTO；邀请邮件只排队，不等待实际投递。

### `POST /employees/bulk`

body 为最多 1,000 个 Employee 输入和 `sendInvitations`。服务端重新校验内部重复与数据库冲突。任一冲突返回 409 `BULK_EMPLOYEE_CONFLICT`，fieldErrors 使用 `employees.<index>.email`，整批 createdCount 必须为 0。

成功 201 返回：

```json
{
  "ok": true,
  "data": {
    "createdCount": 2,
    "invitationsQueuedCount": 2,
    "createdEmployeeIds": ["emp_1", "emp_2"]
  }
}
```

### 更新、状态与邀请

- `PATCH /employees/:id` 只接受 allowlist 字段；空 body 为 422；邮箱修改必须同步 User 与待消费邀请。
- 离职/删除语义在 P-001 确认后定稿，不用硬删除清除历史记录。
- `POST /employees/:id/invitation` 只允许未激活员工；撤销旧邀请，创建新 token，成功返回 202。

## 6. Dashboard、Profile 与业务模块

### Dashboard

`GET /dashboard` 返回以 `role` 为判别字段的 union。管理员看到员工、部门、今日签到/迟到和待审批数量；员工看到今日考勤、当月出勤、待审批请假和最新工资单摘要。

### Profile

`GET /profile` 返回 `kind: ADMIN | EMPLOYEE` 的 union。员工 `PATCH /profile` 默认只允许 phone 与 bio；不能自行修改邮箱、角色、部门、职位、工资、状态或入职日。

### Attendance

- `POST /attendance/check-in` 使用服务器当前时间；同一 businessDate 唯一，重复为 409。
- `POST /attendance/check-out` 要求已有未签退记录；返回工作分钟、dayType 与来源。
- `/attendance/me` 只返回本人；管理员 `/attendance` 支持日期、员工、状态和分页。
- 自动签退的 18:00 后异常规则在 P-002 确认后写入最终 Contract。

### Leaves

- 创建输入：type、startDate、endDate、reason；status 固定 PENDING。
- 管理员 review 只允许 APPROVED 或 REJECTED；使用 `status=PENDING` 条件更新防并发覆盖。
- 员工访问他人的请假返回 404。

### Payslips

- 创建输入：employeeId、month、year、basicSalaryMinor、allowancesMinor、deductionsMinor、currency。
- netSalaryMinor 由服务端计算；员工 + 年 + 月唯一。
- 员工列表和详情只返回本人，猜测他人 ID 返回 404。
- 列表与详情响应使用 `Cache-Control: private, no-store`。

## 7. 正式错误码

| 模块 | code |
|---|---|
| 通用 | `VALIDATION_ERROR`, `BAD_REQUEST`, `UNAUTHENTICATED`, `TOKEN_EXPIRED`, `TOKEN_REVOKED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `INTERNAL_ERROR`, `SERVICE_UNAVAILABLE` |
| Auth | `INVALID_CREDENTIALS`, `ACCOUNT_DISABLED`, `ACCOUNT_TEMPORARILY_LOCKED`, `CURRENT_PASSWORD_INCORRECT`, `PASSWORD_POLICY_FAILED`, `PASSWORD_CONFIRMATION_MISMATCH`, `INVITATION_INVALID`, `INVITATION_EXPIRED`, `INVITATION_ALREADY_USED`, `OTP_INVALID`, `OTP_EXPIRED`, `OTP_ALREADY_USED`, `OTP_TOO_MANY_ATTEMPTS`, `OTP_RESEND_TOO_SOON`, `VERIFICATION_PROOF_INVALID_OR_EXPIRED` |
| Employee | `EMPLOYEE_NOT_FOUND`, `EMPLOYEE_INACTIVE`, `EMPLOYEE_EMAIL_EXISTS`, `USER_EMAIL_EXISTS`, `BULK_EMPLOYEE_CONFLICT`, `INVALID_DEPARTMENT`, `EMPLOYEE_ALREADY_ACTIVE`, `EMPLOYEE_NOT_INVITABLE` |
| Attendance | `ATTENDANCE_ALREADY_CHECKED_IN`, `ATTENDANCE_NOT_CHECKED_IN`, `ATTENDANCE_ALREADY_CHECKED_OUT`, `ATTENDANCE_DATE_CONFLICT`, `ATTENDANCE_NOT_FOUND` |
| Leave | `LEAVE_NOT_FOUND`, `LEAVE_DATE_IN_PAST`, `LEAVE_DATE_RANGE_INVALID`, `LEAVE_DATE_OVERLAP`, `LEAVE_ALREADY_REVIEWED`, `INVALID_LEAVE_TRANSITION` |
| Payslip | `PAYSLIP_NOT_FOUND`, `PAYSLIP_ALREADY_EXISTS`, `DEDUCTIONS_EXCEED_GROSS`, `PAYSLIP_PERIOD_INVALID` |

## 8. 文档维护规则

- 实现端点前先写/更新 Zod Schema 和测试，再写 Route/Controller/Service。
- Contract 变化必须同步后端返回、前端 parse、API 示例和测试 fixture。
- 新增可选字段通常兼容；删除字段、改类型或改枚举语义属于破坏性变化，需要先解释。
- 当前不做路径版本；发生真正不兼容升级时再与用户讨论是否引入 `/api/v2`。

