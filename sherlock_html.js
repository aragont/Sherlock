/* jshint browser: true */
/* global console */
'use strict';
/*module SherlockHtml*/

/** @module  SherlockGame */
var SherlockGame=(function(my){

my.drawAll=function(){
    return drawSherlockTable();
}

var drawSherlockTable=function(){
    var table='<div id="sherlock_table" class="sherlock_base_position"><table>'
    +'<tr>'
    +'<td><div id="sherlock_game" class="sherlock_base_position">'+drawGameTable()+'</div></td>'
    +'<td rowspan=><div id="sherlock_hor_clues" class="sherlock_base_position">'+drawHorCluesTable()+'</div></td>'
    +'</tr>'
    +'<tr>'
    +'<td colspan=1><div id="sherlock_controls" class="sherlock_base_position">'+drawControls()+'</div></td>'
    +'<td></td>'
    +'</tr>'
    +'<tr>'
    +'<td colspan=2><div id="sherlock_ver_clues" class="sherlock_base_position">'+drawVerCluesTable()+'</div></td>'
    +'</tr>'
    +'</table>';
    return table;
}

var drawGameTable=function(){
    var table='<table id="sherlock_game_table"><tr>';
    for(var col=0;col < 6;col+=1){
        table+='<td ><table class="sherlock_column">';
        for(var row=0;row < 6;row+=1){
            table+='<tr><td class="sherlock_cell" id="sherlock_cell'+row+col+'">'
            +'</td></tr>';
        };
        table+='</table></td>';
    };
    table+='</tr></table>';
    return table;
}

var drawHorCluesTable=function(){
    var table='<table id="sherlock_hor_clues_table"><tr>';
    var row=0,num;
    for(var i=0;i<my.maxHorClues;i+=1){
      if(i && !(i%3)){
         row+=1;
         table+='</tr><tr>';
      };
      num=row+i%3*Math.floor(my.maxHorClues/3);
      table+='<td id="sherlock_hor_clue_'+num+'"></td>';
    };
    table+='</tr></table>';
    return table;
}

var drawVerCluesTable=function(){
    var table='<table id="sherlock_ver_clues_table"><tr>';
    for(var num=0;num<my.maxVerClues;num+=1){
      table+='<td id="sherlock_ver_clue_'+num+'"></td>';
    };
    table+='</tr></table>';
    return table;
};

var drawControls=function(){
    var controls=''
    +'<div id="sherlock_info" style="display:inline-block">'
    +'<div id="sherlock_info_level" class="sherlock_button">Level:0</div>'
    +'<div id="sherlock_info_timer" class="sherlock_button">00:00:00</div>'
    +'</div>'
    +'<div id="sherlock_buttons1" style="display:inline-block"><div>';
    return controls;

    var controls='<div class="input" id="number_level">'
    +'<p>Введите уровень</p>'
    +'<input placeholder="0"></input>'
    +'<button onclick="send_level()">Set</button>'
    +'</div>'
    +'<div id="window_buttons1" >'
    +'<button class = "sherlock_button" id="button_start"   onclick = "SherlockGame.doStart();">Start</button>'
    +'<button class = "sherlock_button" id="button_restart" onclick = "SherlockGame.doStart();">Restart</button>'
    +'<button class = "sherlock_button" id="button_undo"    onclick = "SherlockGame.doUndoStep()">Undo</button>'
    +'<button class = "sherlock_button" id="button_undo_to_last_correct" onclick = "SherlockGame.doUndoToLastCorrect()">Return to Correct</button>'
    +'<button class = "sherlock_button" id="button_hint" onclick = "SherlockGame.doFindHint()">Hint</button>'
    +'</div>'
    +'<div id="window_buttons2">'
    +'<button class = "sherlock_button" id="button_level" onclick = "SherlockGame.change_level()">Level</button>'
    +'<button class = "sherlock_button" id="button_name" onclick = "SherlockGame.show_set_name()">Name</button>'
    +'<button class = "sherlock_button" id="button_test" onclick = "SherlockGame.doTest()">Test</button>'
    +'</div>'
    return controls;
}

return my;

}(SherlockGame||{}));
