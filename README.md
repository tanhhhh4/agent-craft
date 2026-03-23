# 🐴 Agent-Craft (AI 包工头)

![OpenClaw](https://img.shields.io/badge/OpenClaw-Skill-blue)
![Node.js](https://img.shields.io/badge/Node.js-Native-green)
![Tmux](https://img.shields.io/badge/Tmux-Managed-orange)

**Agent-Craft** 是专为 OpenClaw 打造的原生轻量级 AI 监工插件（Skill）。
它通过底层的操作系统指令 (`tmux` + `ulimit` + `fs.mtime`) 对跑在终端里的各种 AI 编程助手（如 Codex CLI、Claude Code 等）进行静默托管、死锁检测与资源接管。

---

## ✨ 核心特性 (Features)

- **🚀 零侵入原生底座 (OS-Level Limits)**
  抛弃臃肿的 Docker 套娃！利用 `tmux` 挂载后台，结合 `ulimit -v 2097152` 实现操作系统级 2GB 内存硬隔离，内存泄漏直接由系统内核斩杀。
- **🧠 语义级“鬼打墙”拦截 (FS-Level Anti-Hallucination)**
  告别脆弱的正则日志匹配！创新性引入基于文件系统的状态机监控。如果检测到 AI 连续轮询均在死磕同一文件且 `mtime`（修改时间）停滞，立即判定为“死循环/幻觉”。
- **📢 事件驱动通知 (Event-Driven Alerts)**
  拒绝流水账打卡！仅在达成里程碑产出，或触发死循环、OS Killed 等严重阻碍时，才通过 OpenClaw 原生通道向主人的飞书发送精准警报。
- **🎮 隔空打牛干预通道 (Native CLI Injection)**
  无需暴露任何高危 HTTP 后门。主人在飞书直接下达语音/文字指令，系统底层通过 `tmux send-keys C-c` 强行打断施法，并无缝注入纠正指令。

## 🏗️ 架构哲学 (v2.0)

本项目在设计上极度克制，严格遵守 **单一职责原则 (SRP)**：
1. **坚守防呆红线 (四不交)**：底层强制隔离敏感凭证（`.env`, Key）、编译产物（`node_modules`）、日志数据及系统文件。
2. **纯粹监工定位**：Agent-Craft 只负责进程的生杀大权与行为监控，具体的业务 Code Review 任务交由其他平行 Agent (子智能体) 独立执行，实现业务解耦。

## 📦 安装与使用

由于本项目完美契合 OpenClaw 生态，直接将其克隆至 `skills/` 目录即可作为原生技能即插即用：

```bash
cd ~/.openclaw/workspace-fitness/skills
git clone https://github.com/tanhhhh4/agent-craft.git
```

激活后，在 OpenClaw 聊天窗口发送指令即可：
> “小马驹，用 agent-craft 帮我把 `codex exec '写个贪吃蛇'` 挂到后台盯着。”

---

## 🤝 关于作者与宇宙

本项目是 **Craft 极客工具箱宇宙** 的成员。
致敬兄弟开源项目：[readme-craft (AI-powered README generator with progressive project comprehension)](https://github.com/tanhhhh4/readme-craft)。

**Created with 💻 by [tanhhhh4](https://github.com/tanhhhh4) & 小马驹 🐴**