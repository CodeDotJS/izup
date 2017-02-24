#!/usr/bin/env node

'use strict';

const dns = require('dns');
const chalk = require('chalk');
const got = require('got');
const logUpdate = require('log-update');
const ora = require('ora');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const arg = process.argv[2];
const spinner = ora();

if (!arg || arg === '-h' || arg === '--help') {
	console.log(`
 Down for everyone or just me?

 ${chalk.cyan('Usage')} : izup <website>

 ${chalk.cyan('Help')}  : izup google.com

 ${chalk.dim(`Don't use http or https`)}
	`);
	process.exit(1);
}

dns.lookup('isup.me', err => {
	if (err) {
		logUpdate(`\n${chalk.red.bold('›')} ${chalk.dim('Please check your internet connection!')}\n`);
	} else {
		logUpdate();
		spinner.text = 'Please wait';
		spinner.start();

		got(`http://isup.me/${arg}`).then(res => {
			const a = res.body;
			const b = a.split('<div id="container">')[1].split('<a')[0].trim();

			if (b === `It's just you.`) {
				logUpdate(`\n ${chalk.cyan.bold('✔')} No kidding. It's up!\n`);
			} else {
				logUpdate(`\n ${chalk.red.bold('✖')} Can't do anything. It's down!\n`);
			}
			spinner.stop();
		});
	}
});
