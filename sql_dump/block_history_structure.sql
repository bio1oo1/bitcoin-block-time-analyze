/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : PostgreSQL
 Source Server Version : 140000
 Source Host           : localhost:5432
 Source Catalog        : blocktime_db
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 140000
 File Encoding         : 65001

 Date: 14/09/2022 10:39:41
*/


-- ----------------------------
-- Table structure for block_history
-- ----------------------------
DROP TABLE IF EXISTS "public"."block_history";
CREATE TABLE "public"."block_history" (
  "height" int8,
  "version" int8,
  "mrkl_root" text COLLATE "pg_catalog"."default",
  "bits" int8,
  "nonce" int8,
  "hash" text COLLATE "pg_catalog"."default",
  "prev_block_hash" text COLLATE "pg_catalog"."default",
  "next_block_hash" text COLLATE "pg_catalog"."default",
  "size" int8,
  "pool_difficulty" int8,
  "difficulty" int8,
  "difficulty_double" float8,
  "tx_count" int8,
  "reward_block" int8,
  "reward_fees" int8,
  "confirmations" int8,
  "is_orphan" bool,
  "is_sw_block" bool,
  "sigops" int8,
  "weight" int8,
  "extras" json,
  "stripped_size" int8,
  "block_timestamp" int8,
  "curr_max_timestamp" int8,
  "block_time" int8
)
;
