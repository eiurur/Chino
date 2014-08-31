_            = require 'lodash'
moment       = require 'moment'
cronJob      = require('cron').CronJob
async        = require 'async'
dir          = './data/lib/'
my           = require(dir + 'my').my
# manageCron   = require(dir + 'manage-cron').manageCron
clearActives   = require(dir + 'clear').clearActives
serve        = require('./site/app').serve
s            = if process.env.NODE_ENV is "production"
  require("./data/lib/production")
else
  require("./data/lib/development")


##
# 起動時のタスク
# 1. サーバ起動
# 2.
##
tasks4startUp = [

  (callback) ->

    # 閲覧用サーバーを起動
    my.c "■ Server task start"
    serve null, "Create Server"
    setTimeout (-> callback(null, "Create! Server\n")), s.GRACE_TIME_SERVER
    return

  # , (callback) ->

  #   #
  #   my.c "■ Actives Clear Task start"
  #   # manageCron null, "Clear "
  #   clearActives null, "Clear "
  #   setTimeout (-> callback(null, "Actives Data CLEAR \n")), s.GRACE_TIME_CLEAR
  #   return

]

async.series tasks4startUp, (err, results) ->
  if err
    console.error err
  else
    console.log  "\nall done... Start!!!!\n"
  return

