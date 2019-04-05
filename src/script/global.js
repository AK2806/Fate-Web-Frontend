import Axios from 'axios';
global.apiUrlPrefix = 'http://localhost:8080/trpgfate-api';
Axios.defaults.baseURL = apiUrlPrefix;
Axios.defaults.withCredentials = true;
Axios.defaults.headers.common['Content-Type'] = 'application/json';
