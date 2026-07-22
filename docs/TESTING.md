# EMS 测试文档

> 目标：记录“为什么测、怎样测、实际结果是什么”，让不熟悉测试的开发者也能复现。本文会在每个实施阶段持续追加。

## 1. 测试层次

1. Contract/纯函数单元测试：最快，验证 Zod、日期、金额、Mapper 和 formatter。
2. Service 与数据库集成测试：验证业务状态、唯一索引、事务和并发。
3. API 测试：使用 Supertest 从 HTTP 输入验证到响应，不启动真实端口。
4. React 组件与 Hook 测试：验证表单、错误、loading、权限视图和文件解析。
5. 少量 E2E：只覆盖最重要的管理员到员工完整流程。

不追求形式上的 100% 覆盖率；认证、权限、OTP、金额、时区、批量零写入和状态机属于必须覆盖的高风险区域。

## 2. 每次阶段验证顺序

```text
1. typecheck
2. lint
3. unit/integration tests
4. production build
5. 必要的手工页面或邮件渲染检查
```

某一步失败就记录真实错误并修复，不能把“命令已运行”写成“验证通过”。测试必须使用独立数据库和测试邮件适配器，不能连接开发/生产数据或发送真实邮件。

## 3. 必测矩阵

### 3.1 Contracts

- 正常输入、缺少字段、边界长度、非法枚举。
- 多余/危险字段采用的 strip 或 strict 策略。
- 数字 coercion、默认值、日期和金额边界。
- API.md 中的请求/响应 fixture 能通过真实 Schema。
- 前端不能只依赖 Axios 泛型，必须实际 parse 响应。

### 3.2 JWT 与 Auth

- 正确登录返回可验证 JWT；错误邮箱与错误密码响应一致。
- 算法、issuer、audience、签名、过期时间任何一项不合法都拒绝。
- localStorage 恢复后 `/auth/me` 成功；脏值/过期 token 会被清除。
- DISABLED User、非 ACTIVE Employee、tokenVersion 不匹配均返回正确错误。
- 改密/重置后旧 JWT 失效，新密码可登录，旧密码不可登录。
- 登录和 OTP 限流；日志不包含 Authorization、密码、OTP 或原始 token。

### 3.3 邀请与 OTP

- 邀请有效、过期、撤销、已消费、重发旧 token 失效。
- OTP 正确、错误 1–4 次、第 5 次锁定、过期、重放。
- proof 正确、过期、重放；注册并发请求只创建一个 User。
- 不存在邮箱的忘记密码响应与存在邮箱完全同构。
- Inngest 敏感字段加密；Event ID 与 Resend idempotency key 稳定。
- React 邮件模板的 HTML/纯文本、链接、到期时间和用户字段转义正确。

### 3.4 Employees 与批量导入

- EMPLOYEE 访问员工管理接口为 403。
- create 拒绝 password、role、userId；邮箱大小写唯一。
- invitation 开/关与重发；ACTIVE 员工不可再次邀请。
- 邮箱修改同步关联数据；离职/停用使 JWT 失效并保留历史。
- CSV 引号逗号、引号换行、BOM、空尾行、错误 Header。
- 5 MiB、1,000/1,001 行边界；非法日期、部门与精确金额转换。
- 文件内/数据库重复邮箱显示所有对应行；有错误不发 API。
- bulk 失败零写入；成功返回数量、IDs 和正确邀请事件数。

### 3.5 Attendance

- 北京时间 09:00 和 09:00:01 边界。
- 同日并发签到唯一；未签到签退；重复签退。
- UTC 跨日但 Asia/Shanghai 同一/不同业务日。
- 工作分钟和 239/240/359/360/479/480 日类型边界。
- 自动任务重跑幂等，不覆盖手动签退；晚于 18:00 异常按最终决策处理。

### 3.6 Leave

- 过去日期、同日、逆序、重叠。
- PENDING → APPROVED/REJECTED；已审批不可再次审批。
- 两管理员并发审批只有一个成功。
- 员工读取别人记录返回 404；停用员工提交返回 403。

### 3.7 Payslip

- 整数金额和 net 精确计算；扣款超过 gross 拒绝。
- 同员工年月唯一；历史快照不随 Employee 工资变化。
- 员工只能读取本人；猜测别人 ID 返回 404；管理员可读。
- 响应包含 `Cache-Control: private, no-store`。

### 3.8 最小 E2E

1. Admin 登录。
2. 创建员工并排队邀请。
3. 员工通过邀请和 OTP 完成注册。
4. 员工登录、签到、签退。
5. 员工提交请假，Admin 审批。
6. Admin 创建工资单，员工查看与打印。
7. 员工使用 OTP 重置密码，旧 JWT 失效。

## 4. 测试数据与隔离

- 测试 MongoDB 使用独立数据库；如果业务使用事务，测试环境也必须启用 replica set。
- 每个测试创建并清理自己的数据，不依赖执行顺序。
- 时间测试注入固定时钟，不等待真实时间，也不依赖运行机器时区。
- 邮件使用 fake adapter 或 Resend mock；Inngest 函数测试不发送真实邮件。
- `.env.test` 不提交，示例值不能是真实 Secret。

## 5. 执行记录

### 2026-07-22：文档基线阶段

范围：读取两份需求说明、检查当前目录、确认参考目录状态、建立开发/API/亮点/测试文档与根 `.gitignore`。

验证结果：

| 检查 | 命令 | 结果 |
|---|---|---|
| 文档与标题结构 | `ls -la docs .gitignore`、`rg -n '^#' docs/*.md` | 通过：4 份文档和根 `.gitignore` 均存在，标题结构可检索 |
| 旧 API 前缀审计 | `rg -n '/api/v1\|Cookie\|CSRF\|Session' docs .gitignore` | 通过：`/api/v1` 只出现在“已被 `/api` 替代”的决策说明中；Cookie/Session 只出现在方案差异说明中 |
| Client lint | `npm run lint`（`client`） | 通过，exit code 0 |
| Client production build | `npm run build`（`client`） | 通过，TypeScript build 与 Vite 8.1.5 build 均成功 |
| Server quality gate | 检查 `server/package.json` | 未具备条件：当前只有 Express dependency，没有源码，也没有 lint/test/build script；不计为通过 |

本阶段没有业务代码，因此没有单元、API、组件或 E2E 测试可运行。下一阶段建立最小服务端和测试工具后再开始记录真实测试用例数量。
