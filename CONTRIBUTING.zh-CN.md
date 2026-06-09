# 贡献指南

感谢你改进 Import Proof。

## 本地开发

```bash
npm install
npm run check
```

## 开发原则

- 保持检查本地化、确定性。
- 不加入模型调用。
- 源码 import 解析优先使用 AST，而不是字符串匹配。
- package surface 边界情况需要补测试。

## Pull Request

请说明：

- 最小 package fixture
- 被检查的 import 模式
- `npm run check` 的验证结果
