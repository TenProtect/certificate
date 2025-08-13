本文是面向“AI 代理/协作生成器 + 人类开发者”的任务与约束说明，用于统一三个子项目：

./backend（Spring Boot + JDK8，提供 API、JWT 登录、支付宝登录对接、数据库变更策略）

./cms-vue（Vue3 后台管理系统前端）

./miniapp/zfb-uniapp（由 uni-app 编译到支付宝小程序的前端）

0. 项目目标与约束摘要
需要一个后台管理系统（前端在 ./cms-vue，后端在 ./backend）。

需要对 ./miniapp/zfb-uniapp 进行逆向对接：后端基于该小程序的页面/数据结构来设计接口、数据库与登录态。

所有对数据表/字段的增删改查（DDL/DML 变更）必须统一在 ./backend/update.sql “覆写式”维护（即每次变更都写出完整可重放的最新脚本内容，而不是在文件尾部追加片段；若文件不存在则创建）。

每一次数据库结构变更前，必须先检查小程序内是否存在对应测试数据来源与字段（至少满足测试数据字段要求）。

后台系统登录使用 JWT；同时项目需支持支付宝登录：

在 ./miniapp/zfb-uniapp 添加/打通支付宝登录能力；

./backend 提供与支付宝的服务端对接（换取会话/绑定账户）。

所有 appId / appSecret / 支付宝密钥等配置必须置于 application 配置（application.yml / application.properties）中，而不得硬编码。

后端技术栈：Spring Boot（JDK8）；接口返回统一 JSON。

cms-vue 使用 Vue3 构建。

1. 目录结构（期望形态）
bash
复制
编辑
project-root/
├─ backend/
│  ├─ src/main/java/...         # Spring Boot 源码
│  ├─ src/main/resources/
│  │  ├─ application.yml        # 含 appId/appSecret/支付宝配置/JWT 等
│  │  └─ db/seed/seed.sql       # 初始化种子数据（可选）
│  ├─ update.sql                # 数据库结构/数据变更“覆写式”统一脚本
│  ├─ AGENTS.md                 # 后端子规范（模板见文末）
│  └─ README.md
├─ cms-vue/
│  ├─ src/                      # Vue3 前端源码
│  ├─ .env.*                    # 前端环境变量（不含敏感密钥）
│  ├─ AGENTS.md                 # CMS 子规范（模板见文末）
│  └─ README.md
└─ miniapp/
   └─ zfb-uniapp/
      ├─ pages/                 # 小程序页面
      ├─ static/                # 静态资源
      ├─ AGENTS.md              # 小程序子规范（模板见文末）
      └─ README.md
2. 参与 Agent 与职责
Agent 名称	职责	输入	输出	关键约束
BackendAgent	设计/实现 REST API、数据库、JWT、支付宝服务端对接	小程序页面字段、update.sql 约束、配置项	Spring Boot 代码、统一 JSON 接口、update.sql	JDK8；统一 JSON；变更前检查小程序数据字段
MiniappAgent	在 zfb-uniapp 中实现页面/登录流程（含支付宝登录）与测试数据	页面原型、后端接口契约	可编译支付宝小程序的前端；页面测试数据	测试数据字段需覆盖后端表结构最小需求
CMSAgent	使用 Vue3 构建管理端，完成登录态、权限路由、CRUD 界面	后端接口契约与返回 JSON	CMS 页面与组件、接口适配层	前端环境变量不包含密钥；JWT 放在内存/安全存储
DBAgent	统一维护 backend/update.sql（覆写式），并做字段/表变更评审	小程序测试数据、已存在表结构	最新、完整可重放的 SQL 文件	所有 DDL/DML 变更必须先校验小程序字段
AuthAgent	设计 JWT 与支付宝登录端到端流程（token 生命周期、刷新）	配置项、业务登录需求	鉴权中间件、登录/刷新接口	密钥放 application 配置；HTTP 只传短期 token
QAAgent	为后端与前端提供接口/页面用例与自动化测试清单	API 契约、页面流程	Postman/HTTP 测试集、E2E 用例建议	覆盖 JWT、支付宝登录、CRUD、容错场景

3. 跨项目工作流（强约束）
3.1 数据结构变更流程（必须遵守）
在小程序中定位/补充测试数据

确认 ./miniapp/zfb-uniapp 相应页面/表单/Mock 数据至少包含拟新增/修改字段。

在 ./backend/update.sql “覆写式”写出完整最新脚本

不允许在文件尾部只追加增量版本；而是写出完整可重建当前数据库状态的脚本（包含建库/建表/默认数据/索引/约束等）。

在后端实体与 API 契约中同步字段

Entity/DTO/Mapper/校验规则一并更新；统一 JSON 字段命名遵循 lower_snake 或 lowerCamel（择一并全局统一）。

在 CMS 中同步 CRUD 页面与校验

新增/编辑表单校验与后端一致；列表列头、筛选器同步。

通过用例校验

QAAgent 更新接口/页面用例；覆盖 JWT 失效、权限不足、字段缺失等容错。

检查清单（每次提交前必须满足）

 miniapp 已存在或补充了覆盖拟变更字段的测试数据

 backend/update.sql 已“覆写”为最新完整脚本

 后端实体/DTO/校验/Mapper 同步

 CMS 界面/表单/校验同步

 新增/变更的接口有至少 1 条正向与 1 条负向自动化用例

3.2 登录与鉴权统一流程
后台（CMS）登录：用户名/密码 → 后端 /auth/login → JWT（Access + Refresh）。

小程序（支付宝）登录：

小程序获取 authCode →

后端 /auth/alipay 与支付宝服务端交互换 userId/会话信息 →

若首次，建立或绑定本地账号 →

返回本系统 JWT。

JWT 建议：HS256 或 RS256；accessToken 短期（如 1530 分钟），refreshToken 较长（如 730 天），支持 /auth/refresh。

4. 接口规范（统一 JSON 返回）
统一响应格式：

json
复制
编辑
{
  "code": 0,
  "message": "ok",
  "data": {}
}
字段	含义	说明
code	业务码	0 成功；非 0 为错误码（需文档化）
message	描述	人类可读错误/提示
data	负载	对象/数组/分页对象等

分页结构示例：

json
复制
编辑
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [],
    "page": 1,
    "pageSize": 20,
    "total": 0
  }
}
错误码建议：

10001 参数校验失败

10002 未登录/Token 失效

10003 权限不足

200xx 业务相关错误（按模块分段）

5. 配置与密钥管理
所有敏感配置（如 appId、appSecret、支付宝公私钥、回调地址、JWT 密钥等）必须写入 application.yml（或 application.properties），并通过环境变量/外部化配置覆盖。

不得将密钥硬编码在前端中。

cms-vue 仅保存非敏感前端构建配置（如 API 基址），通过 .env.* 注入。

后端 application.yml 示例（占位）：

yaml
复制
编辑
server:
  port: 8080

security:
  jwt:
    issuer: your-app
    secret: ${JWT_SECRET:please-change}
    accessTtlMinutes: 30
    refreshTtlDays: 14

alipay:
  appId: ${ALIPAY_APP_ID:}
  appPrivateKey: ${ALIPAY_APP_PRIVATE_KEY:}
  alipayPublicKey: ${ALIPAY_PUBLIC_KEY:}
  gateway: https://openapi.alipay.com/gateway.do
  notifyUrl: https://your.domain.com/api/alipay/notify
6. 后端（Spring Boot + JDK8）要求
JDK8、Spring Boot（与 JDK8 兼容版本），建议使用分层结构：controller / service / repository（mapper） / domain / infra。

API 校验使用 javax.validation 注解（如 @NotNull、@Size）。

鉴权中间件：拦截器/过滤器统一验证 Authorization: Bearer <accessToken>；支持刷新。

日志与审计：登录/关键操作保留审计日志（用户、IP、UA、时间、接口、入参概要、结果）。

事务与异常：业务层使用声明式事务；统一异常处理器将异常映射为标准 JSON。

数据库迁移：仅使用 backend/update.sql（覆写式）作为“当前真相”，CI 可用 docker-compose + mysql 启库后执行该脚本来校验可重建性。

7. CMS（Vue3）要求
技术选型：Vue3 + 路由守卫（基于 JWT），状态管理（Pinia/Vuex 均可，推荐 Pinia）。

登录流程：提交凭证 → /auth/login → 缓存 AccessToken（内存/短期存储）与 RefreshToken（HttpOnly Cookie 或安全存储策略），路由守卫校验。

通用组件：表格、分页、筛选、表单校验、上传、富文本（如需）。

错误处理：拦截 code != 0 的响应；10002 跳转登录。

环境变量：.env.development/.env.production 配置 VITE_API_BASE 等非敏感项。

8. 小程序（uni-app → 支付宝）要求
登录：调用支付宝 my.getAuthCode（uni-app 封装 API）获取 authCode → POST /auth/alipay。

页面测试数据：每个涉及后端字段的页面，必须在 mock/ 或页面 data 中提供最小可用字段集合，用于 DB 变更前的字段存在性校验。

网络层：统一请求封装（自动附带 JWT；处理过期与重试/跳登录）。

构建：确保可编译为支付宝小程序产物，严格区分开发/生产环境 API 基址。

9. 逆向对接与契约同步建议
从 zfb-uniapp 的页面与数据结构出发，产出一份 字段清单表（页面 → 接口 → DB）。

建议在仓库根建立 /docs/contract/，包含：

fields.xlsx（或 fields.md）：页面字段 → 接口参数 → DB 字段映射

api.md：接口清单（路径、方法、入参、出参、错误码示例）

每次字段/接口变更：先改 fields.* → 小程序补测试数据 → 覆写 update.sql → 更新后端实体/DTO → 更新 CMS → 跑用例。

10. 代码风格与提交规范（简要）
提交信息：feat: ... / fix: ... / refactor: ... / chore: ... / docs: ... / db: ...（涉及 update.sql 的变更以 db: 开头）。

严禁提交密钥与 .env.production。

PR 必须通过：构建、单测（如有）、update.sql 可重建校验脚本、小程序字段检查脚本（可后续补充）。

11. 测试清单（最小保障）
Auth：登录成功/失败、过期刷新、登出、权限不足访问受限接口。

CRUD：列表/详情/新增/修改/删除 + 非法入参校验。

支付宝登录：authCode 缺失/无效、首次绑定、重复登录、签名校验失败。

跨端一致：小程序与 CMS 对同一资源的显示/编辑一致性。

DB 可重建：空库执行 update.sql 可完全起库 + 基础数据可用。

12. 子项目需要各自维护子 AGENTS.md（强烈建议）
./backend/AGENTS.md：后端接口清单模板、DTO/校验约定、异常映射、JWT/刷新策略细节、支付宝网关交互点。

./cms-vue/AGENTS.md：路由/权限模型、HTTP 适配层、全局错误处理、通用表单与表格组件约定。

./miniapp/zfb-uniapp/AGENTS.md：登录流程、Mock/测试数据目录约定、网络层封装、页面字段最小集规范。

下面直接给出三个子 AGENTS.md 模板，你可以复制到各自目录按需细化。

附录 A：./backend/AGENTS.md（模板）
Backend AGENTS
1. 技术与结构
JDK8、Spring Boot（兼容 JDK8 版本）

分层：controller / service / repository / domain / infra

统一 JSON 响应，异常 → code/message

2. 鉴权
POST /auth/login（账号/密码 → access/refresh）

POST /auth/refresh（刷新）

POST /auth/logout

过滤器校验 Authorization: Bearer <token>

3. 支付宝登录
POST /auth/alipay：入参 { "authCode": "xxx" }

服务端与支付宝网关交互，校验签名，换取 userId 等，完成本地账户绑定后签发 JWT

4. 统一返回示例
json
复制
编辑
{"code":0,"message":"ok","data":{"token":"..."}}
5. DB 管理
仅维护 update.sql（覆写），可从空库重放

任何表/字段变更前，要求对应 zfb-uniapp 存在字段测试数据

6. 典型资源接口（示例）
GET /api/items、POST /api/items、PUT /api/items/{id}、DELETE /api/items/{id}

校验使用 javax.validation 注解

7. 配置
所有密钥/ID 放 application.yml（可被 env 覆盖）