CMS AGENTS
1. 技术
Vue3 + Vite + Pinia + Vue Router

2. 登录态
登录页 → /auth/login

token 管理：Access（内存/会话）+ Refresh（安全存储或 HttpOnly Cookie 由后端策略决定）

路由守卫：无 token 跳登录；10002 统一处理

3. HTTP 适配层
基址：import.meta.env.VITE_API_BASE

统一响应拦截：code != 0 走错误分支

4. CRUD 约定
表单校验与后端一致

表格组件支持分页、筛选、批量操作