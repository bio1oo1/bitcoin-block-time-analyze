/**
 * Command: node analyze.js {{threshold(in second)}} {{milestone}}
 * 
 * The script returns two results as json files.
 * Result #1 (/output/block_time.json): List of Block # and block time which is over threshold block time
 * Result #2 (/output/average_time.json): Average block time every milestone
 */

const config = require('../config');
const fs = require('fs');
const knex = require('knex')(config.knex);

(async ()=> {
    try {

        // Check arguement validation
        const args = process.argv.slice(2);
        let invalidArg;
        if (args.length != 2)
            invalidArg = true;
        args[0] = Number(args[0]);
        args[1] = Number(args[1]);

        if (!Number.isInteger(args[0]) || !Number.isInteger(args[1]) || args[0] <= 0 || args[1] <= 0)
            invalidArg = true;

        if (invalidArg) {
            console.log('Invalid Argument');
            process.exit(1);
        }

        // Get total count of blocks from DB
        let totalCount = await knex('block_history').count('*');
        totalCount = Number(totalCount[0]['count']);

        // Get overtimed block list
        let query = `
            SELECT height, block_timestamp, block_time
            FROM block_history
            WHERE block_time IS NOT NULL AND block_time > ${args[0]}
            ORDER BY height ASC
        `;
        let result = await knex.raw(query);
        let rows = result.rows;

        // Get total average block time
        query = `
            SELECT AVG(block_time) AS avg_time
            FROM block_history
            WHERE block_time IS NOT NULL
        `;
        result = await knex.raw(query);

        let totalAverageTime = Number(result.rows[0]['avg_time']).toFixed(2);

        // Output Result#1
        let json = {
            total_blocks: totalCount,
            average_block_time: totalAverageTime,
            overtime_count: rows.length,
            overtime_blocks: rows
        }

	    fs.writeFileSync(`./output/block_time.json`, JSON.stringify(json, null, '\t'));

        // Get average block time for every milestone
        let offset = 0;
        const limit = parseInt(args[1]);
        json = {
            "total_average_time": totalAverageTime
        };

        while (offset <= totalCount) {
            console.log(`offset: ${offset}`)
            query = `
                SELECT AVG(block_time) AS avg_time
                FROM block_history
                WHERE block_time IS NOT NULL AND height >= ${offset} AND height < ${offset + limit}
            `;
            result = await knex.raw(query);
            let endHeight = offset + limit - 1;
            endHeight = endHeight < totalCount ? endHeight : totalCount;
            const index = `${offset} - ${endHeight}`;
            json[index] = Number(result.rows[0]['avg_time']).toFixed(2);

            offset += limit;
        }

        // Output Result#2
        fs.writeFileSync(`./output/average_time.json`, JSON.stringify(json, null, '\t'));
    } catch( e ) {
        // Catch anything bad that happens
        console.error( "We've thrown! Whoops!", e );
    } finally {
        knex.destroy();
    }
})();