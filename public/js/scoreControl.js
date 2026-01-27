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