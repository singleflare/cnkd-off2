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
console.log('Host: http://localhost:3000/host');

app.get('/puzzle', (req, res) => res.sendFile(join(__dirname, '/public/html/puzzle.html')))
app.get('/control', (req, res) => res.sendFile(join(__dirname, '/public/html/control.html')))
app.get('/wheel', (req, res) => res.sendFile(join(__dirname, '/public/html/wheel.html')))
app.get('/host', (req, res) => res.sendFile(join(__dirname, '/public/html/host.html')))
app.get('/puzzleFullScreen', (req, res) => res.sendFile(join(__dirname, '/public/html/puzzleFullScreen.html')))
app.get('/puzzle2012', (req, res) => res.sendFile(join(__dirname, '/public/html/puzzle2012.html')))

const puzzleNs = ioServer.of('/puzzle');
const wheelNs = ioServer.of('/wheel');
const controlNs = ioServer.of('/control');
const hostNs = ioServer.of('/host');

puzzleNs.on('connection', (socket) => {
  socket.on('disableLetterBtn',letterNumber=>{
    console.log(letterNumber)
    controlNs.emit('disableLetterBtn',letterNumber)
  })
})

controlNs.on('connection', (socket) => {
  socket.on('showLetter', (letterNumber) => {
    puzzleNs.emit('showLetter', letterNumber)
  })
  socket.on('showPuzzle', (data) => {
    puzzleNs.emit('showPuzzle', data)
  })
  socket.on('sendPuzzleToPuzzleBoard', (puzzle,letters,total,question,explain,solved) => {
    puzzleNs.emit('sendPuzzleToPuzzleBoard', puzzle)
    console.log(question,explain)
    hostNs.emit('letters',letters,total,question,explain,solved)
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
  socket.on('playSound',url=>{
    console.log(url)
    puzzleNs.emit('playSound',url)
  })
  socket.on('stopSound',url=>{
    puzzleNs.emit('stopSound')
  })
  socket.on('deleteCloudPuzzle', () => {
    puzzleNs.emit('deleteCloudPuzzle')
  })
  socket.on('showWelcomePuzzle',()=>{
    puzzleNs.emit('showWelcomePuzzle')
  })
  socket.on('openRandomLetterTossup',(data)=>{
    console.log(data)
    puzzleNs.emit('openRandomLetterTossup',data)
  })
  socket.on('stopOpenRandomLetterTossup',(data)=>{
    puzzleNs.emit('stopOpenRandomLetterTossup',data)
  })
  
  socket.on('scoreboard', (data) => {
    hostNs.emit('scoreboard', data)
    puzzleNs.emit('scoreboard',data)
  })
})