import './global';
import $ from 'jquery';
import 'jquery-validation';
import Axios from 'axios';

import '../css/landing.css';

Axios.get('/auth/authentication')
.then(resp => {
    global.appUserId = resp.data.userId;
    $('#logged-out').hide();
    $('#logged-in').show();
})
.catch(() => {});