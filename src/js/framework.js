import _ from 'lodash';
global._ = _;
import $ from 'jquery';
global.$ = $;
import Vue from 'vue';
global.Vue = Vue;
import Chart from 'chart.js';
global.Chart = Chart;
import axios from 'axios';
global.axios = axios;
axios.defaults.withCredentials = true;

import 'jquery.cookie';
import 'jquery-validation';
import 'popper.js';
import 'bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../css/fontastic.css';
import '../css/poppins.css';
import '../css/style.default.css';