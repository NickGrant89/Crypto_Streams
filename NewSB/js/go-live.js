$(document).ready(function(){
    $('#go-live').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        var delDevice =  confirm('Are you sure you want to Go Live?');
        if(delDevice == true){
            $.ajax({
                type:'',
                url: '/devices/'+id,
                success: function(response){
                 //alert('Device Deleted');
                 //window.location.href='/'
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
    $('.sign-out').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        let checkedin = 'checkedin='+false;
        console.log(id);
        var timeCheck =  confirm('Are you sure you want to sign out?');
        if(timeCheck == true){
            $.ajax({
                type:'POST',
                url: '/timesheets/signout/' +id,
                data: checkedin,
                success: function(response, data){
                alert('Signed out')
                //$('#table').DataTable().ajax.reload();
                location.reload();
                 //window.location.href='/'
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