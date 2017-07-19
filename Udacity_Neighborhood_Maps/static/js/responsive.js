/**
	This jquery works when the page is ready.
	It will hides and open the DOM elements
	based on the actions.
**/
$(document).ready(function(){
	$(".cross").hide();
	$("#subcontainer").hide();
	$(".hamburger").click(function(){
		$("#subcontainer").show();
		$(".hamburger").hide();
		$(".cross").show();
	});
	$(".cross").click(function(){
		$("#subcontainer").hide();
		$(".cross").hide();
		$(".hamburger").show();
	});
});