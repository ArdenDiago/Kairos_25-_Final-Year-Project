const portNo = process.env.PORT || 9000;

const isProd = import.meta.env.MODE === 'production';

const URL = isProd
  ? 'https://kairos25.onrender.com/'
  : `http://localhost:${portNo}/`;

export default URL;
