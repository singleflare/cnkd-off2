const hostSocket = io('/host');

hostSocket.on('scoreboard', (data) => {
  $('#p1Name').text(data.p1Name);
  $('#p2Name').text(data.p2Name);
  $('#p3Name').text(data.p3Name);
  $('#p1Score').text(data.p1Score);
  $('#p2Score').text(data.p2Score);
  $('#p3Score').text(data.p3Score);
});