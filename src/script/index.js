import './global';
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

Axios.get('/auth/authentication')
.then(resp => {
    global.appUserId = resp.data.userId;
    $('#logged-out').hide();
    $('#logged-in').show();
})
.catch(() => {});