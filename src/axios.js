// axios
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
// axios.defaults.headers.common['lang'] = i18n.locale;

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  // Network error
  if (!error.response) {
    error = {
        status: 500,
        data: {
          message: 'Server is not running'
        },
        statusText: 'Internal Server Error'
    };

  } else {
    error = error.response;
  }

  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

export default axios;
