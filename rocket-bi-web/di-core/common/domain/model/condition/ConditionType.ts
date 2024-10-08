export enum ConditionType {
  And = 'and',
  Or = 'or',
  IsNull = 'null',
  NotNull = 'not_null',
  IsEmpty = 'empty',
  NotEmpty = 'not_empty',
  Equal = 'equal',
  EqualField = 'equal_field',
  NotEqual = 'not_equal',
  NotEqualField = 'not_equal_field',
  GreaterThan = 'greater_than',
  GreaterThanOrEqual = 'greater_than_or_equal',
  LessThan = 'less_than',
  LessThanOrEqual = 'less_than_or_equal',
  MatchRegex = 'match_regex',
  Like = 'like',
  NotLike = 'not_like',
  LikeCaseInsensitive = 'like_case_insensitive',
  NotLikeCaseInsensitive = 'not_like_case_insensitive',
  Between = 'between',
  BetweenAndIncluding = 'between_and_including',
  IsIn = 'in',
  NotIn = 'not_in',
  LastNMinute = 'last_n_minute',
  LastNHour = 'last_n_hour',
  LastNDay = 'last_n_day',
  LastNWeek = 'last_n_week',
  LastNMonth = 'last_n_month',
  LastNQuarter = 'last_n_quarter',
  LastNYear = 'last_n_year',
  CurrentDay = 'current_day',
  CurrentMonth = 'current_month',
  CurrentQuarter = 'current_quarter',
  CurrentWeek = 'current_week',
  CurrentYear = 'current_year',
  Dynamic = 'dynamic_condition',
  AlwaysTrue = 'always_true',
  AlwaysFalse = 'always_false'
}
