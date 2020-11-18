import auth from './modules/auth';
import users from './modules/users';
import settings from './modules/settings';
import notifs from './modules/notifs';
import notifier from './modules/notifier';
import online from './modules/online';

export default function createReducers(asyncReducers) {
  return {
    online,
    auth,
    users,
    settings,
    notifs,
    notifier,
    ...asyncReducers
  };
}
