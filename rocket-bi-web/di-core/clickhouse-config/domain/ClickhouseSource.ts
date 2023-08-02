import { DataSource } from './DataSource';
import { DataSourceType } from '@core/clickhouse-config';

export class ClickhouseSource extends DataSource {
  className = DataSourceType.Clickhouse;
  displayName = 'Clickhouse';
  useSsl: boolean;
  host: string;
  httpPort: string;
  tcpPort: string;
  username: string;
  password: string;
  properties: Record<string, string>;
  clusterName?: string;

  constructor(
    id: number,
    useSsl: boolean,
    host: string,
    httpPort: string,
    tcpPort: string,
    username: string,
    password: string,
    createdAt: number,
    updatedAt: number,
    properties: Record<string, string>,
    clusterName?: string,
    createdBy?: string,
    updatedBy?: string
  ) {
    super(id, createdAt, updatedAt, createdBy, updatedBy);
    this.useSsl = useSsl;
    this.host = host;
    this.httpPort = httpPort;
    this.tcpPort = tcpPort;
    this.username = username;
    this.password = password;
    this.properties = properties;
    this.clusterName = clusterName;
  }

  static fromObject(obj: any): ClickhouseSource {
    return new ClickhouseSource(
      obj.id,
      obj.useSsl || obj['use_ssl'] || false,
      obj.host,
      obj.httpPort || obj['http_port'],
      obj.tcpPort || obj['tcp_port'],
      obj.username,
      obj.password,
      obj.createdAt || obj['created_at'],
      obj.updatedAt || obj['updated_at'],
      obj.properties,
      obj.clusterName || obj['cluster_name'],
      obj.createdBy || obj['created_by'],
      obj.updatedBy || obj['updated_by']
    );
  }

  static default() {
    return new ClickhouseSource(ClickhouseSource.DEFAULT_ID, false, '', '', '', '', '', 0, 0, {});
  }

  toJson(): Record<string, any> {
    return {
      ...super.toJson(),
      use_ssl: this.useSsl,
      host: this.host,
      http_port: this.httpPort,
      tcp_port: this.tcpPort,
      username: this.username,
      password: this.password,
      properties: this.properties,
      cluster_name: this.clusterName
    };
  }

  get isEdit() {
    return ClickhouseSource.DEFAULT_ID !== this.id;
  }
}
