'use strict';

import { createStore } from 'redux';

import Reducer from './reducer.js';

var store = new createStore(Reducer);

export default store;
