'use strict';

const fs = require('fs');
const https = require('https');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}

async function getTeams(year, k) {
    // write your code here
    // API endpoint template: https://jsonmock.hackerrank.com/api/football_matches?competition=UEFA%20Champions%20League&year=<YEAR>&page=<PAGE_NUMBER>

    const result = [];
    const store = new Map();
    let page = 0;
    let totalPages = 1;

    while (++page <= totalPages) {
        const options = {
            hostname: 'jsonmock.hackerrank.com',
            path: `/api/football_matches?competition=UEFA%20Champions%20League&year=${year}&page=${page}`,
            port: 443,
            method: 'GET',
        };
        totalPages = await getData(options, store);
    }

    for (const [key, value] of store.entries()) {
        if (k <= value) {
            result.push(key);
        }
    }

    result.sort();

    return result;
}

async function getData(options, store) {
    return new Promise((resolve, reject) => {
        https.get(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', function() {
                const obj = JSON.parse(data);

                processData(obj.data, store);

                resolve(obj.total_pages);
            });
        }).on('error', (e) => {
            reject(e);
        });
    });
}

function processData(matches, store) {
    for (const match of matches) {
        store.set(match.team1, 1 + (store.has(match.team1) ? store.get(match.team1) : 0));
        store.set(match.team2, 1 + (store.has(match.team2) ? store.get(match.team2) : 0));
    }
}

async function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const year = parseInt(readLine().trim());
    const k = parseInt(readLine().trim());

    const teams = await getTeams(year, k);

    for (const team of teams) {
        ws.write(`${team}\n`);
    }
}
