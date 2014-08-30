_             = require 'lodash'
moment        = require 'moment'
my            = require('./my').my
ClientProvider = require('./model').ClientProvider
s             = if process.env.NODE_ENV is "production"
  require("./production")
else
  require("./development")

exports.clearActives = ->
  do ->
    setInterval (->

      # getActiveで10秒以内のレコードだけを取得しているので
      # 10秒間隔にリセットする以下の処理は正直無駄
      #
      # 10秒ではなく、1日おきとか、1週間頻度とかもあり。
      # その時はsetIntervalではなくcronを使え
      ClientProvider.clearActives (err, data) ->
        if err then my.dump err
        my.c "delete num = " + data.affectedRows

    ), s.INTERVAL_TIME_CLEAR