WallCology = {
    rollcallURL: '/rollcall', //'http://rollcall.proto.encorelab.org',
	mongooseURL: '/mongoose',
    xmppDomain: 'proto.encorelab.org',
    groupchatRoom: null,
    
    init: function() {
        console.log("Initializing...")
        
        Sail.app.run = JSON.parse($.cookie('run'))
        
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
            $('#tabs').tabs({ selected: 2 });			//for testing, sets default open tab
            
            $('#new-habitat').hide()
			$('#what-others-said-habitat').hide()  
            $('#open-habitat').show()
            $('#add-to-discussion-habitat').hide()
            $('#author-search-habitat').hide()
            $('#new-organism').hide()
            $('#what-others-said-about-organisms').hide()
            $('#open-organism').show()
            $('#new-relationship').hide()
            $('#view-relationships').hide()

            $('.jquery-radios').buttonset()
           


//**********HABITAT*************************************************************************************************
            $('#landing-habitat .new-button').click(function(){
            	$('#open-habitat').hide()   
				$('#add-to-discussions-habitat').hide();
				$('#landing-habitat').hide()
            	$('#new-habitat').show()

				//we need to clear all the fields here (TODO)
				$('textarea.text-box').val();
            })
            $('#landing-habitat .view-button').click(function(){
            	$('#landing-habitat').hide()
            	$('#open-habitat').show()
            })
            
//**********NEW HABITAT*****************************************************************************************

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

			// When See What Others Said for Habitat is clicked, this page page should be loaded
			$('div#open-habitat #what-others-said-habitat-button').click(function(){
            	$('#open-habitat').hide()           
				$("#add-to-discussions-habitat").hide();
            	$('#what-others-said-habitat').show() 
                // Uncheck all selected filters and the chosen notes
				$("#what-others-said-habitat input:radio:checked").attr("checked", false);
				$("#what-others-said-habitat label").removeClass("ui-state-active");                          
				$("#habitat-aggregate-results th#dynamic-column-aggregate-habitat").html('');
				$("#what-others-said-habitat #aggregate-habitat-table input:checkbox").attr("checked", false);
				Sail.app.observations.generateHabitatsDT()	//creates and populates the data table... but only with type:habitat
				//next step is to pass arguments through so create the table with specific criteria (ie Habitat 1)
				//something like:
				//selectedHabitat = $('input:radio[name=habitat-filter-set]:checked').val()
				//selectedType = $('input:radio[name=note-filter-set]:checked').val()
				//Sail.app.observations.generateHabitatsDT(selectedHabitat, selectedType)
				
				//habitatResultsArray[i] = [data.results[i].comments, data.results[i].origin, Sail.app.observations.dateString(d)]
				
			})
				           
				// We create a table with the second column being 500px
				// TODO: we need to feed the data to the table to be inserted
				 
/*				oTable = $('#aggregate-habitat-table').dataTable({
					"bAutoWidth": false,  

					"bJQueryUI" : true,					
					"sPaginationType": "full_numbers",                          
					
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
              

				oTableOrganism = $('#aggregate-organism-table').dataTable({
					"bAutoWidth": false, 
					
					"bJQueryUI" : true,    
					
					"sPaginationType": "full_numbers",                          
					
					"bDestroy" : true,  
					  				
					"aoColumns": [        
						{ "sWidth": "500px" },
						null,
						null
					],  
				 });
			// We need to handle the clicking of the table rows
			 Click event handler 
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
			} );*/

            
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
	
			$("#what-others-said-habitat .add-to-discussion-button").click(function(){
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

			// When I want to Describe an ORGANISM is clicked 
			$('div#open-organism button#describe-organism-button').click(function(){
				$("#organism-menu-page").hide();
				$('#new-organism').show();    
				// Clear all selections and text areas
				Sail.app.observations.clearNewOrganismPage();			
			})

			// When See What Others Said is clicked, this page page should be loaded
			$('div#open-organism #what-others-said-organism-button').click(function(){ 
				$("#organism-menu-page").hide();
				$('#new-organism').hide(); 
				$('#what-others-said-about-organisms').show();
				
				// clear all the Selected Filters
				$('div#open-organism div#what-others-said-about-organisms div#organism-filters td').css('border', 'none'); 
				$('div#open-organism div#what-others-said-about-organisms input#chosen-organism-filter').attr('value', 'null');
				$('div#open-organism div#what-others-said-about-organisms div#organism-comment-filters td.organism-comment-filter').css({'border':'none', 'background-color':'#cccccc', 'color':'black'});
				$('div#open-organism div#what-others-said-about-organisms input#chosen-organism-comment-filter').attr('value', 'null');				
			
			
				// We create a table with the second column being 500px
				// TODO: we need to feed the data to the table to be inserted
				oTableOrganism = $('#aggregate-organism-table').dataTable({
					"iDisplayLength": 10,
					"bLengthChange": false,
					"bAutoWidth": false, 
					
					"bJQueryUI" : true,    
					
					"sPaginationType": "full_numbers",                          
					
					"bDestroy" : true,  
					  				
					"aoColumns": [        
						{ "sWidth": "500px" },
						null,
						null
					],  
				 });
            })

            

           
                          	
        	$('#open-organism div#organism-action-buttons .save-button').click(function() {
       			Sail.app.observations.newOrganismContent(); 
				Sail.app.observations.clearNewOrganismPage();	
			})                           
			
            $('#open-organism div#organism-action-buttons .back-button').click(function(){
				$('#open-organism').show()
            	$('#new-organism').hide()
            	$('#open-organism #organism-menu-page').show()
            })   
           
            

			// Allowing the student to select from the organisms and their Juvenile form to display the evolution of the organism
			$('div#tabs-2 table#organism-table td').click(function(){    
				$('div#tabs-2 table#organism-table td').css('border', 'none');
				$(this).css('border', '1px solid black');
				$('div#tabs-2 input#selected-organism').attr('value', this.id);
			})    
			
			$('div#tabs-2 table#juvenile-organism-table td').click(function(){    
				$('div#tabs-2 table#juvenile-organism-table td').css('border', 'none');
				$(this).css('border', '1px solid black');
				$('div#tabs-2 input#selected-juvenile').attr('value', this.id);
			})			
			
			// if an organism is selected
			$('div#tabs-2 div#organism-evolution span.organism-only').click (function(){
				
				selectedOrganismId = $('div#tabs-2 input#selected-organism').attr('value'); 
				selectedImageHTML =  $('div#tabs-2 table#organism-table td#'+selectedOrganismId).html();
				  
				// We need to clear the content of the cell
				if ($(this).html() != "" && $(this).html() == selectedImageHTML){
					$(this).html(""); 
					$(this).attr('value', "null");
				} else {
					// selectedOrganismId = $('div#tabs-2 input#selected-organism').attr('value');   
					if (selectedOrganismId === ""){
						alert ("You must first choose an organism and then click this cell");
					}else {
						$(this).html(selectedImageHTML);  				
					}
				}
			})
			 
			// if a juvenile is selected
			$('div#tabs-2 div#organism-evolution span.juvenile-only').click (function(){ 
				
				selectedJuvenileId = $('div#tabs-2 input#selected-juvenile').attr('value');
				selectedImageHTML = $('div#tabs-2 table#juvenile-organism-table td#'+selectedJuvenileId).html()   
				
				if ($(this).html() != "" && $(this).html() == selectedImageHTML){
					$(this).html("");       
					$(this).attr('value', "null");					
				} else {            					
					if (selectedJuvenileId === ""){
						alert ("You must first choose a Juvenile and then click this cell");
					}else {  
						$(this).attr('value', selectedJuvenileId);
						$(this).html(selectedImageHTML);  				
					}
				}
			})    
			
			
			// Letting the user select from the Organism Filters to pull in the comments given by all students
			$('div#open-organism div#what-others-said-about-organisms div#organism-filters td').click(function(){
				$('div#open-organism div#what-others-said-about-organisms div#organism-filters td').css('border', 'none');
				$(this).css('border', '1px solid black');     
				$('div#open-organism div#what-others-said-about-organisms div#organism-filters input#chosen-organism-filter').attr('value', $(this).attr('value'));
			})  
			 
			$('div#open-organism div#what-others-said-about-organisms div#organism-comment-filters td.organism-comment-filter').click(function(){ 		
				$('div#open-organism div#what-others-said-about-organisms div#organism-comment-filters td.organism-comment-filter').css({'border':'none', 'background-color':'#CCCCCC', 'color':'black'});
				$(this).css({'background-color':'#669933', 'color':'white'}); 
				$('div#open-organism div#what-others-said-about-organisms div#organism-comment-filters input#chosen-organism-comment-filter').attr('value', $(this).attr('value'));
				$("table#aggregate-organism-table th#dynamic-column-aggregate-organism").html($('div#open-organism div#what-others-said-about-organisms input#chosen-organism-comment-filter').attr('value'));
			})
			
			
			// When we 
			$('#open-organism div#organism-what-others-said-action-buttons .save-button').click(Sail.app.observations.newOrganismContent)
			$('#open-organism div#organism-what-others-said-action-buttons .back-button').click(function(){
				$('#open-organism').show()
	           	$('#open-organism #what-others-said-about-organisms').hide()
	           	$('#open-organism #organism-menu-page').show()
	        })
			

//**********OPEN ORGANISM***************************************************************************************
        	
                      	
        	
//**********RELATIONSHIPS***********************************************************************************
            $('#landing-relationships .new-button').click(function(){
            	$('#landing-relationships').hide()
            	$('#new-relationship').show()
            })
            $('#landing-relationships .view-button').click(function(){
            	$('#landing-relationships').hide()
            	$('#view-relationships').show()
            	Sail.app.observations.generateRelationshipsDT()
            })
            
//**********NEW RELATIONSHIP***********************************************************************************          

            $('#new-relationship .save-button').click(Sail.app.observations.newRelationshipContent)
            $('#new-relationship .back-button').click(function() {
            	$('#new-relationship').hide()
            	$('#landing-relationships').show()
            })

            
            $('#new-relationship .selectable').click(function() {
            	$('.selectable').removeClass('selected')
            	$(this).toggleClass('selected')            	
            })
            
            $('#new-relationship .organism-box').click(function() {
            	$(this).html("")
            	selected = $('.selected')
            	clone = selected.clone()
            	clone.attr('')
            	$(this).append(clone)
            	$('.selectable').removeClass('selected')
            })
            
//**********VIEW RELATIONSHIPS**********************************************************************************            
            
            $('#view-relationships .back-button').click(function() {
            	$('#view-relationships').hide()
            	$('#landing-relationships').show()
            })

			//$('#view-relationships .sun1')
			
			$('#view-relationships .save-button').click(function() {
				// The following get call counts observations with the following criteria=
				// {"type"%3A"relationship", "energy_transfer.from"%3A"sun", "energy_transfer.to"%3A"scum"}
				$.get("/mongoose/wallcology/observations/_count", { criteria: JSON.stringify({"type":"relationship", "energy_transfer.from":"sun", "energy_transfer.to":"scum"}) },
				  function(data) {
					var resultArray
				    if (data.ok === 1) {
						console.log("Mongoose returned a data set")
						console.log("There are " + data.count + " relationships with energy transfer from sun to scum")
	
						// writing the count value into the HTML
						$('#view-relationships .sun1').html(data.count)
												
						return true
					}
					else {
						console.log("Mongoose request failed")
						return false
					}
				  }, "json")
				
				// The following get call counts observations with the following criteria=
				// {"type"%3A"relationship", "energy_transfer.from"%3A"sun", "energy_transfer.to"%3A"scum"}
				$.get("/mongoose/wallcology/observations/_count", { criteria: JSON.stringify({"type":"relationship", "energy_transfer.from":"sun", "energy_transfer.to":"fuzzy-mold"}) },
				  function(data) {
					var resultArray
				    if (data.ok === 1) {
						console.log("Mongoose returned a data set")
						console.log("There are " + data.count + " relationships with energy transfer from sun to scum")

						// writing the count value into the HTML
						$('#view-relationships .sun2').html(data.count)

						return true
					}
					else {
						console.log("Mongoose request failed")
						return false
					}
				  }, "json")
			})

			//row selector for dataTables
			$('#relationships-datatable tr').live('click', function() {
				if ( $(this).hasClass('row_selected') )
					$(this).removeClass('row_selected')
				else
					$(this).addClass('row_selected')
			})
				
            
            
//**********COUNTS******************************************************************************************			

			$('#new-counts-datepicker').datepicker()
			
			$('#new-counts .save-button').click(Sail.app.observations.newCountsContent)			
    	},

//***************************************************************************************************************  


// ******************************************   HELPER FUNCTIONS *************************************************

		clearNewOrganismPage: function () {
			$('#new-organism table#organism-table td').css('border', 'none');
			$('#new-organism table#juvenile-organism-table td').css('border', 'none');  
			$('#new-organism div#organism-evolution .organism-blank-cell').html('');				
			$('#new-organism div#organism-descriptions textarea').val('');          
			$('#new-organism div#organism-tables input#selected-organism').attr('value', 'null');
			$('#new-organism div#organism-tables input#selected-juvenile').attr('value', 'null');   
			$('#new-organism table#organism-evolution-table span.organism-blank-cell').attr('value', 'null');
		},

		dateString: function(d) {
			 function pad(n){return n<10 ? '0'+n : n}
			 return d.getFullYear()+'-'
			      + pad(d.getMonth()+1)+'-'
			      + pad(d.getDate())+' '
			      + pad(d.getHours())+':'
			      + pad(d.getMinutes())+':'
			      + pad(d.getSeconds())
		},
		
		//Data table population functions
		generateHabitatsDT: function(h, t) {
			
			//do some shit with h and t
			
			$.get("/mongoose/wallcology/observations/_find", { criteria: JSON.stringify({"type":"habitat"}) },
				function(data) {
					habitatResultsArray = []
					for (i=0;i<data.results.length;i++) {
						d = new Date(data.results[i].timestamp)
						habitatResultsArray[i] = [data.results[i].comments, data.results[i].origin, Sail.app.observations.dateString(d)]
					}

			    	if (data.ok === 1) {			    		
						$('#aggregate-habitat-table').dataTable({
							"bAutoWidth": false,
							"iDisplayLength": 10,
							"bLengthChange": false,
							"bDestroy" : true,		//you need this so that the table will be refreshed without errors each time entering the page
							"bJQueryUI": true,
							"sPaginationType": "full_numbers",
							"aoColumns": [        
											{ "sWidth": "500px" },
											null,
											null
										],

							"aaData": habitatResultsArray	
						})
			    	}
			    	else {
						console.log("Mongoose request failed")
						return false
					}
			}, "json")
		},
		
		generateRelationshipsDT: function() {
			$.get("/mongoose/wallcology/observations/_find", { criteria: JSON.stringify({"type":"relationship"}) },
				function(data) {
					relationshipResultsArray = []
					for (i=0;i<data.results.length;i++) {
						d = new Date(data.results[i].timestamp)
						relationshipResultsArray[i] = [data.results[i].comments, data.results[i].origin, Sail.app.observations.dateString(d)]
					}

			    	if (data.ok === 1) {			    		
						$('#relationships-datatable').dataTable({
							"iDisplayLength": 5,
							"bLengthChange": false,
							"bDestroy" : true,		//you need this so that the table will be refreshed without errors each time entering the page
							"bJQueryUI": true,
							"sPaginationType": "full_numbers",
							"aoColumns": [        
											{ "sWidth": "500px" },
											null,
											null
										],

							"aaData": relationshipResultsArray	
						})
			    	}
			    	else {
						console.log("Mongoose request failed")
						return false
					}
			}, "json")
		},


		//(new Date(data.results[i].timestamp)).dateString()
		// _find?criteria[type]=relationship
		// _find?criteria={type:relationship}
		//$.get("/mongoose/wallcology/observations/_find", { criteria:{"type":"relationship"} },
		//  $.get("mongoose/wallcology/observations/_find?criteria={%22type%22%3A%22relationship%22}",
		//$.get("/mongoose/wallcology/observations/_find", { criteria: JSON.stringify({"type":"relationship"}) },

		//skip: 10,
		
		
		//"aaData": [ data.results.map(function(result){ return ["D", result.comments, result.origin, result.timestamp] }) ]


// ***************************************************************************************************************

    	
        newHabitatContent: function() {
        	sev = new Sail.Event('new_observation', {
				run:Sail.app.run,
        		type:'habitat',
        		wallscope:$('input:radio[name=radio]:checked').val(),
        		environmental_conditions:$('#new-habitat .environmental-conditions').val(),
        		structural_features:$('#new-habitat .structural-features').val(),
        		organisms:$('#new-habitat .organisms').val(),
        		comments:$('#new-habitat .comments').val()
        		})
        	WallCology.groupchat.sendEvent(sev)
        	//clear fields
	        $('#new-habitat .text-box').val('')
	        $("input:radio").prop('checked', false)
	        $('#new-habitat .radio-button').button('refresh')		//both lines are necessary to clear radios (first changes state, second refreshes screen)
        },
                
        //this is broken right now, waiting on Rokham... #radio-org is wrong (unlabelled)
        newOrganismContent: function() {       
	                                                     
			morphology = $('div#new-organism div#organism-descriptions div#organism-morphology textarea').val();
			behavior = $('div#new-organism div#organism-descriptions div#organism-behavior textarea').val();
			habitat = $('div#new-organism div#organism-descriptions div#organism-habitat textarea').val();
			comments = $('div#new-organism div#organism-descriptions div#organism-comments textarea').val(); 
			
			chosen_organism = $('div#new-organism input#selected-organism').attr('value');
			chosen_juveniles = $('div#new-organism span.juvenile-only');
			first_juvenile =  $(chosen_juveniles[0]).attr('value') === 'undefined' ? 'null' : $(chosen_juveniles[0]).attr('value');
			second_juvenile =  $(chosen_juveniles[1]).attr('value') === 'undefined' ? 'null' : $(chosen_juveniles[1]).attr('value');
			third_juvenile =  $(chosen_juveniles[2]).attr('value') === 'undefined' ? 'null' : $(chosen_juveniles[2]).attr('value');
						
			sev = new Sail.Event('new_observation', {
				run:Sail.app.run,
				type:'organism',
				morphology:morphology,
		        behaviour:behavior,
		        habitat:habitat,
		        comments:comments,
		        organism:chosen_organism,
				lifecycle:{ 
					slot1: first_juvenile,
					slot2: second_juvenile,
					slot3: third_juvenile
				}
			})  			
	        WallCology.groupchat.sendEvent(sev)
	        //clear fields
/*	        $('#new-organism .textarea').val('')
	        $('#new-organism .organism-blank-cell').html("")
*/        },
        
        newRelationshipContent: function() {
	        sev = new Sail.Event('new_observation', {
	        	run:Sail.app.run,
	        	type:'relationship',
	        	energy_transfer:{
	        		"from":$('#box1').children().attr("id"),
	        		"to":$('#box2').children().attr("id")	        		
	        	},
	        	comments:$('#new-relationship .comments').val()
	        	})
	        WallCology.groupchat.sendEvent(sev)
	        //clear fields
	        $('#box1').html("")
	        $('#box2').html("")		
	        $('#new-relationship .comments').val('')
        },

        newCountsContent: function() {
	        sev = new Sail.Event('new_observation', {
	        	run:Sail.app.run,
	        	type:'count',
	        	chosen_habitat:$('input:radio[name=select-habitat]:checked').val(),
	        	temperature:$('input:radio[name=temp]:checked').val(),
	        	light_level:$('input:radio[name=light]:checked').val(),
	        	humidity:$('input:radio[name=humidity]:checked').val(),
	        	scum_percent:$('#new-counts .count-scum-percent').val(),
	        	mold_percent:$('#new-counts .count-mold-percent').val(),
	        	organism_counts:{
		        	blue_bug:{
		        		count1:$('#new-counts .count-blue-bug1').val(),
		        		count2:$('#new-counts .count-blue-bug2').val(),
		        		count3:$('#new-counts .count-blue-bug3').val(),
		        		average:$('#new-counts .count-blue-bug4').val(),
		        		multiplier:$('#new-counts .count-blue-bug5').val(),
		        		final_count:$('#new-counts .count-blue-bug6').val()
		        		},
		        	green_bug:{
		        		count1:$('#new-counts .count-green-bug1').val(),
		        		count2:$('#new-counts .count-green-bug2').val(),
		        		count3:$('#new-counts .count-green-bug3').val(),
		        		average:$('#new-counts .count-green-bug4').val(),
		        		multiplier:$('#new-counts .count-green-bug5').val(),
		        		final_count:$('#new-counts .count-green-bug6').val()
		        		},
		        	predator:{
		        		count1:$('#new-counts .count-predator1').val(),
		        		count2:$('#new-counts .count-predator2').val(),
		        		count3:$('#new-counts .count-predator3').val(),
		        		average:$('#new-counts .count-predator4').val(),
		        		multiplier:$('#new-counts .count-predator5').val(),
		        		final_count:$('#new-counts .count-predator6').val()
		        	}
	        	},
	        	date:$('#new-counts-datepicker').datepicker('getDate'),
	        	hour:$('#new-counts .hour').val(),
	        	minute:$('#new-counts .minute').val(),
	        	ampm:$('input:radio[name=ampm]:checked').val()
	        	})
	        WallCology.groupchat.sendEvent(sev)
	        //clear fields
	        $('#new-counts .text-box').val('')
	        $("input:radio").prop('checked', false)
	        $('#new-counts .radio-button').button('refresh')		//both lines are necessary to clear radios (first changes state, second refreshes screen)
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
        
        unauthenticated: function(ev) {
            window.location.href = "/index.html"
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
