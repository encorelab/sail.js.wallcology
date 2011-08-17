PhonegapDemo = {
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
                Sail.autobindEvents(PhonegapDemo)
                
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
                        PhonegapDemo.initPhonegap()
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
        
        $('#camera').click(function() {
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
    },
    
    authenticate: function() {
        console.log("Authenticating...")
        
        PhonegapDemo.rollcall = new Rollcall.Client(PhonegapDemo.rollcallURL)
        PhonegapDemo.token = PhonegapDemo.rollcall.getCurrentToken()

        if (!PhonegapDemo.token) {
            Rollcall.Authenticator.requestLogin()
        } else {
            PhonegapDemo.rollcall.fetchSessionForToken(PhonegapDemo.token, function(data) {
                PhonegapDemo.session = data.session
                $(PhonegapDemo).trigger('authenticated')
            })
        }
    },
    
    events: {
        sail: {
            
        },
        
        initialized: function(ev) {
            PhonegapDemo.authenticate()
        },
        
        connected: function(ev) {
            PhonegapDemo.groupchat.join()
        },
        
        authenticated: function(ev) {
            $('#connecting').hide()
        }
    }
}