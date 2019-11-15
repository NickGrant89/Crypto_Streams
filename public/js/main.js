//Reset streamkey

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

//Delete all alerts

$(document).ready(function(){
    $('.delAllAlert').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        console.log(id);
        var delDevice =  confirm('Are you sure you want to delete all your alerts?');
        if(delDevice == true){
            $.ajax({
                type:'DELETE',
                url: '/users/deletealerts/'+id,
                success: function(response){
                 alert('Deleted');
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

//Push stream.

$(document).ready(function(){
  $('.pushStream').on('click', function(){
    var streamKey = $("#streamKey").val();
    var userStreamKey = $("#userStreamKey").val();
    var relayUrl = $( "#relay option:selected" ).text();
    
    var pushStream =  confirm('Are you sure you want to go Live?');

    var dataPush =  {
    "app"        : "live",
    "name"       : userStreamKey,
    "vc"         : "libx264",
    "ac"         : "aac",
    "url"        : relayUrl + streamKey,
    "appendName" : false
    }       
    var dataJson = JSON.stringify(dataPush);
    if(pushStream == true){
        $.ajax({
            type:'POST',
            data: dataJson,
            url: 'http://rtmp.darkknight.co.uk:8888/api/relay/push',
            dataType: "json",
            contentType: "application/json",
            statusCode: {
            200: function() {
                alert('Stream has been pushed, please wait!');
                window.location.href='/'
                },
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

//Add relay.

$(document).ready(function(){
    $('.addDest').on('click', function(){
        var name = $("#name").val();
        var streamUrl = $("#streamUrl").val();
        var streamkey = $("#streamkey").val();
        var pushStream =  confirm('Are you sure you want to add this destination?');
        var dataPush =  {
          "name"       : name,
          "streamurl"  : streamUrl,
          "streamkey"  : streamkey,
          }       
        var dataJson = JSON.stringify(dataPush);
        console.log(dataPush);
        if(pushStream == true){
            $.ajax({
                type:'POST',
                data: dataJson,
                url: '/users/addDest',
                dataType: "json",
                contentType: "application/json",
                success: function(response){
                    alert('Deleted');
                    window.location.href='/'
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

$(document).ready(function(){
    $('.ytLive').on('click', function(){
        var ytStreamkey = $("#ytStreamkey").val()
        var streamKey = $("#streamkey").val()
        var streamKey = relay.streamurl;
        var ytStream =  confirm('Are you sure you want to go Live?');
        var dataPush =  {
          "app"        : "live",
          "name"       : streamKey,
          "vc"         : "libx264",
          "ac"         : "aac",
          "url"        : "rtmp://a.rtmp.youtube.com/live2/"+ytStreamkey,
          "appendName" : false
          }       
        var dataJson = JSON.stringify(dataPush);
        if(ytStream == true){
            $.ajax({
                type:'POST',
                data: dataJson,
                url: 'http://rtmp.darkknight.co.uk:8888/api/relay/push',
                dataType: "json",
                contentType: "application/json",
                success: function(response,){
                 alert(response);
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

  //Get single relay.

  $(document).ready(function(){
    $('.editDest').on('click', function(e){
        var relayId = $("#ytStreamkey").val()
        $target = $(e.target);
        const id = $target.attr('data-id');
        //var ytStream =  confirm('Are you sure you want to go Live?');
          
        //var dataJson = JSON.stringify(dataPush);
            $.ajax({
                type:'GET',
                //data: dataJson,
                url: '/relays/'+id,
                dataType: "json",
                contentType: "application/json",
                success: function(response){
                 //alert(response.name);
                 $("#relayId").val(response._id);
                 $("#name").val(response.name);
                 $("#streamUrl").val(response.streamurl);
                },
                error: function(err){
                       console.log(err); 
                },
                
            });
     
  
    });
  });

  //Delete relay
  $(document).ready(function(){
    $('.delDest').on('click', function(e){
        var relayId = $("#ytStreamkey").val()
        $target = $(e.target);
        const id = $target.attr('data-id');
        var ytStream =  confirm('Are you sure you want to delete relay?');
        if(ytStream == true){
            $.ajax({
                type:'DELETE',
                url: '/relays/delete/'+id,
                dataType: "json",
                contentType: "application/json",
                statusCode: {
                    200: function() {
                        alert('deleted');
                        window.location.href='/'
                        },
                    },
                success: function(response){
                 alert('deleted');
                 window.location.href='/'
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

// Save edited Relay  
  $(document).ready(function(){
    $('.saveDest').on('click', function(){
    var relayId = $("#relayId").val()
    var name= $("#name").val();
    var streamurl = $("#streamUrl").val();
    var relaysave =  confirm('Are you sure you want to save?');
        if(relaysave == true){
            var dataPush =  {
                "name"        : name,
                "streamurl"   : streamurl,
                }       
              var dataJson = JSON.stringify(dataPush);
            $.ajax({
                type:'POST',
                url: '/relays/edit/'+relayId,
                data:dataJson,
                dataType: "json",
                contentType: "application/json",
                statusCode: {
                    200: function() {
                        alert('deleted');
                        window.location.href='/'
                        },
                    },
                success: function(response){
                 alert('deleted');
                 window.location.href='/'
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