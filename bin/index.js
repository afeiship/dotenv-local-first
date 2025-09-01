#!/usr/bin/env node

import { Command, Option } from 'commander';
import { createRequire } from 'module';

const __dirname = new URL('../', import.meta.url).pathname;
const require = createRequire(__dirname);
const pkg = require('./package.json');
const program = new Command();

program.version(pkg.version);
program
  .addOption(new Option('-v, --verbose', 'show verbose log'))
  .addOption(new Option('-f, --force', 'force to create'))
  .addOption(new Option('-c, --city <string>', 'weather of city').choices(['wuhan', 'shanghai']))
  .parse(process.argv);

/**
 * @help: dotenv-local-first -h
 * @description: dotenv-local-first -f
 */

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
    // 相当于: node <script> <scriptArgs>
    // 获取要执行的脚本路径
    const script = this.args[0];
    // 获取脚本参数
    const scriptArgs = this.args.slice(1);
    // 使用 node 子进程执行脚本，并继承当前终端的输入输出
    const child = spawn('node', [script, ...scriptArgs], { stdio: 'inherit' });
    // 子进程退出时，主进程也以相同的退出码退出
    child.on('exit', (code) => process.exit(code));
  }
}

new CliApp().run();
