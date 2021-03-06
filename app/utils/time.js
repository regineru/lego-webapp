// @flow
import moment from 'moment-timezone';

const time = (
  timeObject: { days?: number, hours?: number, minutes?: number } = {}
) =>
  moment()
    .startOf('day')
    .add(timeObject)
    .toISOString();

export default time;
