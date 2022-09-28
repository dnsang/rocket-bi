import { PERSISTENT_TYPE } from '@core/DataCook/Domain';
import { JdbcPersistConfiguration } from '@core/DataCook/Domain/ETL/ThirdPartyPersistConfiguration/JdbcPersistConfiguration';
import { ThirdPartyPersistConfigurations } from '@core/DataCook/Domain/ETL';

export class MySQLJdbcPersistConfiguration extends JdbcPersistConfiguration {
  className = ThirdPartyPersistConfigurations.MySQLPersistConfiguration;
  host: string;
  port: string;

  constructor(
    displayName: string,
    username: string,
    password: string,
    databaseName: string,
    tableName: string,
    persistType: PERSISTENT_TYPE,
    host: string,
    port: string
  ) {
    super(displayName, username, password, databaseName, tableName, persistType);
    this.host = host;
    this.port = port;
  }

  static fromObject(obj: any): MySQLJdbcPersistConfiguration {
    return new MySQLJdbcPersistConfiguration(obj.displayName, obj.username, obj.password, obj.databaseName, obj.tableName, obj.persistType, obj.host, obj.port);
  }

  static default(): MySQLJdbcPersistConfiguration {
    return new MySQLJdbcPersistConfiguration('', '', '', '', '', PERSISTENT_TYPE.Update, '', '3306');
  }
}
