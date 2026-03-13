const appName = 'api-7004';
const logPath = './pm2_logs/';
const maxOldSpaceSize = 512;
const maxMemoryRestart = '512M';

module.exports = {
  apps: [
    {
      name: appName,
      interpreter_args: `--max-old-space-size=${maxOldSpaceSize}`,
      script: 'dist/main.js', // 直接运行编译后的入口
      interpreter: 'node',
      exec_mode: 'cluster',
      instances: 2,
      autorestart: true,
      watch: false,
      merge_logs: true,
      error_file: logPath + 'err.log',
      out_file: logPath + 'out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss:SSS',
      min_uptime: 100,
      max_memory_restart: maxMemoryRestart,
      env: {
        NODE_ENV: 'production',
        STARTCONFIG: 'bootstrap-tiger',
        PORT: 7004,
      },
    },
  ],
};
