import { AuthenticationContext } from 'react-adal';

const adalConfig = {
  cacheLocation: 'sessionStorage',
  clientId: '4be23733-2603-4c29-9296-da5293053cac',
  endpoints: {
    api: 'https://andytest247.onmicrosoft.com/azure-ad-nodejs-test'
  },
  postLogoutRedirectUri: window.location.origin,
  redirectUri: 'http://localhost:3000',
  tenant: 'andytest247.onmicrosoft.com',
};

export const authContext = new AuthenticationContext(adalConfig);

export const getToken = () => {
  return authContext.getCachedToken(authContext.config.clientId);
}

export const getUser = () => {
  return authContext.getCachedUser();
}