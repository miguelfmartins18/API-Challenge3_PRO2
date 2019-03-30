const app = document.getElementById('root');

const logo = document.createElement('img');
logo.src = 'images/logo.png';

const container = document.createElement('div');
container.setAttribute('class', 'container');

app.appendChild(logo);
app.appendChild(container);

