#!/usr/bin/env node

import { Command, Option } from 'commander';
import { createRequire } from 'module';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const __dirname = new URL('../', import.meta.url).pathname;
const require = createRequire(__dirname);
const pkg = require('./package.json');
const program = new Command();

program.version(pkg.version);
program
  .addOption(new Option('-v, --verbose', 'show verbose log'))
  .parse(process.argv);

/**
 * @help: dotenv-local-first -h
 * @description: dotenv-local-first -f
 */

// 加载环境变量的函数
function loadEnv() {
  const mode = process.env.NODE_ENV || 'development';
  // prettier-ignore
  const files = [
    '.env', 
    `.env.${mode}`, 
    '.env.local', 
    `.env.${mode}.local`
  ];

  files.forEach((file) => {
    const filePath = path.resolve(file);
    if (fs.existsSync(filePath)) {
      dotenv.config({ path: filePath, override: true });
    }
  });
}

class CliApp {
  constructor() {
    this.args = program.args;
    this.opts = program.opts();
  }

  log(...args) {
    const { verbose } = this.opts;
    if (verbose) console.log('📗', ...args);
  }

  run() {
    // 首先加载环境变量
    loadEnv();

    this.log('Environment variables loaded');

    // 如果没有提供脚本参数，则退出
    if (this.args.length === 0) {
      this.log('No script provided. Use: dotenv-local-first <script.js>');
      return;
    }

    // 相当于: node <script> <scriptArgs>
    // 获取要执行的脚本路径
    const script = this.args[0];
    // 获取脚本参数
    const scriptArgs = this.args.slice(1);

    this.log(`Executing: node ${script} ${scriptArgs.join(' ')}`);

    // 使用 node 子进程执行脚本，并继承当前终端的输入输出
    const child = spawn('node', [script, ...scriptArgs], {
      stdio: 'inherit',
      env: process.env, // 传递已加载的环境变量
    });

    // 子进程退出时，主进程也以相同的退出码退出
    child.on('exit', (code) => process.exit(code));
  }
}

new CliApp().run();
