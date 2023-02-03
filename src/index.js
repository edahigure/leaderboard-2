import './style.css';

const printList = (user, score) => {
  const list = document.querySelector('.list');
  list.innerHTML = '';

  for (let i = 0; i < user.length; i += 1) {
    const newItem = document.createElement('li');
    newItem.className = 'item';
    const str = `    
        <div > ${user[i]} : </div>  <div> ${score[i]} </div>  
      `;
    newItem.innerHTML = str;
    list.appendChild(newItem);
  }
};

const initGame = async (name) => {
  const response = await fetch('https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/', {
    method: 'POST',
    body: JSON.stringify(
      {
        name,
      },
    ),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  return response.json().then((data) => {
    const id = data.result.split(' ')[3];
    const str = JSON.stringify(id);
    localStorage.setItem('idGame', str);
    return id;
  });
};

const myId = initGame('My new cool game');

const getItems = async () => {
  const user = [];
  const score = [];

  let id = '';
  const promise = myId.then((res) => {
    id = res;
  });
  await promise;

  const url = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${id}/scores/`;
  const result = fetch(url);

  const promise2 = result.then((response) => response.json()).then((json) => {
    json.result.forEach((element) => {
      user.push(element.user);
      score.push(element.score);
    });
  });
  await promise2;

  printList(user, score);
};

const addItem = async (name, score) => {
  let id = '';
  const promise = myId.then((res) => {
    id = res;
  });
  await promise;

  const url = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${id}/scores/`;
  const response = fetch(url, {
    method: 'POST',
    body: JSON.stringify(
      {
        user: name,
        score,
      },
    ),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  await response;
  getItems();
  return response;
};

const refreshButton = document.querySelector('.refresh');
refreshButton.addEventListener('click', () => getItems());

const addButton = document.querySelector('#add-button');

addButton.addEventListener('click', () => {
  const user = document.querySelector('.user').value;
  const score = document.querySelector('.score').value;
  addItem(user, score);
});
