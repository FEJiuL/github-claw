# .agents 目录说明

`.agents/` 是 AI 代理的专属工作目录，用于存放可复用的技能、工具链、配置和运行时数据。

## 📂 目录结构

```
.agents/
├── DIRECTORY.md          # 本文件：目录说明
├── skills/               # 🎯 项目级技能库（核心）
│   ├── SKILLS-INDEX.md   # 技能索引与管理
│   ├── SKILL-TEMPLATE.md # 技能编写模板
│   └── <skill-name>/     # 单个技能目录
│       ├── SKILL.md      # 技能定义（必需）
│       ├── [支持脚本]
│       ├── [配置文件]
│       └── [模板文件]
├── configs/              # 🔧 代理配置文件（可选）
│   └── [配置文件]
├── tools/                # 🛠️ 工具脚本（可选）
│   └── [工具脚本]
└── data/                 # 📊 运行时数据（可选）
    └── [数据文件]
```

---

## 📖 各部分说明

### `skills/` — 技能库（核心）

**用途**：存放所有可复用的技能模块

**管理方式**：
- 每个技能占用一个独立目录
- 每个技能目录必须包含 `SKILL.md`
- 支持文件（脚本、模板、配置）与 `SKILL.md` 同目录
- 使用 `SKILLS-INDEX.md` 维护全局技能清单

**示例**：
```
skills/
├── code-review/
│   ├── SKILL.md
│   ├── pr-checklist.md
│   └── review-template.md
├── doc-writing/
│   ├── SKILL.md
│   ├── structure.md
│   └── style-guide.md
└── web-research/
    ├── SKILL.md
    └── search-operators.md
```

**更新频率**：持续，每次新增或修改技能时更新

---

### `configs/` — 配置文件（可选）

**用途**：存放代理级别的全局配置

**示例内容**：
- API 密钥或认证信息（参考）
- 工具链配置
- 默认参数设置

**约定**：
- 敏感信息不提交到 Git（使用 `.gitignore`）
- 使用 `.example` 后缀显示配置模板
- 在 `configs/README.md` 中说明各配置文件的用途

---

### `tools/` — 工具脚本（可选）

**用途**：存放代理常用的辅助脚本

**示例内容**：
- 文件处理脚本
- 数据转换脚本
- 自动化工具

**约定**：
- 脚本应该是独立的、可复用的
- 每个脚本文件包含清晰的说明注释
- 脚本应通过版本控制系统跟踪

---

### `data/` — 运行时数据（可选）

**用途**：存放代理执行过程中产生的临时数据

**示例内容**：
- 缓存数据
- 执行日志
- 中间结果

**约定**：
- 敏感数据不提交到 Git
- 定期清理过期数据
- 在 `.gitignore` 中排除大型或临时文件

---

## 🔄 工作流

### 发现阶段
1. 检查 `.agents/skills/SKILLS-INDEX.md` 是否有相关技能
2. 如有，打开对应技能的 `SKILL.md` 文件
3. 如无，搜索外部技能来源

### 安装阶段
1. 创建新技能目录：`mkdir -p .agents/skills/<skill-name>/`
2. 保存 `SKILL.md` 和支持文件
3. 更新 `SKILLS-INDEX.md`

### 使用阶段
1. 加载技能 `SKILL.md` 了解工作流程
2. 按步骤执行任务
3. 记录执行情况到 `memory/DAILY.md`

### 改进阶段
1. 收集使用反馈
2. 更新技能文件
3. 更新 `SKILLS-INDEX.md` 中的记录

---

## 📋 快速参考

| 项目 | 位置 | 用途 | 必需 |
|------|------|------|------|
| 技能库 | `skills/` | 存放可复用技能 | ✅ |
| 技能索引 | `skills/SKILLS-INDEX.md` | 维护技能清单 | ✅ |
| 技能模板 | `skills/SKILL-TEMPLATE.md` | SKILL.md 编写模板 | ��� |
| 单个技能 | `skills/<skill-name>/SKILL.md` | 技能定义 | ✅ |
| 配置文件 | `configs/` | 代理配置 | ❌ |
| 工具脚本 | `tools/` | 辅助脚本 | ❌ |
| 运行时数据 | `data/` | 临时数据 | ❌ |

---

## 💡 最佳实践

✅ **结构清晰** — 每个技能独立目录，SKILL.md 作为入口  
✅ **命名规范** — 使用小写英文 + 连字符（如 `code-review`、`web-search`）  
✅ **索引完整** — 及时更新 SKILLS-INDEX.md，保持清单准确  
✅ **文档优先** — SKILL.md 内容完整、示例清楚、FAQ 齐全  
✅ **版本追踪** — 在 SKILL.md 中维护版本历史和修改记录  
✅ **来源透明** — 所有技能文件顶部都标注来源和安装时间  

---

## 📞 相关文档

- [AGENTS.md](../AGENTS.md) — AI 助手角色与工作规范（包含详细的技能工作流）
- [MEMORY.md](../MEMORY.md) — 长期记忆和重要发现
- [memory/DAILY.md](../memory/DAILY.md) — 日志与临时记录

---

**更新时间**：2026-05-30  
**版本**：1.0
