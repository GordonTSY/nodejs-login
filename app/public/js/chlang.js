if(getLang("language")=="zh_tw")
{
	$('#main').text('E5教學中心');
	$('#wboard').text('電子白板');
	$('#material').text('課堂教材');
	$('#home').text('個人中心');
}else{	
	$('#main').text('E5-Campus');
	$('#wboard').text('E-WBoard');
	$('#material').text('Material');
	$('#home').text('Accout Setting');
}



function getLang(key) { 
//ex:language=zh-tw;
	if( document.cookie.length==0 ) 
		return false; 
	var i=document.cookie.search(key+'='); 
	if( i==-1 ) 
		return false; 
	i+=key.length+1; 
	var j=document.cookie.indexOf(';', i); 
	if( j==-1 ) 
		j=document.cookie.length; 
	return document.cookie.slice(i,j); 
}	


$('#chtbtn').click(function(){
	document.cookie = "language=zh_tw;";	
	window.location.reload(false);
});
	
$('#engbtn').click(function(){
	document.cookie = "language=en_us;";
	window.location.reload(false);	
});

//	btn for lang
