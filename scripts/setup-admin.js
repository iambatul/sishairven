#!/usr/bin/env node
/**
 * Admin Setup Script
 * 
 * Generates secure admin credentials for the Hairven admin dashboard.
 * Run this script to create the ADMIN_PASSWORD_HASH for your .env file.
 * 
 * Usage: node scripts/setup-admin.js
 */

const { createHash, randomUUID } = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function hashPassword(password, salt) {
	return createHash('sha256')
		.update(password + salt)
		.digest('hex');
}

function generateToken() {
	return randomUUID().replace(/-/g, '');
}

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║         Hairven Admin Account Setup                    ║');
console.log('╚════════════════════════════════════════════════════════╝');
console.log();

rl.question('Enter admin email address: ', (email) => {
	if (!email || !email.includes('@')) {
		console.error('❌ Invalid email address');
		rl.close();
		process.exit(1);
	}

	rl.question('Enter admin password (min 8 characters): ', (password) => {
		if (!password || password.length < 8) {
			console.error('❌ Password must be at least 8 characters');
			rl.close();
			process.exit(1);
		}

		// Generate salt and hash
		const salt = randomUUID();
		const hash = hashPassword(password, salt);
		const passwordHash = `${salt}:${hash}`;

		// Generate API token
		const apiToken = generateToken();

		console.log();
		console.log('✅ Admin credentials generated successfully!');
		console.log();
		console.log('Add these values to your .env file:');
		console.log();
		console.log('# Admin Authentication');
		console.log(`ADMIN_EMAIL=${email}`);
		console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`);
		console.log(`ADMIN_API_TOKEN=${apiToken}`);
		console.log();
		console.log('⚠️  IMPORTANT:');
		console.log('   - Keep these values secure and never commit them to git');
		console.log('   - The ADMIN_API_TOKEN is used for API access');
		console.log('   - The password hash cannot be reversed');
		console.log();
		console.log(`You can now log in at: https://sishairven.com/admin`);
		console.log();

		rl.close();
	});
});
