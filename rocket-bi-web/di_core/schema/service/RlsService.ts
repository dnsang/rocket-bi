import { PageResult, PolicyId, RlsPolicy, UserAttribute } from '@core/domain';
import { Inject } from 'typescript-ioc';
import { RlsRepository } from '@core/schema/repository/RlsRepository';
import { Log } from '@core/utils';
import { UpdateRLSPolicyRequest } from '@core/domain/Model/Schema/Rls/UpdateRLSPolicyRequest';

export abstract class RlsService {
  abstract listPolicies(dbName?: string, tblName?: string): Promise<PageResult<RlsPolicy>>;

  abstract updatePolicy(request: UpdateRLSPolicyRequest): Promise<PageResult<RlsPolicy>>;

  abstract suggestAttributes(): Promise<UserAttribute[]>;
}

export class RlsServiceIml extends RlsService {
  constructor(@Inject private repo: RlsRepository) {
    super();
  }

  listPolicies(dbName?: string, tblName?: string): Promise<PageResult<RlsPolicy>> {
    return this.repo.listPolicies(dbName, tblName);
  }

  suggestAttributes(): Promise<UserAttribute[]> {
    return Promise.resolve([]);
  }

  updatePolicy(request: UpdateRLSPolicyRequest): Promise<PageResult<RlsPolicy>> {
    return this.repo.updatePolicy(request);
  }
}
