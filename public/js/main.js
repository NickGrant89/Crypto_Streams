$(document).ready(function(){
    $('.resetstreamkey').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        var delDevice =  confirm('Are you sure you want to reset your stream key?');
        if(delDevice == true){
            $.ajax({
                type:'POST',
                url: '/users/streamkey/'+id,
                success: function(response){
                 alert('Stream Key Reset');
                 window.location.href='/'
                },
                error: function(err){
                       console.log(err); 
                }
            });
        }
        else{
           
        }

    });
});

$(document).ready(function(){
    $(function () {
        var socket = io();
        $('form').submit(function(e){
          e.preventDefault(); // prevents page reloading
          socket.emit('chat message', $('#m').val());
          $('#m').val('');
          return false;
        });
        socket.on('chat message', function(msg){
          $('#messages').append($('<li>').text(msg));
        });
      });
});