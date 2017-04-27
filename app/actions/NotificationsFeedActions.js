import { NotificationsFeed, Feed } from './ActionTypes';
import callAPI from './callAPI';
import { feedActivitySchema } from 'app/reducers';

import { feedIdByUsername } from 'app/reducers/feeds';

export function fetchNotificationFeed() {
  return callAPI({
    types: Feed.FETCH,
    endpoint: '/feed/notifications/',
    schema: [feedActivitySchema],
    meta: {
      feedId: 'notifications'
    }
  });
}

export function fetchNotificationData() {
  return callAPI({
    types: NotificationsFeed.FETCH_DATA,
    endpoint: '/feed/notifications/notification_data/'
  });
}

export function markAllNotifications() {
  return callAPI({
    types: NotificationsFeed.MARK_ALL,
    endpoint: '/feed/notifications/mark_all/',
    method: 'POST',
    body: {
      read: true,
      seen: true
    }
  });
}

export function markNotification(notificationId) {
  return callAPI({
    types: NotificationsFeed.MARK,
    endpoint: `/feed/notifications/${notificationId}/mark/`,
    method: 'POST',
    body: {
      read: true,
      seen: true
    }
  });
}