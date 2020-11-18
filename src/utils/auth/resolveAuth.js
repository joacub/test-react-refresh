export default async function resolveAuth(auth, app) {
  const { loading } = auth;
  if (loading) {
    const result = await Promise.resolve(app.get('authentication')).catch(() => null);
    if (result) {
      return result.user;
    }
  }
  return auth.user;
}
