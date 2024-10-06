import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, getDoc, updateDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyAhru6UvNbpEYC3Sq_S8QSBaPyIGJwYMzg",
  authDomain: "cnkd-off.firebaseapp.com",
  projectId: "cnkd-off",
  storageBucket: "cnkd-off.appspot.com",
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

const openPuzzleSound = new Howl({
  src: ['../media/sounds/moochu.mp3'],
  volume: 0.5
})
const openLetter1Sound = new Howl({
  src: ['../media/sounds/mochu1.mp3'],
  volume: 0.5
})
const openLetter2Sound = new Howl({
  src: ['../media/sounds/mochu2.mp3'],
  volume: 0.5
})
const solvePuzzleSound = new Howl({
  src: ['../media/sounds/giaiochu.mp3'],
  volume: 0.5
})
const cd30sSound = new Howl({
  src: ['../media/sounds/30s.mp3'],
  volume: 0.5
})
const cd10sSound = new Howl({
  src: ['../media/sounds/10s.mp3'],
  volume: 0.5
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
  if (puzzleMode == 'normal') {
    if (letterOpenSequences[letterNumber - 16] == 0) {
      $('#letter' + letterNumber).addClass('waitToOpen')
      $('#letter' + letterNumber).removeClass('shown')
      letterOpenSequences[letterNumber - 16] = 1
      openLetter1Sound.play()
    }
    else if (letterOpenSequences[letterNumber - 16] == 1) {
      $('#letter' + letterNumber).addClass('shown')
      $('#letter' + letterNumber + ' p').css('opacity', '1')
      $('#letter' + letterNumber + ' p').addClass('animated')
      letterOpenSequences[letterNumber - 16] = 1
      cloudIsShown[letterNumber] = '1'
      updateDocEntry('cnkd-off', 'puzzleboard', { isShown: cloudIsShown })
      openLetter2Sound.play()
    }
  }
  if (puzzleMode == 'tossup') {
    $('#letter' + letterNumber).addClass('shown')
    $('#letter' + letterNumber + ' p').css('opacity', '1')
    $('#letter' + letterNumber + ' p').addClass('animated')
    cloudIsShown[letterNumber] = '1'
    updateDocEntry('cnkd-off', 'puzzleboard', { isShown: cloudIsShown })
    Howler.stop()
    openLetter2Sound.play()
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
    if (puzzleArray[0][i] != null) {
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
  openPuzzleSound.play()
  showPuzzleSequences.forEach((showPuzzleSequence, index) => {
    setTimeout(() => {
      showPuzzleSequence.forEach((letterNumber) => {
        if (puzzleArray[0][letterNumber] != null) {
          $('#letter' + letterNumber).addClass('shown');
        }
      });
    }, index * 500); // Delay each iteration by index * 1000 milliseconds
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
  solvePuzzleSound.play()
  let solvePuzzleInterval;
  for (let ind = 16; ind <= 63; ind++) {
    if (puzzleArray[0][ind] != null) {
      availableLetters.push(ind)
    }
  }
  shuffleArray(availableLetters)
  setTimeout(() => {
    solvePuzzleInterval = setInterval(() => {
      if (availableLetters[i] != null) {
        $('#letter' + availableLetters[i]).addClass('shown')
        $('#letter' + availableLetters[i] + ' p').css('opacity', '1')
        $('#letter' + availableLetters[i] + ' p').text(puzzleArray[0][availableLetters[i]])
      }
      i++;
      console.log(i)
      if (i > 63) clearInterval(solvePuzzleInterval)
    }, 1)
  }, 2500)
  for (let i = 16; i <= 63; i++) {
    cloudHasLetter[i] = $('#letter' + i + ' p').text()
    if ($('#letter' + i + ' p').text() != '') cloudIsShown[i] = '1'
  }
  updateDocEntry('cnkd-off', 'puzzleboard', { hasLetter: cloudHasLetter })
  updateDocEntry('cnkd-off', 'puzzleboard', { isShown: cloudIsShown })
}

function translateArrayToPuzzle(puzzleArray) {
  for (let i = 0; i <= 63; i++) {
    if (puzzleArray[0][i] == null) {
      $('#letter' + i + ' p').text('')
      cloudHasLetter[i] = ''
      cloudIsShown[i] = ''
    }
    else {
      $('#letter' + i + ' p').text(puzzleArray[0][i])
      cloudHasLetter[i] = puzzleArray[0][i]
      cloudIsShown[i] = '0'
    }
    updateDocEntry('cnkd-off', 'puzzleboard', { hasLetter: cloudHasLetter })
    updateDocEntry('cnkd-off', 'puzzleboard', { isShown: cloudIsShown })
  }
}

puzzleSocket.on('showLetter', (letterNumber) => {
  showLetter(letterNumber)
  console.log($('#letter' + letterNumber).attr())
})
puzzleSocket.on('sendPuzzleToPuzzleBoard', (data) => {
  resetPuzzle()
  letterOpenSequences = Array(48).fill(0)
  translateArrayToPuzzle(data)
  showRoundInfo(data)
})
puzzleSocket.on('solvePuzzle', (data) => {
  console.log(data)
  solvePuzzle(data)
})
puzzleSocket.on('showPuzzle', (data) => {
  showPuzzle(data)
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
  cd30sSound.play()
  $('#letter15').removeClass('roundDisplay')
  $('#letter15').removeClass('unopened')
  $('#letter15').addClass('timer')
  $('#letter15 p').css('margin-left', '0')
  time = 30
  $('#letter15 p').text(time)
  cdInterval = setInterval(() => {
    time--
    $('#letter15 p').text(time)
    if (time == 9) {
      $('#letter15 p').css('margin', '13')
      $('#letter15 p').css('margin-left', '')
    }
    if (time == 0) {
      clearInterval(cdInterval)
      $('#letter15').addClass('roundDisplay')
    }
  }, 1000)
})
puzzleSocket.on('10s', () => {
  cd10sSound.play()
  $('#letter15').removeClass('roundDisplay')
  $('#letter15').removeClass('unopened')
  $('#letter15').addClass('timer')
  $('#letter15 p').css('margin-left', '0')
  time = 10
  $('#letter15 p').text(time)
  cdInterval = setInterval(() => {
    time--
    $('#letter15 p').text(time)
    if (time == 9) {
      $('#letter15 p').css('margin', '13')
      $('#letter15 p').css('margin-left', '')
    }
    if (time == 0) {
      clearInterval(cdInterval)
      $('#letter15').addClass('roundDisplay')
    }
  }, 1000)
})