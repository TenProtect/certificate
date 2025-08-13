Miniapp (uni-app → 支付宝) AGENTS
1. 登录流程
获取 authCode

POST /auth/alipay 获取 JWT

保存 JWT 并发起后续请求

2. 测试数据
mock/ 或页面 data() 中维护最小字段集合，作为 DB 变更前的字段兜底

每个涉及表单/列表的页面提供一份示例数据

3. 网络层
封装请求：附带 JWT、处理 401/10002、跳登录

4. 构建
可编译到支付宝小程序；区分开发/生产 API 基址