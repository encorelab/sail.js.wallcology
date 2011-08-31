//TODO
//fix all of the radio buttons
//confirm that all of the sevs are working
//get those jpgs that are missing from the dataTables
//finish counts
//start relationships again


//Sail.app.groupchatRoom to get room



WallCology = {
    rollcallURL: '/rollcall', //'http://rollcall.proto.encorelab.org',
    xmppDomain: 'proto.encorelab.org',
    groupchatRoom: null,
    
    init: function() {
        console.log("Initializing...")
        
        Sail.app.run = JSON.parse($.cookie('run'))
        if (Sail.app.run) {
            Sail.app.groupchatRoom = Sail.app.run.name+'@conference.'+Sail.app.xmppDomain
        }
        
        Sail.modules
            .load('Rollcall.Authenticator', {mode: 'multi-picker'})
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
                        Sail.app.rollcall.fetchRun(runName, function(data) {
                            Sail.app.run = data.run
                            $.cookie('run', JSON.stringify(Sail.app.run))
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

 			$.get("/mongoose/foo/bar/_find", 
			  function(data) {
				var resultArray
			    if (data.ok === 1) {
					console.log("Mongoose returned a data set")
					
					resultArray = data.results
					// TODO: loop over result and use it to change content of table
					/*for (var i = 0; i<resultArray.size(); i++) {
						resultArray[i]
					}*/
					
					return true
				}
				else {
					console.log("Mongoose request failed")
					return false
				}
			  }, "json")
			
			$('#table_id').dataTable()
            
/*            $('#open-habitat .habitat-table').dataTable({
					"aaData": [
						[ "Trident", "Internet Explorer 4.0", "Win 95+", 4, "X" ],
						[ "Trident", "Internet Explorer 5.0", "Win 95+", 5, "C" ],
						[ "Trident", "Internet Explorer 5.5", "Win 95+", 5.5, "A" ],
						[ "Trident", "Internet Explorer 6.0", "Win 98+", 6, "A" ],
						[ "Trident", "Internet Explorer 7.0", "Win XP SP2+", 7, "A" ],
						[ "Gecko", "Firefox 1.5", "Win 98+ / OSX.2+", 1.8, "A" ],
						[ "Gecko", "Firefox 2", "Win 98+ / OSX.2+", 1.8, "A" ],
						[ "Gecko", "Firefox 3", "Win 2k+ / OSX.3+", 1.9, "A" ],
						[ "Webkit", "Safari 1.2", "OSX.3", 125.5, "A" ],
						[ "Webkit", "Safari 1.3", "OSX.3", 312.8, "A" ],
						[ "Webkit", "Safari 2.0", "OSX.4+", 419.3, "A" ],
						[ "Webkit", "Safari 3.0", "OSX.4+", 522.1, "A" ]
					],
					"aoColumns": [
						{ "sTitle": "Engine" },
						{ "sTitle": "Browser" },
						{ "sTitle": "Platform" },
						{ "sTitle": "Version", "sClass": "center" },
						{
							"sTitle": "Grade",
							"sClass": "center",
							"fnRender": function(obj) {
								var sReturn = obj.aData[ obj.iDataColumn ];
								if ( sReturn == "A" ) {
									sReturn = "<b>A</b>";
								}
								return sReturn;
							}
						}
					]
			} )
*/           
            $(".select-habitat input[type='radio']").click(function(){
            	console.log("TEST")
            	/*var TEMP = $('#radio .select-habitat input[type='radio']:checked').val()*/
            	//do your database queries here
            })

            $(".select-criteria input[type='radio']").click(function(){
            	console.log("TEST2")
            	/*var TEMP = $('#radio .select-habitat input[type='radio']:checked').val()*/
            	//do your database queries here
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
			
//**********COUNTS******************************************************************************************			

			$("#mold-slider").slider();
			$("#scum-slider").slider();
			$("#blue-bug-slider").slider();
			$("#green-bug-slider").slider();
			$("#predator-slider").slider();
			
			$('#new-counts .save-button').click(Sail.app.observations.newCountsContent)
            $('#new-counts .back-button').click(function(){
            	$('#new-counts').hide()
            	$('#open-counts').show()
            })
			
//***************************************************************************************************************
			
			
    	},

        newHabitatContent: function() {
        	var habitatRadioInput = $("#radio .select-wallscope input[type='radio']:checked").val()
        	sev = new Sail.Event('new_observation',{
        		run:Sail.app.run,
        		type:'habitat',
        		wallscope:habitatRadioInput,
        		environmental_conditions:$('#new-habitat .environmental-conditions').val(),
        		structural_features:$('#new-habitat .structural-features').val(),
        		organisms:$('#new-habitat .organisms').val(),
        		comments:$('#new-habitat .comments').val()})
        	WallCology.groupchat.sendEvent(sev)
        },
        
        newOrganismContent: function() {
	        var organismRadioInput = $("#radio-organism input[type='radio']:checked").val()
	        sev = new Sail.Event('new_observation',{
	        	run:Sail.app.run,
	        	type:'organism',
	        	chosen_organism:organismRadioInput,
	        	morphology:$('#new-organism .morphology').val(),
	        	behaviour:$('#new-organism .behaviour').val(),
	        	organisms:$('#new-organism .habitat').val(),
	        	comments:$('#new-organism .comments').val()})
	        WallCology.groupchat.sendEvent(sev)
        },
        
        newRelationshipsContent: function() {
	        
//	        sev = new Sail.Event('new_observation', {run_id:Sail.app.run, type:'relationships'
//	        	morphology:$('#organism .morphology').val(), behaviour:$('#organism .behaviour').val(), organisms:$('#organism .habitat').val(),
//	        	comments:$('#organism .comments').val()
//	        	})
//	        WallCology.groupchat.sendEvent(sev)
        },

        newCountsContent: function() {
	        var countsHabitatRadio = $("#new-counts .select-habitat input[type='radio']:checked").val()
	        var countsTemperatureRadio = $("#new-counts .temperature-lowhigh input[type='radio']:checked").val()
	        var countsLightRadio = $("#new-counts .light-levels-lowhigh input[type='radio']:checked").val()
	        var countsHumidityRadio = $("#new-counts .humidity-lowhigh input[type='radio']:checked").val()
	        
	        sev = new Sail.Event('new_count', {run:Sail.app.run,
	        	type:"count",
	        	chosen_habitat:countsHabitatRadio,
	        	start_time:"TEMP",
	        	end_time:"TEMP@",
/*	        	mold:$('#new-counts .mold').slider("value"),
	        	scum:$('#new-counts .scum').slider("value"),
	        	blue_bug:$('#new-counts .blue-bug').slider("value"),
	        	green_bug:$('#new-counts .green-bug').slider("value"),
	        	predator:$('#new-counts .predator').slider("value"),
*/	        	temperature:countsTemperatureRadio,
	        	light_levels:countsLightRadio,
	        	humidity:countsHumidityRadio,
	        	})
	        WallCology.groupchat.sendEvent(sev)
        },

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
        },
        
        logout: function(ev) {
            Sail.app.run = null
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
