#init.js
mysql       = require 'mysql'
moment      = require 'moment'
my          = require('./my').my
DB_URI      = process.env.CLEARDB_URI || ''
DB_HOST     = process.env.DB_HOST || 'localhost'
DB_NAME     = process.env.DB_NAME || 'cocoa'
DB_USER     = process.env.DB_USER || 'chino'
DB_PASSWORD = process.env.DB_PASSWORD || 'rize'


#mysqlクライアント作成


class ClientProvider

  # 接続
  getConnection: ->
    # console.log DB_HOST, DB_NAME, DB_USER, DB_PASSWORD
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

    nowDate = my.formatYMDHms()
    store =
      email: 'test@gmail.com'
      password: my.createHash 'test'
      UUID: my.createHash 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'
      name: 'テスト'
      categoryID: 1
      url: 'http://example.com'
      createdAt: nowDate
      updatedAt: nowDate

    sql = 'INSERT INTO stores SET ?'

    @executeSQL sql, store, callback


  insertCategoryTestData: (callback) ->

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

    sql = 'INSERT INTO categories (id, name) VALUES ?'

    @executeSQL sql, [categories], callback


  insertInfomationTestData: (callback) ->

    nowDate = my.formatYMDHms()
    infomation =
      UUID: my.createHash 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'
      salesText: '(*´人｀*)'
      detailText: '<p>hshs</p><img src="http://goo.gl/kvJJEM">'
      createdAt: nowDate
      updatedAt: nowDate

    sql = 'INSERT INTO infomations SET ?'

    @executeSQL sql, infomation, callback


  insertActiveTestData: (callback) ->

    nowDate = my.formatYMDHms()
    active =
      UUID: my.createHash 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'
      deviceID: 'testtesttest'
      createdAt: nowDate
      updatedAt: nowDate

    sql = "INSERT INTO actives SET ?
    ON DUPLICATE KEY update updatedAt = '#{nowDate}'"

    @executeSQL sql, active, callback


  ####### -------------------------------------------------- ########


  # 店舗名、セールステキスト、カテゴリ名を返す
  findStoreInfo: (params, callback) ->
    console.log '-------- findStoreInfo --------', params

    UUID = params['UUID'] ||
           my.createHash 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'

    sql = 'SELECT stores.name AS storeName, salesText,
    categories.name AS categoryName
    FROM stores
    LEFT JOIN infomations ON stores.UUID = infomations.UUID
    LEFT JOIN categories ON stores.categoryID = categories.id
    WHERE stores.UUID = ?
    ORDER BY infomations.id DESC
    LIMIT 1'

    @executeSQL sql, UUID, callback


  # 未完成
  #　店舗名、セールステキスト、詳細情報、URL、カテゴリ名、情報の作成日時・更新日時
  findStoreDetail: (params, callback) ->
    console.log '-------- findStoreDetail --------', params

    UUID = params['UUID'] ||
           my.createHash 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'

    sql = 'SELECT stores.name AS storeName, salesText, detailText, url,
    categories.name AS categoryName,
    infomations.createdAt, infomations.updatedAt
    FROM stores
    LEFT JOIN infomations ON stores.UUID = infomations.UUID
    LEFT JOIN categories ON stores.categoryID = categories.id
    WHERE stores.UUID = ?
    ORDER BY infomations.id DESC
    LIMIT 1'

    @executeSQL sql, UUID, callback


  # 現在店舗内にいる買い物客の人数を返す
  getActiveCustomerCount: (params, callback) ->
    console.log '-------- getActiveCustomer --------\n', params

    UUID = params['UUID'] ||
           my.createHash 'b0fc460-14a6-43a1-abcd-cb9cfddb4013'

    # TODO: 10秒以内
    sql = 'SELECT count(UUID) AS activeCustomerCount
    FROM actives WHERE UUID = ?'

    @executeSQL sql, UUID, callback


  # URLから直打ち、またはtelnet,sshからの不正なリクエストかどうか判定
  isValidRequest: (params, callback) ->
    console.log '-------- isValidRequest --------', params

    UUID = params['UUID']

    sql = 'SELECT count(*) FROM stores WHERE UUID = ?'

    @executeSQL sql, UUID, callback


  # ユーザが店舗のBeacon信号を検知したこと(店舗前に通りかかる、入店、在店)をデータベースに通知(保存)
  notifyActiveCustomer: (params, callback) ->
    console.log '-------- notifyActiveCustomer --------', params

    nowDate  = my.formatYMDHms()
    UUID     = params['UUID'] ||
               my.createHash 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'
    deviceID = params['deviceID']
    active =
      UUID: UUID
      deviceID: deviceID
      createdAt: nowDate
      updatedAt: nowDate

    sql = "INSERT INTO actives SET ?
    ON DUPLICATE KEY update updatedAt = '#{nowDate}'"

    @executeSQL sql, active, callback


  # 一定時間(10秒)BLEの反応が帰ってこない買い物客(退店)の入店情報を削除する
  clearActives: (callback) ->
    console.log '-------- clearActives --------'

    dateBefore10Seconds  = my.addSecondsFormatYMDHms '-10'

    sql = 'DELETE FROM actives WHERE updatedAt < ?'

    @executeSQL sql, dateBefore10Seconds, callback


  ##
  # クライアントサイド?
  ##

  # 新規登録
  signUp: (params, callback) ->
    console.log '-------- signUp --------'

    nowDate  = my.formatYMDHms()
    email    = params['email']
    password = params['password']
    passwordSHA256 = my.createHash password
    UUID = params['UUID']

    store =
      email: email
      password: passwordSHA256
      UUID: UUID
      createdAt: nowDate
      updatedAt: nowDate

    sql = 'INSERT INTO stores SET ?'

    @executeSQL sql, store, callback


  # ログイン
  signIn: (params, callback) ->
    console.log '-------- signIn --------'

    email = params['email']
    password = params['password']
    passwordSHA256 = my.createHash password

    emailAndPass = [email, passwordSHA256]

    console.log 'emailAndPAss', emailAndPass

    sql = 'SELECT count(*) AS userNum, id, email
    FROM stores
    WHERE email = ? AND password = ?'

    @executeSQL sql, emailAndPass, callback


  #  お店の過去の宣伝内容の一覧をリストアップ
  getLogsOfInfomation: (params, callback) ->

    console.log '-------- getLogsOfInfomation --------'

    UUID = params['UUID']

    console.log "getLogsOfInfomation UUID = ", UUID

    sql = 'SELECT id, salesText, detailText, createdAt, updatedAt
    FROM infomations
    WHERE UUID = ?
    ORDER BY infomations.id DESC'

    @executeSQL sql, UUID, callback


  deleteSessionID: (params, callback) ->

    console.log '-------- deleteSessionID --------'

    session_id = params['session_id']

    console.log "deleteSessionID = " + session_id

    sql = 'DELETE FROM sessions WHERE session_id = ?'

    @executeSQL sql, session_id, callback


  isAuthenticated: (params, callback) ->

    console.log '-------- isAuthenticated --------'

    session_id = params['session_id']

    console.log "isAuthenticated = " + session_id

    sql = 'SELECT count(*) AS userNum FROM sessions WHERE session_id = ?'

    @executeSQL sql, session_id, callback


  # 宣伝内容の簡易情報、詳細情報を登録
  registerInfomation: (params, callback) ->

    nowDate  = my.formatYMDHms()

    UUID = params['UUID']
    salesText = params['salesText']
    detailText = params['detailText']

    infomation =
      UUID: UUID
      salesText: salesText
      detailText: detailText
      createdAt: nowDate
      updatedAt: nowDate

    sql = 'INSERT INTO infomations SET ?'

    @executeSQL sql, infomation, callback


  updateStoreRestInfomation: (params, callback) ->

    console.log 'updateStoreRestinfomatiion = ', params

    nowDate  = my.formatYMDHms()

    UUID = params['UUID']
    name = params['name']
    url = params['url']
    categoryID = params['categoryID']

    store =
      name: name
      url: url
      categoryID: categoryID
      updatedAt: nowDate

    sql = 'UPDATE stores SET ? WHERE UUID = ?'

    @executeSQL sql, [store, UUID], callback


  getStoreData: (params, callback) ->

    console.log '-------- getStoreData --------'

    storeID = params['storeID']

    sql = 'SELECT name, UUID, categoryID, url FROM stores WHERE id = ?'

    @executeSQL sql, storeID, callback


  getLastInfomation: (params, callback) ->

    console.log '-------- getLastInfomation --------'

    UUID = params['UUID']

    sql = 'SELECT id, salesText, detailText, createdAt, updatedAt
    FROM infomations
    WHERE UUID = ?
    ORDER BY id DESC
    LIMIT 1'

    @executeSQL sql, UUID, callback


exports.ClientProvider = new ClientProvider()