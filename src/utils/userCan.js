export default function userCan(user, permission) {
  if (!user || user === null || user === '') { return false; }

  const { role } = user.UserRole || {};
  if (role === 'admin') {
    return true;
  }

  switch (permission) {
    case 'markFeaturedPost': {
      return false;
    }
    case 'createPublication': {
      return role === 'editor';
    }
    default:
      return false;
  }
}
