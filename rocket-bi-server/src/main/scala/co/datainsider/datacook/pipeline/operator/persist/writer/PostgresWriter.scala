package co.datainsider.datacook.pipeline.operator.persist.writer

import com.twitter.util.logging.Logging
import datainsider.client.exception.UnsupportedError
import co.datainsider.bi.client.JdbcClient
import co.datainsider.datacook.pipeline.exception.{CreateDatabaseException, CreateTableException, DropTableException}
import co.datainsider.schema.domain.TableSchema
import co.datainsider.schema.domain.column._

class PostgresWriter(protected val client: JdbcClient, catalog: String, username: String)
    extends JDBCWriter
    with Logging {

  private def toCreateSQL(tableSchema: TableSchema): String = {
    s"""
      |CREATE TABLE ${escape(tableSchema.dbName)}.${escape(tableSchema.name)}(
      | ${toMultiColumnDDL(tableSchema.columns)}
      |);
      |""".stripMargin
  }

  private def toMultiColumnDDL(columns: Seq[Column]): String = {
    columns
      .map(toColumnDDLExpr)
      .mkString(", ")
  }

  // https://docs.oracle.com/cd/E19501-01/819-3659/gcmaz/
  // https://www.javatpoint.com/postgresql-datatypes
  // https://www.enterprisedb.com/docs/jdbc_connector/latest/11_reference_jdbc_data_types/
  private def toColumnDDLExpr(column: Column): String = {
    val dataType = column match {
      case column: BoolColumn       => "BOOL"
      case column: Int8Column       => "INT2"
      case column: Int16Column      => "INT2"
      case column: Int32Column      => "INT4"
      case column: Int64Column      => "INT8"
      case column: UInt8Column      => "integer"
      case column: UInt16Column     => "integer"
      case column: UInt32Column     => "bigint"
      case column: UInt64Column     => "bigint"
      case column: FloatColumn      => "FLOAT4"
      case column: DoubleColumn     => "FLOAT8"
      case column: StringColumn     => "VARCHAR(255)"
      case column: DateColumn       => "DATE"
      case column: DateTimeColumn   => "TIME"
      case column: DateTime64Column => "TIME"
      case _                        => throw UnsupportedError(s"This column isn't supported: ${column.getClass.getName}")
    }
    if (column.isNullable) {
      s"""${escape(column.name)} ${dataType} NULL"""
    } else {
      s"""${escape(column.name)} ${dataType} NOT NULL"""
    }
  }

  override def isTableExisted(dbName: String, tableName: String): Boolean = {
    client.executeQuery(
      """
        |SELECT count(TABLE_NAME) AS NUMBER_TABLE
        |FROM INFORMATION_SCHEMA.TABLES
        |WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
        |""".stripMargin,
      dbName,
      tableName
    )(rs =>
      if (rs.next()) {
        rs.getInt("NUMBER_TABLE") > 0
      } else {
        false
      }
    )
  }

  protected def escape(text: String): String = {
    s""""${text}""""
  }

  def isDatabaseTableExisted(dbName: String): Boolean = {
    client.executeQuery(
      """
        |SELECT count(schema_name) as NUMBER_DATABASE
        |FROM information_schema.schemata
        |where
        | catalog_name = ?
        | AND
        | schema_name = ?
        |""".stripMargin,
      catalog,
      dbName
    )(rs =>
      if (rs.next()) {
        rs.getInt("NUMBER_DATABASE") > 0
      } else {
        false
      }
    )
  }

  @throws[CreateDatabaseException]
  @throws[CreateTableException]
  override def ensureTableCreated(tableSchema: TableSchema): Unit = {
    if (!isDatabaseTableExisted(tableSchema.dbName)) {
      createDatabase(tableSchema.dbName)
    }
    if (!isTableExisted(tableSchema.dbName, tableSchema.name)) {
      createTable(tableSchema)
    }
  }

  @throws[CreateTableException]
  protected def createTable(tableSchema: TableSchema): Boolean = {
    try {
      val createQuery = toCreateSQL(tableSchema)
      client.executeUpdate(createQuery) > 0
    } catch {
      case ex: Throwable =>
        throw CreateTableException(
          s"create table ${tableSchema.dbName}.${tableSchema.name} failed, cause ${ex.getMessage}",
          ex
        )
    }
  }

  @throws[CreateDatabaseException]
  def createDatabase(dbName: String): Boolean = {
    try {
      val createDatabaseQuery =
        s"""
           |CREATE SCHEMA ${escape(dbName)} AUTHORIZATION "${username}"
           |""".stripMargin
      client.executeUpdate(createDatabaseQuery) > 0
    } catch {
      case ex: Throwable => throw CreateDatabaseException(s"create table ${dbName} failed, cause ${ex.getMessage}", ex)
    }
  }

  @throws[DropTableException]
  override def dropTable(dbName: String, tblName: String): Unit = {
    try {
      val dropQuery = s"""DROP TABLE IF EXISTS ${escape(dbName)}.${escape(tblName)}"""
      client.executeUpdate(dropQuery) > 0
    } catch {
      case ex: Throwable =>
        throw DropTableException(s"drop table ${dbName}.${tblName} failed, cause ${ex.getMessage}", ex)
    }
  }

  protected def toInsertSQL(dbName: String, tblName: String, columns: Seq[Column]): String = {
    val columnNames = columns.map(column => s"""${escape(column.name)}""")
    val valuePlaceHolders = columnNames.map(_ => "?").mkString(", ")
    s"""INSERT INTO ${escape(dbName)}.${escape(tblName)}(${columnNames.mkString(", ")}) VALUES($valuePlaceHolders)"""
  }

  /**
    * Write data to table with config
    *
    * @param dbName        : dest database
    * @param tableName  : dest table
    * @param columns        : column schema
    * @param records      : records will write
    * @return number of row write success
    */
  override def write(dbName: String, tableName: String, columns: Seq[Column], records: Seq[Seq[Any]]): Int = {
    val insertQuery = toInsertSQL(dbName, tableName, columns)
    client.executeBatchUpdate(insertQuery, records.map(_.toArray).toArray)
  }
}
