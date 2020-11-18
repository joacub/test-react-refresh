import config from 'config';

const { domain } = config;

const getLink = (post, relative = true) => {
  let base = '';
  if (!relative) {
    base = domain;
  }
  if (typeof post === 'string') {
    return base + post;
  }
  const {
    Publication: pub, parent, User
  } = post;
  const isResponse = post.isResponse ? parseInt(post.isResponse, 10) : 0;
  if ((!parent || !parent.slug) && pub && pub.slug) {
    return `${base}/${pub.slug}/${post.slug}-${post.uid}`;
  }
  if ((parent && parent.slug) || isResponse === 1) {
    return `${base}/@${User.username}/${post.slug}-${post.uid}`;
  }
  return `${base}/s/story/${post.slug}-${post.uid}`;
};

export default getLink;

const getLinkPublication = (pub, post, relative = true) => {
  const obj = { uid: post.uid, slug: post.slug, Publication: pub };
  return getLink(obj, relative);
};

export { getLinkPublication, getLink };
