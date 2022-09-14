const axios = require("axios").default;
const knex = require('knex')({
    client: 'pg',
    version: '7.2',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : '123456',
      database : 'blocktime_db'
    }
});

const BTC_API = 'https://chain.api.btc.com/v3/block';
let apiOptions = {
    method: 'GET',
    url: '',
    headers: {
      Accept: 'application/json'
    }
};

function getBlockInfo(height) {
    return new Promise((resolve, reject) => {        
        let options = Object.assign({}, apiOptions);
        options.url = `${BTC_API}/${height}`;
        console.log(options);

        axios(options).then(function (response) {
            // console.log(response);
            let data = response.data;
            console.log(data);

            if (data.err_code == 0) {
                data = data.data;
                data.block_timestamp = data.timestamp;
                delete data.timestamp;

                knex('block_history_copy1').select('*').where({height: height}).then(function(rows) {
                    if (rows.length == 0) {
                        knex('block_history_copy1').insert(data).then(function(data) {
                            resolve(height);
                        }).catch(function(e) {
                            reject(`ERROR - ${e}`);
                        });
                    }
                }).catch(function(e) {
                    reject(`ERROR - ${e}`);
                });
            } else {
                console.log(`ERROR CODE- ${height}`);
                reject(`ERROR_CODE - ${height}`);
            }
        }).catch(function (error) {
            console.log(error);
        });
    });
}

(async ()=> {
    try {
        
        let begin = 0, end = 3;
        let promiseList = [];
        for (let i = begin; i <= end; i++)
            promiseList.push(getBlockInfo(i));
        
        Promise.all(promiseList).then((result) => console.log(result));

        knex.destroy();
    } catch( e ) {
        // Catch anything bad that happens
        console.error( "We've thrown! Whoops!", e );
    }

})();