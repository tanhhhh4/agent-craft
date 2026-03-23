/**
 * AI Agent Overseer (包工头系统 2.0)
 * 纯原生轻量级接管方案 (tmux + ulimit + OpenClaw Native)
 */

const { execSync } = require('child_process');
const fs = require('fs');

class AgentOverseer {
    /**
     * 启动并托管一个 AI CLI 进程
     */
    static startTask(taskName, command, workspaceDir = process.cwd()) {
        console.log(`[Overseer] 准备拉起任务: ${taskName}`);
        
        // 核心架构 1：ulimit 资源限制 (2GB 内存) + tmux 后台托管
        const safeCommand = `ulimit -v 2097152; ${command}`;
        const tmuxCmd = `tmux new-session -d -s ${taskName} '${safeCommand}'`;
        
        try {
            execSync(tmuxCmd);
            console.log(`[Overseer] 🟢 任务已成功挂载至后台 tmux: ${taskName}`);
            this.startPolling(taskName, workspaceDir);
        } catch (error) {
            console.error(`[Overseer] 🔴 任务拉起失败:`, error.message);
        }
    }

    /**
     * 定时状态监控与语义防呆（基于文件系统 FS Level）
     */
    static startPolling(taskName, workspaceDir) {
        let sameFileCount = 0;
        let lastModifiedFile = '';
        let lastModifiedTime = 0;

        // 核心架构 2：通过文件系统的 mtime 判断进度，告别日志抓取
        setInterval(() => {
            try {
                // 1. 检查 tmux 进程是否还活着
                execSync(`tmux has-session -t ${taskName} 2>/dev/null`);

                // 2. 获取工作区最新修改的文件状态
                const latestFileStat = this.getLatestModifiedFile(workspaceDir);

                if (latestFileStat && latestFileStat.file === lastModifiedFile && latestFileStat.mtime === lastModifiedTime) {
                    sameFileCount++;
                    // 如果连续 3 次轮询（1分半钟）在死磕同一个文件且没产出，判定死锁
                    if (sameFileCount >= 3) {
                        console.log(`[Overseer] 🔴 警告！检测到 AI 连续 3 次发呆/死磕文件 (${lastModifiedFile})，陷入鬼打墙！`);
                        this.triggerAlert(taskName, `检测到鬼打墙 (文件进度停滞: ${lastModifiedFile})，请大哥介入打断！`);
                        sameFileCount = 0; // 重置计数
                    }
                } else if (latestFileStat) {
                    // 有新进展，更新记录
                    lastModifiedFile = latestFileStat.file;
                    lastModifiedTime = latestFileStat.mtime;
                    sameFileCount = 0;
                }
            } catch (err) {
                console.log(`[Overseer] 🔴 发现任务进程意外结束或被 OS Killed, 发送告警并准备收尸...`);
            }
        }, 30000); // 30s 轮询
    }

    /**
     * 获取目录中最新修改的文件及其修改时间
     */
    static getLatestModifiedFile(dir) {
        try {
            // 利用系统 find 命令找寻最新文件，聪明地避开了 node_modules 和 .git
            const cmd = `find ${dir} -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -printf '%T@ %p\\n' | sort -n | tail -1`;
            const output = execSync(cmd).toString().trim();
            if (!output) return null;
            
            const [mtime, ...fileParts] = output.split(' ');
            return { 
                mtime: parseFloat(mtime), 
                file: fileParts.join(' ') 
            };
        } catch (e) {
            return null;
        }
    }

    static triggerAlert(taskName, message) {
        // 核心架构 3：事件驱动精准推送
        console.log(`[Overseer 飞书推送] 任务 ${taskName}: ${message}`);
    }

    /**
     * 核心架构 4：远程干预接口 (OpenClaw 原生通道触发)
     */
    static injectCommand(taskName, userCommand) {
        console.log(`[Overseer] 收到干预指令，准备注入: ${userCommand}`);
        try {
            // 发送 Ctrl+C 打断当前进程
            execSync(`tmux send-keys -t ${taskName} C-c`);
            execSync('sleep 1'); // 缓冲
            // 强塞入新指令并回车
            execSync(`tmux send-keys -t ${taskName} "${userCommand}" C-m`);
            console.log(`[Overseer] 🟢 指令注入成功!`);
        } catch (error) {
            console.error(`[Overseer] 🔴 指令注入失败:`, error.message);
        }
    }
}

module.exports = AgentOverseer;