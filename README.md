# 🐴 Agent-Overseer (AI 包工头)

![OpenClaw](https://img.shields.io/badge/OpenClaw-Skill-blue)
![Node.js](https://img.shields.io/badge/Node.js-Native-green)
![Tmux](https://img.shields.io/badge/Tmux-Managed-orange)

**Agent-Overseer** (AI 包工头) 是专为 OpenClaw 打造的原生轻量级 AI 监工插件（Skill）。

当你在终端里运行 AI 编程助手（如 Codex CLI、Claude Code 等）执行大任务时，没人盯着它可能会陷入死循环、内存泄漏或者卡死。这个工具就是你的“监工”：通过底层的操作系统指令 (`tmux` + `ulimit` + 轮询) 对跑在终端里的各种 AI 编程助手进行静默托管、死锁检测与资源接管。

---

## ✨ 核心特性 (Features)

- **🚀 零侵入原生底座 (OS-Level Limits)**
  抛弃臃肿的 Docker 套娃！利用 `tmux` 挂载后台，结合 `ulimit -v 2097152` 实现操作系统级 2GB 内存硬隔离，内存泄漏直接由系统内核斩杀。
  
- **🧠 语义级“鬼打墙”拦截 (State & Semantic Monitoring)**
  告别脆弱的正则日志匹配！创新性引入基于 `tmux capture-pane` 的状态机监控。如果检测到 AI 连续轮询均在死磕同一文件或疯狂输出重复日志，立即判定为“死循环/幻觉”并进行干预。
  
- **📢 事件驱动通知 (Event-Driven Alerts)**
  拒绝流水账打卡！平时不打扰你，仅在达成里程碑产出（任务完成），或触发死锁、进程崩溃等严重阻碍时，才通过 OpenClaw 原生通道向主人的飞书发送精准警报。
  
- **🎮 隔空打牛干预通道 (Native CLI Injection)**
  无需暴露任何高危 HTTP 后门。主人直接在聊天窗口发送指令，系统底层通过 `tmux send-keys` (C-c -> 注入新指令 -> C-m) 强行打断 AI 发呆，并无缝注入纠正指令。

## 🏗️ 架构哲学 (v2.0)

本项目在设计上极度克制，严格遵守 **防呆红线 (四不交)**：
绝对禁止提交敏感凭证（`.env`, Key）、编译依赖/产物（`node_modules`）、运行日志/测试数据及系统/IDE文件。

## 📦 安装与使用

由于本项目完美契合 OpenClaw 生态，直接将其作为原生技能即插即用：

```bash
cd ~/.openclaw/workspace-fitness/skills
git clone https://github.com/tanhhhh4/agent-overseer.git
```

激活后，在 OpenClaw 聊天窗口发送指令即可：
> “小马驹，用 agent-overseer 帮我把 `codex -m gpt-5.4 --dangerously-bypass-approvals-and-sandbox exec '帮我写个贪吃蛇'` 挂到后台盯着。”

---

## 🤝 关于作者与宇宙

本项目是 **Craft 极客工具箱宇宙** 的成员。
致敬兄弟开源项目：[readme-craft (AI-powered README generator with progressive project comprehension)](https://github.com/tanhhhh4/readme-craft)。

**Created with 💻 by [tanhhhh4](https://github.com/tanhhhh4) & 小马驹 🐴**