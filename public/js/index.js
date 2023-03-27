import '@babel/polyfill';
import { login, logout } from './login';

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});

const logoutBtn = document.querySelector('.nav__el--logout');
if (logoutBtn) logoutBtn.addEventListener('click', logout);
