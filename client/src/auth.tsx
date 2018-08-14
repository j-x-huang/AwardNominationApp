import { AuthenticationContext } from 'react-adal';

const adalConfig = {
  clientId: 'f7f39c22-9ee8-4fc8-94d3-b9ddc3ae74df',
  endpoints: {
    api: 'https://ignitewards.onmicrosoft.com/Ignition_Awards'
  },
  postLogoutRedirectUri: window.location.origin,
  redirectUri: 'http://localhost:3000/auth/openid/return',
  tenant: 'ignitewards.onmicrosoft.com',
};

export const authContext = new AuthenticationContext(adalConfig);

export const getToken = () => {
  return authContext.getCachedToken(authContext.config.clientId);
}

export const getUser = () => {
  return authContext.getCachedUser();
}