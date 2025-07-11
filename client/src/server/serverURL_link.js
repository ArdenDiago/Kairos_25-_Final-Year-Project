const portNo = process.env.PORT || 9000;

const isProd = import.meta.env.MODE === 'production';

const URL = isProd
  ? `${import.meta.env.VITE_API_URL}/`
  : `http://localhost:${portNo}/`;

export default URL;
