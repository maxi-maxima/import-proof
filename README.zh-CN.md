<div align="center">

# Import Proof

**在 TypeScript 或运行时之前，抓住幻觉式 named import。**

[English](README.md)

</div>

AI 编码 agent 经常写出看起来合理、但当前依赖版本并不存在的 import：

```ts
import { createMagicClient } from "some-sdk";
```

也许 SDK 实际导出的是 `createClient`。也许文档变了。也许 agent 发明了一个好看的 API。`import-proof` 会把 named imports 和本地 package surface 对比，提前报告不匹配。

不需要 API key。不调用模型。不联网。

## 30 秒演示

```bash
npx github:maxi-maxima/import-proof demo
```

演示会创建一个带假包的小 workspace，并写出：

```text
reports/demo/workspace/
reports/demo/import-proof.json
reports/demo/import-proof.md
```

## 扫描项目

```bash
npx github:maxi-maxima/import-proof scan --out reports/import-proof
```

## 扫描指定文件

```bash
npx github:maxi-maxima/import-proof files src/app.ts src/api.ts
```

## 检查什么

`import-proof` 使用 TypeScript compiler API 解析 JavaScript 和 TypeScript，提取 package named imports，然后从本地依赖读取 package surface：

- `package.json` 里的 `types` / `typings`
- 根级 `exports["."].types`
- `index.d.ts`
- `dist/index.d.ts`
- `src/index.ts`

它会报告：

| 检查项 | 级别 | 含义 |
| --- | --- | --- |
| `missing-named-export` | error | 本地 package surface 存在，但没有这个 named export。 |
| `package-surface-not-found` | warning | 没找到 package 或可读取的类型/源码入口。 |

## 第一版不做什么

- 不替代 `tsc`。
- 不验证 default imports。
- 不完整求值 conditional exports。
- 跳过相对路径 import 和 Node 内置模块。

这个工具的目标很窄：快速反馈一种常见 AI-agent 失败模式，即“看起来像真的依赖 API，但实际上不存在”。

## 开发

```bash
npm install
npm run check
node dist/cli.js demo --out reports/demo
npm pack --dry-run --ignore-scripts
```

## 许可证

MIT
