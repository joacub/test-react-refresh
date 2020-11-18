export default function canCreatePublication(user) {
  const result = user && (user.UserRole.role === 'admin' || user.UserRole.role === 'editor');
  return result;
}
