import { DIException } from '@core/domain';

export abstract class GoogleUtils {
  static setupGoogleDriveClient(apiKey: string, accessToken: string) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    gapi.client.setToken({ access_token: accessToken });
    gapi.client.setApiKey(apiKey);
    return gapi.client.load('https://content.googleapis.com/discovery/v1/apis/drive/v3/rest', 'v3');
  }

  static setupGoogleSheetClient(apiKey: string, accessToken: string) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    gapi.client.setToken({ access_token: accessToken });
    gapi.client.setApiKey(apiKey);
    return gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4', 'v4');
  }

  // login with google
  static loginGoogle(clientId: string, scope: string): Promise<gapi.auth2.AuthorizeResponse> {
    return new Promise((resolve, reject) => {
      if (!window.gapi) {
        reject(new DIException('"https://apis.google.com/js/api:client.js" needs to be included as a <script>.'));
      }
      window.gapi.load('auth2', async () => {
        // @ts-ignore
        window.gapi.auth2.authorize(
          {
            // eslint-disable-next-line
            client_id: clientId,
            scope: scope,
            // fixme: migrate to new api https://developers.google.com/identity/gsi/web/guides/migration
            // eslint-disable-next-line @typescript-eslint/camelcase
            plugin_name: 'App used in google developer console API',
            // eslint-disable-next-line
            response_type: 'id_token code permission',
            prompt: 'consent'
          } as any,
          (response: gapi.auth2.AuthorizeResponse) => {
            resolve(response);
          }
        );
      });
    });
  }

  //q: A query for filtering the file results.
  //doc: https://developers.google.com/drive/api/v3/reference/files/list
  static listSpreadsheetResponse(): Promise<gapi.client.Response<gapi.client.drive.FileList>> {
    return gapi.client.drive.files
      .list({
        q: "mimeType='application/vnd.google-apps.spreadsheet'"
      })
      .then(response => {
        // Handle the results here (response.result has the parsed body).
        return response;
      });
  }

  //get list sheet from spreadsheetId|
  //doc: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/get
  static listSheetResponse(spreadsheetId: string, includeGridData = false): Promise<gapi.client.Response<gapi.client.sheets.Spreadsheet>> {
    return gapi.client.sheets.spreadsheets
      .get({
        spreadsheetId: spreadsheetId,
        includeGridData: includeGridData
      })
      .then(response => {
        return response;
      });
  }

  static getSheetRecords(spreadsheetId: string, ranges: string): Promise<gapi.client.Response<gapi.client.sheets.BatchGetValuesResponse>> {
    return gapi.client.sheets.spreadsheets.values
      .batchGet({ spreadsheetId: spreadsheetId, ranges: ranges })
      .then((response: gapi.client.Response<gapi.client.sheets.BatchGetValuesResponse>) => {
        return response;
      });
  }

  static getUserProfile(accessToken: string) {
    return gapi.client.request({
      path: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
      params: {
        // eslint-disable-next-line
        access_token: accessToken
      }
    });
  }

  static loadGoogleAnalyticClient(apiKey: string, accessToken: string) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    gapi.client.setToken({ access_token: accessToken });
    gapi.client.setApiKey(apiKey);
    return gapi.client.load('https://content.googleapis.com/discovery/v1/apis/analytics/v3/rest', 'v3');
  }

  static getGoogleAnalyticProperty(accountId: string): Promise<gapi.client.Response<gapi.client.analytics.Webproperties>> {
    return gapi.client.analytics.management.webproperties.list({
      accountId: accountId
    });
  }

  static getGoogleAnalyticViewProperty(accountId: string, webPropertyId: string): Promise<gapi.client.Response<gapi.client.analytics.Profiles>> {
    return gapi.client.analytics.management.profiles.list({
      accountId: accountId,
      webPropertyId: webPropertyId
    });
  }
}
