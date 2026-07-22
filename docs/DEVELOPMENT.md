# EMS 开发文档

> 状态：实施基线（2026-07-22，Asia/Shanghai）  
> 项目：`ems`  
> 结构：`client` 与 `server` 前后端分离  
> 本文把 `/Users/junbiao/Desktop/未命名.md` 中的最新要求合并进主规格；冲突处以最新要求为准。

## 1. 当前项目状态

- `client` 是 React 19 + Vite + TypeScript 的默认脚手架，尚无 EMS 业务页面。
- `server` 目前只有 Express 依赖，尚无服务端源码。
- `/Users/junbiao/Desktop/ems-v1` 与 `/Users/junbiao/Desktop/ems-v2` 当前均为空目录，没有可迁移代码。
- 当前目录不是 Git 仓库；实现过程不执行 Git 命令，只在每个阶段给出建议提交信息。
- 根目录不建立运行时应用；前端、后端各自安装、启动和构建。根目录只保留仓库级文件与项目文档。

## 2. 已确认决策

| 编号 | 决策 |
|---|---|
| D-001 | 项目名称为 `ems` |
| D-002 | 使用 TypeScript；HTTP 边界使用 Zod 做运行时校验 |
| D-003 | 后端使用 Express 5 + Mongoose，分层为 Route → Middleware → Controller → Service → Model/Mapper |
| D-004 | API 统一挂载在 `/api`，不使用 `/api/v1` |
| D-005 | 登录凭证使用 JWT，并存入浏览器 `localStorage`；不使用 Cookie 或服务端 Session |
| D-006 | 前端通知统一使用 `react-hot-toast`；字段错误仍显示在表单字段附近 |
| D-007 | 邮件由 Inngest 编排、Resend 发送，模板必须使用 React/TSX 邮件组件实现 |
| D-008 | 业务时区固定为 `Asia/Shanghai`；数据库时间保存为 UTC |
| D-009 | 管理员先创建员工邀请，员工进入注册流程后才发送注册 OTP |
| D-010 | 批量导入在浏览器本地解析并逐行校验，全部通过后只向后端提交 JSON，不上传原始文件 |
| D-011 | 本期不实现 AI，也不创建无调用者的 AI 空目录 |
| D-012 | 用户自行进行 Git、分支、提交、Push 与 PR 操作 |

## 3. 仍需用户确认的业务决策

这些事项会改变数据库或关键业务逻辑，编码前必须确认。

| 编号 | 事项 | 推荐方案 | 原因 |
|---|---|---|---|
| P-001 | 离职与删除 | 离职设置 Employee 为 `TERMINATED`，同时将 User 设为 `DISABLED`，保留历史；只有误建且未激活的草稿允许软删除 | 离职不是数据删除，考勤、请假和工资单必须可追溯 |
| P-002 | 自动签退 | 工作日 23:55 扫描未签退记录；18:00 前签到者按 18:00 结算；18:00 后签到者标记异常，不虚构工作时长 | 可避免负时长和把异常晚签到误算成完整工时 |
| P-003 | 共享 Contract 位置 | 允许根目录增加 `packages/contracts`，但不增加根 `package.json`；两端通过本地包依赖使用 | 维持前后端独立启动，同时避免复制 HTTP 类型 |
| P-004 | JWT 生命周期 | 单个 access token 24 小时，不做 refresh token；过期后重新登录 | 更适合学习项目，明显少于 refresh/denylist 方案的复杂度 |
| P-005 | 第一版导入格式 | CSV 必做，XLSX 放到后续增强 | 先完成可验证的确定性导入流程，减少依赖与解析分支 |

在以上事项确认前，可以完成工程骨架、通用 Contract 和非业务页面，但不实现员工离职、自动签退或 JWT 刷新策略。

## 4. 产品范围

### 4.1 管理员

- 登录并查看组织 Dashboard。
- 创建、邀请、查询、编辑和停用员工。
- 使用固定模板批量创建员工并查看逐行错误。
- 查看组织考勤和迟到情况。
- 审批请假。
- 创建、查看和打印工资单。
- 重发邀请，接收自动签退摘要邮件。

### 4.2 员工

- 通过邀请、邮箱 OTP 和自设密码完成注册。
- 登录、退出、忘记密码、修改密码。
- 查看个人 Dashboard、资料和设置。
- 签到、签退并查看考勤历史。
- 提交请假并查看审批状态。
- 仅查看和打印自己的工资单。

### 4.3 本期不做

- AI、公开自助注册、OAuth/SSO、短信 OTP、MFA。
- 多租户、排班、定位、人脸、复杂假期余额和完整薪资引擎。
- 文件长期存储、头像上传、营销邮件、原生移动端、微服务。

## 5. 工程结构

```text
ems/
├── .gitignore
├── docs/
│   ├── API.md
│   ├── DEVELOPMENT.md
│   ├── SPARKY.md
│   └── TESTING.md
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── styles/
│   │   └── utils/
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── inngest/
│   │   ├── mappers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
└── packages/contracts/       # 待 P-003 确认
```

`client` 和 `server` 不通过根脚本启动。若批准共享 Contract，它只是本地依赖包，不把项目改成由根目录统一运行的 Workspace。

## 6. 类型与数据契约

### 6.1 类型来源

| 数据类别 | 唯一来源 |
|---|---|
| HTTP body/query/params/response 与业务枚举 | Zod Schema，再由 `z.infer`/`z.input`/`z.output` 推导 |
| MongoDB 持久化对象 | Mongoose Schema + 推导类型 |
| React Props、局部 State、Service 内部结构 | 普通 TypeScript 类型 |
| 环境变量、文件行、第三方返回 | 各自边界上的 Zod Schema |

禁止为同一 HTTP 结构同时维护 Zod Schema 和手写 interface；禁止用 `req.body as X` 或 Axios 泛型代替真实解析；禁止把 Mongoose Document 直接返回客户端。

### 6.2 通用格式

- ID 对外只叫 `id`，不暴露 `_id`、`__v`。
- 日期时间使用带时区的 ISO 8601；纯业务日期使用 `YYYY-MM-DD`。
- 时刻保存 UTC，考勤业务日按 `Asia/Shanghai` 计算。
- 金额使用整数分，例如 `850000` 表示 CNY 8,500.00。
- 列表必须分页，默认每页 20，最大 100。
- API 统一成功/失败 envelope，见 `docs/API.md`。

## 7. 后端分层

```text
Request
  → requestId / Helmet / 精确 CORS / JSON limit
  → JWT Bearer 验证
  → 角色与对象权限
  → Zod 请求校验
  → Controller
  → Service
  → Mongoose Model
  → Mapper
  → Zod 响应校验
  → Response
```

- Route 只声明路径和中间件顺序。
- Middleware 处理 JWT、角色、限流、校验和 requestId。
- Controller 只读取已验证输入、调用 Service、设置 HTTP 状态。
- Service 负责业务规则、事务、幂等和授权后的操作，不依赖 Express `req/res`。
- Mapper 显式选择 DTO 字段，不展开整个数据库对象。
- Model 负责 Schema、索引和持久化约束。

## 8. JWT 认证基线

最新要求指定 `localStorage + JWT`，因此主规格中的 Cookie、Session Model 和 CSRF 方案全部取消。

- 登录成功返回 access token 和最小用户资料。
- 前端存储键统一为 `ems_access_token`。
- API 请求使用 `Authorization: Bearer <token>`。
- 页面初始化调用 `GET /api/auth/me` 重新获取权威用户状态，不能只信任解码后的 JWT。
- 后端验证签名、算法、`iss`、`aud`、`exp` 和用户状态；员工请求还验证 Employee 任职状态。
- JWT 只承载 `sub`、`role`、`employeeId`、`tokenVersion`、`iat`、`exp`、`iss`、`aud`，不放邮箱、工资等 PII。
- 修改/重置密码、停用账号时递增 `tokenVersion`，使已有 JWT 失效。
- 普通退出只删除本地 token；如果以后要求“单设备立即撤销”，再引入 denylist，而不是伪装成无状态退出。
- Authorization Header 不会自动跨站携带，因此不使用 Cookie CSRF Token；仍必须实施 CSP、输出转义、依赖审计和严格输入校验来降低 XSS 风险。
- localStorage 会让 XSS 后果更严重，这是已接受的学习项目权衡，重要变更应在 README 中解释。

## 9. 核心数据模型

### User

`emailNormalized` 唯一；密码只存 bcrypt hash；角色为 `ADMIN | EMPLOYEE`；状态为 `ACTIVE | LOCKED | DISABLED`；保存 `tokenVersion`、登录失败计数、锁定时间和密码变更时间。

### Employee

保存人员资料、部门、职位、入职日期、整数工资字段和账号关联。邀请期状态为 `INVITED`；在职为 `ACTIVE`；离职状态待 P-001 确认。员工邮箱和 User 邮箱必须保持一致。

### RegistrationInvitation

邀请 token 只保存 SHA-256 摘要，绑定 employeeId 与邮箱，状态为 `PENDING | CONSUMED | REVOKED | EXPIRED`，默认 72 小时有效。重发时撤销旧邀请并生成新 token。

### OtpChallenge / VerificationProof

OTP 默认 6 位、5 分钟有效、最多 5 次、60 秒后可重发。验证码使用带服务端 Pepper 的 HMAC 摘要；验证成功签发 10 分钟、一次性 proof。注册与重置密码各自绑定用途、邮箱和目标对象。

### Attendance

按 `employeeId + businessDate` 唯一。保存签到/签退 UTC 时刻、`PRESENT | LATE`、整数工作分钟、日类型和 `EMPLOYEE | AUTO` 签退来源。

### LeaveApplication

类型为 `SICK | CASUAL | ANNUAL`，状态为 `PENDING | APPROVED | REJECTED`。审批使用条件更新，已审批记录不能被第二次覆盖；重叠的待审批或已批准请假默认拒绝。

### Payslip

`employeeId + year + month` 唯一。金额保存为整数分，净工资只由服务端计算。创建时保存快照，员工加薪不能改写历史工资单。

### AuditLog

记录登录、改密、员工变更、邀请、考勤、审批和工资单等高风险动作；不得记录密码、OTP、token、完整工资单或完整员工请求体。

## 10. 核心业务规则

### 邀请、注册和重置密码

管理员创建 `INVITED` 员工 → Inngest 发送邀请 → 员工打开链接并请求 OTP → 验证 OTP → 使用一次性 proof 设置密码 → 创建 User 并激活 Employee。忘记密码对存在和不存在邮箱返回完全相同的 202 结构，防止账号枚举；成功后不自动登录。

### 批量员工导入

- 固定 Header：`firstName,lastName,email,phone,department,position,joinDate,basicSalary,allowances,deductions,bio`。
- 浏览器本地用成熟 Parser 解析，处理 BOM、引号、逗号和换行。
- 最大 5 MiB、1,000 个非空行；显示每行、每字段错误和重复邮箱行号。
- 任一行错误时禁止提交；全部正确后提交 JSON。
- 服务端再次验证、一次查询数据库冲突；任何冲突整批零写入。

### 考勤

- 只有 ACTIVE 员工可以操作。
- 使用独立签到和签退端点；重复签到、未签到先签退、重复签退均返回 409。
- 北京时间 09:00 之后为迟到。
- 工作分钟用整数；240/360/480 分钟是半天、四分之三天、全天边界。
- 自动签退具体异常规则等待 P-002 确认。

### 请假

- 员工只能提交今天或未来日期，结束日期不得早于开始日期。
- 创建状态固定为 PENDING；管理员只能执行 PENDING → APPROVED/REJECTED。
- 两位管理员并发审批时只允许第一次条件更新成功。

### 工资单

- 管理员创建；员工只能读取自己的记录。
- `net = basic + allowances - deductions`，扣款超过总收入时拒绝。
- 详情响应使用 `Cache-Control: private, no-store`，打印页复用同一受保护接口。

## 11. Inngest、Resend 与 React 邮件模板

- Inngest 处理邀请、注册 OTP、重置 OTP、改密通知、自动签退和管理员摘要。
- Resend 只发送事务邮件，不使用 Broadcast。
- 邮件模板放在 `server/src/emails/templates/*.tsx`，使用 React Email 组件与 TypeScript Props；必须同时生成 HTML 与纯文本版本。
- 模板 Props 只接收发送所需的最小数据；React 默认转义仍不能替代 URL allowlist 和数据校验。
- OTP、邮箱和邀请 token 放在 Inngest 加密事件字段中；数据库只保存摘要。
- 每个事件和每次 Resend 调用都有稳定且与 payload 对应的幂等键。
- 模板可独立渲染测试，检查用户字段转义、链接、到期时间、纯文本内容和敏感数据泄漏。

## 12. 前端约束

- 路由：`/login`、`/register`、`/forgot-password`、`/dashboard`、`/employees`、`/attendance`、`/leave`、`/payslips`、`/settings`。
- AuthContext 保存权威 user、token 与 loading；刷新页面时从 localStorage 读取 token 后调用 `/auth/me`。
- 前端路由守卫仅改善体验，权限最终由后端执行。
- 所有 API 成功响应使用对应 Zod Schema 解析，失败响应使用统一 Error Schema。
- `react-hot-toast` 用于短暂反馈；字段和页面错误不能只显示 Toast。
- 列表筛选、搜索、分页写入 URL SearchParams；搜索 debounce 300ms。
- 样式使用语义 Token；保证键盘操作、明显 focus、对比度、reduced motion 和打印样式。

## 13. 安全基线

- bcrypt hash 密码；OTP/邀请/proof 只存摘要；Secret 只来自已校验环境变量。
- 精确 CORS Origin、Helmet/CSP、JSON body limit、登录与 OTP 双维度限流。
- 所有 Mongo filter/update 从允许字段构造；正则搜索转义；禁止 mass assignment。
- 工资单、考勤、请假详情都做对象级授权，越权对象统一返回 404。
- 日志不包含 Authorization、密码、OTP、原始 token、完整工资或批量员工 PII。
- 依赖安装前核对官方最新文档和实际兼容性；发现版本冲突时先向用户说明并确认。

## 14. 分阶段实施

1. 文档与决策基线：当前阶段。
2. 前后端质量工具与最小 `/api/health`：TypeScript strict、Lint、Vitest、build 全通过。
3. 共享 Contract 与 API 基础：Zod、response envelope、requestId、AppError、前端响应解析。
4. JWT 登录：User、seed admin、login/me、AuthContext、路由守卫、限流。
5. 邀请与注册 OTP：Employee/Invitation/Otp/Proof、React 邮件模板、Inngest/Resend。
6. 找回密码、设置与 Profile。
7. 员工管理与批量导入。
8. Dashboard、考勤与自动签退。
9. 请假。
10. 工资单。
11. UX、可访问性、安全和发布验收。

每个阶段必须报告：完成内容、变更文件、验证命令与结果、已知限制、建议 Git message 和建议 PR 标题；实现窗口不执行 Git。

## 15. 完成标准

- 前后端 strict TypeScript、Lint、测试和生产构建全部通过。
- HTTP 请求与响应均通过 Zod；没有重复 API 类型或原始 Mongoose 输出。
- `/api` 文档与实现一致，所有错误带稳定 code 与 requestId。
- 认证、越权、OTP 重放、邀请重放、批量零写入、时区、金额与并发状态均有测试。
- localStorage 键、JWT Claims、退出和失效行为与本文一致。
- React 邮件模板、Inngest 加密事件和 Resend 幂等键均有测试。
- `.env.example`、README、API、测试记录与实际代码保持同步。

