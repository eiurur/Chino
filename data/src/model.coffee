#init.js
mysql       = require 'mysql'
moment      = require 'moment'
my          = require('./my').my
# SHA256sum   = require('crypto').createHash('sha256')
DB_URI      = process.env.CLEARDB_URI || ''
DB_HOST     = process.env.DB_HOST || 'localhost'
DB_NAME     = process.env.DB_NAME || 'cocoa'
DB_USER     = process.env.DB_USER || 'chino'
DB_PASSWORD = process.env.DB_PASSWORD || 'rize'


#mysqlクライアント作成


class ClientProvider

  # 接続
  getConnection: ->
    console.log DB_HOST, DB_NAME, DB_USER, DB_PASSWORD
    client = mysql.createConnection(
      host: DB_HOST
      database: DB_NAME
      user: DB_USER
      password: DB_PASSWORD
    )


  # 切断
  closeConnection: (client) ->
    client.end()


  ##
  # テストデータ格納用
  # あとで消す
  ##
  insertStoreTestData: (callback) ->

    nowDate = moment().format('YYYY-MM-DD HH:mm:dd')
    store =
      id: 'test'
      email: 'test@gmail.com'
      password: 'test'
      UUID: my.createHash 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'
      name: 'テスト'
      categoryID: 1
      url: 'http://example.com'
      createdAt: nowDate
      updatedAt: nowDate

    client = @getConnection()
    client.query 'INSERT INTO stores SET ?', store, (err, data) =>
      @closeConnection client
      return


  insertCategoryTestData: (callback) ->

    nowDate = moment().format('YYYY-MM-DD HH:mm:dd')
    category =
      id: 1
      name: '飲食店'

    client = @getConnection()
    client.query 'INSERT INTO categories SET ?', category, (err, data) =>
      @closeConnection client
      callback err, data


  insertInfomationTestData: (callback) ->


    console.log my.createHash 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'

    nowDate = moment().format('YYYY-MM-DD HH:mm:dd')
    infomation =
      UUID: my.createHash 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'
      salesText: '(*´人｀*)'
      detailText: '<p>hshs</p><img src="http://goo.gl/kvJJEM">'
      createdAt: nowDate
      updatedAt: nowDate

    client = @getConnection()
    client.query 'INSERT INTO infomations SET ?', infomation, (err, data) =>
      @closeConnection client
      return


  # 店舗名、セールステキスト、カテゴリ名を返す
  findStoreInfo: (params, callback) ->
    console.log '-------- findStoreInfo --------', params

    UUID = params['UUID'] ||
           my.createHash 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'
    client = @getConnection()
    client.query 'SELECT stores.name AS storeName, salesText,
    categories.name AS categoryName
    FROM stores LEFT JOIN infomations ON stores.UUID = infomations.UUID
    LEFT JOIN categories ON stores.categoryID = categories.id
    WHERE stores.UUID = ?
    ORDER BY infomations.id DESC LIMIT 1', UUID,  (err, data) =>
      @closeConnection client
      callback err, data


  # 未完成
  #　店舗名、詳細情報、URL、カテゴリ名、
  findStoreDetail: (params, callback) ->


  # 未完成
  # 現在店舗内にいる買い物客の人数を返す
  findActiveCustomer: (params, callback) ->
    console.log '-------- findActiveCustomer --------', params

    UUID = params['UUID'] ||
           my.createHash 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'

    client = @getConnection()
    client.query 'SELECT stores.name AS storeName, salesText,
    categories.name AS categoryName
    FROM stores LEFT JOIN infomations ON stores.UUID = infomations.UUID
    LEFT JOIN categories ON stores.categoryID = categories.id
    WHERE stores.UUID = ?
    ORDER BY infomations.id DESC LIMIT 1', UUID,  (err, data) =>
      @closeConnection client
      callback err, data


  # URLから直打ち、またはtelnet,sshからの不正なリクエストかどうか判定
  isValidRequest: (params, callback) ->
    console.log '-------- isValidRequest --------', params

    UUIDHashed = params['UUIDHashed']
    client = @getConnection()
    client.query 'SELECT count(*)
    FROM stores WHERE UUIDHashed = ?', UUIDHashed,  (err, data) =>
      @closeConnection client
      callback err, data


  # ユーザが店舗のBeacon信号を検知したこと(店舗前に通りかかる、入店、在店)をデータベースに通知(保存)
  notifyActiveCustomer: (params, callback) ->
    console.log '-------- notifyActiveCustomer --------', params

    UUID           = params['UUID'] ||
                     my.createHash 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'
    deviceIDHashed = params['deviceIDHashed']
    nowDate        = moment().format('YYYY-MM-DD HH:mm:dd')
    active =
      UUID: UUID
      deviceIDHashed: deviceIDHashed
      createdAt: nowDate
      updatedAt: nowDate

    client = @getConnection()
    client.query "INSERT INTO actives SET ?
    ON DUPLICATE KEY updatedAt = #{nowDate}", active, (err, data) =>
      @closeConnection client
      return

      callback err, data




exports.ClientProvider = new ClientProvider()