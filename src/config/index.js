let ROOT, SOCKET_ROOT;

if (process.env.REACT_APP_NODE_ENV === 'development') {
  ROOT = 'https://api-dev.kizmo04.com';
  SOCKET_ROOT = '';
} else if (process.env.NODE_ENV === 'production') {
  ROOT = 'https://api.kizmo04.com';
  SOCKET_ROOT = 'http://13.125.1.43:8081';
}

export const config = {
  JWT_SECRET: process.env.REACT_APP_JWT_SECRET,
  ROOT
};
