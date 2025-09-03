const hostSocket = io('/host');

let alphabet=['A','Ă','Â','B','C','D','Đ','E','Ê','G','H','I','K','L','M','N','O','Ô','Ơ','P','Q','R','S','T','U','Ư','V','X','Y']
for(let i=1;i<=29;i++){
  $('#letters').append(`<button id='letter${i}'>${alphabet[i-1]}</button>`)
}
hostSocket.on('scoreboard', (data) => {
  $('#p1Name').text(data.p1Name);
  $('#p2Name').text(data.p2Name);
  $('#p3Name').text(data.p3Name);
  $('#p1Score').text(data.p1Score);
  $('#p2Score').text(data.p2Score);
  $('#p3Score').text(data.p3Score);
  $('#p1Total').text(data.p1Total);
  $('#p2Total').text(data.p2Total);
  $('#p3Total').text(data.p3Total);
});



hostSocket.on('letters',(letters,total,question,explain,puzzle)=>{
  console.log(letters,question,explain)
  $('#question').text(question)
  $('#explain').text(explain)
  $('#numOfLetters').text(total+' chữ cái')
  for(let i=1;i<=29;i++){
    $('#letter'+i).prop('disabled',false)
    $('#letter'+i).text(`${letters[i-1]} ${alphabet[i-1]}`)
    $('#letter'+i).on('click',()=>{
      console.log('click')
      $('#letter'+i).prop('disabled',true)
      console.log($('#letter'+i).prop())
    })
  }
  $('#puzzle').empty()
  for(let i=0;i<64;i++){
    $('#puzzle').append(`<div id='letter${i+1}'>${puzzle[0][i]!=null?puzzle[0][i]:''}</div>`)
  }
})

