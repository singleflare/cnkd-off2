import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, getDoc, updateDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyAhru6UvNbpEYC3Sq_S8QSBaPyIGJwYMzg",
  authDomain: "cnkd-off.firebaseapp.com",
  databaseURL: "https://cnkd-off-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cnkd-off",
  storageBucket: "cnkd-off.firebasestorage.app",
  messagingSenderId: "667962004228",
  appId: "1:667962004228:web:d6826dd754b49c08f4b651"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();
async function getDocEntry(col, docId) {
  const docRef = doc(db, col, docId)
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return docSnap.data();
}
async function updateDocEntry(col, docId, data) {
  const docRef = doc(db, col, docId)
  await updateDoc(docRef, data)
}

const puzzleSocket = io('/puzzle');

function playSound(url) {
  let sound = new Howl({
    src: [url]
  })
  sound.play()
}
puzzleSocket.on('playSound', url => {
  playSound(url)
})
puzzleSocket.on('stopSound', url => {
  Howler.stop()
})


let puzzleboardRef = await getDocEntry('cnkd-off', 'puzzleboard')
let cloudHasLetter = puzzleboardRef.hasLetter
let cloudIsShown = puzzleboardRef.isShown
$(async function () {
  for (let i = 0; i <= 63; i++) {
    $('#board').append('<div class="letter" id="letter' + i + '"><p></p></div>');
    $('#letter' + i + ' p').text(cloudHasLetter[i])
  }
  for (let i = 0; i <= 15; i++) {
    $('#letter' + i).addClass('roundDisplay')
    if (cloudHasLetter[i] != '') {
      $('#letter' + i + ' p').text(cloudHasLetter[i])
      $('#letter' + i + ' p').css('opacity', '1')
      $('#letter' + i).removeClass('roundDisplay')
      $('#letter' + i).addClass('shown')
    }
  }
  for (let i = 16; i <= 63; i++) {
    if (cloudHasLetter[i] != '') {
      if (cloudIsShown[i] == '1') {
        $('#letter' + i).addClass('shown')
        $('#letter' + i + ' p').css('opacity', '1')
      }
      else if (cloudIsShown[i] == '0') {
        $('#letter' + i).addClass('shown')
        $('#letter' + i + ' p').css('opacity', '0')
      }
      else if (cloudIsShown[i] == '2') {
        $('#letter' + i).addClass('roundDisplay')
        $('#letter' + i + ' p').css('opacity', '0')
      }
      else {
        $('#letter' + i).removeClass('shown')
        $('#letter' + i + ' p').css('opacity', '0')
      }
    }
  }
})

let puzzleMode = 'tossup'
let letterOpenSequences = Array(48).fill(0)

function showLetter(letterNumber) {
  console.log(puzzleMode)
  if (puzzleMode == 'normal') {
    if (letterOpenSequences[letterNumber - 16] == 0) {
      $('#letter' + letterNumber).addClass('waitToOpen')
      $('#letter' + letterNumber).removeClass('shown')
      playSound('../media/sounds/mochu2012pt1.wav')
      letterOpenSequences[letterNumber - 16] = 1
    }
    else if (letterOpenSequences[letterNumber - 16] == 1) {
      $('#letter' + letterNumber).addClass('shown')
      $('#letter' + letterNumber + ' p').css('opacity', '1')
      $('#letter' + letterNumber + ' p').addClass('animated')
      letterOpenSequences[letterNumber - 16] = 1
      cloudIsShown[letterNumber] = '1'
      updateDocEntry('cnkd-off', 'puzzleboard', { isShown: cloudIsShown })
      playSound('../media/sounds/mochu2012pt2.wav')
      puzzleSocket.emit('disableLetterBtn', letterNumber)
    }
  }
  if (puzzleMode == 'tossup') {
    $('#letter' + letterNumber).addClass('shown')
    $('#letter' + letterNumber + ' p').css('opacity', '1')
    $('#letter' + letterNumber + ' p').addClass('animated')
    cloudIsShown[letterNumber] = '1'
    updateDocEntry('cnkd-off', 'puzzleboard', { isShown: cloudIsShown })
    Howler.stop()
    playSound('../media/sounds/mochu2012pt2.wav')
  }
}

function resetPuzzle() {
  $('.letter').removeClass('shown')
  $('.letter').removeClass('waitToOpen')
  $('.letter p').css('opacity', '0')
  $('.letter p').removeClass('animated')
}

function showRoundInfo(puzzleArray) {
  for (let i = 0; i <= 15; i++) {
    $('#letter' + i).addClass('roundDisplay')
    $('#letter' + i).removeClass('shown')
    if (puzzleArray[i] != '') {
      $('#letter' + i).removeClass('roundDisplay')
      $('#letter' + i).addClass('shown')
      $('#letter' + i + ' p').css('opacity', '1')
    }
    else {
      $('#letter' + i).addClass('roundDisplay')
    }
  }
}

const showPuzzleSequence1 = [16, 17, 32, 33, 48, 49]
const showPuzzleSequence2 = [18, 19, 34, 35, 50, 51]
const showPuzzleSequence3 = [20, 21, 36, 37, 52, 53]
const showPuzzleSequence4 = [22, 23, 38, 39, 54, 55]
const showPuzzleSequence5 = [24, 25, 40, 41, 56, 57]
const showPuzzleSequence6 = [26, 27, 42, 43, 58, 59]
const showPuzzleSequence7 = [28, 29, 44, 45, 60, 61]
const showPuzzleSequence8 = [30, 31, 46, 47, 62, 63]
const showPuzzleSequences = [showPuzzleSequence1, showPuzzleSequence2, showPuzzleSequence3, showPuzzleSequence4, showPuzzleSequence5, showPuzzleSequence6, showPuzzleSequence7, showPuzzleSequence8]
function showPuzzle(puzzleArray) {
  showPuzzleSequences.forEach((showPuzzleSequence, index) => {
    setTimeout(() => {
      showPuzzleSequence.forEach((letterNumber) => {
        if (puzzleArray[letterNumber] != null) {
          $('#letter' + letterNumber).addClass('shown');
        }
      });
    }, index * 200); // Delay each iteration by index * 1000 milliseconds
  })
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
  for (var i = array.length - 1; i >= 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function solvePuzzle(puzzleArray) {
  let i = 0
  let availableLetters = []
  let solvePuzzleInterval;
  for (let ind = 16; ind <= 63; ind++) {
    if (puzzleArray[ind] != '') {
      availableLetters.push(ind)
    }
  }
  shuffleArray(availableLetters)
  setTimeout(() => {
    solvePuzzleInterval = setInterval(() => {
      if (availableLetters[i] != '') {
        $('#letter' + availableLetters[i]).addClass('shown')
        $('#letter' + availableLetters[i] + ' p').css('opacity', '1')
        $('#letter' + availableLetters[i] + ' p').text(puzzleArray[availableLetters[i]])
      }
      i++;
      console.log(i)
      if (i > 63) clearInterval(solvePuzzleInterval)
    }, 1)
  }, 0)
  for (let i = 16; i <= 63; i++) {
    cloudHasLetter[i] = $('#letter' + i + ' p').text()
    if ($('#letter' + i + ' p').text() != '') cloudIsShown[i] = '1'
  }
  updateDocEntry('cnkd-off', 'puzzleboard', { hasLetter: cloudHasLetter })
  updateDocEntry('cnkd-off', 'puzzleboard', { isShown: cloudIsShown })
}
let openRandomTossUpLettersInterval
puzzleSocket.on('openRandomLetterTossup', data => {
  let puzzleArray = data[0]
  console.log(puzzleArray)
  let availableLetters = []
  for (let i = 16; i <= 63; i++) {
    console.log(puzzleArray[i])
    if (puzzleArray[i] != '') {
      console.log(i, puzzleArray[i])
      availableLetters.push(i)
    }
  }
  availableLetters.shift()
  shuffleArray(availableLetters)

  let cnt = 0
  openRandomTossUpLettersInterval = setInterval(() => {
    if (cnt < availableLetters.length) {
      $('#letter' + availableLetters[cnt]).addClass('shown')
      $('#letter' + availableLetters[cnt] + ' p').css('opacity', '1')
      $('#letter' + availableLetters[cnt] + ' p').addClass('animated')
      cloudIsShown[availableLetters[cnt]] = '1'
      updateDocEntry('cnkd-off', 'puzzleboard', { isShown: cloudIsShown })
      Howler.stop()
      playSound('https://cdn.glitch.global/d0e93c15-7185-4dae-8b43-4957a4b0d047/mochu2012pt2.wav?v=1746847872130')
      cnt++
    }
  }, 800)
})
puzzleSocket.on('stopOpenRandomLetterTossup', () => {
  clearInterval(openRandomTossUpLettersInterval)
})

function translateArrayToPuzzle(puzzleArray) {
  console.log(puzzleArray)
  for (let i = 0; i <= 63; i++) {
    if (puzzleArray[i] == '') {
      $('#letter' + i + ' p').text('')
      cloudHasLetter[i] = ''
      cloudIsShown[i] = ''
    }
    else {
      $('#letter' + i + ' p').text(puzzleArray[i])
      cloudHasLetter[i] = puzzleArray[i]
      cloudIsShown[i] = '0'
    }
    updateDocEntry('cnkd-off', 'puzzleboard', { hasLetter: cloudHasLetter })
    updateDocEntry('cnkd-off', 'puzzleboard', { isShown: cloudIsShown })
  }
}

puzzleSocket.on('showLetter', (letterNumber) => {
  showLetter(letterNumber)
})
puzzleSocket.on('sendPuzzleToPuzzleBoard', (data) => {
  resetPuzzle()
  for (let i = 0; i < 16; i++) {
    $('#letter' + i).addClass('roundDisplay')
  }
  console.log(data)
  letterOpenSequences = Array(48).fill(0)
  translateArrayToPuzzle(data)
  showRoundInfo(data)
})
puzzleSocket.on('solvePuzzle', (data) => {
  console.log(data)
  if (Array.isArray(data[0])) {
    solvePuzzle(data[0])
  }
  else {
    solvePuzzle(data)
  }
})
puzzleSocket.on('showPuzzle', (data) => {
  for (let i = 0; i <= 63; i++) {
    if (data[i] == '') {
      data[i] = null
    }
  }
  console.log(data)
  if (Array.isArray(data[0])) {
    console.log('data[0]')
    showPuzzle(data[0])
  }
  else {
    console.log('data')
    showPuzzle(data)
  }
})

puzzleSocket.on('tossupMode', () => {
  puzzleMode = 'tossup'
})
puzzleSocket.on('normalMode', () => {
  puzzleMode = 'normal'
})
let time;
let cdInterval;
puzzleSocket.on('30s', () => {
  $('#letter15').css('background-color', 'red')
  $('#letter15 p').css('margin-left', '0')
  $('#letter15 p').css('opacity', '1')
  time = 30
  $('#letter15 p').text(time)
  cdInterval = setInterval(() => {
    time--
    console.log(time)
    $('#letter15 p').text(time)
    if (time == 9) {
      $('#letter15 p').css('margin', '13')
      $('#letter15 p').css('margin-left', '')
    }
    if (time == 0) {
      clearInterval(cdInterval)
      $('#letter15').css('background-color', '#01E7F8')
      $('#letter15 p').text('')
      $('#letter15 p').css('opacity', '0')
    }
  }, 1000)
})
puzzleSocket.on('10s', () => {
  $('#letter15').css('background-color', 'red')
  $('#letter15 p').css('margin-left', '0')
  $('#letter15 p').css('opacity', '1')
  time = 10
  $('#letter15 p').text(time)
  cdInterval = setInterval(() => {
    time--
    console.log(time)
    $('#letter15 p').text(time)
    if (time == 9) {
      $('#letter15 p').css('margin', '13')
      $('#letter15 p').css('margin-left', '')
    }
    if (time == 0) {
      clearInterval(cdInterval)
      $('#letter15').css('background-color', '#01E7F8')
      $('#letter15 p').text('')
      $('#letter15 p').css('opacity', '0')
    }
  }, 1000)
})
puzzleSocket.on('showWelcomePuzzle', () => {
  for (let i = 0; i <= 15; i++) {
    $('#letter' + i).removeClass('roundDisplay')
  }
  for (let i = 16; i < 48; i++) {
    $('#letter' + i).addClass('shown')
  }
  $('#letter16 p').text('C')
  $('#letter17 p').text('H')
  $('#letter18 p').text('I')
  $('#letter19 p').text('Ế')
  $('#letter20 p').text('C')
  $('#letter21 p').text('N')
  $('#letter22 p').text('Ó')
  $('#letter23 p').text('N')
  $('#letter24 p').text('K')
  $('#letter25 p').text('Ỳ')
  $('#letter26 p').text('D')
  $('#letter27 p').text('I')
  $('#letter28 p').text('Ệ')
  $('#letter29 p').text('U')
  $('#letter30 p').text('C')
  $('#letter31 p').text('G')
  $('#letter32 p').text('X')
  $('#letter33 p').text('I')
  $('#letter34 p').text('N')
  $('#letter35 p').text('K')
  $('#letter36 p').text('Í')
  $('#letter37 p').text('N')
  $('#letter38 p').text('H')
  $('#letter39 p').text('C')
  $('#letter40 p').text('H')
  $('#letter41 p').text('À')
  $('#letter42 p').text('O')
  $('#letter43 p').text('Q')
  $('#letter44 p').text('U')
  $('#letter45 p').text('Ý')
  $('#letter46 p').text('V')
  $('#letter47 p').text('Ị')
})

puzzleSocket.on('deleteCloudPuzzle', () => {
  updateDocEntry('cnkd-off', 'puzzleboard', { hasLetter: Array(64).fill(''), isShown: Array(64).fill('') })
  for (let i = 0; i < 64; i++) {
    $('#letter' + i).removeClass('roundDisplay')
    $('#letter' + i).removeClass('shown')
    $('#letter' + i + ' p').text('')
    $('#letter' + i + ' p').css('opacity', '1')
  }
})

puzzleSocket.on('scoreboard', (data) => {
  $('#p1 .name').text(data.p1Name);
  $('#p2 .name').text(data.p2Name);
  $('#p3 .name').text(data.p3Name);
  $('#p1Score').text(data.p1Score);
  $('#p2Score').text(data.p2Score);
  $('#p3Score').text(data.p3Score);
})

document.addEventListener('contextmenu', event => event.preventDefault());
