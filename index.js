/**
 * Get block infomation and store them in database
 */

const config = require('./config');
const axios = require("axios").default;
const delay = require('delay');
const knex = require('knex')(config.knex);

// BTC API endpoint
const BTC_API = 'https://chain.api.btc.com/v3/block';
let apiOptions = {
    method: 'GET',
    url: '',
    headers: {
        Accept: 'application/json'
    }
};

(async ()=> {
    try {
        
        // Get last height
        let lastHeight = await knex('block_history').max('height', {as: 'height'});
        console.log(lastHeight);
        let height;
        if (lastHeight[0]['height'] == null) {
            height = 0;
            lastHeight = -1;
        } else {
            lastHeight = lastHeight[0]['height'];
            height = lastHeight;
        }

        console.log(`Last height: ${lastHeight}`);

        let data;
        do {                                        // loop to last block
            // Call API endpoint
            console.log(`========== Height: ${height} ==========`)
            apiOptions.url = `${BTC_API}/${height}`;
            const response = await axios.request(apiOptions);
            data = response.data;
            // console.log(data);

            if (data.err_code == 0) {               // if success, store it in database
                data = data.data;
                data.block_timestamp = data.timestamp;
                delete data.timestamp;
                
                if (height == lastHeight) {         // update last block's next_block_hash
                    await knex('block_history').update(data).where({height: data.height});
                } else {
                    if (height > 0) {               // calculate block time
                        let lastBlockInfo = await knex('block_history').select('block_timestamp').where({height: height-1});
                        data.block_time = data.block_timestamp - lastBlockInfo[0]['block_timestamp'];
                    } 
                    let info = await knex('block_history').select('*').where({height: height});
                    info.length == 0 && await knex('block_history').insert(data);
                }

                height++;

            } else {                                // if error, retry it in one second
                console.log('---- DELAY ----');
                await delay(1000);
            }
        } while (data.next_block_hash != '0000000000000000000000000000000000000000000000000000000000000000');

    } catch( e ) {
        // Catch anything bad that happens
        console.error("We've thrown! Whoops!", e );
    } finally {
        knex.destroy();
    }
})();