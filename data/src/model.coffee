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


  # SQL文実行
  executeSQL: (sql, param, callback) ->
    client = @getConnection()
    client.query sql, param,  (err, data) =>
      @closeConnection client
      callback err, data if callback?
      return


  ##
  # テストデータ格納用
  # あとで消す
  ##
  insertStoreTestData: (callback) ->

    sql = 'INSERT INTO stores SET ?'

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

    @executeSQL sql, store, callback


  insertCategoryTestData: (callback) ->

    sql = 'INSERT INTO categories (id, name) VALUES ?'

    categories = [
      [1, 'ファッション']
      [2, 'グッズ']
      [3, 'フード']
      [4, '食料品']
      [5, '雑貨']
      [6, '家具・インテリア']
      [7, 'サービス']
      [8, 'その他']
    ]

    @executeSQL sql, [categories], callback


  insertInfomationTestData: (callback) ->
    sql = 'INSERT INTO infomations SET ?'

    nowDate = moment().format('YYYY-MM-DD HH:mm:dd')
    infomation =
      UUID: my.createHash 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'
      salesText: '(*´人｀*)'
      detailText: '<p>hshs</p><img src="http://goo.gl/kvJJEM">'
      createdAt: nowDate
      updatedAt: nowDate

    @executeSQL sql, infomation, callback


  insertActiveTestData: (callback) ->
    sql = 'INSERT INTO actives SET ?'

    nowDate = moment().format('YYYY-MM-DD HH:mm:dd')
    active =
      UUID: my.createHash 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'
      deviceIDHashed: 'testtesttest'
      createdAt: nowDate
      updatedAt: nowDate

    @executeSQL sql, active, callback

  # 店舗名、セールステキスト、カテゴリ名を返す
  findStoreInfo: (params, callback) ->
    console.log '-------- findStoreInfo --------', params

    sql = 'SELECT stores.name AS storeName, salesText,
    categories.name AS categoryName
    FROM stores
    LEFT JOIN infomations ON stores.UUID = infomations.UUID
    LEFT JOIN categories ON stores.categoryID = categories.id
    WHERE stores.UUID = ?
    ORDER BY infomations.id DESC
    LIMIT 1'

    UUID = params['UUID'] ||
           my.createHash 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'

    @executeSQL sql, UUID, callback


  # 未完成
  #　店舗名、セールステキスト、詳細情報、URL、カテゴリ名、情報の作成日時・更新日時
  findStoreDetail: (params, callback) ->
    console.log '-------- findStoreDetail --------', params

    sql = 'SELECT stores.name AS storeName, salesText, detailText, url,
    categories.name AS categoryName,
    infomations.createdAt, infomations.updatedAt
    FROM stores
    LEFT JOIN infomations ON stores.UUID = infomations.UUID
    LEFT JOIN categories ON stores.categoryID = categories.id
    WHERE stores.UUID = ?
    ORDER BY infomations.id DESC
    LIMIT 1'

    UUID = params['UUID'] ||
           my.createHash 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'

    @executeSQL sql, UUID, callback


  # 現在店舗内にいる買い物客の人数を返す
  getActiveCustomerCount: (params, callback) ->
    console.log '-------- getActiveCustomer --------\n', params

    # TODO: 10秒以内
    sql = 'SELECT count(UUID) AS activeCustomerCount
    FROM actives WHERE UUID = ?'

    UUID = params['UUID'] ||
           my.createHash 'b0fc460-14a6-43a1-abcd-cb9cfddb4013'

    @executeSQL sql, UUID, callback


  # URLから直打ち、またはtelnet,sshからの不正なリクエストかどうか判定
  isValidRequest: (params, callback) ->
    console.log '-------- isValidRequest --------', params

    sql = 'SELECT count(*) FROM stores WHERE UUID = ?'

    UUID = params['UUID']

    @executeSQL sql, UUID, callback

    # UUIDHashed = params['UUIDHashed']


  # ユーザが店舗のBeacon信号を検知したこと(店舗前に通りかかる、入店、在店)をデータベースに通知(保存)
  notifyActiveCustomer: (params, callback) ->
    console.log '-------- notifyActiveCustomer --------', params

    nowDate = moment().format('YYYY-MM-DD HH:mm:dd')
    sql = "INSERT INTO actives SET ? ON DUPLICATE KEY updatedAt = #{nowDate}"

    UUID           = params['UUID'] ||
                     my.createHash 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'
    deviceIDHashed = params['deviceIDHashed']
    active =
      UUID: UUID
      deviceIDHashed: deviceIDHashed
      createdAt: nowDate
      updatedAt: nowDate

    @executeSQL sql, active, callback

  #



exports.ClientProvider = new ClientProvider()