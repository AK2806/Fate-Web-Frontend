import $ from 'jquery';
import 'jquery-validation';
import 'bootstrap';
import Axios from 'axios';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import '../css/fontastic.css';
import '../css/poppins.css';
import '../css/general.css';
import '../css/theme.css';
import '../css/landing.css';

let apiUrlPrefix = 'http://localhost:8080/trpgfate-api';

Axios.defaults.baseURL = apiUrlPrefix;
Axios.defaults.withCredentials = true;
Axios.defaults.headers.common['Content-Type'] = 'application/json';

Axios.get('/auth/authentication')
.then(resp => {
    global.appUserId = resp.data.userId;
    $('#logged-out').hide();
    $('#logged-in').show();
})
.catch(ignore => { });