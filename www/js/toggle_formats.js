var ALL_CLASSES = ['js-websocket','js-jsonrpc','cli']
function show_syntax(classname) 
{
	for (var c in ALL_CLASSES) {
		$('.lang-'+ALL_CLASSES[c]).parent().hide();
		console.log("hididng "+ALL_CLASSES[c])
	}
	$('.lang-'+classname).parent().show();
}

function show_syntax_handler()
{
	show_syntax( $('#syntax_mode').val() );
}

$(document).on('flatdoc:ready', function() 
{
	$('#syntax_mode').change(show_syntax_handler);
	show_syntax_handler();
});
