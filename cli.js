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
	`);
	process.exit(1);
}

const getHostName = url => {
	const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
	if (match !== null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
		return match[2];
	}
	return url;
};

dns.lookup('downforeveryoneorjustme.com', err => {
	if (err) {
		logUpdate(`\n${chalk.red.bold('›')} ${chalk.dim('Please check your internet connection!')}\n`);
	} else {
		logUpdate();
		spinner.text = 'Please wait';
		spinner.start();

		const url = getHostName(arg);

		got(`http://downforeveryoneorjustme.com/${url}`).then(res => {
			const a = res.body;
			const b = a.split('<div id="container">')[1].split('<a')[0].split('</h1>')[1].trim();

			if (b === `It's just you.`) {
				logUpdate(`\n ${chalk.cyan.bold('✔')} No kidding. It's up!\n`);
			} else {
				logUpdate(`\n ${chalk.red.bold('✖')} Can't do anything. It's down!\n`);
			}
			spinner.stop();
		});
	}
});
