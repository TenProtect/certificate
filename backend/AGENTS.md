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