//TODO
//redo data dictionary

//complete all of habitats, get a better of an idea of how complex a whole unit will be (also, querying the db)
//start relationships again


//Sail.app.groupchatRoom to get room. Currently ie "wallcology-julia-fall2011"



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
			var oTable;
			var gaiSelected =  [];
			
            $('#tabs').tabs()
            $('#tabs').show()
            $('#tabs').tabs({ selected: 3 });			//for testing, sets default open tab to 4th tab
            
            $('#new-habitat').hide()
			$('#what-others-said-habitat').hide()  
            $('#open-habitat').show()
            $('#add-to-discussion-habitat').hide()
            $('#author-search-habitat').hide()
            $('#new-organism').hide()
            $('#open-organism').hide()
            $('#new-relationship').hide()
            $('#view-relationships').hide()

            $('.jquery-radios').buttonset()
            
            $('.reload-button').click(function(){
            	location.reload()
            })

//**********HABITAT*************************************************************************************************
            $('#landing-habitat .new-button').click(function(){
            	$('#open-habitat').hide()   
				$('#add-to-discussions-habitat').hide();
				$('#landing-habitat').hide()
            	$('#new-habitat').show()

				//we need to clear all the fields here
				$('textarea.text-box').val();
            })
            $('#landing-habitat .view-button').click(function(){
            	$('#landing-habitat').hide()
            	$('#open-habitat').show()
            })
            
//**********NEW HABITAT*****************************************************************************************
        	// $('#new-habitat .save-button').click(Sail.app.observations.newHabitatContent)

            $('#new-habitat .back-button').click(function(){
            	$('#new-habitat').hide()
            	$('#open-habitat').show()
            })       

     		
//**********OPEN HABITAT*********************************************************************************************            
            $('#open-habitat .back-button').click(function(){
            	$('#open-habitat').hide()
            	$('#landing-habitat').show()
            })
            $('#open-habitat .add-button').click(function(){
            	$('#open-habitat').hide()
            	$('#add-to-discussion-habitat').show()
            })            

			// When I want to Describe a Habitat is clicked 
			$('div#open-habitat button#describe-habitat-button').click(function(){
				$('#open-habitat').hide()           
				$("#add-to-discussions-habitat").hide();
            	$('#what-others-said-habitat').hide();
				$('#new-habitat').show();
			})

			// When See What Others Said is clicked, this page page should be loaded
			$('div#open-habitat #what-others-said-habitat-button').click(function(){
            	$('#open-habitat').hide()           
				$("#add-to-discussions-habitat").hide();
            	$('#what-others-said-habitat').show() 
                // Uncheck all selected filters and the chosen notes
				$("#what-others-said-habitat input:radio:checked").attr("checked", false);
				$("#what-others-said-habitat label").removeClass("ui-state-active");                          
				$("#habitat-aggregate-results th#dynamic-column-aggregate-habitat").html('');
				$("#what-others-said-habitat #aggregate-habitat-table input:checkbox").attr("checked", false);  
				           
				// We create a table with the second column being 500px
				// TODO: we need to feed the data to the table to be inserted
				oTable = $('#aggregate-habitat-table').dataTable({
					"bAutoWidth": false,  
					
					"bDestroy" : true,  
					  				
					"aoColumns": [ 
						{ "sWidth": "500px" },
						null,
						null
					],
					
					"fnRowCallback": function( nRow, aData, iDisplayIndex ) {
						if ( jQuery.inArray(aData[0], gaiSelected) != -1 )
						{
							$(nRow).addClass('row_selected');
						}
						return nRow;
					}
				 });
            })  


			// We need to handle the clicking of the table rows
			/* Click event handler */
			$('#aggregate-habitat-table tbody tr').live('click', function () {
				var aData = oTable.fnGetData( this );
				var iId = aData[0];

				if ( jQuery.inArray(iId, gaiSelected) == -1 )
				{
					gaiSelected[gaiSelected.length++] = iId;
				}
				else
				{
					gaiSelected = jQuery.grep(gaiSelected, function(value) {
						return value != iId;
					} );
				}

				$(this).toggleClass('row_selected');
			} );
            

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
			
			//these aren't working, correctly... TODO
            $(".select-habitat input[type='radio']").click(function(){
            	console.log("radio1")
            	/*var TEMP = $('#radio .select-habitat input[type='radio']:checked').val()*/
            	//do your database queries here
            })

            $(".select-criteria input[type='radio']").click(function(){
            	console.log("radio2")
            	/*var TEMP = $('#radio .select-habitat input[type='radio']:checked').val()*/
            	//do your database queries here
            })

            
//**********ADD TO DISCUSSION HABITAT*****************************************************************************************
                        
			$('#radio').buttonset()

            $('#add-to-discussion-habitat .choose-keywords-button').click(function(){
            	//pop up with all keywords, pulled from discussion area
            })
            
            $('#add-to-discussion-habitat .author-search-button').click(function(){
            	$('#author-search-habitat').show()
    	            Sail.app.rollcall.fetchAllUsers(function(data) {
    	            	$(data).each(function() {
		                u = this['user']
		                li = $("<li id='user-"+u.account.login+"'>"+u.account.login+"</li> ")
		                li.data('account', u.account)
		                li.click(function() { Sail.app.ollcall.Authenticator.pickLogin($(this).data('account')) })
		                picker.children(".users").append(li)
    	            	})
		            
		            $(inContainer || 'body').append(picker)

    	            })
            })
            
            
            $('#add-to-discussion-habitat .save-button').click(Sail.app.observations.newDiscussionContent)
			$('#new-habitat .save-button').click(Sail.app.observations.newHabitatContent)
            $('#add-to-discussion-habitat .back-button').click(function(){
				$('#new-habitat').hide()
            	$('#add-to-discussion-habitat').hide()
            	$('#open-habitat').show()
            })
            
            
////////////AUTHOR SELECT POPUP///////////////////////////////////////////////////////////////
            
//            Sail.app.rollcall.fetchAllUsers(function(data) {
//            $(data).each(function() {
//                u = this['user']
//                li = $("<li id='user-"+u.account.login+"'>"+u.account.login+"</li> ")
//                li.data('account', u.account)
//                li.click(function() { Rollcall.Authenticator.pickLogin($(this).data('account')) })
//                picker.children(".users").append(li)
//            })
//            
//            $(inContainer || 'body').append(picker)

            
			$('#what-others-said-habitat .back-button').click(function(){
            	$('#what-others-said-habitat').hide()
            	$('#open-habitat').show()
            })  

        	 $('#add-to-discussions-habitat .back-button').click(function(){
				$('#add-to-discussions-habitat').hide()
				$('#what-others-said-habitat').show()
	         })   
	
			$("#what-others-said-habitat #add-to-discussion-button-habitat").click(function(){
				// Check to see if all required filters/comments are selected
				if ($("#what-others-said-habitat input:radio:checked").size() == 2){
					// TODO: send the data to the server to be saved
					// Dummy code to move to the next step
					   $('#what-others-said-habitat').hide()
					   $('#add-to-discussions-habitat').show()
					// End of Dummy code
				} else {
					alert ("Please select at least 2 filters!");
				}
			})

			$(function() {
				$("div#aggregate-view-habitat-filter").buttonset();
				$("div#aggregate-view-note-type-filter").buttonset();
			});  
			    
			// Send selected filters for the agents to pull them back
			$("div#aggregate-habitat-filters input").click(function(){
				totalFiltersSelected = $("div#aggregate-habitat-filters input").attr("checked");
				// A filter from each category is selected so we can send them to the agents
				if (totalFiltersSelected == 2){
				   alert ('woohoo');
				}                         				
			})                      
			
			// Actions that need to be taken when filters in the Habitat's aggregate view are clicked
			$("div#aggregate-habitat-filters input").click(function() { 
						
				// Set the table header for the dynamic column
				if (this.name == "note-filter-set"){               
					$("table#aggregate-habitat-table th#dynamic-column-aggregate-habitat").html($(this).button("option", "label"));
				}
			})


			// Selected filters in the Aggregate view for Habitats page
			// $('div#aggregate-view-habitat-filter button').click(function() {
			// 				$('div#what-others-said-habitat button').removeClass('ui-state-active');
			// 				$(this).addClass('ui-state-active');
			// 			})

//**********ORGANISM****************************************************************************************                              	
        	$('#new-organism .save-button').click(Sail.app.observations.newOrganismContent)
            $('#new-organism .back-button').click(function(){
            	$('#new-organism').hide()
            	$('#landing-organism').show()
            })            

//**********OPEN ORGANISM***************************************************************************************
        	
            $('#open-organism .back-button').click(function(){
            	$('#open-organism').hide()
            	$('#landing-organism').show()
            })             	
        	
//**********RELATIONSHIPS***********************************************************************************
            $('#landing-relationships .new-button').click(function(){
            	$('#landing-relationships').hide()
            	$('#new-relationship').show()
            })
            $('#landing-relationships .view-button').click(function(){
            	$('#landing-relationships').hide()
            	$('#view-relationships').show()
            })
            
//**********NEW RELATIONSHIP***********************************************************************************          

            $('#new-relationship .save-button').click(Sail.app.observations.newRelationshipContent)
            $('#new-relationship .back-button').click(function(){
            	$('#new-relationships').hide()
            	$('#landing-relationships').show()
            })
            
//**********VIEW RELATIONSHIPS**********************************************************************************            
            
            $('#view-relationships .back-button').click(function(){
            	$('#view-relationships').hide()
            	$('#landing-relationships').show()
            })
			
//**********COUNTS******************************************************************************************			

			$('#new-counts-datepicker').datepicker()
			
			$('#new-counts .save-button').click(Sail.app.observations.newCountsContent)
            $('#new-counts .back-button').click(function(){
            	$('#new-counts').hide()
            	$('#open-counts').show()
            })
			
    	},

//***************************************************************************************************************
    	
        newHabitatContent: function() {
        	var habitatRadioInput = $("#radio .select-wallscope input[type='radio']:checked").val()
        	sev = new Sail.Event('new_observation', {
				run:Sail.app.run,
        		type:'habitat',
        		wallscope:habitatRadioInput,
        		environmental_conditions:$('#new-habitat .environmental-conditions').val(),
        		structural_features:$('#new-habitat .structural-features').val(),
        		organisms:$('#new-habitat .organisms').val(),
        		comments:$('#new-habitat .comments').val()
        		})
        	WallCology.groupchat.sendEvent(sev)
        },
        
        //this should now be generalised for habitat+organisms+(other?)
        newDiscussionContent: function() {
        	sev = new Sail.Event('new_observation',{
        		run:Sail.app.run,
        		type:'discussion',
        		evidence:'pieces of habitat content that were queried (by id number?) and selected from the data table',
        		note:$('#add-to-discussion-habitat .note').val(),
        		headline:$('#add-to-discussion-habitat .headline').val(),
        		keywords:'still a mess'
        		})
        	WallCology.groupchat.sendEvent(sev)
        },
        
        //this is broken right now, waiting on Rokham... #radio-org is wrong (unlabelled)
        newOrganismContent: function() {
	        var organismRadioInput = $("#radio-organism input[type='radio']:checked").val()
	        sev = new Sail.Event('new_observation', {run:Sail.app.run,
	        	type:'organism',
	        	chosen_organism:organismRadioInput,
	        	morphology:$('#new-organism .morphology').val(),
	        	behaviour:$('#new-organism .behaviour').val(),
	        	organisms:$('#new-organism .habitat').val(),
	        	comments:$('#new-organism .comments').val()
	        	})
	        WallCology.groupchat.sendEvent(sev)
        },
        
        newRelationshipContent: function() {
	        sev = new Sail.Event('new_observation',{
	        	run:Sail.app.run,
	        	type:'relationship',
	        	//some stuff about the relationship
	        	//comments:$('#new-relationship .comments').val()
	        	})
	        WallCology.groupchat.sendEvent(sev)
        },

        newCountsContent: function() {
	        sev = new Sail.Event('new_observation', {run:Sail.app.run,
	        	type:'count',
	        	chosen_habitat:$("#new-counts .select-habitat-radios input[type='radio']:checked").val(),
	        	temperature:$("#new-counts .temperature-radios input[type='radio']:checked").val(),
	        	light_level:$("#new-counts .light-level-radios input[type='radio']:checked").val(),
	        	humidity:$("#new-counts .humidity-radios input[type='radio']:checked").val(),
	        	scum_percent:$('#new-counts .count-scum-percent').val(),
	        	mold_percent:$('#new-counts .count-mold-percent').val(),
	        	blue_bug:[{
	        		count1:$('#new-counts .count-blue-bug1').val(),
	        		count2:$('#new-counts .count-blue-bug2').val(),
	        		count3:$('#new-counts .count-blue-bug3').val(),
	        		average:$('#new-counts .count-blue-bug4').val(),
	        		multiplier:$('#new-counts .count-blue-bug5').val(),
	        		final_count:$('#new-counts .count-blue-bug6').val(),
	        		}],
	        	green_bug:[{
	        		count1:$('#new-counts .count-green-bug1').val(),
	        		count2:$('#new-counts .count-green-bug2').val(),
	        		count3:$('#new-counts .count-green-bug3').val(),
	        		average:$('#new-counts .count-green-bug4').val(),
	        		multiplier:$('#new-counts .count-green-bug5').val(),
	        		final_count:$('#new-counts .count-green-bug6').val(),
	        		}],
	        	predator:[{
	        		count1:$('#new-counts .count-predator1').val(),
	        		count2:$('#new-counts .count-predator2').val(),
	        		count3:$('#new-counts .count-predator3').val(),
	        		average:$('#new-counts .count-predator4').val(),
	        		multiplier:$('#new-counts .count-predator5').val(),
	        		final_count:$('#new-counts .count-predator6').val(),
	        		}],
	        	date:$('#new-counts-datepicker').datepicker('getDate'),
	        	hour:$('#new-counts .hour').val(),
	        	minute:$('#new-counts .minute').val(),
	        	ampm:$("#new-counts .ampm-radios input[type='radio']:checked").val()
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
        	jQuery('#top-level-dropdown').change(function(e){
        		window.location.href = jQuery('#top-level-dropdown').val();
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
