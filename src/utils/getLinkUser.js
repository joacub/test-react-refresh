import config from 'config';

const { domain } = config;

const getLinkUser = (user, relative = true) => {
  if (relative) {
    return `/@${user.username}`;
  }
  return `${domain}/@${user.username}`;
};
const getLinkUserFeed = (user, relative = true) => {
  if (relative) {
    return `/feed/@${user.username}`;
  }
  return `${domain}/feed/@${user.username}`;
};

export default getLinkUser;

export { getLinkUserFeed };
