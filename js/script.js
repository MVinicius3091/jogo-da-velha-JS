const btnNew = document.querySelector('div.buttons > button#btn-new');
const btnConfirmar = document.querySelector('button#btn-confirmar');
const pOneIcons = document.querySelector('div.p-one-icons');
const pTwoIcons = document.querySelector('div.p-two-icons');
const divSelectPlayers = document.querySelector('div.select-players');
const divModalAlert = document.querySelector('section.modal');
const btnCloseAlert = document.querySelector('button#btn-close-modal');
const inputColors = document.querySelectorAll('input.box');

let divFigure = document.querySelectorAll('div.block div');
let namePlayerTurn = document.querySelector('span#player');
let nameVictoriOne = document.querySelector('h2#player-one');
let nameVictoriTwo = document.querySelector('h2#player-two');

let PLAYER = 1;
let ICON_ONE = '';
let ICON_TWO = '';
let COUNT_ONE = 0;
let COUNT_TWO = 0;
let COUNT_DRAW = 0;
let namePlayerOne = '';
let namePlayerTwo = '';
let matchSeq = [];
let DRAW_GAME = null;
let VERIFY_ICONS = false;
let ONE_ICON_SELECTED = false;

const icons = [
  'logo-facebook',
  'logo-github',
  'logo-gitlab',
  'logo-html5',
  'logo-instagram',
  'logo-javascript',
  'logo-laravel',
  'logo-linkedin',
  'logo-nodejs',
  'logo-python',
  'logo-tumblr',
  'logo-tux',
  'logo-twitter',
  'logo-whatsapp',
];

const positions = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6],
];

(function renderIcons(){

  divSelectPlayers.style.display = 'block'
  let html = '<div>';

  icons.forEach(icon => html += `<img src="../icons/${icon}.svg" width="50px" height="50px">`);

  html += '</div>';
  pTwoIcons.innerHTML += html;
  pOneIcons.innerHTML += html;

  let currentColor = localStorage.getItem('background');

  document.body.style.background =  `linear-gradient(to left, ${currentColor})`;

})();

inputColors.forEach(color => color.addEventListener('click', handleBackgroud))

const imgOneIcons = document.querySelectorAll('div.p-one-icons img');
const imgTwoIcons = document.querySelectorAll('div.p-two-icons img');
const inputOnePlayer = document.querySelector('input#p-one');
const inputTwoPlayer = document.querySelector('input#p-two');

divFigure.forEach((div, index) =>handleSequencePlayer(div, index));

imgOneIcons.forEach((img, index) => {

  img.addEventListener('click', () => {
    imgOneIcons.forEach(el => {
      if(el.className == 'icon-selected'){
        el.classList.remove('icon-selected')
      }
    });

    getIndexIcon(index);

    ICON_ONE = img.src;
    img.classList.add('icon-selected');
    ONE_ICON_SELECTED = true;

  });
});

imgTwoIcons.forEach(img => {
  
  img.addEventListener('click', () => {
    imgTwoIcons.forEach(el => {
      if(el.className == 'icon-selected'){
        el.classList.remove('icon-selected')
      }
    });

    if (img.className == 'selected'){

      img.setAttribute('clicked', false);
      VERIFY_ICONS = true;
      return;

    } 

    if (!ONE_ICON_SELECTED) return;

    VERIFY_ICONS = false;
    ICON_TWO = img.src;
    img.classList.add('icon-selected');
    
  });
});

function getIndexIcon(icon) {

  imgTwoIcons.forEach((img, index) => 
  (index == icon) ? img.classList.add('selected') : img.classList.remove('selected'))
}

function handleSequencePlayer(div, index) {

  div.addEventListener('click', () => {
   
    if (ICON_ONE == '') {
      ICON_ONE = '../icons/logo-facebook.svg';
    }
     
    if (ICON_TWO == ''){
      ICON_TWO = '../icons/logo-github.svg';
    }

    if (PLAYER == 1 && div.innerHTML == ''){

      div.innerHTML = `<img src="${ICON_ONE}">`;
      PLAYER = 2;
      namePlayerTurn.innerHTML = namePlayerTwo;

      let type = 'x';
      matchSeq[index] = type;
      ++DRAW_GAME;
      let matchSequence = endGame(matchSeq, type);

      if (matchSequence) {
        document.querySelector('span#count-one').innerHTML = ++COUNT_ONE;

        setTimeout(() => {
          modalWinPlayer(`O jogador ${namePlayerOne} venceu!`);
        }, 200);

      }

      if (!matchSequence && DRAW_GAME == 9) {

        document.querySelector('span#draw-game').innerHTML = ++COUNT_DRAW;

        setTimeout(() => {
          modalWinPlayer(`O jogo deu empate!`);
        }, 200);
      }

    } else if (PLAYER == 2 && div.innerHTML == '') {

      div.innerHTML = `<img src="${ICON_TWO}">`;
      PLAYER = 1;
      namePlayerTurn.innerHTML = namePlayerOne;

      let type = 'o';
      matchSeq[index] = type;
      ++DRAW_GAME;
      let matchSequence = endGame(matchSeq, type);

      if (matchSequence) {
        document.querySelector('span#count-two').innerHTML = ++COUNT_TWO;

        setTimeout(() => {
          modalWinPlayer(`O jogador ${namePlayerTwo} venceu!`);
        }, 200);
      } 
    }
  });
}

function endGame(a, type) {

  const match = matchSeq.map((n,i) => [n,i])
    .filter(item => item[0] == type)
    .map(item => item[1]);

  for (pos of positions) {

    if (pos.every(item => match.includes(item))) {
      return true;
    } 
  }
}

btnConfirmar.addEventListener('click', () => {

  if (!confirmPlayers() || VERIFY_ICONS == true) {
    return false;

  } else {

    divSelectPlayers.style.display = 'none';
    namePlayerTurn.innerHTML = inputOnePlayer.value;
    namePlayerOne = inputOnePlayer.value;
    namePlayerTwo = inputTwoPlayer.value;
    nameVictoriOne.innerHTML = inputOnePlayer.value + `: <span id="count-one">0</span>`;
    nameVictoriTwo.innerHTML = inputTwoPlayer.value + `: <span id="count-two">0</span>`;
  }
});

btnNew.addEventListener('click', () => {

  divSelectPlayers.style.display = 'block';
  inputOnePlayer.value = '';
  inputTwoPlayer.value = '';
  imgOneIcons.forEach(img => img.classList.remove('icon-selected'));
  imgTwoIcons.forEach(img => {
    img.classList.remove('icon-selected')
    img.classList.remove('selected')
  });
  divFigure.forEach(div => div.innerHTML = '');
  matchSeq = [];
  PLAYER = 1;
  COUNT_ONE = 0;
  COUNT_TWO = 0;
  COUNT_DRAW = 0;
  DRAW_GAME = 0;
  ONE_ICON_SELECTED = false;
  VERIFY_ICONS = false;

  if (confirmPlayers()) {
    return false;
  } 

});

btnCloseAlert.addEventListener('click', () => {

  divModalAlert.classList.remove('modal-fade-in');
  divFigure.forEach(div => div.innerHTML = '');
  matchSeq = [];
  PLAYER = 1;
  namePlayerTurn.innerHTML = namePlayerOne;
  DRAW_GAME = 0;

});

function confirmPlayers() {

  if (inputOnePlayer.value == '') {
    insertTootip(inputOnePlayer)
    return false;
  } 

  if (inputTwoPlayer.value == '') {
    insertTootip(inputTwoPlayer)
    return false;
  }

  return true;

}

function insertTootip(element) {
  let p = document.createElement('p');
  p.setAttribute('id', 'tooltip');
  p.innerHTML = 'Preencha esse campo!';

  if(element.previousSibling.id !== 'tooltip'){
    element.parentNode.insertBefore(p, element);
  }
}

function modalWinPlayer(player) {
  
  document.querySelector('h2#p-name-win').innerHTML = player;
  divModalAlert.classList.add('modal-fade-in');
}

function handleBackgroud(element) {
  let currentColor = element.target.getAttribute('data-color');
  document.body.style.background = `linear-gradient(to left, ${currentColor})`;
  localStorage.setItem('background', currentColor);
}


