WallCology = {
    rollcallURL: '/rollcall', //'http://rollcall.proto.encorelab.org',
    xmppDomain: 'proto.encorelab.org',
    groupchatRoom: null,
    
    init: function() {
        console.log("Initializing...")
        
        Sail.app.run = JSON.parse($.cookie('run'))
        if (Sail.app.run)
            Sail.app.groupchatRoom = Sail.app.run.name+'@conference.'+Sail.app.xmppDomain
        
        Sail.modules
            .load('Rollcall.Authenticator', {mode: 'picker'})
            .load('Strophe.AutoConnector')
            .load('AuthStatusWidget')
            .thenRun(function () {
                Sail.autobindEvents(WallCology)
                
                $(document).ready(function() {
                    $('#reload').click(function() {
                        console.log("Disconnecting...")
                        Sail.Strophe.disconnect()
                        console.log("Reloading "+location+"...")
                        location.reload()
                    })

                    $('#connecting').show()
                    
                    $('#class-selection button').click(function() {
                        runName = $(this).data('run')
                        Sail.app.rollcall.fetchRun(runName, function(run) {
                            Sail.app.run = run
                            $.cookie('run', JSON.stringify(run))
                            location.href = '/observations.html'
                        })
                    })
                })

                $(Sail.app).trigger('initialized')
                return true
            })
    },
   
    
    observations: {
        
        init: function() {
            $('#tabs').tabs()
            $('#tabs').show()
            
            $('#new-habitat').hide()
        	
            $('.reload-button').click(function(){
            	location.reload()
            })

//**********HABITAT*********************************************************************************************            
            $('#open-habitat .new-page-button').click(function(){
            	$('#open-habitat').hide()
            	$('#new-habitat').show()
            })
            
            
//**********NEW HABITAT*****************************************************************************************       	
            $('#radio').buttonset()

        	$('#new-habitat .save-button').click(Sail.app.observations.newHabitatContent)

            $('#new-habitat .back-button').click(function(){
            	$('#new-habitat').hide()
            	$('#open-habitat').show()
            })

//**********ORGANISM****************************************************************************************                              	
        	$('#new-organism .save-button').click(Sail.app.observations.newOrganismContent)

//**********RELATIONSHIPS***********************************************************************************
			$('#new-relationships .arrow').click(function(){
				//switch to different arrow
			})
			
    	},
    	
        newHabitatContent: function() {
        	var habitatRadioInput = $("#radio input[type='radio']:checked").val()
        	sev = new Sail.Event('new_observation', {run_id:"temp", type:'habitat', wallscope:habitatRadioInput,
        		environmental_conditions:$('#new-habitat .environmental-conditions').val(), structural_features:$('#new-habitat .structural-features').val(),
        		organisms:$('#new-habitat .organisms').val(), comments:$('#new-habitat .comments').val()})
        	WallCology.groupchat.sendEvent(sev)
        },
        
        newOrganismContent: function() {
	        var organismRadioInput = $("#radio-organism input[type='radio']:checked").val()
	        sev = new Sail.Event('new_observation', {run_id:"temp", type:'organism', chosen_organism:organismRadioInput,
	        	morphology:$('#new-organism .morphology').val(), behaviour:$('#new-organism .behaviour').val(), organisms:$('#new-organism .habitat').val(),
	        	comments:$('#new-organism .comments').val()})
	        WallCology.groupchat.sendEvent(sev)
        },
        
        newRelationshipsContent: function() {
	        
//	        sev = new Sail.Event('new_observation', {run_id:Sail.app.run, type:'relationships'
//	        	morphology:$('#organism .morphology').val(), behaviour:$('#organism .behaviour').val(), organisms:$('#organism .habitat').val(),
//	        	comments:$('#organism .comments').val()
//	        	})
//	        WallCology.groupchat.sendEvent(sev)
        }

    },
   
//**********************************************************************************************************************************    
     
    discussion: {
    	init: function() {
    		
    	}
    },
    
    investigation: {
    	init: function() {
    		
    	}
    },
    

    authenticate: function() {
        console.log("Authenticating...")
        
        WallCology.rollcall = new Rollcall.Client(WallCology.rollcallURL)
        WallCology.token = WallCology.rollcall.getCurrentToken()

        if (!WallCology.run) {
            if ($.url.attr('file') != 'index.html')
                window.location.href = "/index.html"
        } else if (!WallCology.token) {
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
      	    //$('#connecting').hide()						
        	jQuery("#top-level-dropdown").change(function(e){
        		window.location.href = jQuery("#top-level-dropdown").val();
        	})
            
            if (true) {
            	Sail.app.observations.init()
            } else if (false) {
            	Sail.app.discussions.init()
            } else if (false) {
            	Sail.app.experiment.init()
            }
             
        },
        
        authenticated: function(ev) {
            $('#connecting').hide()
        }
    }
}
    /*    phonegap: function() {
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
*/    
