const AuthApi = {
  login(username, password) {
    return apiRequest(
      '/auth/login',
      {
        method: 'POST',
        auth: false,
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );
  },

  me() {
    return apiRequest(
      '/auth/me'
    );
  },

  logout() {
    return apiRequest(
      '/auth/logout',
      {
        method: 'POST',
      }
    );
  },
};

window.AuthApi = AuthApi;