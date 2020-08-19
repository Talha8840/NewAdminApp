import moment from 'moment';

export default function meditationDuration(seconds) {
  if (seconds < 3600) {
    return moment
      .utc(moment.duration(seconds, 'seconds').asMilliseconds())
      .format('m [min]');
  } else if (seconds < 3600 * 24) {
    return moment
      .utc(moment.duration(seconds, 'seconds').asMilliseconds())
      .format('H [hr] m [min]');
  } else {
    return moment
      .utc(moment.duration(seconds, 'seconds').asMilliseconds())
      .format('D [day], H [hr] m [min]');
  }
}
