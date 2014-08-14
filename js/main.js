$(function(){

	$(".modal-checkbox input").on("change",function(){
		$("#btn-download").toggleClass("btn-download btn-disabled");
	});
	$("#btn-download").click(function(){
		if($(this).hasClass("btn-disabled")){
			return false;
		}
		$(".modal .close").click();
	});
	$(".logo-download-link").click(function(){
		var filename = $(this).data("src");
		$("#btn-download").attr("href", filename).attr("download", filename.replace(/^.*[\\\/]/, ''));
	});

});

