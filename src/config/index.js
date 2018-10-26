let ROOT, SOCKET_ROOT;

if (process.env.REACT_APP_NODE_ENV === 'development') {
  ROOT = 'https://api-dev.kizmo04.com';
  SOCKET_ROOT = '';
} else if (process.env.NODE_ENV === 'production') {
  ROOT = 'https://api.kizmo04.com';
  SOCKET_ROOT = 'http://172.31.4.127:8081';
}

export const config = {
  JWT_SECRET: process.env.REACT_APP_JWT_SECRET,
  ROOT
};
