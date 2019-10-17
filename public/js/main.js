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
  $('.fbLive').on('click', function(){
      var fbStreamkey = $("#fbStreamkey").val()
      var streamKey = $("#streamkey").val()
      var fbStream =  confirm('Are you sure you want to go Live?');
      var dataPush =  {
        "app"        : "live",
        "name"       : streamKey,
        "vc"         : "libx264",
        "ac"         : "aac",
        "url"        : "rtmps://live-api-s.facebook.com:443/rtmp/"+fbStreamkey,
        "appendName" : false
        }       
      var dataJson = JSON.stringify(dataPush);
      if(fbStream == true){
          $.ajax({
              type:'POST',
              data: dataJson,
              url: 'http://rtmp.darkknight.co.uk:8888/api/relay/push',
              dataType: "json",
              contentType: "application/json",
              success: function(response,){
               //window.location.href='/'
              },
              error: function(err){
                     console.log(err); 
              },
              
          });
      }
      else{
         
      }

  });
});
