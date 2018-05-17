import childProcess from 'child_process';
import test from 'ava';

test.cb('up', t => {
	const cp = childProcess.spawn('./cli.js', ['google.com'], {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 0);
		t.end();
	});
});

test.cb('down', t => {
	const cp = childProcess.spawn('./cli.js', ['rishigiri.com'], {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 0);
		t.end();
	});
});
