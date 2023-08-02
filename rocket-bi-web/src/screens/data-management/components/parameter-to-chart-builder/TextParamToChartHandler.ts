import { ParamChartHandler } from '@/screens/data-management/components/parameter-to-chart-builder/ParamChartHandler';
import { ChartInfo, DefaultSettings, InputControlQuerySetting, InputFilterOption, QueryParameter, WidgetCommonData } from '@core/common/domain';
import { StringUtils } from '@/utils';
import { ChartType } from '@/shared';
import { Log } from '@core/utils';
///Create a input, name = param name, default value = param default value
export class TextParamToChartHandler implements ParamChartHandler {
  buildChart(parameter: QueryParameter): ChartInfo {
    const inputSetting: InputFilterOption = InputFilterOption.getDefaultChartOption();
    inputSetting.setOption('title', parameter.displayName);
    inputSetting.setOption('default', this.buildDefaultValue(parameter));
    inputSetting.setOption('parameterConfig', parameter); //Important
    const inputQuerySetting = new InputControlQuerySetting([], [], [], inputSetting);
    const commonSetting: WidgetCommonData = {
      id: -1,
      name: parameter.displayName,
      description: '',
      extraData: {
        configs: {} as any,
        filters: {},
        currentChartType: ChartType.InputFilter
      }
    };
    return new ChartInfo(commonSetting, inputQuerySetting);
  }

  private buildDefaultValue(param: QueryParameter): DefaultSettings {
    const value = param.value;
    return {
      enabled: StringUtils.isNotEmpty(value),
      setting: {
        value: value
      }
    };
  }
}
