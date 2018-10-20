let ROOT;

if (process.env.REACT_APP_NODE_ENV === 'development') {
  ROOT = 'https://api-dev.kizmo04.com';
} else if (process.env.NODE_ENV === 'production') {
  ROOT = 'https://api.kizmo04.com';
}

export const config = {
  JWT_SECRET: process.env.REACT_APP_JWT_SECRET,
  ROOT
};
