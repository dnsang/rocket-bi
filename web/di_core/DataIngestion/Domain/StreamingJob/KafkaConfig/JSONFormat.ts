import { KafkaFormat, KafkaFormats } from '@core/DataIngestion';

export class JSONFormat implements KafkaFormat {
  className: KafkaFormats = KafkaFormats.JSON;
  constructor(public flattenDepth = 0) {}

  static fromObject(obj: JSONFormat) {
    return new JSONFormat(obj.flattenDepth);
  }
}
