let ROOT, SOCKET_ROOT;

if (process.env.REACT_APP_NODE_ENV === 'development') {
  ROOT = 'https://api-dev.algorithm-fighter.live';
  SOCKET_ROOT = '';
} else if (process.env.NODE_ENV === 'production') {
  ROOT = 'https://api.algorithm-fighter.live';
  SOCKET_ROOT = 'http://localhost:8081';
}

export const config = {
  JWT_SECRET: process.env.REACT_APP_JWT_SECRET,
  ROOT
};
