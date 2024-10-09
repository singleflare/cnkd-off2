const express = require('express');
const app = express();
const server = app.listen(process.env.PORT || 3000)
const fs = require('fs')
const bodyParser = require('body-parser')
const { initializeApp } = require('firebase/app')
const { getFirestore, collection, getDoc, updateDoc, doc } = require('firebase/firestore')

app.use(express.static('public'));
app.use(bodyParser.json())
app.use(express.json())

const path = require('path');
const { join } = require('path');
const ioServer = require('socket.io')(server)

const firebaseConfig = {
  apiKey: "AIzaSyAhru6UvNbpEYC3Sq_S8QSBaPyIGJwYMzg",
  authDomain: "cnkd-off.firebaseapp.com",
  projectId: "cnkd-off",
  storageBucket: "cnkd-off.appspot.com",
  messagingSenderId: "667962004228",
  appId: "1:667962004228:web:d6826dd754b49c08f4b651"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, 'cnkd-off');

console.log('Puzzle: http://localhost:3000/puzzle');
console.log('Control: http://localhost:3000/control');
console.log('Wheel: http://localhost:3000/wheel');
console.log('Puzzle Full Screen: http://localhost:3000/puzzleFullScreen');

app.get('/puzzle', (req, res) => res.sendFile(join(__dirname, '/public/html/puzzle.html')))
app.get('/control', (req, res) => res.sendFile(join(__dirname, '/public/html/control.html')))
app.get('/wheel', (req, res) => res.sendFile(join(__dirname, '/public/html/wheel.html')))
app.get('/wheelFullScreen', (req, res) => res.sendFile(join(__dirname, '/public/html/puzzleFullScreen.html')))

const puzzleNs = ioServer.of('/puzzle');
const wheelNs = ioServer.of('/wheel');
const controlNs = ioServer.of('/control');

puzzleNs.on('connection', (socket) => {

})

controlNs.on('connection', (socket) => {
  socket.on('showLetter', (letterNumber) => {
    puzzleNs.emit('showLetter', letterNumber)
  })
  socket.on('showPuzzle', (data) => {
    puzzleNs.emit('showPuzzle', data)
  })
  socket.on('sendPuzzleToPuzzleBoard', data => {
    puzzleNs.emit('sendPuzzleToPuzzleBoard', data)
  })
  socket.on('solvePuzzle', data => {
    puzzleNs.emit('solvePuzzle', data)
  })
  socket.on('tossupMode', () => {
    puzzleNs.emit('tossupMode')
  })
  socket.on('normalMode', () => {
    puzzleNs.emit('normalMode')
  })
  socket.on('spinWheel', (data) => {
    wheelNs.emit('spinWheel', (data))
  })
  socket.on('enablePt', () => {
    wheelNs.emit('enablePt')
  })
  socket.on('disablePt', () => {
    wheelNs.emit('disablePt')
  })
  socket.on('enableBm', () => {
    wheelNs.emit('enableBm')
  })
  socket.on('disableBm', () => {
    wheelNs.emit('disableBm')
  })
  socket.on('enableDb', () => {
    wheelNs.emit('enableDb')
  })
  socket.on('disableDb', () => {
    wheelNs.emit('disableDb')
  })
  socket.on('30s', () => {
    puzzleNs.emit('30s')
  })
  socket.on('10s', () => {
    puzzleNs.emit('10s')
  })
  socket.on('playpt', () => {
    wheelNs.emit('playpt')
  })
  socket.on('playbm', () => {
    wheelNs.emit('playbm')
  })
  socket.on('playtlmm', () => {
    wheelNs.emit('playtlmm')
  })
  socket.on('playcd', () => {
    wheelNs.emit('playcd')
  })
  socket.on('playmd', () => {
    wheelNs.emit('playmd')
  })
  socket.on('playml', () => {
    wheelNs.emit('playml')
  })
  socket.on('playsai', () => {
    wheelNs.emit('playsai')
  })
  socket.on('playnen1', () => {
    wheelNs.emit('playnen1')
  })
  socket.on('playnen2', () => {
    wheelNs.emit('playnen2')
  })
})