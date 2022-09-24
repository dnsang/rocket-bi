package co.datainsider.share.controller.filter

import co.datainsider.bi.service.{DashboardService, DirectoryService}
import co.datainsider.share.controller.filter.BaseShareFilter.{getResourceId, getResourceType, isResourceOwner}
import com.twitter.finagle.http.Request
import com.twitter.util.Future
import datainsider.authorization.domain.PermissionProviders
import datainsider.client.domain.permission.{PermissionResult, Permitted, UnPermitted}
import datainsider.client.filter.BaseAccessFilter.AccessValidator
import datainsider.client.filter.UserContext.UserContextSyntax
import datainsider.client.service.OrgAuthorizationClientService

import javax.inject.Inject

/**
  * @author tvc12 - Thien Vi
  * @created 03/11/2021 - 4:25 PM
  */
case class DeleteAccessFilterImpl @Inject() (
    directoryService: DirectoryService,
    dashboardService: DashboardService,
    authorizationService: OrgAuthorizationClientService
) extends ShareAccessFilters.DeleteAccessFilter {
  override protected def getValidatorChain(): Seq[AccessValidator] = {
    Seq(isResourceOwner(directoryService, dashboardService), isPermissionPermitted)
  }

  private def isPermissionPermitted(request: Request): Future[PermissionResult] = {
    val resourceId: String = getResourceId(request)
    val resourceType: String = getResourceType(request)
    val permissionResult: Future[PermissionResult] = authorizationService
      .isPermitted(
        request.currentOrganization.map(_.organizationId).get,
        request.currentUser.username,
        PermissionProviders.permissionBuilder.perm(request.currentOrganizationId.get, resourceType, "delete", resourceId)
      )
      .map {
        case true  => Permitted()
        case false => UnPermitted("No permission to delete this resource.")
      }
    permissionResult
  }
}
case class DeleteAccessTestFilter() extends ShareAccessFilters.DeleteAccessFilter {
  override protected def getValidatorChain(): Seq[AccessValidator] = {
    Seq((_) => Future.value(Permitted()))
  }
}
