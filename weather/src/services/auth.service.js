import axios from "axios";

const API_URL = "http://localhost:3001/auth/";

function hash(s) {
  var hash = 0, i, chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};
class AuthService {



  login(username, password) {
    password = hash(password);
    return axios
      .post(API_URL + "signin", {
        username,

        password
      })
      // .then(response => {
      //     localStorage.setItem("user", JSON.stringify(response.data.user));
      //
      //   return response.data;
      // });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, password) {
    password = hash(password);
    return axios.post(API_URL + "signup", {
      username,
      password
    });
  }

  getCurrentUser() {
    if (localStorage.getItem('user') == "undefined")
      return undefined
    else
      return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();
