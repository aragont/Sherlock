/* jshint browser: true */
/* global console */
'use strict';
/*module SherlockDialog*/

/** @module  SherlockGame */
var SherlockGame=(function(my){
/**
 * номер таймера
 * @type {Number};
 */
var gameTimerNumber=0;

var imageSets=[
  {
    big:{
        img   :"images/ClassicBig.png",
        width :32,
        height:32
    },
    small:{
        img   :"images/ClassicSmall.png",
        width :16,
        height:16
    }
  },
  {
    big:{
        img      :"images/Basic60Big.png",
        width :45,
        height:60
    },
    small:{
        img      :"images/Basic60Small.png",
        width :24,
        height:30
    }
  },
  {
    big:{
        img      :"images/BasicBig.png",
        width :60,
        height:80
    },
    small:{
        img      :"images/BasicSmall.png",
        width :30,
        height:40
    }
  }
];
var imageSet=imageSets[0];

/*
  Специальные иконоки
  расположены в наборе с индекса 36
*/
var EMPTY_CARD ={row:6,idx:0};
var TRI_CARD   ={row:6,idx:1};
var NOT_CARD   ={row:6,idx:2};
var LEFT_CARD  ={row:6,idx:3};
var MIDDLE_CARD={row:6,idx:4};
var RIGHT_CARD ={row:6,idx:5};

/**
 * инициализирует и отрисовывает игровое поле при запуске окна
 * @func module:SherlockGame#init
 */
my.init=function(){
//    loadLevels();
    if(window.innerWidth > 860 && window.innerHeight > 1020){
        imageSet=imageSets[2];
        imageSet.clueSize='b';
    }else
    if(window.innerWidth > 900 && window.innerHeight > 700){
        imageSet=imageSets[1];
        imageSet.clueSize='b';
    }else{
        imageSet=imageSets[0];
        imageSet.clueSize='b';
    }
    my.initEmptyLevel();
    $$('#sherlock_placeholder').html(my.drawAll());
    drawGame();
    drawButtons(0);
    $$('sherlock_button_start').on('singleTap', function (e){
        SherlockGame.doStart();
        return false;
        }
    );
}

var loadLevels=function(){
    var oReq = new XMLHttpRequest();
    oReq.open("GET", "levels/levelPack.dat", true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function (oEvent) {
      var arrayBuffer = oReq.response; // Note: not oReq.responseText
      if (arrayBuffer) {
        var byteArray = new Uint8Array(arrayBuffer);
        alert("byteArray[0]:"+byteArray[0]);
        for (var i = 0; i < byteArray.byteLength; i++) {
          // do something with each byte in the array
        };
      };
    };

    oReq.send(null);
};

/**
 * Отрисовывает кнопки управления
 * @param  {Int} state состояние игры
 *     0 - до начала игры
 *     1 - в процессе игры
 *     2 - завершение игры
 * @func module:SherlockGame#drawButtons
 */
var drawButtons=function(state){
    switch(state){
    case 0:
       var buttons=''
       +'<button class="sherlock_button" id="sherlock_button_start" onclick="SherlockGame.doStart();">Start</button>'
       +'<button class="sherlock_button" id="sherlock_button_set-level" onclick="SherlockGame.doStart();">Set level</button>'
       +'<button class="sherlock_button" id="sherlock_button_restart" onclick="SherlockGame.doStart();">Restart</button>';
       break;
    case 1:
       var buttons=''
       +'<button class="sherlock_button" id="sherlock_button_undo" alt="Undo" onclick = "SherlockGame.doUndoStep()">&lt;</button>'
       +'<button class="sherlock_button" id="sherlock_button_undo_to_last_correct" alt="Undo to last correct" onclick = "SherlockGame.doUndoToLastCorrect()">&lt;&lt;&lt;</button>'
       +'<button class="sherlock_button" id="sherlock_button_hint" alt="Hint" onclick = "SherlockGame.doFindHint()">?</button>'
       +'<button class="sherlock_button" id="sherlock_button_stop" alt="Stop" onclick = "SherlockGame.doStop()">Stop</button>'
       break;
    default:
    }
    $$('#sherlock_buttons1').html(buttons);
};

/**
 * Отрисовывает игровое поле
 * @func module:SherlockGame#drawGame
 */
var drawGame=function(){
    if($$('.sherlock_hint').length){
        $$('.sherlock_hint').remove();
    }
    for(var row=0;row < 6;row+=1){
        for(var col=0;col < 6;col+=1){
            $$('#sherlock_cell' + row + col).html(drawCell(row,col));
        }
    }
    for(var i=0;i<my.maxVerClues;i+=1){
        $$('#sherlock_ver_clue_'+i).html(drawVClue(imageSet.clueSize,my.vClues[i]));
    }
    for(var i=0;i<my.maxHorClues;i+=1){
        $$('#sherlock_hor_clue_'+i).html(drawHClue(imageSet.clueSize,my.hClues[i]));
    }

    $$('.sherlock_variant .sherlock_card_div').on('click', function (e){
	SherlockGame.doClick(e.target.parentNode.id,'remove');
        return false;
    });
    $$('.sherlock_variant .sherlock_card_div').on('singleTap', function (e){
	SherlockGame.doClick(e.target.parentNode.id,'remove');
        return false;
    });

    $$('.sherlock_variant .sherlock_card_div').on('contextmenu', function (e){
	SherlockGame.doClick(e.target.parentNode.id,'select');
        return false;
    });
    $$('.sherlock_variant .sherlock_card_div').on('hold', function (e){
	SherlockGame.doClick(e.target.parentNode.id,'select');
        return false;
    });

};

/**
 * Отрисовывает ячейку игрового поля
 * @param  {Int} row  строка
 * @param  {Int} col  колонка
 * @func module:SherlockGame#drawCell
 */
var drawCell=function(row, col){
    if(my.gameField[row][col].userValue===my.NOT_A_CARD){
        return drawVariants(row,col);
    } else {
        return drawCard(row,col);
    };
};

/**
 * Отрисовывает карту, которую выбрал игрок в качестве заполнения поля
 * @param  {Int} row  строка, в которой выбрана карта
 * @param  {Int} col  колонка, в которой выбрана карта
 * @func module:SherlockGame#drawCard
 */
var drawCard=function(row, col){
   var idx=my.gameField[row][col].userValue;
   return '<div style="padding-left:'+(3*imageSet.small.width-imageSet.big.width)/2+'px;'
     +'padding-right:'+(3*imageSet.small.width-imageSet.big.width)/2+'px">'
     +getCardDiv('b',{row:row,idx:idx})+'</div>'
     +'</div>';
};

/**
 * Отрисовывает варианты для заполнения поля
 * @param  {Int} row  строка, в которой выбрана карта
 * @param  {Int} col  колонка, в которой выбрана карта
 * @func module:SherlockGame#drawVariants
 */
var drawVariants=function(row, col){
    var variants=my.gameField[row][col].variants;
    var table='<table class="sherlock_cardholder"><tr>';
    for(var idx=0; idx<6; idx+=1){
        if(idx ===3)table += '</tr><tr>';
        table += '<td><div class="sherlock_variant" id="sherlock_variant' +row+''+col+''+idx+'">';
        if(variants[idx]){
            table+=getCardDiv('s',{row:row,idx:idx})+'</div>';
        }else{
            table+=getCardDiv('s',EMPTY_CARD,0)+'</div>';
        };
        table+='</div></td>';
    };
    table += '</tr></table>';
    return table;
};

/*
 * Отрисовывает вертикальную подсказку
 * @param  {String} type 'hor' или 'ver'
 * @param  {String} size 'b' или 's'
 * @param  {Object} clue подсказка
 * @func module:SherlockGame#drawClue
 */
var drawClue=function(type,size,clue){
    switch(type){
    case 'hor': return drawHClue(size,clue); 
    case 'ver': return drawVClue(size,clue); 
    }
}


/*
 * Отрисовывает вертикальную подсказку
 * @param  {String} size 'b' или 's'
 * @param  {Object} clue подсказка
 * @func module:SherlockGame#drawVClue
 */
var drawVClue=function(size,clue){
    var cell=[];
    var table='<table class="sherlock_cardholder">'

    if(clue === undefined || clue.type === my.VC_NONE){
        cell[0]=getCardDiv(size,EMPTY_CARD)+'</div>';
        cell[1]=getCardDiv(size,EMPTY_CARD)+'</div>';
    }else{
        cell[0]=getCardDiv(size,clue.card[0])+'</div>';
        cell[1]=getCardDiv(size,clue.card[1]);
        if(clue.type===my.VC_NOT_TOGETHER){
            cell[1]+=getCardDiv(size,NOT_CARD,0.5)+'</div>';
        }
        cell[1]+='</div>';
    };
    for(var i=0;i<2;i+=1){
        table+='<tr><td>'+cell[i]+'</td></tr>';
    };
    table+='</tr></table></td>';
    return table;
};

/*
 * Отрисовывает горизонтальную подсказку
 * @param  {String} size 'b' или 's'
 * @param  {Object} clue подсказка
 * @func module:SherlockGame#drawHClue
 */

var drawHClue=function(size,clue){
    var cell=[];

    if(clue===undefined || clue.type===my.HC_NONE){
        cell[0]=getCardDiv(size,EMPTY_CARD)+'</div>';
        cell[1]=getCardDiv(size,EMPTY_CARD)+'</div>';
        cell[2]=getCardDiv(size,EMPTY_CARD)+'</div>';
    } else
    if(clue.type===my.HC_TRIPLE){
        cell[0]=getCardDiv(size,clue.card[0])+getCardDiv(size,LEFT_CARD,0.5)
           +'</div></div>';
        cell[1]=getCardDiv(size,clue.card[1])+getCardDiv(size,MIDDLE_CARD,0.5)
            +'</div></div>';
        cell[2]=getCardDiv(size,clue.card[2])+getCardDiv(size,RIGHT_CARD,0.5)
            +'</div></div>';
    } else
    if(clue.type===my.HC_NOT_TRIPLE){
        cell[0]=getCardDiv(size,clue.card[0])+getCardDiv(size,LEFT_CARD,0.5)
            +'</div></div>';
        cell[1]=getCardDiv(size,clue.card[1])+getCardDiv(size,MIDDLE_CARD,0.5)
            +getCardDiv(size,NOT_CARD,0.5)+'</div>'
            +'</div></div>';
        cell[2]=getCardDiv(size,clue.card[2])+getCardDiv(size,RIGHT_CARD,0.5)
            +'</div></div>';
    } else
    if(clue.type===my.HC_NOT_NEXT_TO){
        cell[0]=getCardDiv(size,clue.card[0])+'</div>';
        cell[1]=getCardDiv(size,clue.card[1])+getCardDiv(size,NOT_CARD,0.5)
            +'</div></div>';
        cell[2]=getCardDiv(size,clue.card[2])+'</div>';
    } else
    if(clue.type===my.HC_NEXT_TO){
        cell[0]=getCardDiv(size,clue.card[0])+'</div>';
        cell[1]=getCardDiv(size,clue.card[1])+'</div>';
        cell[2]=getCardDiv(size,clue.card[2])+'</div>';
    } else
    if(clue.type===my.HC_ORDER){
        cell[0]=getCardDiv(size,clue.card[0])+'</div>';
        cell[1]=getCardDiv(size,TRI_CARD)+'</div>';
        cell[2]=getCardDiv(size,clue.card[2])+'</div>';
    };
    var table='<td><table class="sherlock_cardholder"><tr>';
    for(var i=0;i<3;i+=1){
        table+='<td>'+cell[i]+'</td>';
    };
    table+='</tr></table>';
    return table;
};

/**
 * формирование URL картинки с картой
 * @param  {String} size 'b' или 's'
 * @param  {Object} card  карта
 * @param  {Int} opacity  прозрачность
 * @func module:SherlockGame#getCardDiv
 */
var getCardDiv=function(size,card){
   var opacity=1;
   if(arguments.length === 3)
       opacity=arguments[2];

   var style=(size==='s'? imageSet.small:imageSet.big);
   var imgOffset=-(card.row*6+card.idx)*style.width;
   return'<div'
        +' class="sherlock_card_div"'
        +' style="width:'+style.width+'px;'
        +' height:'+style.height+'px;'
        +' opacity:'+opacity+';'
        +' display:block;'
        +' margin: 0px;'
        +' padding:0px;'
        +' background-image:url('+style.img+');'
        +' background-position: '+imgOffset+'px 0px"'
//        +' onclick="SherlockGame.doClick(this.parentNode.id,'+"'"+'remove'+"'"+');"'
//        +' oncontextmenu="SherlockGame.doClick(this.parentNode.id,'+"'"+'select'+"'"+');"'
        +'>';

};

/**
 * таймер игры
 *@func module:SherlockGame#gameTimer
 */
var gameTimer=function(){
    var time=$$('#sherlock_info_timer')[0].innerHTML;
    var time_str=time.split(':');
    var time_value=[];
    for(var i=0;i < 3;i+=1) time_value[i]=parseInt(time_str[i]);

    time_value[2]++;
    if(time_value[2]===60){
        time_value[1]++;
        time_value[2]=0;
    };
    if(time_value[1]===60){
        time_value[0]++;
        time_value[1]=0;
    };
    $$('#sherlock_info_timer')[0].innerHTML=correctLength(time_value[0])
        +':' + correctLength(time_value[1])
        +':' + correctLength(time_value[2]);

};

/**
 * корректирует длину строки, до двух символов. Используется для таймера, чтобы секунды и минуты всегда отображались двумя цифрами
 * @param  {Int} data цифра, которую нужно откорректировать
 * @return {String}      полученная строка
 * @func module:SherlockGame#correctLength
 */
var correctLength=function(data){
    if(data <= 9) return '0' + data;
    else return '' + data;
};

/**
 * Начало новой игры
 * @func module:SherlockGame#doStart
 */
my.doStart=function(){
    $$('#sherlock_info_timer')[0].innerHTML='00:00:00';
    if(gameTimerNumber)clearInterval(gameTimerNumber);
    gameTimerNumber=setInterval(function(){
        gameTimer();
    }, 1000);

    var l1=$$('#sherlock_info_level')[0].innerHTML.replace('Level:', '');
    var level=parseInt(l1);
    level=Math.floor(Math.random()*my.getLevelsCount());
    $$('#sherlock_info_level')[0].innerHTML='Level:' + level;
    my.initLevel(level);
    //document.querySelector('#window_buttons').classList.add('Sherlock_state_game');
    drawGame();

    for(var i=0;i<my.maxVerClues;i+=1){
        drawVClue(i);
    };
    for(var i=0;i<my.maxHorClues;i+=1){
         drawHClue(i);
    };
    drawButtons(1);
    document.oncontextmenu = function() {return false;};
};

/**
 * Остановка игры
 * @func module:SherlockGame#doStart
 */
my.doStop=function(){
    my.initEmptyLevel();
    drawGame();
    drawButtons(0);
}

/** Экспорт функции перерисовки поля для кнопки ОК в подсказках
* @func module:SherlockGame#doDrawGame
  */
my.doDrawGame=function(){
 drawGame();
};

/**
 * щелчок мышки на карточке. 
 * реализованы действия выбор варианта и удаление варианта
 * щелчки поостальным полям игнорируются
 * @param  {String} id sherlock_variant+трехзначное число:
 *      первая цифра - строка, вторая - колонка, третья - номер варианта
 * @param  {String} op действие select или remove
 * @func module:SherlockGame#doClick
 */
my.doClick=function(id,op){
    console.log("id:"+id+" op:"+op);

    if(id.substring(0,16) !== 'sherlock_variant') return true; 
    var row= +id.substring(16,17);
    var col= +id.substring(17,18);
    var idx= +id.substring(18,19);
    my.execStep({type:op,col:col,card:{row:row,idx:idx}});
    drawGame();
    return false;
};


/**
 * Обработчик кнопки Undo. Отменяет последний ход и перерисовывает поле
 * @func module:doUndoStep
 */
my.doUndoStep=function(){
    my.execStep({type:"undo"});
    drawGame();
};

/**
 * Обработчик кнопки UndoToLastCorrecy.
 *    Отменяет все ходы до первого ошибочного включительно и перерисовывает поле
 * @func module:doUndoToLastCorrect
 */
my.doUndoToLastCorrect=function(){
    my.execStep({type:"undo_to_last_correct"});;
    drawGame();
};

/**
 * Обработчик кнопки Test.
 * @func module:doTest
 */
my.doTest=function(){
    var count=my.getLevelsCount();
    alert("doTest: Available "+count+" levels");
    var maxvclues=-1,maxhclues=-1;
    for(var level=0;level<count;level+=1){
        my.initLevel(level);
        maxvclues=Math.max(my.vClues.length,maxvclues);
        maxhclues=Math.max(my.hClues.length,maxhclues);
    };
    alert("doTest: done maxvclues:"+maxvclues+" maxhclues:"+maxhclues);
};

/**
 * отрисовка уровня игры
 * @func module:SherlockGame#send_level
 */
var send_level=function(){
    $$('#window_info_level')[0].innerHTML='Уровень: ' + $$('#number_level >input')[0].value;
    $$('.input ').css('display', 'none');
};

/**
 * отрисовка блока для ввода номера уровня
 * @func module:SherlockGame#change_level
 */
var change_level=function(){
    $$('#number_level').css('display', 'block');
};

/**
 * отрисовка имени игрока
 * @func module:SherlockGame#send_name
 */
var send_name=function(){
    $$('#sherlock_name')[0].innerHTML=$$('#set_name >input')[0].value + '<p></p>';
    $$('.input ').css('display', 'none');
};

/**
 * показывает блок для ввода имени игрока
 * @func module:SherlockGame#show_set_name
 */
var show_set_name=function(){
    $$('#set_name').css('display', 'block');
};

/**
 * показать подсказку
 * @func module:SherlockGame#doFindHint
 */
my.doFindHint=function(){
    var hint=my.findHint();
    my.assert(hint.found,"doFindHint: No more hints");
    my.execStep(hint.action);
    drawHint(getHintText(hint));
};

/**
 * отрисовка блока с подсказкой
 * @param  {String} data  текст подсказки
 * @func module:SherlockGame#drawHint
 */
var drawHint=function(data){
    $$('#sherlock_ver_clues').append(
       '<div class="sherlock_hint"'
      +' style="'
      +'max-width:'+imageSet.small.width*30+'px;'
      +'position:absolute;'
      +'bottom:2px;'
      +'left:10px;'
      +'background: silver;'
      +'border: 2px solid;'
      +'">'
      +data
      +'<br><button onclick="SherlockGame.doDrawGame()">OK</button>'
      +'</div>'
    );
};

/**
 * генерация текста подсказки
 * @param  {Obj} hint  подсказка
 *    hint.label  тип подсказки
 *    hint.col, hint.raw  проблемная ячейка
 *    hint.card1 hint.card2, hint.card3 карты входящие в подсказку
 * @func module:SherlockGame#getHintText
 */
var getHintText=function(hint){
    var text, hintSize='s';
    switch(hint.label){
    case 'common_error':
        text='Решение ошибочно, но противоречие выявляется только в результате многоходовой комбинации';
        break;
    case 'variant_error':
        text='Поле в клетке '+(hint.col+1)+':'+(hint.row+1)+' не содержит вариантов';
        break;
    case 'herr_next':                                              
        text='Комбинация противоречит ключу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>:'
        +' карты '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'
        +' и '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +' должны находиться в соседних столбцах';
        break;
    case 'herr_not_next':
        text='Комбинация противоречит ключу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>:'
        +' карты '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'
        +' и '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +' не должны находиться в соседних столбцах';
        break;
    case 'herr_triple':
        text='Комбинация противоречит ключу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>:'
        +' карты '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'
        +' и '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)+'</div></div>'
        +' должны находиться рядом с картой '
        +'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +' по разные стороны от неё';
        break;
    case 'herr_not_triple':
        text='Комбинация противоречит ключу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>:'
        +' между картами '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'
        +' и '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)+'</div></div>'
        +' должен быть один столбец, в котором нет карты '
        +'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2);
        break;
    case 'herr_order':
        text='Комбинация противоречит ключу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>:'
        +' карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'
        +' должна быть левее, чем карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3);
        break;
    case 'verr_together':
        text='Комбинация противоречит ключу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>:'
        +' карты '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'
        +' и '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +' должны находиться в одном столбце';
        break;
    case 'verr_not_together':
        text='Комбинация противоречит ключу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>:'
        +' карты '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'
        +' и '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +' не могут находиться в одном столбце';
        break;

    case 'uniq_variant':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'
        +' должна быть в столбце '+(hint.action.col+1)
        +' потому что в ней остался только один возможный вариант';
        break;
    case 'uniq_cell':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'
        +' должна быть в столбце '+(hint.action.col+1)
        +', потому что в остальных столбцах этот вариант уже исключён';
        break;

    case 's_together':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' должна быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она находится в одном столбце с картой '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>';
        break;

    case 's_next_to_r':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' должна быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она находится в столбце, соседнем с картой '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +', а справа от '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'+' её быть не может';
        break;
    case 's_next_to_l':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' должна быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она находится в столбце, соседнем с картой '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +', а слева от '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'+' её быть не может';
        break;

    case 's_triple_l':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' должна быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)+'</div></div>'
        +' находится между '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' и '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +', а '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +' уже находится слева от '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)+'</div></div>';
        break;
    case 's_triple_r':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' должна быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)
        +' находится между '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' и '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)+'</div></div>'
        +', а '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +' уже находится справа от '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>';
        break;
    case 's_triple_nr':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' должна быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она находится рядом с картой '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +', а справа от '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'+' она быть не может';
        break;
    case 's_triple_nl':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' должна быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она находится рядом с картой '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +', а слева от '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'+' она быть не может';
        break;
    case 's_triple_between':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' должна быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она находится между '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +' и '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)+'</div></div>';
        break;
    case 's_triple_nr1':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' должна быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она находится через один столбец от карты '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +', а справа от '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'+' её быть не может';
        break;
    case 's_triple_nl1':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' должна быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она находится через один столбец от карты '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +', а слева от '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'+' её быть не может';
        break;
    case 's_not_triple_between_nr1':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' должна быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она находится через один столбец от карты '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +', а справа от '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +' её быть не может, иначе между ними окажется '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)+'</div></div>';
        break;
    case 's_not_triple_between_nl1':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' должна быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она находится через один столбец от карты '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +', а слева от '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +' её быть не может, иначе между ними окажется '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)+'</div></div>';
        break;

    case 'r_together':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' не может быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она находится в одном столбце с картой '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>';
        break;
    case 'r_not_together':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' не может быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она не может находится в одном столбце с картой '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>';
        break;
    case 'r_next_to':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' не может быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' в одном из соседних с ней столбцов должна быть карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>';
        break;
    case 'r_not_next_to':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' не может быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она не должна находится в столбце, соседнем с картой '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>';
        break;
    case 'r_triple_between_nl':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' не может быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она находится между '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +' и '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)+'</div></div>'
        +', а слева не может быть ни '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +', ни '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)+'</div></div>';
        break;
    case 'r_triple_between_nr':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' не может быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она находится между '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +' и '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)+'</div></div>'
        +', а справа не может быть ни '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'
        +', ни '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)+'</div></div>';
        break;
    case 'r_triple_between_nlr':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' не может быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она находится между '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +' и '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)+'</div></div>'
        +', а карты '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)+'</div></div>'+' нет ни справа, ни слева';
        break;
    case 'r_triple_near':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' не может быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' в одном из соседних с ней столбцов должна быть карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>';
        break;
    case 'r_triple_near1':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' не может быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' через один столбец от неё должна быть карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>';
        break;
    case 'r_not_triple_nl1':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' не может быть в столбце '+(hint.action.col+1)
        +', так как через столбец слева нет '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)+'</div></div>'
        +', а в соседнем столбце справа стоит '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +', и правило'+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'+' не может быть выполнено';
        break;
    case 'r_not_triple_nr1':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' не может быть в столбце '+(hint.action.col+1)
        +', так как через столбец справа нет '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)+'</div></div>'
        +', а в соседнем столбце слева стоит '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +', и правило'+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'+' не может быть выполнено';
        break;
    case 'r_not_triple_between':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' не может быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' не может находиться между '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>'
        +' и '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card3)+'</div></div>';
        break;
    case 'r_order_r':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' не может быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она должна находиться правее карты '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>';
        break;
    case 'r_order_l':
        text='Карта '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card1)+'</div></div>'+' не может быть в столбце '+(hint.action.col+1)
        +', так как по правилу '+'<div style="display:inline-block;vertical-align:middle;">'+drawClue(hint.type,hintSize,hint.clue)+'</div>'
        +' она должна находиться левее карты '+'<div style="display:inline-block;vertical-align:middle;">'+getCardDiv('s',hint.card2)+'</div></div>';
        break;

    default:
        my.assert(false,'getHintText: Unknown hint:'+hint.label);
        break;
    };
    return text;
};

my.assert=function(condition, message) {
    if (!condition) {
        message=message || "Assertion failed";
        alert(message);
//        if (typeof Error !== "undefined") {
//            throw new Error(message);
//        };
//        throw message; // Fallback
    };
};

return my;

}(SherlockGame||{}));

window.onload=SherlockGame.init;