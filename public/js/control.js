const controlSocket = io('/control');

$(function () {
  for (let i = 16; i <= 63; i++) {
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
let puzzleRanges = [];
let solvedPuzzles = [];
let solvedPuzzleRanges = [];

async function loadFile(e) {
  try {
    const file = e.target.files[0];
    e.target.value = '';
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data)
    const sheet = workbook.Sheets['Sheet1']

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
    console.log(puzzles, solvedPuzzles)
  } catch (e) {
    console.error(e)
  }
}
$('#fileInput').on('change', loadFile)

function setControlLetterVisibility(puzzleNumber) {
  for (let i = 16; i <= 63; i++) {
    if (puzzles[puzzleNumber][0][i] != null) {
      console.log(puzzles[puzzleNumber][0][i])
      $('#letterBtn' + i + ' p').text(puzzles[puzzleNumber][0][i])
    }
  }
}

function resetControlLetters() {
  for (let i = 16; i <= 63; i++) {
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
let roundNames = ['Đoán nhanh 1', 'Đoán nhanh 2', 'Vòng 1', 'Vòng 2', 'Vòng 3', 'Vòng khán giả', 'Vòng đặc biệt']
$('#prevRoundBtn').click(() => {
  controlSocket.emit('deleteCloudPuzzle')
  puzzleNumber--;
  controlSocket.emit('sendPuzzleToPuzzleBoard', puzzles[puzzleNumber])
  $('#round').text(roundNames[puzzleNumber])
  resetControlLetters()
  setControlLetterVisibility(puzzleNumber)
})
$('#nextRoundBtn').click(() => {
  controlSocket.emit('deleteCloudPuzzle')
  puzzleNumber++;
  controlSocket.emit('sendPuzzleToPuzzleBoard', puzzles[puzzleNumber])
  $('#round').text(roundNames[puzzleNumber])
  resetControlLetters()
  setControlLetterVisibility(puzzleNumber)
})
$('#showPuzzle').click(() => {
  controlSocket.emit('showPuzzle', puzzles[puzzleNumber])
})
$('#solvePuzzle').click(() => {
  controlSocket.emit('solvePuzzle', solvedPuzzles[puzzleNumber])
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
$('#30sBtn').click(() => {
  controlSocket.emit('30s')
})
$('#10sBtn').click(() => {
  controlSocket.emit('10s')
})

$('#ptBtn').click(() => {
  controlSocket.emit('playpt')
})
$('#bmBtn').click(() => {
  controlSocket.emit('playbm')
})
$('#tlmmBtn').click(() => {
  controlSocket.emit('playtlmm')
})
$('#cdBtn').click(() => {
  controlSocket.emit('playcd')
})
$('#mdBtn').click(() => {
  controlSocket.emit('playmd')
})
$('#mlBtn').click(() => {
  controlSocket.emit('playml')
})
$('#saiBtn').click(() => {
  controlSocket.emit('playsai')
})
$('#nen1Btn').click(() => {
  controlSocket.emit('playnen1')
})
$('#nen2Btn').click(() => {
  controlSocket.emit('playnen2')
})
$('#30sBtn').click(() => {
  controlSocket.emit('play30s')
})
$('#10sBtn').click(() => {
  controlSocket.emit('play10s')
})
$('#stopBtn').click(() => {
  controlSocket.emit('stopSound')
})

let customPuzzle = []
$('#showCustomPuzzle').click(() => {
  for (let i = 16; i < 64; i++) {
    customPuzzle[i] = $('#letterInput' + i).val()
    if (customPuzzle[i] != null)
      $('#letterBtn' + i + ' p').text(customPuzzle[i])
  }
  controlSocket.emit('showPuzzle', customPuzzle)
})

$('#solveCustomPuzzle').click(() => {
  controlSocket.emit('solvePuzzle', customPuzzle)
})

$('#deleteCloudPuzzle').click(() => {
  controlSocket.emit('deleteCloudPuzzle')
})

let p1Score = 0, p2Score = 0, p3Score = 0

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

function updateHostScoreboard() {
  let p1Name = $('#p1Name').val()
  let p2Name = $('#p2Name').val()
  let p3Name = $('#p3Name').val()
  controlSocket.emit('scoreboard', { p1Name, p2Name, p3Name, p1Score, p2Score, p3Score })
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