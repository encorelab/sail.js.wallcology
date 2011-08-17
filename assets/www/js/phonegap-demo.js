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
                
                $(document).ready(function() {
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
    
    phonegap: function() {
        $('#camera').click(function() {
            navigator.camera.getPicture(onSuccess, onFail, { quality: 15 }); 

            function onSuccess(imageData) {
              var image = document.getElementById('photo');
              image.src = "data:image/jpeg;base64," + imageData;
            }

            function onFail(message) {
              alert('Failed because: ' + message);
            }
        })
        
        $('#phonegap-info').html(JSON.stringify(navigator.device).replace(/,/g,',<br />'))
        
        navigator.accelerometer.watchAcceleration(
            function(acc) {
                $('#accelerometer').text("x: "+acc.x+", y:"+acc.y+", z:"+acc.z)
            }
        )
        
        navigator.compass.watchHeading(
            function(heading) {
                $('#compass').text(heading)
            }
        )
        
        navigator.geolocation.watchPosition(
            function(position) {
                $('#geolocation').text("Lat: "+acc.coords.latitude+", Long:"+acc.coords.longitude)
            }
        )
        
        $('#alert').click(function() {
            navigator.notification.alert("This is an alert!", null, "Uh oh!", "Okay")
        })
        
        $('#confirm').click(function() {
            navigator.notification.alert("This is a confirmation!", null, "Yay!", "Alright")
        })
        
        $('#beep').click(function() {
            navigator.notification.beep(3)
        })
        
        $('#vibrate').click(function() {
            navigator.notification.vibrate(1000)
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