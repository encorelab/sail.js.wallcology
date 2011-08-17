WallCology = {
    rollcallURL: 'http://rollcall.proto.encorelab.org',
    xmppDomain: 'proto.encorelab.org',
    groupchatRoom: 's3@conference.proto.encorelab.org',
    
    init: function() {
        console.log("Initializing...")
        
        Sail.modules
            .load('Rollcall.Authenticator', {mode: 'picker'})
            .load('Strophe.AutoConnector')
            .load('AuthStatusWidget')
            .thenRun(function () {
                Sail.autobindEvents(WallCology)
                
                var interval = window.setInterval(
                      function() {
                          if (PhoneGap.available) {
                              console.log("PhoneGap available!")
                              window.clearInterval(interval)
                          } else {
                              console.log("PhoneGap NOT available :(")
                          }
                      },
                      500
                    );
                
                $(document).ready(function() {
                    
                    $(document).bind('deviceready', function () {
                        WallCology.initPhonegap()
                    })
                    
                    $('#reload').click(function() {
                        console.log("Disconnecting...")
                        Sail.Strophe.disconnect()
                        console.log("Reloading "+location+"...")
                        location.reload()
                    })

                    $('#connecting').show()
                })

                $(Sail.app).trigger('initialized')
                return true
            })
    },
    
    initPhonegap: function() {
        alert("device ready!")
        
/*        $('#camera').click(function() {
            alert("Getting picture...")
            navigator.camera.getPicture(onSuccess, onFail, { quality: 100 }); 

            function onSuccess(imageData) {
                var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageData;
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
        })
*/    },
    
    authenticate: function() {
        console.log("Authenticating...")
        
        WallCology.rollcall = new Rollcall.Client(WallCology.rollcallURL)
        WallCology.token = WallCology.rollcall.getCurrentToken()

        if (!WallCology.token) {
            Rollcall.Authenticator.requestLogin()
        } else {
            WallCology.rollcall.fetchSessionForToken(WallCology.token, function(data) {
                WallCology.session = data.session
                $(WallCology).trigger('authenticated')
            })
        }
    },
    
    events: {
        sail: {
            
        },
        
        initialized: function(ev) {
            WallCology.authenticate()
        },
        
        connected: function(ev) {
            WallCology.groupchat.join()
            $('#username').text(session.account.login)
      	    $('#connecting').hide()						

            $('#tabs').show()

            
//where should all this go? Maybe after everything else?**************************************************************
            $(function() {
            	$('#tabs').tabs();
            });
            $(function() {
            	$('#radio').buttonset();
            });
            
            //simulates back button... we likely need something different here, as it's not really 'back', right?
            $(document).ready(function(){
                $('#back-button').click(function(){
                    parent.history.back();
                    return false;
                });
            });
            $('#submit-button').click(function() {
                var temp1 = $("#radio input[type='radio']:checked").val();
            	sev = new Sail.Event('habitatContent', {habitat:{wallScope:temp1, environmentalConditions:$('#environmental-conditions').val(),
            			structuralFeatures:$('#structural-features').val(), organisms:$('#organisms').val(), comments:$('#comments').val()}})
            	WallCology.groupchat.sendEvent(sev)	
            });

            //for back button
            //$(function() {
//            	$( "input:submit, a, button", ".demo" ).button();
//            	$( "a", ".demo" ).click(function() { return false; });
            //});
//*************************************************************************************************
 
        },
        
        authenticated: function(ev) {
            $('#connecting').hide()
        }
    }
}