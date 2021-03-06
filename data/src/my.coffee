util   = require 'util'
moment = require 'moment'
crypto = require 'crypto'

my = ->

  c: (desciption, str) ->
    desciption = desciption || ''
    str = str || ''
    console.log "#{desciption}: #{str}"

  e: (desciption, str) ->
    desciption = desciption || ''
    str = str || ''
    console.error "#{desciption}: #{str}"

  dump: (obj) ->
    console.log util.inspect(obj,false,null)

  # _.includeではNGキーワードが文字列に含まれているか検査することができないので別に作成
  # hash_tagにNGキーワードが１つでも含まれていたらtrueを返す
  #
  # !array　としている理由は、everyメソッドは作成した条件に合わなかった時点で関数を終了させてfalseを返すため
  # 真偽値を反転させないと関数名にそぐわなくなるから
  include: (array, str) ->
    !array.every (elem, idx, array) ->
      str.indexOf(elem) is -1

  createParams: (params) ->
    ("#{k}=#{v}" for k, v of params).join('&')
    # => 'key=apikey&code=01234&start=0&rows=0'

  # UNIXTIMEを返す
  # 引数なし -> 現在時刻のUNIXTIME
  # 引数あり -> 指定時刻のUNIXTIME
  formatX: (time) ->
    if time?
      moment(time).format("X")
    else
      moment().format("X")

  formatYMD: (time) ->
    if time?
      moment(new Date(time)).format("YYYY-MM-DD")
    else
      moment().format("YYYY-MM-DD")

  formatYMDHms: (time) ->
    if time?
      moment(new Date(time)).format("YYYY-MM-DD HH:mm:ss")
    else
      moment().format("YYYY-MM-DD HH:mm:ss")

  # second秒後の時刻をYYYY-MM-DD HH:mm:ss　の形式で返す
  addSecondsFormatYMDHms: (seconds, time) ->
    if time?
      moment(new Date(time)).add(seconds, 's').format("YYYY-MM-DD HH:mm:ss")
    else
      moment().add(seconds, 's').format("YYYY-MM-DD HH:mm:ss")

  # 開始時刻と終了時刻が同じ日かどうか判定
  isSameDay: (startTimeYMD, endTimeYMD) ->
    if startTimeYMD is endTimeYMD then true else false

  # ハッシュ化
  createHash: (key, algorithm) ->
    algorithm = algorithm or "sha256"
    crypto.createHash(algorithm).update(key).digest "hex"

  # 指定された文字列と生成したいサイズ数でユニークIDを生成
  # http://blog.fkei.me/2012/03/nodejs-uid.html
  createUID: (size, base) ->
    size = size or 32
    base = base or
           "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    len = base.length
    buf = []
    i = 0

    while i < size
      buf.push base[Math.floor(Math.random() * len)]
      ++i
    buf.join ""

exports.my = my()