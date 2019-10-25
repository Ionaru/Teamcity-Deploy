#!/usr/bin/env node

import { deploy } from './index';

if (process.argv.length < 4) {
    throw new Error('Both "host" and "buildType" parameters must be provided.');
}

const host = process.argv[2];
if (!host || !host.length) {
    throw new Error('A valid "host" parameter must be provided.');
}

const buildType = process.argv[3];
if (!buildType || !buildType.length) {
    throw new Error('A valid "host" parameter must be provided.');
}

const apiKey = process.argv[4] || process.env.TEAMCITY_API_KEY;
if (!apiKey || !apiKey.length) {
    throw new Error('A Teamcity API key must be provided through a command argument or the "TEAMCITY_API_KEY" environment variable.');
}

deploy(host, buildType, apiKey).then(() => {
    process.exit(0);
}).catch((message) => {
    process.stderr.write(message + '\n');
    process.exit(1);
});
