import { UsersResponse } from '@core/domain/Response/User/UsersResponse';
import { InjectValue } from 'typescript-ioc';
import { DIKeys } from '@core/modules';
import { BaseClient } from '@core/services/base.service';
import { CreateUserRequest } from '@core/admin/domain/request/CreateUserRequest';
import { EditUserProfileRequest } from '@core/admin/domain/request/EditUserProfileRequest';
import { UserFullDetailInfo, UserProfile } from '@core/domain/Model';
import { DeleteUserRequest } from '@core/admin/domain/request/TransferUserDataConfig';
import { RegisterResponse } from '@core/domain/Response';
import { SearchUserRequest } from '@core/admin/domain/request/SearchUserRequest';
import { UserSearchResponse } from '@core/domain/Response/User/UserSearchResponse';
import { EditUserPropertyRequest } from '@core/admin/domain/request/EditUserPropertyRequest';

export abstract class UserAdminRepository {
  abstract create(newUser: CreateUserRequest): Promise<RegisterResponse>;

  abstract getUserFullDetailInfo(username: string): Promise<UserFullDetailInfo>;

  abstract editUserProfile(request: EditUserProfileRequest): Promise<UserProfile>;

  abstract activate(username: string): Promise<boolean>;

  abstract deactivate(username: string): Promise<boolean>;

  abstract search(from: number, size: number, isActive: boolean): Promise<UsersResponse>;

  abstract searchV2(from: number, size: number, keyword: string, isActive?: boolean): Promise<UserSearchResponse>;

  abstract delete(request: DeleteUserRequest): Promise<boolean>;

  abstract getSuggestedUsers(request: SearchUserRequest): Promise<UsersResponse>;

  abstract updateUserProperties(request: EditUserPropertyRequest): Promise<UserProfile>;
}

export class UserAdminRepositoryImpl extends UserAdminRepository {
  @InjectValue(DIKeys.authClient)
  private httpClient!: BaseClient;
  private apiPath = '/admin/users/';

  create(request: CreateUserRequest): Promise<RegisterResponse> {
    return this.httpClient.post(`${this.apiPath}/create`, request, undefined).then(obj => RegisterResponse.fromObject(obj));
  }

  getUserFullDetailInfo(username: string): Promise<UserFullDetailInfo> {
    return this.httpClient.get(`${this.apiPath}/${username}`).then(response => {
      return UserFullDetailInfo.fromObject(response);
    });
  }

  editUserProfile(request: EditUserProfileRequest): Promise<UserProfile> {
    return this.httpClient.put(`${this.apiPath}/${request.username}`, request).then(response => {
      return UserProfile.fromObject(response);
    });
  }

  activate(username: string): Promise<boolean> {
    return this.httpClient.post(`${this.apiPath}/${username}/activate`);
  }

  deactivate(username: string): Promise<boolean> {
    return this.httpClient.post(`${this.apiPath}/${username}/deactivate`);
  }

  /**
   * Deprecated
   * Use searchV2 instead.
   * @param from
   * @param size
   * @param isActive
   */
  search(from: number, size: number, isActive: boolean): Promise<UsersResponse> {
    const params = {
      from: from,
      size: size,
      // eslint-disable-next-line @typescript-eslint/camelcase
      is_active: isActive
    };
    return this.httpClient.post(`${this.apiPath}/search`, undefined, params).then(data => {
      return UsersResponse.fromObject(data);
    });
  }

  searchV2(from: number, size: number, keyword: string, isActive?: boolean): Promise<UserSearchResponse> {
    const params = {
      from: from,
      size: size,
      keyword,
      // eslint-disable-next-line @typescript-eslint/camelcase
      is_active: isActive
    };
    return this.httpClient.post(`${this.apiPath}/search/v2`, undefined, params).then(data => {
      return UserSearchResponse.fromObject(data);
    });
  }

  delete(request: DeleteUserRequest): Promise<boolean> {
    const body = {
      transferDataConfig: request.transferDataConfig
    };
    return this.httpClient.delete(`${this.apiPath}/${request.username}/delete`, body, undefined);
  }

  getSuggestedUsers(request: SearchUserRequest): Promise<UsersResponse> {
    return this.httpClient.post<UsersResponse>(`user/profile/suggest`, request).then(
      res =>
        new UsersResponse(
          res.data.map(user => UserProfile.fromObject(user)),
          res.total
        )
    );
  }

  updateUserProperties(request: EditUserPropertyRequest): Promise<UserProfile> {
    return this.httpClient.put(`/admin/users/${request.username}/property`, request).then(res => UserProfile.fromObject(res));
  }
}
