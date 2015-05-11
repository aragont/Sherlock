window.onload = function() {
	var temp = 0;
for (var i=0; i<6; i++)
	for (var j=0; j<6; j++){
		//console.log(i , j, '#s'+i+j+'>img');
		 //$("#s"+i+j)[0].src  ="/Sherlock/Image/Big/11.jpg"; 
		 //console.log("load");

		 $('#s'+j+i+' > div').css('background', 'url(BasicBig.bmp) '+temp+ 'px 0px' );
		 temp-=60;
	}
	//start_new_game();
}
click_img = function(data) {
	//console.log(data.parentNode);
} 
draw_big = function(col,row,card) {
	$('#s'+col+row).append(' <div class="sherlock_pict"> </div>');
	add_step({
		'col':col,'row':row, 'card':card,'type':'big','act':'add'
	})
	$('#s'+col+row+'> table').remove();
	var w = card*60+row*60*6;
	//console.log(w);
	$('#s'+col+row+'>div').css('background', 'url(BasicBig.bmp) -'+w+ 'px 0px' );
	for (var  r=0; r<6; r++){
		$('#'+row+r+card+'> span').css('background','none');
		delete_variants(r,row,card);
	}	
	
}
draw_variants = function(i,j,Variants) {
	//console.log(i,j,Variants);
	var count=0;
	var table = '<table><tr>';
	for (var k=0; k<6;k++) {
		if (count===3) table+= '</tr><tr>';
		var w = -k*30-j*180;
		if (Variants.indexOf(k)>=0) { table+='<td class = "small" id = '+j+''+i+''+k+'><span style = "background-image:url(/Sherlock/BasicSmall.bmp);background-position:'+w+'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span> </td>';}
     	else table+='<td class = "small" id = '+j+''+i+''+k+'><span  onclick = "td_click(this.parentNode.id);"></span> </td>';
		count++;
	}
	table+= '</tr></table>';
	//console.log(table);
	$('#s'+i+j+'>div').remove();
	$('#s'+i+j).append(table);
}
draw_field = function(){
	for (var i=0; i<6; i++)
		for (var j=0; j<6; j++) {
			if (!FField[i][j].Initial) {
				var count=0;
				var table = '<table><tr>';
				for (var k=0; k<6;k++) {
					if (count===3) table+= '</tr><tr>';
					var w = -k*30-j*180;

     				if (FField[i][j].Variants.indexOf(k)>=0) { table+='<td class = "small" id = '+j+''+i+''+k+'><span style = "background-image:url(/Sherlock/BasicSmall.bmp);background-position:'+w+'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span> </td>';}
     				else table+='<td class = "small" id = '+j+''+i+''+k+'><span  onclick = "td_click(this.parentNode.id);"></span> </td>';
				count++;
				}
				table+= '</tr></table>';
				$('#s'+i+j+'>div').remove();
				$('#s'+i+j+'>table').remove();
				$('#s'+i+j).append(table);
			}	 else  {
				//$('#s'+i+j+">div").remove();
				//console.log(i,j);
				$('#s'+i+j+'>table').remove();
//console.log("correct"+i+j);
		 	$('#s'+i+j+'>div').css('background', 'url(BasicBig.bmp) -'+FField[i][j].UserValue*60+ 'px 0px' );}
}
}
start_new_game = function(level) {
	var l = $('.window_info_level')[0].innerHTML.replace('Уровень: ','');
	//console.log(l);
	l+=level;
	InitLevel(level);
	document.querySelector('.window_buttons').classList.add('Sherlock_state_game');
	draw_field();
// 	for (var i=0; i<6; i++)
// 		for (var j=0; j<6; j++) {
// 			if (!FField[i][j].Initial) {
// 				var count=0;
// 				var table = '<table><tr>';
// 				for (var k=0; k<6;k++) {
// 					if (count===3) table+= '</tr><tr>';
// 					var w = -k*30-j*180;

//      				if (FField[i][j].Variants.indexOf(k)>=0) { table+='<td class = "small" id = '+j+''+i+''+k+'><span style = "background-image:url(/Sherlock/BasicSmall.bmp);background-position:'+w+'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span> </td>';}
//      				else table+='<td class = "small" id = '+j+''+i+''+k+'><span  onclick = "td_click(this.parentNode.id);"></span> </td>';
// 				count++;
// 				}
// 				table+= '</tr></table>';
// 				$('#s'+i+j+'>div').remove();
// 				$('#s'+i+j).append(table);
// 			}	 else  {
// //console.log("correct"+i+j);
// 		 	$('#s'+i+j+'>div').css('background', 'url(BasicBig.bmp) -'+FField[i][j].CorrectValue*60+ 'px 0px' );}
// 			//$('body').on('contextmenu', 'td', function(e){return false; });
 			$('body').on('contextmenu', '.Sherlock_game_main', function(e){return false; });
		//}
		for (var i=0; i<21; i++){
			var w = FMainVClues[i].Card1*(-60);
			var v = FMainVClues[i].Card2*(-60);
			var tips = '<table><tr><td class = "down-tip"><span style = "background-image:url(/Sherlock/BasicBig.bmp);background-position: '+w+'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></td></tr><tr><td class="down-tip"><span style = "background-image:url(/Sherlock/BasicBig.bmp);background-position:'+v+'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></td></tr></table'
$('#down_tips_'+i).append(tips);
		}
		for (var i=0; i<24; i++) {
			//console.log("leofe", FMainHClues[i].Card1);
			var w = FMainHClues[i].Card1*(-60);
			var v = FMainHClues[i].Card2*(-60);
			var e = FMainHClues[i].Card3*(-60);
if (FMainHClues[i].ClueType!='hcTriple')
			var tips = '<table><tr><td class = "down-tip"><span style = "background-image:url(/Sherlock/BasicBig.bmp);background-position: '+w+'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></td><td class="down-tip"><span style = "background-image:url(/Sherlock/BasicBig.bmp);background-position:'+v+'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></td><td class="down-tip"><span style = "background-image:url(/Sherlock/BasicBig.bmp);background-position:'+e+'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></td></tr></table'
else var tips = '<table><tr><td class = "down-tip"><span style = "background-image:url(/Sherlock/BasicBig.bmp);background-position: '+w+'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"><span style = "background-image:url(/Sherlock/BasicBig.bmp);background-position: -2340px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></span></td><td class="down-tip"><span style = "background-image:url(/Sherlock/BasicBig.bmp);background-position:'+v+'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></td><td class="down-tip"><span style = "background-image:url(/Sherlock/BasicBig.bmp);background-position:'+e+'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></td></tr></table' 
$('#left_tip_'+i).append(tips);
		}

}
td_right_click = function (data) {
	
	while (data.length<3) data='0'+data;
	//console.log(data );
	if ($('#'+data+'> span').css('background-image')!=='none') {
		
		
		$('#'+data+'> span').css('background','none'); 
		//alert(data);
		var col = div(data,10)%10;
		var row = div(data,100)
		add_step({
			'col':col,'row':row, 'card':data%10,'type':'small','act':'del'
		})
		//console.log(FField[col][row].Variants);
		//var Variants = FField[col][row].Variants;
		delete_variants(col,row,data%10);
		//console.log( FField[col][row].Variants);
		if (FField[col][row].Variants.length===1) {
			draw_big(col,row,FField[col][row].Variants[0]);

			}
		
	} else {
		
		var w = (data % 10)*(-30)-div(data, 100)*180;
		var col = div(data,10)%10;
		var row = div(data,100);
		add_step({
			'col':col,'row':row, 'card':data%10,'type':'small','act':'add'
		})
		
		add_variants(col,row,data%10);
		$('#'+data+'> span').css('background-image','url(/Sherlock/BasicSmall.bmp)');
		$('#'+data+'> span').css('background-position',w+'px 0px');}
	}
td_click = function (data) {
	var k = data%10;
	data = div(data,10);
	data = (data%10)*10+div(data,10);
	if (data<10) data='0'+data;
	draw_big(div(data,10), data%10, k);
	choose_big(div(data,10), data%10, k);
}
