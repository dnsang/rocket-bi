import { BaseModule } from '@core/modules';
import { Container, Scope } from 'typescript-ioc';
import { RelationshipRepository, RelationshipRepositoryImpl, RelationshipService, RelationshipServiceImpl } from '@core/DataRelationship';

export class RelationshipModule extends BaseModule {
  configuration() {
    Container.bind(RelationshipRepository)
      .to(RelationshipRepositoryImpl)
      .scope(Scope.Singleton);

    Container.bind(RelationshipService)
      .to(RelationshipServiceImpl)
      .scope(Scope.Singleton);
  }
}
