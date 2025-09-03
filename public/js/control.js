const controlSocket = io('/control');

$(()=> {
  for (let i = 0; i <= 63; i++) {
    $('#controlLetters').append('<button class="letterBtn" id="letterBtn' + i + '"><p></p></div>');
    $('#letterBtn' + i).click(() => {
      controlSocket.emit('showLetter', i)
      $('#letterBtn' + i).css('background-color', 'white')
      $('#letterBtn' + i + ' p').css('color', 'black')
    })
    $('.puzzleInput').append('<input type="text" id="letterInput' + i + '" class="letterInput" maxlength="1">')
  }
})

let puzzles = [];
let solvedPuzzles = [];
let questions=[]
let explains=[]

$('#fileInput').on('change', async (e)=> {
  const file = e.target.files[0]
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  
  try{
    for(let row=0;row<100;row+=5){
      let puzzle=[],solve=[]
      questions.push(sheet[XLSX.utils.encode_cell({c:0, r:row})].v)
      explains.push(sheet[XLSX.utils.encode_cell({c:17, r:row})].v)
      for(let col=0;col<16;col++){
        puzzle.push(sheet[XLSX.utils.encode_cell({c:col, r:row+1})]==undefined?'':sheet[XLSX.utils.encode_cell({c:col, r:row+1})].v)
        solve.push(sheet[XLSX.utils.encode_cell({c:col+17, r:row+1})]==undefined?'':sheet[XLSX.utils.encode_cell({c:col+17, r:row+1})].v)
      }
      for(let col=0;col<16;col++){
        puzzle.push(sheet[XLSX.utils.encode_cell({c:col, r:row+2})]==undefined?'':sheet[XLSX.utils.encode_cell({c:col, r:row+2})].v)
        solve.push(sheet[XLSX.utils.encode_cell({c:col+17, r:row+2})]==undefined?'':sheet[XLSX.utils.encode_cell({c:col+17, r:row+2})].v)
      }
      for(let col=0;col<16;col++){
        puzzle.push(sheet[XLSX.utils.encode_cell({c:col, r:row+3})]==undefined?'':sheet[XLSX.utils.encode_cell({c:col, r:row+3})].v)
        solve.push(sheet[XLSX.utils.encode_cell({c:col+17, r:row+3})]==undefined?'':sheet[XLSX.utils.encode_cell({c:col+17, r:row+3})].v)
      }
      for(let col=0;col<16;col++){
        puzzle.push(sheet[XLSX.utils.encode_cell({c:col, r:row+4})]==undefined?'':sheet[XLSX.utils.encode_cell({c:col, r:row+4})].v)
        solve.push(sheet[XLSX.utils.encode_cell({c:col+17, r:row+4})]==undefined?'':sheet[XLSX.utils.encode_cell({c:col+17, r:row+4})].v)
      }
      console.log(puzzle,solve)
      puzzles.push(puzzle)
      solvedPuzzles.push(solve)
    }
  }
  catch(e){console.log(e)}
  console.log(questions,explains,puzzles)
  

  e.target.value = '';
  /*questions.push(sheet.A1.v)
  questions.push(sheet.A6.v)
  questions.push(sheet.A11.v)
  questions.push(sheet.A16.v)
  questions.push(sheet.A21.v)
  questions.push(sheet.A26.v)
  questions.push(sheet.A31.v)
  explains.push(sheet.R1.v)
  explains.push(sheet.R6.v)
  explains.push(sheet.R11.v)
  explains.push(sheet.R16.v)
  explains.push(sheet.R21.v)
  explains.push(sheet.R26.v)
  explains.push(sheet.R31.v)

  console.log(questions,explains)

  const tossup1Range = XLSX.utils.decode_range('A2:P5');
  const tossup2Range = XLSX.utils.decode_range('A7:P10');
  const round1Range = XLSX.utils.decode_range('A12:P15');
  const round2Range = XLSX.utils.decode_range('A17:P20');
  const round3Range = XLSX.utils.decode_range('A22:P25');
  const audienceRoundRange = XLSX.utils.decode_range('A27:P30');
  const bonusRoundRange = XLSX.utils.decode_range('A32:P35');
  const solvedTossup1Range = XLSX.utils.decode_range('R2:AG5');
  const solvedTossup2Range = XLSX.utils.decode_range('R7:AG10');
  const solvedRound1Range = XLSX.utils.decode_range('R12:AG15');
  const solvedRound2Range = XLSX.utils.decode_range('R17:AG20');
  const solvedRound3Range = XLSX.utils.decode_range('R22:AG25');
  const solvedAudienceRoundRange = XLSX.utils.decode_range('R27:AG30');
  const solvedBonusRoundRange = XLSX.utils.decode_range('R32:AG35');

  const tossup1 = [];
  const tossup2 = [];
  const round1 = [];
  const round2 = [];
  const round3 = [];
  const audienceRound = [];
  const bonusRound = [];
  const solvedTossup1 = [];
  const solvedTossup2 = [];
  const solvedRound1 = [];
  const solvedRound2 = [];
  const solvedRound3 = [];
  const solvedAudienceRound = [];
  const solvedBonusRound = [];

  puzzles = [tossup1, tossup2, round1, round2, round3, audienceRound, bonusRound];
  puzzleRanges = [tossup1Range, tossup2Range, round1Range, round2Range, round3Range, audienceRoundRange, bonusRoundRange];

  solvedPuzzles = [solvedTossup1, solvedTossup2, solvedRound1, solvedRound2, solvedRound3, solvedAudienceRound, solvedBonusRound];
  solvedPuzzleRanges = [solvedTossup1Range, solvedTossup2Range, solvedRound1Range, solvedRound2Range, solvedRound3Range, solvedAudienceRoundRange, solvedBonusRoundRange];

  puzzles.forEach((puzzle, i) => {
    let puzzleRange = puzzleRanges[i];
    let letters = [];
    for (let R = puzzleRange.s.r; R <= puzzleRange.e.r; ++R) {
      for (let C = puzzleRange.s.c; C <= puzzleRange.e.c; ++C) {
        let cellAddress = { c: C, r: R };
        let cellRef = XLSX.utils.encode_cell(cellAddress);
        let cell = sheet[cellRef];
        letters.push(cell ? cell.v : null);
      }
    }
    puzzle.push(letters);
  });

  solvedPuzzles.forEach((solvedPuzzle, i) => {
    let solvedPuzzleRange = solvedPuzzleRanges[i];
    let letters = [];
    for (let R = solvedPuzzleRange.s.r; R <= solvedPuzzleRange.e.r; ++R) {
      for (let C = solvedPuzzleRange.s.c; C <= solvedPuzzleRange.e.c; ++C) {
        let cellAddress = { c: C, r: R };
        let cellRef = XLSX.utils.encode_cell(cellAddress);
        let cell = sheet[cellRef];
        letters.push(cell ? cell.v : null);
      }
    }
    solvedPuzzle.push(letters);
  });
  console.log(puzzles, solvedPuzzles)*/
})


function countLetters(puzzleArray){
  let letters=['A','Ă','Â','B','C','D','Đ','E','Ê','G','H','I','K','L','M','N','O','Ô','Ơ','P','Q','R','S','T','U','Ư','V','X','Y']
  let numberOfLetters=[]
  let totalNumOfLetters=0
  letters.forEach(letter=>{
    let letterCount=0
    puzzles.forEach(puzzleLetter=>{
      if(puzzleLetter==letter) letterCount++
    })
    numberOfLetters.push(letterCount)
    totalNumOfLetters+=letterCount
  })
  console.log(totalNumOfLetters)
  return [numberOfLetters,totalNumOfLetters]
}

function setControlLetterVisibility(puzzleNumber) {
  for (let i = 0; i <= 63; i++) {
    $('#letterBtn'+i).prop('disabled',false)
    puzzles[puzzleNumber][i] != ''?$('#letterBtn' + i + ' p').text(puzzles[puzzleNumber][i]):$('#letterBtn'+i).prop('disabled',true)
  }
}

function resetControlLetters() {
  for (let i = 0; i <= 63; i++) {
    $('#letterBtn' + i + ' p').text('')
    $('#letterBtn' + i).css('background-color', 'black')
    $('#letterBtn' + i + ' p').css('color', 'white')
    $('#letterBtn' + i).hover(() => {
      $('#letterBtn' + i).css('background-color', 'white')
      $('#letterBtn' + i + ' p').css('color', 'black')
    })
    $('#letterBtn' + i).mouseleave(() => {
      $('#letterBtn' + i).css('background-color', 'black')
      $('#letterBtn' + i + ' p').css('color', 'white')
    })
  }
}

let puzzleNumber = -1
$('#prevRoundBtn').click(() => {
  controlSocket.emit('deleteCloudPuzzle')
  puzzleNumber--;
  console.log(countLetters(puzzles[puzzleNumber]))
  controlSocket.emit('sendPuzzleToPuzzleBoard', puzzles[puzzleNumber],countLetters(puzzles[puzzleNumber])[0],countLetters(puzzles[puzzleNumber])[1],questions[puzzleNumber],explains[puzzleNumber],solvedPuzzles[puzzleNumber])
  resetControlLetters()
  setControlLetterVisibility(puzzleNumber)
})
$('#nextRoundBtn').click(() => {
  controlSocket.emit('deleteCloudPuzzle')
  puzzleNumber++;
  console.log(countLetters(puzzles[puzzleNumber])[0])
  controlSocket.emit('sendPuzzleToPuzzleBoard', puzzles[puzzleNumber],countLetters(puzzles[puzzleNumber])[0],countLetters(puzzles[puzzleNumber])[1],questions[puzzleNumber],explains[puzzleNumber],solvedPuzzles[puzzleNumber])
  resetControlLetters()
  setControlLetterVisibility(puzzleNumber)
})
$('#showPuzzle').click(() => {
  controlSocket.emit('showPuzzle', puzzles[puzzleNumber])
  controlSocket.emit('playSound','../media/sounds/moochu.mp3')
})
$('#solvePuzzle').click(() => {
  controlSocket.emit('solvePuzzle', solvedPuzzles[puzzleNumber])
  controlSocket.emit('playSound','../media/sounds/giaiochu.mp3')
})
let puzzleMode = 'tossup'
$('#puzzleMode').click(() => {
  if (puzzleMode == 'normal') {
    controlSocket.emit('tossupMode')
    puzzleMode = 'tossup'
    $('#puzzleMode').text('Chế độ: Đoán nhanh')
  }
  else if (puzzleMode == 'tossup') {
    controlSocket.emit('normalMode')
    puzzleMode = 'normal'
    $('#puzzleMode').text('Chế độ: Vòng thường')
  }
})

function getRandomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}
$('#spinWheel').click(() => {
  controlSocket.emit('spinWheel', (getRandomNumberBetween(360 * 4, 360 * 6)))
})

let isBmEnabled = false
let isPtEnabled = false
let isDbEnabled = false
$('#togglePt').click(() => {
  if (!isPtEnabled) {
    controlSocket.emit('enablePt')
    isPtEnabled = true
    $('#togglePt').text('Ô phần thưởng: Bật')
  }
  else {
    controlSocket.emit('disablePt')
    isPtEnabled = false
    $('#togglePt').text('Ô phần thưởng: Tắt')
  }
})
$('#toggleBm').click(() => {
  if (!isBmEnabled) {
    controlSocket.emit('enableBm')
    isBmEnabled = true
    $('#toggleBm').text('Ô bí mật: Bật')
  }
  else {
    controlSocket.emit('disableBm')
    isBmEnabled = false
    $('#toggleBm').text('Ô bí mật: Tắt')
  }
})
$('#toggleDb').click(() => {
  if (!isDbEnabled) {
    controlSocket.emit('enableDb')
    isDbEnabled = true
    $('#toggleDb').text('Nón đặc biệt: Bật')
  }
  else {
    controlSocket.emit('disableDb')
    isDbEnabled = false
    $('#toggleDb').text('Nón đặc biệt: Tắt')
  }
})

$('#spin2012Btn').click(() => {
  controlSocket.emit('playSound','../media/sounds/2012.mp3')
})
$('#spin2012HighBtn').click(() => {
  controlSocket.emit('playSound','https://cdn.glitch.global/d0e93c15-7185-4dae-8b43-4957a4b0d047/2012%20cao.wav?v=1747919401160')
})
$('#spin2016Btn').click(() => {
  controlSocket.emit('playSound','../media/sounds/2016.mp3')
})
$('#ptBtn').click(() => {
  controlSocket.emit('playSound','../media/sounds/pt.mp3')
})
$('#bmBtn').click(() => {
  controlSocket.emit('playSound','../media/sounds/bm.mp3')
})
$('#tlmmBtn').click(() => {
  controlSocket.emit('playSound','../media/sounds/tlmm.mp3')
})
$('#cdBtn').click(() => {
  controlSocket.emit('playSound','../media/sounds/cd.mp3')
})
$('#mdBtn').click(() => {
  controlSocket.emit('playSound','../media/sounds/md.mp3')
})
$('#mlBtn').click(() => {
  controlSocket.emit('playSound','../media/sounds/ml.mp3')
})
$('#saiBtn').click(() => {
  controlSocket.emit('playSound','../media/sounds/sai.mp3')
})
$('#nen1Btn').click(() => {
  controlSocket.emit('playSound','../media/sounds/nen1.mp3')
})
$('#nen2Btn').click(() => {
  controlSocket.emit('playSound','../media/sounds/nen2.mp3')
})
$('#30sBtn').click(() => {
  controlSocket.emit('playSound','../media/sounds/30s.mp3')
  controlSocket.emit('30s')
})
$('#10sBtn').click(() => {
  controlSocket.emit('playSound','../media/sounds/10s.mp3')
  controlSocket.emit('10s')
})
$('#stopBtn').click(() => {
  controlSocket.emit('stopSound')
})

$('#showWelcomePuzzle').click(()=>{
  controlSocket.emit('showWelcomePuzzle')
})
$('#openRandomLetterTossup').click(()=>{
  console.log(puzzles[puzzleNumber])
  controlSocket.emit('openRandomLetterTossup',puzzles[puzzleNumber])
})
$('#stopOpenRandomLetterTossup').click(()=>{
  controlSocket.emit('stopOpenRandomLetterTossup',puzzles[puzzleNumber])
})

$('#deleteCloudPuzzle').click(() => {
  controlSocket.emit('deleteCloudPuzzle')
})

let p1Score = 0, p2Score = 0, p3Score = 0,p1Total=0,p2Total=0,p3Total=0

function plus(player, score) {
  if (player == 1) {
    p1Score += score
    $('#p1Score').text(p1Score)
  }
  else if (player == 2) {
    p2Score += score
    $('#p2Score').text(p2Score)
  }
  else if (player == 3) {
    p3Score += score
    $('#p3Score').text(p3Score)
  }
}
function minus(player, score) {
  if (player == 1) {
    p1Score -= score
    $('#p1Score').text(p1Score)
  }
  else if (player == 2) {
    p2Score -= score
    $('#p2Score').text(p2Score)
  }
  else if (player == 3) {
    p3Score -= score
    $('#p3Score').text(p3Score)
  }
}
function double(player) {
  if (player == 1) {
    p1Score *= 2
    $('#p1Score').text(p1Score)
  }
  else if (player == 2) {
    p2Score *= 2
    $('#p2Score').text(p2Score)
  }
  else if (player == 3) {
    p3Score *= 2
    $('#p3Score').text(p3Score)
  }
}
function half(player) {
  if (player == 1) {
    p1Score /= 2
    $('#p1Score').text(p1Score)
  }
  else if (player == 2) {
    p2Score /= 2
    $('#p2Score').text(p2Score)
  }
  else if (player == 3) {
    p3Score /= 2
    $('#p3Score').text(p3Score)
  }
}
function addTotal(player,score){
  if(player==1){
    p1Total+=score
    $('#p1Total').text(p1Total)
  }
  if(player==2){
    p2Total+=score
    $('#p2Total').text(p2Total)
  }
  if(player==3){
    p3Total+=score
    $('#p3Total').text(p3Total)
  }
}

function updateHostScoreboard() {
  let p1Name = $('#p1Name').val()
  let p2Name = $('#p2Name').val()
  let p3Name = $('#p3Name').val()
  controlSocket.emit('scoreboard', { p1Name, p2Name, p3Name, p1Score, p2Score, p3Score,p1Total,p2Total,p3Total })
}

$('#p1Set').click(() => {
  p1Score = parseInt($('#p1ScoreInput').val())
  $('#p1Score').text(p1Score)
  updateHostScoreboard()
})
$('#p1Plus').click(() => {
  let scoreToChange = $('#p1ScoreInput').val()
  plus(1, parseInt(scoreToChange))
  updateHostScoreboard()
})
$('#p1Minus').click(() => {
  let scoreToChange = $('#p1ScoreInput').val()
  minus(1, parseInt(scoreToChange))
  updateHostScoreboard()
})
$('#p1Double').click(() => {
  double(1)
  updateHostScoreboard()
})
$('#p1Half').click(() => {
  half(1)
  updateHostScoreboard()
})
$('#p1Clear').click(() => {
  p1Score = 0
  $('#p1Score').text(p1Score)
  updateHostScoreboard()
})
$('#p1SetTotal').click(()=>{
  p1Total= parseInt($('#p1TotalInput').val())
  $('#p1Total').text(p1Total)
  updateHostScoreboard()
})
$('#p1AddTotal').click(()=>{
  p1Total+= parseInt($('#p1TotalInput').val())
  $('#p1Total').text(p1Total)
  updateHostScoreboard()
})
$('#p2Set').click(() => {
  p2Score = parseInt($('#p2ScoreInput').val())
  $('#p2Score').text(p2Score)
  updateHostScoreboard()
})
$('#p2Plus').click(() => {
  let scoreToChange = $('#p2ScoreInput').val()
  plus(2, parseInt(scoreToChange))
  updateHostScoreboard()
})
$('#p2Minus').click(() => {
  let scoreToChange = $('#p2ScoreInput').val()
  minus(2, parseInt(scoreToChange))
  updateHostScoreboard()
})
$('#p2Double').click(() => {
  double(2)
  updateHostScoreboard()
})
$('#p2Half').click(() => {
  half(2)
  updateHostScoreboard()
})
$('#p2Clear').click(() => {
  p2Score = 0
  $('#p2Score').text(p2Score)
  updateHostScoreboard()
})
$('#p2SetTotal').click(()=>{
  p2Total= parseInt($('#p2TotalInput').val())
  $('#p2Total').text(p2Total)
  updateHostScoreboard()
})
$('#p2AddTotal').click(()=>{
  p2Total+= parseInt($('#p2TotalInput').val())
  $('#p2Total').text(p2Total)
  updateHostScoreboard()
})
$('#p3Set').click(() => {
  p3Score = parseInt($('#p3ScoreInput').val())
  $('#p3Score').text(p3Score)
  updateHostScoreboard()
})
$('#p3Plus').click(() => {
  let scoreToChange = $('#p3ScoreInput').val()
  plus(3, parseInt(scoreToChange))
  updateHostScoreboard()
})
$('#p3Minus').click(() => {
  let scoreToChange = $('#p3ScoreInput').val()
  minus(3, parseInt(scoreToChange))
  updateHostScoreboard()
})
$('#p3Double').click(() => {
  double(3)
  updateHostScoreboard()
})
$('#p3Half').click(() => {
  half(3)
  updateHostScoreboard()
})
$('#p3Clear').click(() => {
  p3Score = 0
  $('#p3Score').text(p3Score)
  updateHostScoreboard()
})
$('#p3SetTotal').click(()=>{
  p3Total= parseInt($('#p3TotalInput').val())
  $('#p3Total').text(p3Total)
  updateHostScoreboard()
})
$('#p3AddTotal').click(()=>{
  p3Total+= parseInt($('#p3TotalInput').val())
  $('#p3Total').text(p3Total)
  updateHostScoreboard()
})

controlSocket.on('disableLetterBtn',letterNumber=>{
  $('#letterBtn'+letterNumber).prop('disabled',true)
})