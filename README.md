## Bitcoin Block Time Analyze
### Features

- Get block infomation of bitcoin network and store them in database.
- Analyze block time.

### Usage
#### Setup database
- Install PostgreSQL v14.x
- Create database called `blocktime_db`
- Execute dump file `/sql_dump/block_history_structure.sql`

#### Install dependencies
`$ npm install`

#### Get block info
`$ npm getblock`

#### Analyze block time
`$ npm analyze {{threshold}} {{milestone}}

The script returns two results as json files.
 * Result #1 (```/output/block_time.json```): List of Block # and block time which is over threshold block time
 * Result #2 (```/output/average_time.json```): List of average block time every milestone
 
 ##### example
 	`$ npm analyze 7200 5000`
	`$ npm analyze 3600 10000`


##### End