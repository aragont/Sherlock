/* global console */
/* jshint browser: true */

"use strict";

/** @module SherlockGame */
var SherlockGame=(function(my){


/**
 * Константа для обозначения отсутствия карты
 */
my.NOT_A_CARD="NC";

/**
 * Константы для описания типов горизонтальных подсказок
 */
my.HC_NONE="HC-";
my.HC_NEXT_TO="HCNT";
my.HC_NOT_NEXT_TO="HC-NT";
my.HC_TRIPLE="HCT";
my.HC_NOT_TRIPLE="HC-T";
my.HC_ORDER="HCO";

/**
 * Константы для описания типов верикальных подсказок
 */
my.VC_NONE="VC-";
my.VC_TOGETHER="VCT";
my.VC_NOT_TOGETHER="VC-T";

/**
 * Константы для описания возможности нахождения карты в позиции
 */
my.CP_CAN_BE="CAN";
my.CP_CANNOT_BE="CANNOT";
my.CP_IS_HERE="HERE";

/**
 * Массив индексов, указывающих на начало уровня в массиве уровней
 * @type {Array}
 */
var levelMap=[];

/**
 * Возвращает количество доступных уровней
 * @func   module:SherlockGame#getLevelsCount
 * @return {Int}
 */
my.getLevelsCount=function()
{
    return levelMap.length;
}

/**
 * Основной массив игры. Каждый элемент - клетка игрового поля.
 * Все шаги игрока изменяют этот массив.
 * При изменении массива, игроку отрисовывается новое поле
 * @type {Array}
 */
my.gameField=[];


/**
 * Максимальное количество вертикальных подсказок
 * подсчитывается при разборе списка уровней
 */
my.maxVerClues=0;

/**
 * Текущее количество горизонтальных подсказок
 * подсчитывается при разборе списка уровней
 */
my.maxHorClues=0;

/**
 * Максимальное количество вертикальных подсказок
 * подсчитывается при инициализации уровня
 */
my.curVerClues=0;

/**
 * Максимальное количество горизонтальных подсказок
 * подсчитывается при инициализации уровня
 */
my.curHorClues=0;

/**
 * Массив горизонтальных ключей
 * @type {Array}
 */
my.hClues=[];

/**
 * Массив вертикальных ключей
 * @type {Array}
 */
my.vClues=[];

/**
 * массив истории ходов
 * @type {Array}
 */
var stepHistory=[];

/**
 * Правильно ли заполнено поле при текущей раскладке карт
 * @type {Boolean}
 */
var isCorrect=true;

/**
 * Поиск состояния в котором правильно заполнено поле
 * @return {Int} число undo, чтобы достичь корректной позиции
 * @func   module:SherlockGame#findCorrectPosition
 */
my.findCorrectPosition=function(){
    if(isCorrect) return 0;
    for(var i=0; (i<stepHistory.length)&&stepHistory[i].isCorrect;i++);
    return stepHistory.length-i+1; 
}

/**
 * Ищет колонку, в которой выбрана карта
 * @param  {Object} карта: row - строка, idx - номер карты (0..5)
 * @return {Int} Колонка в которой стоит карта или -1
 * @func   module:SherlockGame#findCard
 */
my.findCard=function(card){
    if( card.idx === my.NOT_A_CARD ){
         return -1;
    }
    for(var col=0; col<6; col+=1){
        if(my.gameField[card.row][col].userValue===card.idx){
             return col;
        }
    }
    return -1;
}

/**
 * Удаляет вариант заполнения данной клетки
 * @param  {Int} col     колонка
 * @param  {Object} card    карта
 * @func   module:SherlockGame#removeVariant
 */
var removeVariant=function(col, card) {
    var step;
    if (!my.gameField[card.row][col].variants[card.idx]){
        return;
    }
    var cnt=0;
    for(var idx=0;idx<6;idx++){
        if(my.gameField[card.row][col].variants[idx]) cnt++;
    }
    if(cnt < 2){
        return;
    }
    step={
        type: "remove",
        col : col,
        card: card,
        isCorrect:isCorrect
    };

    //console.log("remove row:"+row+" col:"+col+" card:"+card);
    stepHistory.push(step);

    my.gameField[card.row][col].variants[card.idx]=false;

    // Удалили правильный вариант
    if (my.gameField[card.row][col].correctValue===card.idx) {
        isCorrect=false;
    }

    var count=0;
    for(var i=0;i<6;i+=1){
        if(my.gameField[card.row][col].variants[i]) count+=1;
    }
    // Удалили все варианты
    if(!count){
        my.gameField[card.row][col].variants=[];
        isCorrect=false;
    }
}

/**
 * Выбор окончательного местоположения карты
 * @param  {Int} col колонка, в которой расположена карта
 * @param  {Object} card выбранная карта
 * @return {Array}  Массив столбцов, в которые изменились ячейки, исключая выбранную
 * @func module:SherlockGame#selectVariant
 */
var selectVariant=function(col, card) {
    var step;
    if (!my.gameField[card.row][col].variants[card.idx]) {
        return [];
    }
    step={
        type: "select",
        col : col,
        card: card,
        isCorrect:isCorrect,
        variants: my.gameField[card.row][col].variants,
        removed: []
    };
    for(var cl=0;cl<6;cl+=1){
       if(my.gameField[card.row][cl].variants[card.idx]){
           my.gameField[card.row][cl].variants[card.idx]=false;
           step.removed.push(cl);
       }
    }

    stepHistory.push(step);
    //console.log("select row:"+card.row+" col:"+col+" card:"+card.idx);
    my.gameField[card.row][col].userValue=card.idx;
    my.gameField[card.row][col].variants=[];
    // Первое условие отсекает этап поиска правильных решений при заполнения поля
    if(my.gameField[card.row][col].correctValue!==my.NOT_A_CARD
    && my.gameField[card.row][col].correctValue!==card.idx) {
        isCorrect=false;
    }
    return step.removed;
}

/**
 * Производит откат одного хода
 * @func  module:SherlockGame#undoStep
 */
var undoStep=function() {
    if(stepHistory.length===0)return;

    var step=stepHistory.pop();

    if (step.type==="remove") {
        my.gameField[step.card.row][step.col].variants[step.card.idx]=true;
    } else {
        my.gameField[step.card.row][step.col].userValue=my.NOT_A_CARD;
        my.gameField[step.card.row][step.col].variants=step.variants;
        for(var i=0; i < step.removed.length; i+=1){
            my.gameField[step.card.row][step.removed[i]].variants[step.card.idx]=true;
        }
    }
    isCorrect=step.isCorrect;
}

/**
 * Производит откат ходов до верного расположения карт на поле
 * @func  module:SherlockGame#undoToLastCorrect
 */
var undoToLastCorrect=function(){
    for(var i=stepHistory.length; i >0 && !isCorrect; i--){
        undoStep();
    }
}

/**
 * Выполняет действия c клетками
 * @param {Object} action - действие, которое необходимо выполнить
 * @func   module:SherlockGame#execStep
 */
my.execStep=function(action){
    switch(action.type){
        case "remove":
            removeVariant(action.col,action.card);
            break;
        case "select":
            selectVariant(action.col,action.card);
            break;
        case "undo":
            undoStep();
            break;
        case "undo_to_last_correct":
            undoToLastCorrect();
            break;
        default:
            my.assert(false, "execStep: unknown action: "+action.type);
    }
}

/**
 * инициализация и заполнение массива с картой уровней
 * @func   module:SherlockGame#createLevelMap
 */
var createLevelMap=function (){
    var i=0,
        current=0,
        cnt=0,
        horClues,verClues,
        ctype=0;
    for(i=0; i < 65535; i+=1) {
        levelMap[i]=current;
        cnt=my.levels[current++];
        current=current + cnt;
        cnt=my.levels[current++];
        horClues=cnt;
        my.maxHorClues=(my.maxHorClues>horClues?my.maxHorClues:horClues);
        for(var j=0; j < cnt; j+=1) {
            ctype=idiv(my.levels[current++], 36);
            switch (ctype) {
                case 0:
                case 2:
                case 4:
                    current +=1;
                    break;
                case 1:
                case 3:
                    current +=2;
                    break;
            }
        }
        cnt=my.levels[current++];
        verClues=cnt;
        my.maxVerClues=(my.maxVerClues>verClues?my.maxVerClues:verClues);
        current +=cnt * 2;
        if(current>=my.levels.length || typeof my.levels[current]!=="number"){
            break;
        }
        if(horClues>18 && verClues>11){
           console.log("horClues:"+horClues+" verClues:"+verClues);
        }
    }
    //console.log("maxHorClues:"+my.maxHorClues+" maxVerClues:"+my.maxVerClues);
};

/**
 * Инициализация массивов уровня
 * @func  module:SherlockGame#initEmptyLevel
 */
my.initEmptyLevel=function(){
    for(var row=0; row < 6; row+=1){
        my.gameField[row]=[];
        for(var col=0; col < 6; col+=1) {
            my.gameField[row][col]={
              correctValue:my.NOT_A_CARD,
              userValue:my.NOT_A_CARD,
              variants:[true,true,true,true,true,true]
            };
        }
    }
    my.hClues=[];
    my.vClues=[];
}

/**
 * Инициализация уровня. Заполнение всех необходимых для игры массивов
 * @param {Int} level уровень игры
 * @func  module:SherlockGame#initLevel
 */
my.initLevel=function(level){
    var idx, col, row, card, i, cnt, current, clueType;

    my.initEmptyLevel();
    current=levelMap[level];
    cnt=my.levels[current++];
    for(i=0; i < cnt; i+=1) {
        card=my.levels[current++];
        col=card % 6;
        card=idiv(card, 6);
        row=idiv(card, 6);
        idx=card % 6;
        my.gameField[row][col]={
            correctValue:idx,
            userValue:idx,
            variants:[]
        };
        for(col=0; col<6; col+=1){
            if(my.gameField[row][col].variants[idx]){
                my.gameField[row][col].variants[idx]=false;
            }
        }
    }

    cnt=my.levels[current++];
    my.curHorClues=cnt;
    for(i=0; i < cnt; i+=1) {
        my.hClues[i]={type:null,card:[{},{},{}]};
        card=my.levels[current++];
        clueType=idiv(card, 36);
        card=card % 36;
        my.hClues[i].card[0].row=idiv(card,6);
        my.hClues[i].card[0].idx=card % 6;
        switch (clueType) {
            case 0:
            case 2:
                my.hClues[i].type=clueType===0?my.HC_NEXT_TO
                                                  :my.HC_NOT_NEXT_TO;
                card=my.levels[current++];
                my.hClues[i].card[1].row=idiv(card,6);
                my.hClues[i].card[1].idx=card % 6;
                my.hClues[i].card[2].row=my.hClues[i].card[0].row;
                my.hClues[i].card[2].idx=my.hClues[i].card[0].idx;
                break;
            case 1:
            case 3:
                my.hClues[i].type=(clueType===1?my.HC_TRIPLE
                                                  :my.HC_NOT_TRIPLE);
                card=my.levels[current++];
                my.hClues[i].card[1].row=idiv(card,6);
                my.hClues[i].card[1].idx=card % 6;
                card=my.levels[current++];
                my.hClues[i].card[2].row=idiv(card,6);
                my.hClues[i].card[2].idx=card % 6;
                break;
            case 4:
                my.hClues[i].type=my.HC_ORDER;
                my.hClues[i].card[1].idx=my.NOT_A_CARD;
                card=my.levels[current++];
                my.hClues[i].card[2].row=idiv(card,6);
                my.hClues[i].card[2].idx=card % 6;
                break;
           default:
                my.assert(false,"initLevel:"+level+" Unknown horizontal clue type");
        }
    } //end for

    cnt=my.levels[current++];
    my.curVerClues=cnt;
    for(i=0; i < cnt; i+=1) {
        my.vClues[i]={type:null,card:[{},{},{}]};
        card=my.levels[current++];
        if ((card & 128) > 0) {
            my.vClues[i].type=my.VC_NOT_TOGETHER;
        } else {
            my.vClues[i].type=my.VC_TOGETHER;
        }
        card &= 127;
        my.vClues[i].card[0].row=idiv(card,6);
        my.vClues[i].card[0].idx=card%6;
        card=my.levels[current++];
        my.vClues[i].card[1].row=idiv(card,6);
        my.vClues[i].card[1].idx=card%6;
    }

    solveGame();
    my.assert(checkCorrectness(),"initLevel:"+level+" Game not solved");

    //Восстанавливаем начальное состояния поля, скопировав correctValue из найденного решения
    stepHistory=[];
    for(row=0; row < 6; row+=1){
        for(col=0; col < 6; col+=1) {
            var correctValue=my.gameField[row][col].userValue;
            my.gameField[row][col]={
                correctValue:correctValue,
                userValue   :my.NOT_A_CARD,
                variants     :[true,true,true,true,true,true]
            };
        }
    }

    current=levelMap[level];
    cnt=my.levels[current++];
    for(i=0; i < cnt; i+=1) {
        card=my.levels[current++];
        col=card % 6;
        card=idiv(card, 6);
        row=idiv(card, 6);
        idx=card % 6;
        for(var cl=0; cl<6; cl+=1){
            my.gameField[row][cl].variants[idx]=false;
        }
        my.gameField[row][col]={
            correctValue:idx,
            userValue:idx,
            variants:[]
        };
    }
}


/**
 * Проверка возможности нахождения карты в данной клетке
 * @param {Int} col - колонка, которую необходимо проверить
 * @param {Object} card - карта
 * @returns {String} результат проверки
 *   my.CP_CAN_BE может быть расположена
 *   my.CP_CANNOT_BE не может быть расположена
 *   my.CP_IS_HERE уже расположена
 * @func  module:SherlockGame#checkPossibility
 */
my.checkPossibility=function(col, card){
    var result;
    if(col<0||col>5||card.row<0||card.row>5){
        result=my.CP_CANNOT_BE;
    } else
    if(card.idx===my.NOT_A_CARD){
        result=my.CP_CANNOT_BE;
    } else
    if(card.idx===my.gameField[card.row][col].userValue){
        result=my.CP_IS_HERE;
    } else
    if(my.gameField[card.row][col].variants[card.idx]){
        result=my.CP_CAN_BE;
    } else {
        result=my.CP_CANNOT_BE;
    }
    return result;
}

/**
 * проверяет корректность заполнения поля
 * @return {True|False} правильность заполнения поля
 * @func  module:SherlockGame#checkCorrectness
 */
var checkCorrectness=function(){
    for(var row=0; row < 6; row+=1){
        for(var col=0; col < 6; col+=1){
            if (my.checkPossibility(col, {row:row, idx:my.gameField[row][col].userValue})===my.CP_CANNOT_BE) {
                return false;
            }
        }
    }
    return true;
}

/**
 * решение игры. Заполняет массив my.gameField вместо игрока
 * если уровень не решается за 300 ходов, то это ошибка
 * @func   module:SherlockGame#solveGame
 */
var solveGame=function() {
    var hint;
    for(var i=0; i < 300; i+=1) {
        hint=my.findHint();
        if (!hint.found) break;
        my.execStep(hint.action);
    }
    my.assert(i<300,"solveGame: too many steps");
}


/**
 * Целочисленной деление
 * @param  {Int} val Делитель
 * @param  {Int} by  Делимое
 * @example
 * //returns 5
 * idiv(11,2)
 * @example
 * //returns 4
 * idiv(111,23)
 * @return {Int}     Частное
 * @func   module:SherlockGame#idiv
 */
var idiv=function(val, by) {
    return (val - val % by) / by;
}

createLevelMap();

return my;

}(SherlockGame||{}));