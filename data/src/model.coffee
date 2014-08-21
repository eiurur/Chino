#init.js
mysql       = require 'mysql'
moment      = require 'moment'
DB_URI      = process.env.CLEARDB_URI || ''
DB_HOST     = process.env.DB_HOST || 'localhost'
DB_NAME     = process.env.DB_NAME || 'cocoa'
DB_USER     = process.env.DB_USER || 'chino'
DB_PASSWORD = process.env.DB_PASSWORD || 'rize'


#mysqlクライアント作成


class ClientProvider

  # 接続
  getConnection: ->
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
      UUID: 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'
      name: 'テスト'
      categoryID: 1
      url: 'http://example.com'
      createdAt: nowDate
      updatedAt: nowDate

    client = @getConnection()
    client.query "INSERT INTO stores SET ?", store, (err, data) =>
      @closeConnection client
      return

  insertCategoryTestData: (callback) ->

    nowDate = moment().format('YYYY-MM-DD HH:mm:dd')
    category =
      id: 1
      name: '飲食店'

    client = @getConnection()
    client.query "INSERT INTO categories SET ?", category, (err, data) =>
      @closeConnection client
      callback err, data

  insertInfomationTestData: (callback) ->

    nowDate = moment().format('YYYY-MM-DD HH:mm:dd')
    infomation =
      storeID: 'test'
      salesText: '(*´人｀*)'
      detailText: '<p>hshs</p><img src="http://goo.gl/kvJJEM">'
      createdAt: nowDate
      updatedAt: nowDate

    client = @getConnection()
    client.query "INSERT INTO infomations SET ?", infomation, (err, data) =>
      @closeConnection client
      return

  # お店の
  findStoreInfo: (params, callback) ->
    client = @getConnection()
    console.log '-------- findStoreInfo --------', params
    UUID = params['UUID'] || 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'
    client.query 'SELECT storeID, salesText, categories.name AS categoryName
    FROM stores LEFT JOIN infomations ON stores.id = infomations.storeID
    LEFT JOIN categories ON stores.categoryID = categories.id
    WHERE stores.UUID = ?
    ORDER BY infomations.id DESC LIMIT 1', UUID,  (err, data) =>
      @closeConnection client
      callback err, data

  #
  findStoreDetail: (params, callback) ->

exports.ClientProvider = new ClientProvider()