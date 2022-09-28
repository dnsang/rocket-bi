import { UPLOAD_STAGE } from '../../../DiUploadDocument/entities/Enum';
import { Log } from '@core/utils';
import actions from '../../actions';
import BrowseFiles from '../GoogleSheetSelectionForm/GoogleSheetSelectionForm.vue';
import PreviewFiles from '../PreviewGoogleSheet/PreviewGoogleSheet.vue';
import DescribeDatabase from '../GoogleSheetForm/GoogleSheetForm.vue';
import Modal from '../../../DiUploadDocument/components/commons/Modal.vue';
import { UploadGoogleSheetInfo } from '@/screens/DataIngestion/components/DiUploadDocument/entities/UploadGoogleSheetInfo';
import { DataSourceModule } from '@/screens/DataIngestion/store/DataSourceStore';

export default {
  name: 'UploadGoogleSheet',
  components: { Modal },
  data() {
    return {
      model: null
    };
  },
  computed: {
    title() {
      if (this.model) return this.model.title;
      return '';
    },
    desc() {
      if (this.model) return this.model.desc;
      return '';
    },
    modalWidth() {
      const defaultWidth = 1030;
      const browseFileWidth = 398;
      const describeDatabaseWidth = 430;
      if (!this.model) return defaultWidth;
      switch (this.model.stage) {
        case UPLOAD_STAGE.browse_file:
          return browseFileWidth;
        case UPLOAD_STAGE.describe_db:
          return describeDatabaseWidth;
        default:
          return defaultWidth;
      }
    },
    bodyComponent() {
      if (!this.model) return null;
      switch (this.model.stage) {
        case UPLOAD_STAGE.browse_file:
          return BrowseFiles;
        case UPLOAD_STAGE.preview_file:
          return PreviewFiles;
        case UPLOAD_STAGE.describe_db:
          return DescribeDatabase;
        default:
          return null;
      }
    }
  },
  mounted() {
    actions.onShowUploadGoogleSheet(this.show);
    actions.onHideUploadGoogleSheet(this.hide);
    actions.onSetAccessToken(this.setAccessToken);
    actions.onSetAuthorizationCode(this.setAuthorizationCode);
  },
  destroy() {
    actions.offShowUploadGoogleSheet(this.show);
    actions.offHideUploadGoogleSheet(this.hide);
    actions.offSetAccessToken(this.setAccessToken);
    actions.offSetAuthorizationCode(this.setAuthorizationCode);
  },
  methods: {
    reset() {
      Log.debug('reset');
    },
    initModel() {
      this.model = new UploadGoogleSheetInfo();
    },
    show() {
      this.initModel();
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    setAccessToken(accessToken) {
      this.model.accessToken = accessToken;
    },

    setAuthorizationCode(authCode) {
      this.model.authorizationCode = authCode;
    },
    onClose() {
      this.model = null;
    }
  }
};
