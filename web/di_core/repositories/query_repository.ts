/*
 * @author: tvc12 - Thien Vi
 * @created: 11/27/20, 10:30 AM
 */

import { InjectValue } from 'typescript-ioc';
import { DIKeys } from '@core/modules';
import { BaseClient } from '@core/services/base.service';
import { VisualizationResponse } from '@core/domain/Response';
import { QueryRequest } from '@core/domain/Request';
import PivotSetting from '@/shared/Settings/PivotTable/PivotSetting.vue';
import { PivotTableQuerySetting, QuerySetting, RawQuerySetting, TableQueryChartSetting, UserProfile } from '@core/domain';
import { JsonUtils, Log } from '@core/utils';

export abstract class QueryRepository {
  abstract query(request: QueryRequest): Promise<VisualizationResponse>;
  abstract queryWithUser(request: QueryRequest, userProfile: UserProfile): Promise<VisualizationResponse>;
}

export class QueryRepositoryImpl implements QueryRepository {
  private apiPath = '/chart';

  constructor(@InjectValue(DIKeys.authClient) private baseClient: BaseClient) {}

  query(request: QueryRequest): Promise<VisualizationResponse> {
    const jsonParser: ((data: string) => any) | undefined = this.getJsonParser(request.querySetting);
    return this.baseClient.post(`${this.apiPath}/query`, request, void 0, void 0, jsonParser).then(obj => VisualizationResponse.fromObject(obj));
  }

  queryWithUser(request: QueryRequest, userProfile: UserProfile): Promise<VisualizationResponse> {
    const jsonParser: ((data: string) => any) | undefined = this.getJsonParser(request.querySetting);
    return this.baseClient
      .post(`/chart/view_as`, { queryRequest: request, userProfile: userProfile }, void 0, void 0, jsonParser)
      .then(obj => VisualizationResponse.fromObject(obj));
  }

  /**
   * parse json for table & pivot table
   */
  private getJsonParser(querySetting: QuerySetting): ((data: string) => any) | undefined {
    if (
      PivotTableQuerySetting.isPivotChartSetting(querySetting) ||
      TableQueryChartSetting.isTableChartSetting(querySetting) ||
      RawQuerySetting.isRawQuerySetting(querySetting)
    ) {
      return (data: any) => {
        const records = data.records;
        delete data.records;
        const newData = JsonUtils.fromObject(data);
        return Object.assign(newData, { records: records });
      };
    } else {
      return void 0;
    }
  }
}
