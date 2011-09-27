/*$(function(){
    $("div#new-organism table#organism-table tr td").click(function(event) {
                                                                                   
		// Mark the chosen cell as selected to draw a border around the selected cell
		$("div#new-organism table#organism-table td").removeClass("selected");
		selectedCell = $("td#" + event.currentTarget.id);
		selectedCell.addClass("selected");

		// Get the value of the selected organism and store it in a hidden variable
		selectedOrganism = event.currentTarget.id;
		$('input#selected-organism').val(selectedOrganism);
    });
}); 

$(function (){       	
	$("div#new-organism h5.organism-description-section").click(function (event) { 
		$("div#new-organism div.description-content").hide();
		$(this).parent().find("div.description-content").toggle()
	}); 	
});  
    */