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

const wheelSocket = io('/wheel');

let currentRotation;
$(async function () {
  let currentRotationRef = await getDocEntry('cnkd-off', 'wheel')
  currentRotation = currentRotationRef.degree
  document.getElementById('bigWheel').style.rotate = currentRotation + 'deg';
})


// const docRef = doc(db, 'cnkd-off', 'puzzleboard');
// const largeArray = Array(64).fill('')
// setDoc(docRef, { hasLetter: largeArray, isShown: largeArray }).then(() => {
//   console.log("Document written with ID: ", docRef.id);
// }).catch((error) => {
//   console.error("Error adding document: ", error);
// });



const spinSound = new Howl({
  src: ['../media/sounds/2016.mp3'],
  volume: 0.5
})
const bmSound = new Howl({
  src: ['../media/sounds/bm.mp3'],
  volume: 0.5
})
wheelSocket.on('playbm', () => {
  bmSound.play()
})
const ptSound = new Howl({
  src: ['../media/sounds/pt.mp3'],
  volume: 0.5
})
wheelSocket.on('playpt', () => {
  ptSound.play()
})
const mdSound = new Howl({
  src: ['../media/sounds/md.mp3'],
  volume: 0.5
})
wheelSocket.on('playmd', () => {
  mdSound.play()
})
const mlSound = new Howl({
  src: ['../media/sounds/ml.mp3'],
  volume: 0.5
})
wheelSocket.on('playml', () => {
  mlSound.play()
})
const tlmmSound = new Howl({
  src: ['../media/sounds/tlmm.mp3'],
  volume: 0.5
})
wheelSocket.on('playtlmm', () => {
  tlmmSound.play()
})
const cdSound = new Howl({
  src: ['../media/sounds/cd.mp3'],
  volume: 0.5
});
wheelSocket.on('playcd', () => {
  cdSound.play()
})
const saiSound = new Howl({
  src: ['../media/sounds/sai.mp3'],
  volume: 0.5
});
wheelSocket.on('playsai', () => {
  saiSound.play()
})
const nen1Sound = new Howl({
  src: ['../media/sounds/nen1.mp3'],
  volume: 0.5
});
wheelSocket.on('playnen1', () => {
  nen1Sound.play()
})
const nen2Sound = new Howl({
  src: ['../media/sounds/nen2.mp3'],
  volume: 0.5
});
wheelSocket.on('playnen2', () => {
  nen2Sound.play()
})

let tempCurrentRotation = 0
async function spin(deg) {
  let nextRotation = deg
  tempCurrentRotation += nextRotation
  document.getElementById('bigWheel').style.transform = 'rotate(' + tempCurrentRotation + 'deg)';
  spinSound.play()
  await updateDocEntry('cnkd-off', 'wheel', { degree: currentRotation + nextRotation })
  let currentRotationRef = await getDocEntry('cnkd-off', 'wheel')
  currentRotation = currentRotationRef.degree
}

wheelSocket.on('spinWheel', (deg) => {
  spin(deg);
})
wheelSocket.on('enablePt', () => {
  $('#pt').css('opacity', 1)
})
wheelSocket.on('disablePt', () => {
  $('#pt').css('opacity', 0)
})
wheelSocket.on('enableBm', () => {
  $('#bm1').css('opacity', 1)
  $('#bm2').css('opacity', 1)
})
wheelSocket.on('disableBm', () => {
  $('#bm1').css('opacity', 0)
  $('#bm2').css('opacity', 0)
})
wheelSocket.on('enableDb', () => {
  $('#dbWheel').css('opacity', 1)
})
wheelSocket.on('disableDb', () => {
  $('#dbWheel').css('opacity', 0)
})

