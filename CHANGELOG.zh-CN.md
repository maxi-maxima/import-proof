# 变更记录

## 未发布

- CI 改用基于 Node 24 的 `actions/setup-node@v7` 运行时。
- 即使 import 省略 `node:` 前缀，也会跳过 Node 内置模块。
- 移除未使用且存在漏洞的 Zod 运行时依赖。

## 0.1.0

- 首个公开版本。
- 解析 JavaScript 和 TypeScript 的 package named imports。
- 读取本地 package 类型/源码 surface。
- 报告缺失的 named exports 和缺失的 package surface。
- 提供 `scan`、`files` 和 `demo` 命令。
