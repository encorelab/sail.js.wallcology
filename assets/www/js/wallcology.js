WallCology = {
    /** Reverse-proxied URLs for rollcall and sleepy mongoose services. */
    rollcallURL: '/rollcall',
    mongooseURL: '/mongoose',
    
    // all Sail events generated in this app must have a run
    allowRunlessEvents: false,
    
    init: function() {
        console.log("Initializing...")
        
        Sail.app.run = JSON.parse($.cookie('run'))
        
        Sail.modules
            .load('Rollcall.Authenticator', {mode: 'multi-picker', run: function() {return Sail.app.run.name}})
            .load('Strophe.AutoConnector')
            .load('AuthStatusWidget')
            .load('CommonKnowledge', {buttonContainer: '#tabs'})
            .thenRun(function () {
                Sail.autobindEvents(WallCology)
                
                $(document).ready(function() {
                    $('#reload').click(function() {
                        console.log("Disconnecting...")
                        Sail.Strophe.disconnect()
                        console.log("Reloading "+location+"...")
                        location.reload()
                    })
                    
                    // this is only on the index (class selection) page
                    $('#loading').hide()
                    $('#class-selection').show()
                    if ($('#class-selection').length > 0) // dumb way to check that we're on the class selection page
                        $('#connecting').hide()
                    else 
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
            $('#tabs').tabs({ selected: 0 });			// for testing, sets default open tab
            var $tabs = $('#tabs').tabs()
            
            // initial context
            $(Sail.app).trigger('context_switch', {
    		    selectableTags: [
                    ['Theory', 'Question', 'Observation', 'Investigation', 'Other Idea'],
                    ['Environmental Conditions', 'Structural Features'],
                    ['Habitats', 'Organisms', 'Food Web']
    		    ],
    		    defaultTags: ['Habitats']
    		})
            
            $( "#tabs" ).bind( "tabsselect", function(event, ui) {
            	if (ui.index == 0) {
            		$(Sail.app).trigger('context_switch', {
            		    selectableTags: [
            		      ['Theory', 'Question', 'Observation', 'Investigation', 'Other Idea'],
            		      ['Environmental Conditions', 'Structural Features'],
            		      ['Habitats', 'Organisms', 'Food Web']
            		    ],
            		    defaultTags: ['Habitats']
            		})
            	}
            	else if (ui.index == 1) {
            		$(Sail.app).trigger('context_switch', {
            		    selectableTags: [
            		      ['Theory', 'Question', 'Observation', 'Investigation', 'Other Idea'],
            		      ['Morphology', 'Behaviour', 'Life Cycles'],
            		      ['Habitats', 'Organisms', 'Food Web']
            		    ],
            		    defaultTags: ['Organisms']
            		})
            	}
            	else if (ui.index == 2) {
            		$(Sail.app).trigger('context_switch', {
            		    selectableTags: [
            		      ['Theory', 'Question', 'Observation', 'Investigation', 'Other Idea'],
            		      ['Suggestion For Food Web'],
            		      ['Habitats', 'Organisms', 'Food Web']
            		    ],
            		    defaultTags: ['Food Web']
            		})
            	}
            	else if (ui.index == 3) {
            		$(Sail.app).trigger('context_switch', {
            		    selectableTags: [
            		      ['Theory', 'Question', 'Observation', 'Investigation', 'Other Idea'],
            		      [],
            		      []			// confirm this is the right way (or just omit?)
            		    ],
            		})
            	}
            	else {
            		console.log('what tab are you clicking on?!')
            	}
    		})
            

            $('#new-habitat').hide()
			$('#what-others-said-habitat').hide()  
            $('#open-habitat').show()
            $('#add-to-discussion-habitat').hide()
            $('#author-search-habitat').hide()
            $('#new-organism').hide()      
			$('#describe-lifecycle-organism').hide();
            $('#what-others-said-about-organisms').hide();
 			$('#what-others-said-organism-lifecycle').hide();
			$('#describe-lifecycle-organism').hide()
            $('#open-organism').show()
            $('#new-relationship').hide()
            $('#view-relationships').hide()
            $('#new-counts').hide()
            $('#view-counts').hide()

            $('.jquery-radios').buttonset()
                       
            
// **********NEW HABITAT*****************************************************************************************

            $('#new-habitat .back-button').click(function(){
            	$('#new-habitat').hide()
            	$('#open-habitat').show()
            })       

            $('#new-habitat .save-button').click(function(){
            	if ( $('input:radio').is(':checked') ) {
					Sail.app.observations.newHabitatContent()
	            	$('#new-habitat').hide()
	            	$('#open-habitat').show()
            	}
	            else {
	            	alert("Please select a habitat to describe")
	            }
			})

     		
// **********OPEN HABITAT*********************************************************************************************
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
				$('#new-habitat').show()
			})

			$('#radio').buttonset()

			
// **********VIEW HABITAT*********************************************************************************************
			$("div#aggregate-view-habitat-filter").buttonset();
			$("div#aggregate-view-note-type-filter").buttonset();
			
			// When See What Others Said for Habitat is clicked, this page page
			// should be loaded
			$('div#open-habitat #what-others-said-habitat-button').click(function(){
			    
            	$('#open-habitat').hide()           
            	$('#what-others-said-habitat').show() 
                // Uncheck all selected filters and the chosen notes
				$("#what-others-said-habitat input:radio:checked").attr("checked", false);
				$("#what-others-said-habitat label").removeClass("ui-state-active");                          
				$("#habitat-aggregate-results th#dynamic-column-aggregate-habitat").html('');
				$("#what-others-said-habitat #aggregate-habitat-table input:checkbox").attr("checked", false);

				// populate the datatable with default values
				$('input:radio[name="habitat-filter-set"]').filter('[value="1"]').attr('checked', true);
				$("#habitat-filter-1 + label").addClass("ui-state-active");
				$('input:radio[name="note-filter-set"]').filter('[value="organisms"]').attr('checked', true);
				$("#habitat-note-filter-1 + label").addClass("ui-state-active");

				typeChoice = $('input:radio[name=note-filter-set]:checked').val()
				habitatChoice = $('input:radio[name=habitat-filter-set]:checked').val()
				
				// setting the header of the datatable according to selected criteria
				$("#dynamic-column-aggregate-habitat").text($('input:radio[name=note-filter-set]:checked').val())
 
				//Sail.app.observations.generateHabitatsDT(habitatChoice, typeChoice)
				Sail.app.observations.generateHabitatsDT({ wallscope: habitatChoice, note: typeChoice })
			})
			
			$('#what-others-said-habitat .back-button').click(function(){
            	$('#what-others-said-habitat').hide()
            	$('#open-habitat').show()
            })
            
            $("input[name=habitat-filter-set]").click(function() {
				typeChoice = $('input:radio[name=note-filter-set]:checked').val()
				habitatChoice = $('input:radio[name=habitat-filter-set]:checked').val()
				//Sail.app.observations.generateHabitatsDT(habitatChoice, typeChoice)
				Sail.app.observations.generateHabitatsDT({ wallscope: habitatChoice, note: typeChoice })
			})
			
			$("input[name=note-filter-set]").click(function() {
				typeChoice = $('input:radio[name=note-filter-set]:checked').val()
				habitatChoice = $('input:radio[name=habitat-filter-set]:checked').val()
				// setting the header of the datatable according to selected criteria
				$("#dynamic-column-aggregate-habitat").text($('input:radio[name=note-filter-set]:checked').val())
				//Sail.app.observations.generateHabitatsDT(habitatChoice, typeChoice)
				Sail.app.observations.generateHabitatsDT({ wallscope: habitatChoice, note: typeChoice })
			})

           	$('#aggregate-habitat-table tr').live('click', function() {
				if ( $(this).hasClass('row_selected') )
					$(this).removeClass('row_selected')
				else
					$(this).addClass('row_selected')
           	})
           	
           	// To hand off to MATT
           	$('#what-others-said-habitat .add-to-discussion-button').click(function(){
           		// $('#what-others-said-habitat .row_selected')
           		// do other stuff
           		// clear the tags: $('#what-others-said-habitat
				// .row_selected').removeClass('row_selected')
            	$('#what-others-said-habitat').hide()
            	$('#open-habitat').show()
            })
            $('#what-others-said-habitat .add-to-discussion-button').hide()

					
/*
 * $('#add-to-discussion-habitat .author-search-button').click(function(){
 * $('#author-search-habitat').show()
 * Sail.app.rollcall.fetchAllUsers(function(data) { $(data).each(function() { u =
 * this['user'] li = $("<li id='user-"+u.account.login+"'>"+u.account.login+"</li> ")
 * li.data('account', u.account) li.click(function() {
 * Sail.app.ollcall.Authenticator.pickLogin($(this).data('account')) })
 * picker.children(".users").append(li) })
 * 
 * $(inContainer || 'body').append(picker)
 *  }) })
 */ 
            
/*
 * This doesn't actually do anything $('#add-to-discussion-habitat
 * .save-button').click(function(){ Sail.app.observations.newDiscussionContent()
 * $('#add-to-discussion-habitat').hide() $('#new-habitat').hide()
 * $('#open-habitat').show() })
 */
            

	
			// do we still need this? TODO
/*
 * $("#what-others-said-habitat .add-to-discussion-button").click(function(){ //
 * Check to see if all required filters/comments are selected if
 * ($("#what-others-said-habitat input:radio:checked").size() == 2){ // TODO:
 * send the data to the server to be saved // Dummy code to move to the next
 * step $('#what-others-said-habitat').hide()
 * $('#add-to-discussions-habitat').show() // End of Dummy code } else { alert
 * ("Please select at least 2 filters!"); } })
 * 
 * $('#add-to-discussion-habitat .back-button').click(function(){
 * $('#new-habitat').hide() $('#open-habitat').show() })
 *  // Send selected filters for the agents to pull them back
 * $("div#aggregate-habitat-filters input").click(function(){
 * totalFiltersSelected = $("div#aggregate-habitat-filters
 * input").attr("checked"); // A filter from each category is selected so we can
 * send them to the agents (TODO? Still need?) if (totalFiltersSelected == 2){
 * alert ('woohoo'); }
 *  // Set the table header for the dynamic column if (this.name ==
 * "note-filter-set"){ $("table#aggregate-habitat-table
 * th#dynamic-column-aggregate-habitat").html($(this).button("option",
 * "label")); } })
 */                    			


// **********ORGANISM****************************************************************************************

			// When I want to Describe an ORGANISM is clicked
			$('div#open-organism button#describe-organism-button').click(function(){	    
				$("#organism-menu-page").hide();    
				$('#describe-lifecycle-organism').hide(); 
				$('#what-others-said-about-organisms').hide();				
				$('#new-organism').show();    
				// Clear all selections and text areas
				Sail.app.observations.clearNewOrganismPage();			
			})

			// When See What Others Said is clicked, this page page should be loaded
			$('div#open-organism #what-others-said-organism-button').click(function(){				
			    
				$("#organism-menu-page").hide();
				$('#new-organism').hide();                     
				$('#describe-lifecycle-organism').hide(); 
				$('#what-others-said-about-organisms').show();
				
				// HACK: preselect scum - looking for more elegant solution also
				// .css() is no good add and remove class instead
				$('#what-others-said-about-organisms .organism-filter-selected').css('border', '1px solid black'); 
				$('#what-others-said-about-organisms .organism-filter').css('border', 'none'); 
				$('#chosen-organism-filter').attr('value', 'scum');
				
				// unchecking all radio buttons
				$('input:radio[name="organism-comment-filter-set"]').attr('checked', false);
				// removing active state from all jQuery styled radio buttons
				$('.organism-comment-filters label').removeClass('ui-state-active');
				
				// Pre-select the morphology radio buttton
				$('input:radio[name="organism-comment-filter-set"]').filter('[value="morphology"]').attr('checked', true);
				$("#organism-comment-filter-1 + label").addClass("ui-state-active");
				// setting the header of the datatable according to selected
				// criteria
				$("#dynamic-column-aggregate-organism").text($('input:radio[name=organism-comment-filter-set]:checked').val());
				// calling function to fill data-table via ajax call
				Sail.app.observations.generateOrganismsDT({selectedOrganism:$('#chosen-organism-filter').val(), aspect:$('input:radio[name=organism-comment-filter-set]:checked').val()})
            })

			// When I want to describe a LIFECYCLE is clicked, this page should be loaded
			$('div#open-organism #describe-lifecycle-organism-button').click(function(){ 
		    
				$("#organism-menu-page").hide();
				$('#new-organism').hide(); 
				$('#what-others-said-about-organisms').hide();				
				$('#describe-lifecycle-organism').show(); 
				                                 
				Sail.app.observations.clearOrganismLifecycle();				
            })   
             
			// When I want to see what others said about LIFECYCLES is clicked,
			// this page page should be loaded
			$('div#open-organism #what-others-said-organism-lifecycle-button').click(function(){
			    
				$("#organism-menu-page").hide();
				$('#new-organism').hide(); 
				$('#what-others-said-about-organisms').hide();				
				$('#describe-lifecycle-organism').hide();  
				$('#what-others-said-organism-lifecycle').show();    

				Sail.app.observations.clearOrganismLifecycleAggregate();
				
			})
                          	
        	$('#open-organism div#organism-action-buttons .save-button').click(function() {
        		if ($('.organism-blank-cell').children().size() == 0) {
        			alert("Please select an organism")       			
        		}
        		else {
           			Sail.app.observations.newOrganismContent(); 
    				Sail.app.observations.clearNewOrganismPage();
    				$('#new-organism').hide();
    				$("#organism-menu-page").show();
        		}
			})                           
			
            $('#open-organism div#organism-action-buttons .back-button').click(function(){
				$('#open-organism').show()
            	$('#new-organism').hide()
            	$('#open-organism #organism-menu-page').show()
            })    
        

			$('#open-organism div#describe-lifecycle-action-buttons .back-button').click(function(){
            	$('#describe-lifecycle-organism').hide()
				$('#open-organism').show()
            	$('#open-organism #organism-menu-page').show()
            }) 

 			$('#open-organism div#what-others-said-organism-lifecycle table#organism-life-cycle-table td.selectable').click(function() {
	        	// We first need to fill the "TO" part of the relationship
				// tables with the selected organism. Then we need to update
	 			// the "data-to" value on TDs with "relationship-count" class.
				// Then we make a call to the server and get the counts.
	                                                     
				$('#open-organism div#what-others-said-organism-lifecycle table#organism-life-cycle-table td.selectable').css("border", "none");
				$(this).css("border", "1px solid black");
	
				$('div#what-others-said-organism-lifecycle table#organism-lifecycle-count-table-1 td.selected-organism-relationship').html($(this).html());
				$('div#what-others-said-organism-lifecycle table#organism-lifecycle-count-table-2 td.selected-organism-relationship').html($(this).html());
				 
				toOrganism = $(this).attr('value');   
				cellListToUpdate =  $("div#organism-lifecycle-count-tables-container td.relationship-count");
				$.each(cellListToUpdate, function() {
					$(this).attr('data-to', toOrganism);
				});
				
				// Make a call to back-end (database) to get the counts and
				// populate the table with them
				Sail.app.observations.fillLifecycleCount(); 
				
			})

			$('#open-organism div#what-others-said-organism-lifecycle .back-button').click(function(){
				$('#what-others-said-organism-lifecycle').hide()
				$('#open-organism').show()
            	$('#open-organism #organism-menu-page').show()
			})
                       
			
			// Clearing the chosen organism
			$('div#new-organism div#organism-tables div#chosen-organism span.organism-only').click(function(){
				$(this).html('');
				$('div#tabs-2 table#organism-table td').css('border', 'none'); 
				$('div#tabs-2 input#selected-organism').attr('value', 'null');   			
			})
            

			// Allowing the student to select from the organisms and their
			// Juvenile form to display the evolution of the organism
			$('div#tabs-2 table#organism-table td').click(function(){    
				$('div#tabs-2 table#organism-table td').css('border', 'none');
				$(this).css('border', '1px solid black');                      
				$('div#new-organism div#organism-tables div#chosen-organism span.organism-only').html($(this).html());
				$('div#tabs-2 input#selected-organism').attr('value', $(this).attr('value'));
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
					}
					else {
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
			
			
			// Letting the user select from the Organism Filters to pull in the
			// comments given by all students
			$('div#open-organism div#what-others-said-about-organisms div#organism-filters td').click(function(){
				$('div#open-organism div#what-others-said-about-organisms div#organism-filters td').css('border', 'none');
				$(this).css('border', '1px solid black');     
				$('div#open-organism div#what-others-said-about-organisms div#organism-filters input#chosen-organism-filter').attr('value', $(this).attr('value'));
				
				Sail.app.observations.generateOrganismsDT({selectedOrganism:$('#chosen-organism-filter').val(), aspect:$('input:radio[name=organism-comment-filter-set]:checked').val()})
			})  
			 
			$('#what-others-said-about-organisms .organism-comment-filters input').click(function() {
				// setting the header of the datatable according to selected
				// criteria
				$("#dynamic-column-aggregate-organism").text($('input:radio[name=organism-comment-filter-set]:checked').val());
				// calling function to fill data-table via ajax call
				Sail.app.observations.generateOrganismsDT({selectedOrganism:$('#chosen-organism-filter').val(), aspect:$('input:radio[name=organism-comment-filter-set]:checked').val()})
			})      
			
			// Handling all the events for Organism Lifecycle Page
			$('div#describe-lifecycle-organism table#organism-lifecycle-table td.selectable').click(function() {  
				$('div#describe-lifecycle-organism table#organism-lifecycle-table td.selectable').css('border', 'none');
				$('div#describe-lifecycle-organism table#organism-lifecycle-table td.selected').removeClass('selected');
				$(this).css("border", "1px solid black");  
				$(this).addClass('selected');
			})    
			
			// When the save button is clicked we need to to save the organism
			// relations
			$('div#describe-lifecycle-organism div#describe-lifecycle-action-buttons button.save-button').click(function() {
				// Do not let the student submit the relationship if any of the
				// two slots are empty
				if ($("div#describe-lifecycle-organism table#organism-lifecycle-relation td#from-organism").html() == '' ||
					   $("div#describe-lifecycle-organism table#organism-lifecycle-relation td#to-organism").html() == '') {
						alert("Please select two organisms");
				} else { // Save the selections and clear them after
					Sail.app.observations.newOrganismLifecycle(); 
					Sail.app.observations.clearOrganismLifecycle();
	            	$('#describe-lifecycle-organism').hide()
					$('#open-organism').show()
					$('#open-organism #organism-menu-page').show()
				}
			})

			// When the student wants to paste the selected organism to show the
			// relationships between them
			$('div#describe-lifecycle-organism table#organism-lifecycle-relation td.content-cell').click(function() { 
				
				// Check to see if we need to fill the cell or empty it
				if ($(this).html() != ''){ // clear the cell
					$(this).html('');
					$(this).attr('value', 'null');
				} else {				
					// We need to see which organism was selected to be copied
					// over here
					selectedOrganismValue = $('div#describe-lifecycle-organism table#organism-lifecycle-table td.selected').attr('value');
					selectedOrganismHTML = $('div#describe-lifecycle-organism table#organism-lifecycle-table td.selected').html();
					$(this).html(selectedOrganismHTML);
					$(this).attr('value', selectedOrganismValue);
				}
			}) 
			
			
			// When we
			//$('#open-organism div#organism-what-others-said-action-buttons .save-button').click(Sail.app.observations.newOrganismContent)
			$('#open-organism div#organism-what-others-said-action-buttons .back-button').click(function(){
				$('#open-organism').show()
	           	$('#open-organism #what-others-said-about-organisms').hide()
	           	$('#open-organism #organism-menu-page').show()
	        })

                      	
        	
// **********RELATIONSHIPS***********************************************************************************
            $('#landing-relationships .new-button').click(function(){
                
            	$('#landing-relationships').hide()
            	$('#new-relationship').show()
            })
            $('#landing-relationships .view-button').click(function(){
                
				// call function that retrieves counts for each relationship via sleepy mongoose GET calls
				Sail.app.observations.fillRelationshipsTable()
				Sail.app.observations.generateRelationshipsDT({from:null, to:null})
				
            	$('#landing-relationships').hide()
            	$('#view-relationships').show()
            	
            })
            
// **********NEW RELATIONSHIP***********************************************************************************

            $('#new-relationship .save-button').click(function() {           	
            	if (($('#box1').children().size() == 0) || ($('#box2').children().size() == 0)) {
            		alert("Please select two organisms")
            	}
            	else {
                	Sail.app.observations.newRelationshipContent()	
                	$('#new-relationship').hide()
                	$('#landing-relationships').show()
            	}
            })

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

			$('#relationships .data-box').click(function(){
				Sail.app.observations.generateRelationshipsDT( {from:$(this).data('from'), to:$(this).data('to')} )
			})
            
// **********VIEW RELATIONSHIPS**********************************************************************************
            
            $('#view-relationships .back-button').click(function() {
                
            	$('#view-relationships').hide()
            	$('#landing-relationships').show()
            })
            
            //Handoff to MATT here
            $('#view-relationships .add-to-discussion-button').click(function() {
           		// $('#view-relationships .row_selected')
           		// do other stuff
           		// clear the tags: $('#view-relationships .row_selected').removeClass('row_selected')
            	$('#view-relationships').hide()
            	$('#landing-relationships').show()
            })    
            $('#view-relationships .add-to-discussion-button').hide()

			// row selector for dataTables
			$('#relationships-datatable tr').live('click', function() {
				if ( $(this).hasClass('row_selected') )
					$(this).removeClass('row_selected')
				else
					$(this).addClass('row_selected')
			})
				          
            
// **********COUNTS*********************************************************************************************
			
            $('#landing-counts .new-button').click(function() {                
            	$('#landing-counts').hide()
            	$('#new-counts').show()
            })
            $('#landing-counts .view-button').click(function() {				
            	$('#landing-counts').hide()
            	$('#view-counts').show()   
				// TODO: Select data from mongoDB and use it instead of dummy data. However this is to get flot going
				$.plot($("#placeholder"), [ [[0, 0], [1, 1]] ], { yaxis: { max: 1 } });        	
            })
            
// **********NEW COUNTS******************************************************************************************
            
			$('div#record-organisms table#count-vegetation-date-time td#count-vegetation-date-picker').datepicker(function() {
				alert ('hello');
			});
			$('.new-counts-datepicker').datepicker()
			
			$('#new-counts .save-button').click(function() {
            	//if ( $('input:radio').is(':checked') ) {
				if ( $('.counts-habitat-radio-button').is(':checked') && $('.counts-temperature-radio-button').is(':checked')
						&& $('.counts-light-radio-button').is(':checked') && $('.counts-humidity-radio-button').is(':checked') ) { 
            		Sail.app.observations.newCountsContent()
            		alert("Count submitted")
            		$('#new-counts').hide()
            		$('#landing-counts').show()
            	}
	            else {
	            	alert("Please record habitat, temperature, light levels and humidity")
	            }							
			})
			$('#new-counts .back-button').click(function() {                
            	$('#new-counts').hide()
            	$('#landing-counts').show()
            })			
    	
// **********VIEW COUNTS******************************************************************************************
    	
            $('#view-counts .back-button').click(function() {				
            	$('#view-counts').hide()
            	$('#landing-counts').show()           	
            })  
    	},

// ****************************************** HELPER FUNCTIONS ***************************************************

		clearNewOrganismPage: function () {
			$('#new-organism table#organism-table td').css('border', 'none');
			$('#new-organism table#juvenile-organism-table td').css('border', 'none');  
			$('#new-organism div#organism-evolution .organism-blank-cell').html('');				
			$('#new-organism div#organism-descriptions textarea').val('');          
			$('#new-organism div#organism-tables input#selected-organism').attr('value', 'null');
			$('#new-organism div#organism-tables input#selected-juvenile').attr('value', 'null');   
			$('#new-organism table#organism-evolution-table span.organism-blank-cell').attr('value', 'null'); 
			$('#new-organism div#organism-tables div#chosen-organism span.organism-only').html('');
		},

		// this doesn't work in Safari, for some reason :/
		dateString: function(d) {
			 function pad(n){return n<10 ? '0'+n : n}
			 return d.getFullYear()+'-'
			      + pad(d.getMonth()+1)+'-'
			      + pad(d.getDate())+' '
			      + pad(d.getHours())+':'
			      + pad(d.getMinutes())+':'
			      + pad(d.getSeconds())
		},   
		
		clearOrganismLifecycle: function () {
			// clear all previous selections
			$("div#describe-lifecycle-organism table#organism-lifecycle-table td.selected").css('border', 'none');
			$("div#describe-lifecycle-organism table#organism-lifecycle-table td.selected").removeClass('selected');
			$("div#describe-lifecycle-organism table#organism-lifecycle-relation td.content-cell").html('');
			$("div#describe-lifecycle-organism table#organism-lifecycle-relation td.content-cell").attr('value', 'null');
		},
		
		clearOrganismLifecycleAggregate: function () {
			$("div#what-others-said-organism-lifecycle table#organism-life-cycle-table td.selectable").css('border', 'none');
			$("div#organism-lifecycle-count-tables-container td.selected-organism-relationship").html('');
			$("div#organism-lifecycle-count-tables-container td.relationship-count").html('');
		},
		
		// function that retrieves counts for each lifecycle relationship via
		// sleepy mongoose GET calls
		fillLifecycleCount: function() {
			// do this for each table field that has the class
			// .relationship-count
			$('.relationship-count').each(function () {
				// ajax GET call to sleepy mongoose 
				// console.log($(this).data('to'));   
				console.log($(this));
				$.ajax({
					type: "GET",
					url: "/mongoose/wallcology/observations/_count",
					data: { criteria: JSON.stringify({"run.name":Sail.app.run.name, "type":"life_cycle", "from":$(this).attr('data-from'), "to":$(this).attr('data-to')}) },
					// handing in the context is very important to fill the
					// right table cell with the corresponding result - async
					// call in loop!!
					context: this,
				  	success: function(data) { 
						if (data.ok === 1) {                            
							 console.log("from " +$(this).data('from') +" to " +$(this).data('to') + ": " + data.count);
						                                                                                      
							if ($("div#organism-lifecycle-count-tables-container td.relationship-count:empty").size() == 0){
								$("div#organism-lifecycle-count-tables-container td.relationship-count").html('');
							}
							// writing the count value into the HTML
							$(this).text(data.count);
							 
							return true;
						}
						else {
							console.log("Mongoose request failed")
							return false
						}
					}
				}) // end of ajax
			}) // end of each
		},
		
		// function that retrieves counts for each relationship via sleepy
		// mongoose GET calls
		fillRelationshipsTable: function() {
			// do this for each table field that has the class .data-box
			$('.data-box').each(function () {
				// ajax GET call to sleepy mongoose
				$.ajax({
					type: "GET",
					url: "/mongoose/wallcology/observations/_count",

					data: { criteria: JSON.stringify({"run.name":Sail.app.run.name, "type":"relationship", "energy_transfer.from":$(this).data('from'), "energy_transfer.to":$(this).data('to')}) },
					// handing in the context is very important to fill the right table cell with the corresponding result - async call in loop!!
					context: this,
				  	success: function(data) {
						var resultArray
					    if (data.ok === 1) {
							console.log("Mongoose returned a data set")
							console.log("There are " + data.count + " relationships with energy transfer from " +$(this).data('from') +" to " +$(this).data('to'))

							// writing the count value into the HTML
							$(this).text(data.count)

							return true
						}
						else {
							console.log("Mongoose request failed")
							return false
						}
					}
				}) // end of ajax
			}) // end of each
		},
		
		// Data table population functions
		// Example criteria:
		// { wallscope: '1', note: 'organism' }
		generateHabitatsDT: function(userHabitatSelections) {
			// we do a count REST call to determine how many results to expect
			// (setting batch_size in _find)
			$.ajax({
				type: "GET",
				url: "/mongoose/wallcology/observations/_count",
				data: {criteria: JSON.stringify({"run.name":Sail.app.run.name, "type":"habitat", "wallscope":userHabitatSelections.wallscope})},
				context: userHabitatSelections,
				success: function(data) {
/*			$.get("/mongoose/wallcology/observations/_count",
				{ criteria: JSON.stringify({"run.name":Sail.app.run.name, "type":"habitat", "wallscope":wallscope}) },
				function(data) {*/
					criteria = {"run.name":Sail.app.run.name, "type":"habitat", "wallscope":this.wallscope}
					criteria[this.note] = {$ne: ""}
					
			    	if (data.ok === 1) {
						batchSize = 0
						batchSize = data.count
						
						$.ajax({
							type: "GET",
							url: "/mongoose/wallcology/observations/_find",
							data: { criteria: JSON.stringify(criteria), batch_size: batchSize },
							context: this,
							success: function(data) {

/*						$.get("/mongoose/wallcology/observations/_find",
							{ criteria: JSON.stringify(criteria), batch_size: batchSize },
							function(data) {*/
								habitatResultsArray = []
								for (i=0;i<data.results.length;i++) {
									d = new Date(data.results[i].timestamp)
									habitatResultsArray[i] = [data.results[i][this.note], data.results[i].origin, Sail.app.observations.dateString(d)]
								}
						    	if (data.ok === 1) {			    		
									$('#aggregate-habitat-table').dataTable({
										"bAutoWidth": false,
										"iDisplayLength": 6,
										"bLengthChange": false,
										"bDestroy" : true,
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
							}
						})//, "json")
			    	}
			    	else {
						console.log("Mongoose request count failed")
						return false
					}
				}
			})//, "json")
		},
		
		// Example criteria:
		// { selectedOrganism: 'blue-bug', aspect: 'morphology' }
		generateOrganismsDT: function(userOrganismSelections) {
			// we do a count REST call to determine how many results to expect
			// (setting batch_size in _find)
			$.ajax({
				type: "GET",
				url: "/mongoose/wallcology/observations/_count",
				data: {criteria: JSON.stringify({"run.name":Sail.app.run.name, "type":"organism", "organism":userOrganismSelections.selectedOrganism})},
				context: userOrganismSelections,
				success: function(data) {
/*			$.get("/mongoose/wallcology/observations/_count",
				{ criteria: JSON.stringify({"run.name":Sail.app.run.name, "type":"organism","organism":selectedOrganism}) },
				function(data) {*/
					criteria = {"run.name":Sail.app.run.name, "type":"organism","organism":this.selectedOrganism}
					criteria[this.aspect] = {$ne: ""}
						
			    	if (data.ok === 1) {			    		
						batchSize = 0
						batchSize = data.count
						
						$.ajax({
							type: "GET",
							url: "/mongoose/wallcology/observations/_find",
							data: { criteria: JSON.stringify(criteria), batch_size: batchSize },
							context: this,
							success: function(data) {
/*						$.get("/mongoose/wallcology/observations/_find",
							{ criteria: JSON.stringify(criteria), batch_size: batchSize },						
							function(data) {*/
								organismResultsArray = []
								for (i=0;i<data.results.length;i++) {
									d = new Date(data.results[i].timestamp)
									organismResultsArray[i] = [data.results[i][this.aspect], data.results[i].origin, Sail.app.observations.dateString(d)]
								}

						    	if (data.ok === 1) {			    		
									$('#aggregate-organism-table').dataTable({
										"iDisplayLength": 6,
										"bLengthChange": false,
										"bDestroy" : true,		
										"bJQueryUI": true,
										"sPaginationType": "full_numbers",
										"aoColumns": [        
														{ "sWidth": "500px" },
														null,
														null
													],

										"aaData": organismResultsArray	
									})
						    	}
						    	else {
									console.log("Mongoose request failed")
									return false
								}
							}
						})//, "json")	
			    	}
			    	else {
						console.log("Mongoose request failed")
						return false
					}
				}
			})//, "json")
			
		},

		generateRelationshipsDT: function(userRelationshipSelection) {
			// we do a count REST call to determine how many results to expect
			// (setting batch_size in _find)
			$.ajax({
				type: "GET",
				url: "/mongoose/wallcology/observations/_count",
				data: {criteria: JSON.stringify({"run.name":Sail.app.run.name, "type":"relationship", "energy_transfer.from":userRelationshipSelection.from, "energy_transfer.to":userRelationshipSelection.to})},
				context: userRelationshipSelection,
				success: function(data) {
					
					criteria = {"run.name":Sail.app.run.name, "type":"relationship", "energy_transfer.from":userRelationshipSelection.from, "energy_transfer.to":userRelationshipSelection.to}
					criteria["comments"] = {$ne: ""}
					this.criteria = criteria
/*			$.get("/mongoose/wallcology/observations/_count",
				{ criteria: JSON.stringify({"run.name":Sail.app.run.name, "type":"relationship", "energy_transfer.from":from, "energy_transfer.to":to})},
				function(data) {*/
			    	if (data.ok === 1) {			    		
						batchSize = 0
						batchSize = data.count
						
						$.ajax({
							type: "GET",
							url: "/mongoose/wallcology/observations/_find",
							data: { criteria: JSON.stringify(criteria), batch_size: batchSize },
							context: this, 
							success: function(data) {
								
/*						$.get("/mongoose/wallcology/observations/_find",
							{ criteria: JSON.stringify({"run.name":Sail.app.run.name, "type":"relationship", "energy_transfer.from":from, "energy_transfer.to":to}), batch_size: batchSize },
							function(data) {
*/								
								relationshipResultsArray = []
								for (i=0;i<data.results.length;i++) {
									d = new Date(data.results[i].timestamp)
									relationshipResultsArray[i] = [data.results[i].comments, data.results[i].origin, Sail.app.observations.dateString(d)]
								}

						    	if (data.ok === 1) {			    		
									$('#relationships-datatable').dataTable({
										"iDisplayLength": 6,
										"bLengthChange": false,
										"bDestroy" : true,		
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
							}
						})//, "json")
			    	}
			    	else {
						console.log("Mongoose request failed")
						return false
					}
			    }
			})//, "json")
			
		},


// ***************************************************************************************************************

    	
        newHabitatContent: function() {
        	sev = new Sail.Event('new_observation', {
        		type:'habitat',
        		wallscope:$('input:radio[name=radio]:checked').val(),
        		environmental_conditions:$('#new-habitat .environmental-conditions').val(),
        		structural_features:$('#new-habitat .structural-features').val(),
        		organisms:$('#new-habitat .organisms').val(),
        		comments:$('#new-habitat .comments').val()
        		})
        	WallCology.groupchat.sendEvent(sev)
        	// clear fields
	        $('#new-habitat .text-box').val('')
	        $("input:radio").prop('checked', false)
	        $('#new-habitat .radio-button').button('refresh')
        },
                

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
				type:'organism',
				morphology:morphology,
		        behaviour:behavior,
		        habitat:habitat,
		        comments:comments,
		        organism:chosen_organism,
				/**
				 * This piece is commented out because the designers changed
				 * their mind. DO NOT REMOVE THIS CODE as they might change
				 * their minds once again lifecycle:{ slot1: first_juvenile,
				 * slot2: second_juvenile, slot3: third_juvenile }
				 */
			})  			
	        WallCology.groupchat.sendEvent(sev)
        },   

		newOrganismLifecycle: function() {    
			
			fromOrganism = $('div#describe-lifecycle-organism table#organism-lifecycle-relation td#from-organism').attr('value');
			toOrganism = $('div#describe-lifecycle-organism table#organism-lifecycle-relation td#to-organism').attr('value');
			
			sev = new Sail.Event('new_observation', {
				run:Sail.app.run,
				// run_name: Sail.app.run.name,
				type:'life_cycle',
				from: fromOrganism,
				to: toOrganism,
			})
			WallCology.groupchat.sendEvent(sev)
		},
        
        newRelationshipContent: function() {
	        sev = new Sail.Event('new_observation', {
	        	type:'relationship',
	        	energy_transfer:{
	        		"from":$('#box1').children().attr("id"),
	        		"to":$('#box2').children().attr("id")	        		
	        	},
	        	comments:$('#new-relationship .comments').val()
	        	})
	        WallCology.groupchat.sendEvent(sev)
	        // clear fields
	        $('#box1').html("")
	        $('#box2').html("")		
	        $('#new-relationship .comments').val('')
        },

        newCountsContent: function() {
	        sev = new Sail.Event('new_observation', {
	        	type:'count',
	        	chosen_habitat:$('input:radio[name=select-habitat]:checked').val(),
	        	temperature:$('input:radio[name=temp]:checked').val(),
	        	light_level:$('input:radio[name=light]:checked').val(),
	        	humidity:$('input:radio[name=humidity]:checked').val(),
	        	scum_percent:$('#new-counts .count-scum-percent').val(),
	        	mold_percent:$('#new-counts .count-mold-percent').val(), 
				vegetation_date:$('#new-counts .vegatation_date').val(),
				vegatation_time:$('#new-counts .vegatation_time').val(),
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
				organism_date:{
					count1_date:$('#new-counts .count1-date').val(),
					count2_date:$('#new-counts .count2-date').val(),
					count3_date:$('#new-counts .count3-date').val()
				},
				organism_time:{
					count1_time:$('#new-counts .count1-time').val(),
					count2_time:$('#new-counts .count2-time').val(), 
					count3_time:$('#new-counts .count3-time').val()
				}
			})

	        WallCology.groupchat.sendEvent(sev)
	        // clear fields
	        $('#new-counts .text-box').val('') 
			$('#new-counts .count-organism-data-cell').val('')
	        $("input:radio").prop('checked', false)
	        $('#new-counts .radio-button').button('refresh')	        
        },

    },
   
// **********************************************************************************************************************************
     
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
            Sail.app.observations.init()
        },
        
        authenticated: function(ev) {
            
        },
        
        unauthenticated: function(ev) {
            window.location.href = "/index.html"
        },
        
        // not sure why we're going this route, but whateves
/*        context_switch: function(event, changedContext) {
        	//alert(changedContext)
        	// set the context
        	// where are the contexts defined?
        	// 
        	//"viewing_others_habitat_observations", "viewing_others_organism_observations", "viewing_others_lifecycle_observations", "viewing_others_foodweb_observations"
        	//and maybe "viewing_other"
        	//$(Sail.app).trigger('context_switch', "viewing_others_habitat_observations")
        	if (changedContext == "viewing_others_habitat_observations") {
        		selectableTags = ["X", "Y"]
            	alert(changedContext)
        	} 
        	
        }*/
    }
}
    /*
	 * phonegap: function() { $('#camera').click(function() {
	 * navigator.camera.getPicture(onSuccess, onFail, { quality: 15 });
	 * 
	 * function onSuccess(imageData) { var image =
	 * document.getElementById('photo'); image.src = "data:image/jpeg;base64," +
	 * imageData; }
	 * 
	 * function onFail(message) { alert('Failed because: ' + message); } })
	 * 
	 * $('#phonegap-info').html(JSON.stringify(navigator.device).replace(/,/g,',<br />'))
	 * 
	 * navigator.accelerometer.watchAcceleration( function(acc) {
	 * $('#accelerometer').text("x: "+acc.x+", y:"+acc.y+", z:"+acc.z) } )
	 * 
	 * navigator.compass.watchHeading( function(heading) {
	 * $('#compass').text(heading) } )
	 * 
	 * navigator.geolocation.watchPosition( function(position) {
	 * $('#geolocation').text("Lat: "+acc.coords.latitude+",
	 * Long:"+acc.coords.longitude) } )
	 * 
	 * $('#alert').click(function() { navigator.notification.alert("This is an
	 * alert!", null, "Uh oh!", "Okay") })
	 * 
	 * $('#confirm').click(function() { navigator.notification.alert("This is a
	 * confirmation!", null, "Yay!", "Alright") })
	 * 
	 * $('#beep').click(function() { navigator.notification.beep(3) })
	 * 
	 * $('#vibrate').click(function() { navigator.notification.vibrate(1000) }) },
	 */    
