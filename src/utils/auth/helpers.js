import cookie from 'js-cookie';

function setCookie() {
  return async response => {
    const { payload } = response.authentication;
    const options = payload.exp ? { expires: new Date(payload.exp * 1000) } : undefined;

    cookie.set('feathers-jwt', response.accessToken, options);
  };
}

function setToken({ client, app, restApp }) {
  return response => {
    const { accessToken } = response;
    if (accessToken) {
      app.authentication.setAccessToken(accessToken);
    } else {
      app.authentication.removeAccessToken(accessToken);
    }
    app.set('accessToken', accessToken);
    restApp.set('accessToken', accessToken);
    client.setJwtToken(accessToken);
  };
}

function setUser({ app, restApp }) {
  return response => {
    app.set('user', response.user);
    restApp.set('user', response.user);
  };
}

export { setCookie, setToken, setUser };
