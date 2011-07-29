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
                
                $('#connecting').show()
                
                $(Sail.app).trigger('initialized')
                return true
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
        }
    }
}