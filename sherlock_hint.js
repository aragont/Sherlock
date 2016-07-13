/* jshint browser: true */
/* global console */
'use strict';

/** @module SherlockGame */
var SherlockGame=(function(my){

/**
 * Проверка поля на правильность расположения выбранных карт на поле
 * @return{Object} подсказка с количеством шагов, которые надо отменить 
 * для достижения верной позиции
 * @func module:SherlockGame#checkCommonError
 */
var checkCommonError=function(){
    var steps=my.findCorrectPosition();
    if(steps){
       // alert('Решение ошибочно, но противоречие выявляется только в результате многоходовой комбинации');
        return {
            found:true,
            label:"common_error",
            action:{type:"undo_to_last_correct",steps:steps}
        };
    }
    return {found:false};
}


/**
 * Проверка поля на наличие в незанятых клетках вариантов заполнения
 * @return{Object} подсказка
 * @func module:SherlockGame#checkVariantError
 */
var checkVariantError=function(){
    for(var row=0; row < 6; row++){
        for(var col=0; col < 6; col++){
            if(my.gameField[row][col].userValue===my.NOT_A_CARD
            && my.gameField[row][col].variants.length===0){
                // alert('Поле ' + col + ', ' + row + 'не содержит вариантов');
                return {
                    found:true,
                    label:"variant_error",
                    row:row,
                    action:{type:"undo"}
                };
            }
        }
    }
    return {found:false};
}

/**
 * Проверка поля на противоречие горизонтальным ключам
 * @param{Object} clue ключ
 * @return{Object} подсказка
 * @func module:SherlockGame#checkHClueError
 */
var checkHClueError=function(clue){
    var col1=my.findCard(clue.card[0]);
    var col2=my.findCard(clue.card[1]);
    var col3=my.findCard(clue.card[2]);
    if(clue.type===my.HC_NEXT_TO
    && col1!==-1 && col2!==-1
    && Math.abs(col1 - col2)!==1){
        // alert('Комбинация противоречит ключу:' + clue + ' карты ' + clue.card[0] + ' и ' + clue.card[1] + ' должны находиться в соседних столбцах');
        return {
            found:true,
            type:"hor",
            label:"herr_next",
            clue:clue,
            card1:clue.card[0],
            card2:clue.card[1],
            action:{type:"undo"}
        };
    }
    if(clue.type===my.HC_NOT_NEXT_TO
    && col1!==-1 && col2!==-1
    && Math.abs(col1 - col2)===1){
        // alert('Комбинация противоречит ключу:' + clue + ' карты ' + clue.card[0] + ' и ' + clue.card[1] + ' не должны находиться в соседних столбцах');
        return {
            found:true,
            type:"hor",
            label:"herr_not_next",
            clue:clue,
            card1:clue.card[0],
            card2:clue.card[1],
            action:{type:"undo"}
        };
    }
    if(clue.type===my.HC_TRIPLE
    && col1!==-1 && col2!==-1 && col3!==-1
    &&(Math.abs(col2 - col1)!==1 || Math.abs(col2 - col3)!==1)){
        // alert('Комбинация противоречит ключу ' + clue + ':карты ' + clue.card[0] + ' и ' + clue.card[2] + ' должны находиться рядом с картой ' + clue.card[1] + ' по разные стороны от неё');
        return {
            found:true,
            type:"hor",
            label:"herr_triple",
            clue:clue,
            card1:clue.card[0],
            card2:clue.card[1],
            card3:clue.card[2],
            action:{type:"undo"}
        };
    }
    if(clue.type===my.HC_NOT_TRIPLE
    && col1!==-1 && col2!==-1 && col3!==-1
    &&(Math.abs(col2 - col1)===1 || Math.abs(col2 - col3)===1)){
        // alert('Комбинация противоречит ключу' + clue + ':между картами ' + clue.card[0] + ' и ' + clue.card[2] + ' должен быть один столбец, в котором нет карты ' + clue.card[1]);
        return {
            found:true,
            type:"hor",
            label:"herr_not_triple",
            clue:clue,
            card1:clue.card[0],
            card2:clue.card[1],
            card3:clue.card[2],
            action:{type:"undo"}
        };
    }
    if(clue.type===my.HC_ORDER
    && col1!==-1 && col3!==-1
    && col1 > col3){
        // alert('Комбинация противоречит  ключу ' + clue + ':карта ' + clue.card[0] + ' должна быть левее, чем карта ' + clue.card[2]);
        return {
            found:true,
            type:"hor",
            label:"herr_order",
            clue:clue,
            card1:clue.card[0],
            card2:clue.card[1],
            action:{type:"undo"}
        };
    }
    return {found:false};
}

/**
 * Проверка поля на противоречие вертикальным ключам
 * @param{Object} clue ключ
 * @return{Object} подсказка
 * @func module:SherlockGame#checkVClueError
 */
var checkVClueError=function(clue){
    var col1=my.findCard(clue.card[0]);
    var col2=my.findCard(clue.card[1]);
    if(col1===-1 && col2===-1){
       return {found:false};
    }
    //TODO проверить, что при одной выбранной карте над/под ней есть вариант для второй. Можно автоматически исправить
    if(clue.type===my.VC_TOGETHER
    && col1!==col2){
        // alert('Комбинация противоречит  ключу ' + clue + ':карты #' + clue.card[0] + ' и #' + clue.card[1] + ' должны находиться в одном столбце');
        return {
            found:true,
            type:"ver",
            label:"verr_together",
            clue:clue,
            card1:clue.card[0],
            card2:clue.card[1],
            action:{type:"undo"}
        };
    }
    if(clue.type===my.VC_NOT_TOGETHER
    && col1===col2){
        // alert('Комбинация противоречит  ключу ' + clue + ':карты #' + clue.card[0] + ' и #' + clue.card[1] + ' не могут  находиться в одном столбце');
        return {
            found:true,
            type:"ver",
            label:"verr_not_together",
            clue:clue,
            card1:clue.card[0],
            card2:clue.card[1],
            action:{type:"undo"}
        };
    }
    return {found:false};
}


/**
 * Проверка на возможность однозначного заполнение клетки поля
 * Единственный вариант заполнения данной клетки либо данный вариант остался в одной клетке строки
 * @return{Object} подсказка
 * @func module:SherlockGame#searchUniqValue
 */
var searchUniqValue=function(){
    var vcount=[], card={};
    for(var row=0; row < 6; row++){
        vcount[row]=[0,0,0,0,0,0];
        for(var col=0; col < 6; col++){
            var count=0;
            for(var idx=0; idx < 6; idx++){
                if(my.gameField[row][col].variants[idx]){
                    count++;
                    card={row:row,idx:idx};
                    vcount[row][idx]++;
                }
            }
            if(count===1){
                // selectVariant(col, card);
                // alert('В клетке' + col + ', ' + clue.row + ' остался только один возможный вариант:карта #' + card);
                return {
                    found:true,
                    label:"uniq_variant",
                    card1:card,
                    action:{type:"select", col:col, card:card}
                };
            }
        }
        for(var idx=0; idx < 6; idx++){
            if(vcount[row][idx]===1){
                for(col=0; col < 6; col++){
                    if(my.gameField[row][col].variants[idx]){
                        card={row:row,idx:idx};
                        // selectVariant(col, card);
                        // alert('Карта #' + card + ' должна находится в клетке, ' + col + ', ' + row + ' потому что в остальных столбцах этот вариант уже исключён');
                        return {
                            found:true,
                            label:"uniq_cell",
                            card1:card,
                            action:{type:"select", col:col, card:card}
                        };
                    }
                }
             }
         }
    }
    return {found:false};
}

/**
 * Поиск возможност выбора карты по вертикальным ключам
 * @param{int} clue ключ
 * @return{Object} подсказка
 * @func module:SherlockGame#searchSVClue
 */
var searchSVClue=function(clue){
    for(var col=0; col < 6; col++){
        var p1=my.checkPossibility(col, clue.card[0]);
        var p2=my.checkPossibility(col, clue.card[1]);

        if(clue.type===my.VC_TOGETHER
        && p1===my.CP_IS_HERE
        && p2===my.CP_CAN_BE){
            // selectVariant(col, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' должна быть в ' + col + ', ' + clue.row2 + ' клетке, так как по правилу' + clue + ' она находится в одном столбце с картой ' + clue.card[0]);
            return {
                found:true,
                type:"ver",
                label:"s_together",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[0],
                action:{type:"select", col:col, card:clue.card[1]}
            };
        }
        if(clue.type===my.VC_TOGETHER
        && p2===my.CP_IS_HERE
        && p1===my.CP_CAN_BE){
            // selectVariant(col, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' должна быть в ' + col + ', ' + clue.row1 + ' клетке, так как по правилу' + clue + ' она находится в одном столбце с картой ' + clue.card[1]);
            return {
                found:true,
                type:"ver",
                label:"s_together",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[1],
                action:{type:"select",col:col, card:clue.card[0]}
            };
        }
    }//end for
    return {found:false};
}

/**
 * Поиск подсказок по горизонтальным ключам типа hcNextTo
 * @param{Object} clue ключ
 * @return{Object} подсказка
 * @func module:SherlockGame#searchSHClueNextTo
 */
var searchSHClueNextTo=function(clue){
    for( var col=0; col < 6; col++){
        var cL=col-1;
        var cR=col+1;
        var pC1=my.checkPossibility(col, clue.card[0]);
        var pL2=my.checkPossibility(cL,  clue.card[1]);
        var pR2=my.checkPossibility(cR,  clue.card[1]);
        var pC2=my.checkPossibility(col, clue.card[1]);
        var pL1=my.checkPossibility(cL,  clue.card[0]);
        var pR1=my.checkPossibility(cR,  clue.card[0]);

        if(pC1===my.CP_IS_HERE
        && pL2===my.CP_CAN_BE
        && pR2===my.CP_CANNOT_BE){
            // selectVariant(cL, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' должна быть в клетке ' + cL + ', ' + clue.row2 + ' , так как по правилу ' + clue + ' она находится в столбце, соседнем с картой ' + clue.card[0] + ', а справа от ' + clue.card[0] + ' её быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_next_to_r",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[0],
                action:{type:"select",col:cL, card:clue.card[1]}
            };
        }
        if(pC2===my.CP_IS_HERE
        && pL1===my.CP_CAN_BE
        && pR1===my.CP_CANNOT_BE){
            // selectVariant(cL, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' должна быть в клетке ' + cL + ', ' + clue.row1 + ' , так как по правилу ' + clue + ' она находится в столбце, соседнем с картой ' + clue.card[1] + ', а справа от ' + clue.card[1] + ' её быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_next_to_r",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[1],
                action:{type:"select",col:cL, card:clue.card[0]}
            };
        }
        if(pC1===my.CP_IS_HERE
        && pR2===my.CP_CAN_BE
        && pL2===my.CP_CANNOT_BE){
            // selectVariant(cR, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' должна быть в клетке ' + cR + ', ' + clue.row2 + ' , так как по правилу ' + clue + ' она находится в столбце, соседнем с картой ' + clue.card[0] + ', а слева от ' + clue.card[0] + ' её быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_next_to_l",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[0],
                action:{type:"select",col:cR, card:clue.card[1]}
            };
        }
        if(pC2===my.CP_IS_HERE
        && pR1===my.CP_CAN_BE
        && pL1===my.CP_CANNOT_BE){
            // selectVariant(cR, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' должна быть в клетке ' + cR + ', ' + clue.row1 + ' , так как по правилу ' + clue + ' она находится в столбце, соседнем с картой ' + clue.card[1] + ', а слева от ' + clue.card[1] + ' её быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_next_to_l",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[1],
                action:{type:"select",col:cR, card:clue.card[0]}
            };
        }
    } //end for
    return {found:false};
}

/**
 * Поиск подсказок по горизонтальным ключам типа hcTriple
 * @param{Object} clue ключ
 * @return{Object} подсказка
 * @func module:SherlockGame#searchSHClueTriple
 */
var searchSHClueTriple=function(clue){
    for(var col=0; col < 6; col++){
        var cL=col - 1;
        var cR=col + 1;
        var cLL=col - 2;
        var cRR=col + 2;
        var pC1=my.checkPossibility(col, clue.card[0]);
        var pL1=my.checkPossibility(cL,  clue.card[0]);
        var pR1=my.checkPossibility(cR,  clue.card[0]);
        var pLL1=my.checkPossibility(cLL, clue.card[0]);
        var pRR1=my.checkPossibility(cRR, clue.card[0]);
        var pC2=my.checkPossibility(col, clue.card[1]);
        var pL2=my.checkPossibility(cL,  clue.card[1]);
        var pR2=my.checkPossibility(cR,  clue.card[1]);
        var pC3=my.checkPossibility(col, clue.card[2]);
        var pL3=my.checkPossibility(cL,  clue.card[2]);
        var pR3=my.checkPossibility(cR,  clue.card[2]);
        var pLL3=my.checkPossibility(cLL, clue.card[2]);
        var pRR3=my.checkPossibility(cRR, clue.card[2]);

    // card2 в центре + ещё одна
        if(pC2===my.CP_IS_HERE
        && pL1===my.CP_IS_HERE
        && pR3===my.CP_CAN_BE){
            // selectVariant(cR, clue.card[2]);
            // alert('Карта ' + clue.card[2] + ' должна быть в клетке ' + cR + ', ' + clue.row3
            // + ', так как по правилу ' + clue + ' карта ' + clue.card[1]
            // + ' находится между ' + clue.card[0] + ' и ' + clue.card[2]
            // + ', а ' + clue.card[0] + ' уже находится слева от ' + clue.card[1]);
            return {
                found:true,
                type:"hor",
                label:"s_triple_l",
                clue:clue,
                card1:clue.card[2],
                card2:clue.card[0],
                card3:clue.card[1],
                action:{type:"select",col:cR, card:clue.card[2]}
            };
        }
        if(pC2===my.CP_IS_HERE
        && pR1===my.CP_IS_HERE
        && pL3===my.CP_CAN_BE){
            // selectVariant(cL, clue.card[2]);
            // alert('Карта ' + clue.card[2] + ' должна быть в клетке ' + cL + ', ' + clue.row3
            // + ', так как по правилу ' + clue + ' карта ' + clue.card[1]
            // + ' находится между ' + clue.card[0] + ' и ' + clue.card[2]
            // + ', а ' + clue.card[0] + ' уже находится справа от ' + clue.card[1]);
            return {
                found:true,
                type:"hor",
                label:"s_triple_r",
                clue:clue,
                card1:clue.card[2],
                card2:clue.card[0],
                card3:clue.card[1],
                action:{type:"select",col:cL, card:clue.card[2]}
            };
        }
        if(pC2===my.CP_IS_HERE
        && pL3===my.CP_IS_HERE
        && pR1===my.CP_CAN_BE){
            // selectVariant(cR, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' должна быть в клетке ' + cR + ', ' + clue.row1
            // + ', так как по правилу ' + clue + ' карта ' + clue.card[1]
            // + ' находится между ' + clue.card[0] + ' и ' + clue.card[2]
            // + ', а ' + clue.card[2] + ' уже находится слева от ' + clue.card[1]);
            return {
                found:true,
                type:"hor",
                label:"s_triple_l",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[2],
                card3:clue.card[0],
                action:{type:"select",col:cR, card:clue.card[0]}
            };
        }
        if(pC2===my.CP_IS_HERE
        && pR3===my.CP_IS_HERE
        && pL1===my.CP_CAN_BE){
            // selectVariant(cL, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' должна быть в клетке ' + cL + ', ' + clue.row1
            // + ', так как по правилу ' + clue + ' карта ' + clue.card[1]
            // + ' находится между ' + clue.card[0] + ' и ' + clue.card[2]
            // + ', а ' + clue.card[2] + ' уже находится справа от ' + clue.card[1]);
            return {
                found:true,
                type:"hor",
                label:"s_triple_r",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[2],
                card3:clue.card[0],
                action:{type:"select",col:cL, card:clue.card[0]}
            };
        }

        // card2 в центре и одна из боковых может быть только с одной стороны
        if(pC2===my.CP_IS_HERE
        && pR1===my.CP_CANNOT_BE
        && pL1===my.CP_CAN_BE){
            // selectVariant(cL, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' должна быть в клетке ' + cL + ', ' + clue.row1
            // + ', так как по правилу ' + clue
            // + ' она находится рядом с картой ' + clue.card[1]
            // + ', а справа от ' + clue.card[1] + ' она быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_triple_nr",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[1],
                action:{type:"select",col:cL, card:clue.card[0]}
            };
        }
        if(pC2===my.CP_IS_HERE
        && pL1===my.CP_CANNOT_BE
        && pR1===my.CP_CAN_BE){
            // selectVariant(cR, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' должна быть в клетке ' + cR + ', ' + clue.row1
            // + ', так как по правилу ' + clue + ' она находится рядом с картой ' + clue.card[1]
            // + ', а слева от ' + clue.card[1] + ' она быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_triple_nl",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[1],
                action:{type:"select",col:cR, card:clue.card[0]}
            };
        }
        if(pC2===my.CP_IS_HERE
        && pR3===my.CP_CANNOT_BE
        && pL3===my.CP_CAN_BE){
            // selectVariant(cL, clue.card[2]);
            // alert('Карта ' + clue.card[2] + ' должна быть в клетке ' + cL + ', ' + clue.row3
            // + ', так как по правилу ' + clue + ' она находится рядом с картой ' + clue.card[1]
            // + ', а справа от ' + clue.card[1] + ' она быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_triple_nr",
                clue:clue,
                card1:clue.card[2],
                card2:clue.card[1],
                action:{type:"select",col:cL, card:clue.card[2]}
            };
        }
        if(pC2===my.CP_IS_HERE
        && pL3===my.CP_CANNOT_BE
        && pR3===my.CP_CAN_BE){
            // selectVariant(cR, clue.card[2]);
            // alert('Карта ' + clue.card[2] + ' должна быть в клетке ' + cR + ', ' + clue.row3
            // + ', так как по правилу ' + clue + ' она находится рядом с картой ' + clue.card[1]
            // + ', а слева от ' + clue.card[1] + ' она быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_triple_nl",
                clue:clue,
                card1:clue.card[2],
                card2:clue.card[1],
                action:{type:"select",col:cR, card:clue.card[2]}
            };
        }

    // есть обе боковые карты
        if(pC2===my.CP_CAN_BE
        && pL1===my.CP_IS_HERE
        && pR3===my.CP_IS_HERE){
            // selectVariant(col, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' должна быть в клетке ' + col + ', ' + clue.row2
            // + ', так как по правилу ' + clue + ' она находится между ' + clue.card[0] + ' и ' + clue.card[2]);
            return {
                found:true,
                type:"hor",
                label:"s_triple_between",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[0],
                card3:clue.card[2],
                action:{type:"select",col:col, card:clue.card[1]}
            };
        }
        if(pC2===my.CP_CAN_BE
        && pL3===my.CP_IS_HERE
        && pR1===my.CP_IS_HERE){
            // selectVariant(col, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' должна быть в клетке ' + col + ', ' + clue.row2 + ', так как по правилу ' + clue + ' она находится между ' + clue.card[0] + ' и ' + clue.card[2]);
            return {
                found:true,
                type:"hor",
                label:"s_triple_between",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[0],
                card3:clue.card[2],
                action:{type:"select",col:col, card:clue.card[1]}
            };
        }

        // card1 в центре
        if(pC1===my.CP_IS_HERE
        && pL2===my.CP_CAN_BE
        && pR2===my.CP_CANNOT_BE){
            // selectVariant(cL, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' должна быть в клетке ' + cL + ', ' + clue.row2 + ', так как по правилу ' + clue + ' она находится в столбце, соседнем с картой ' + clue.card[0] + ', а справа от ' + clue.card[0] + ' её быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_triple_nr",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[0],
                action:{type:"select",col:cL, card:clue.card[1]}
            };
        }
        if(pC1===my.CP_IS_HERE
        && pL2===my.CP_CANNOT_BE
        && pR2===my.CP_CAN_BE){
            // selectVariant(cR, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' должна быть в клетке ' + cR + ', ' + clue.row2 + ', так как по правилу ' + clue + ' она находится в столбце, соседнем с картой ' + clue.card[0] + ', а слева от ' + clue.card[0] + ' её быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_triple_nl",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[0],
                action:{type:"select",col:cR, card:clue.card[1]}
            };
        }
        if(pC1===my.CP_IS_HERE
        && pLL3===my.CP_CAN_BE
        && pRR3===my.CP_CANNOT_BE){
            // selectVariant(cLL, clue.card[2]);
            // alert('Карта ' + clue.card[2] + ' должна быть в клетке ' + cLL + ', ' + clue.row3 + ', так как по правилу ' + clue + ' она находится в столбце, соседнем с картой ' + clue.card[0] + ', а справа от ' + clue.card[0] + ' её быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_triple_nr",
                clue:clue,
                card1:clue.card[2],
                card2:clue.card[0],
                action:{type:"select",col:cLL, card:clue.card[2]}
            };
        }
        if(pC1===my.CP_IS_HERE
        && pLL3===my.CP_CANNOT_BE
        && pRR3===my.CP_CAN_BE){
            // selectVariant(cRR, clue.card[2]);
            // alert('Карта ' + clue.card[2] + ' должна быть в клетке ' + cRR + ', ' + clue.row3 + ', так как по правилу ' + clue + ' она находится в столбце, соседнем с картой ' + clue.card[0] + ', а слева от ' + clue.card[0] + ' её быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_triple_nl",
                clue:clue,
                card1:clue.card[2],
                card2:clue.card[0],
                action:{type:"select",col:cRR, card:clue.card[2]}
            };
        }

        // card3 в центре
        if(pC3===my.CP_IS_HERE
        && pL2===my.CP_CAN_BE
        && pR2===my.CP_CANNOT_BE){
            // selectVariant(cL, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' должна быть в клетке ' + cL + ', ' + clue.row2 + ', так как по правилу ' + clue + ' она находится в столбце, соседнем с картой ' + clue.card[2] + ', а справа от ' + clue.card[2] + ' её быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_triple_nr",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[2],
                action:{type:"select",col:cL, card:clue.card[1]}
            };
        }
        if(pC3===my.CP_IS_HERE
        && pL2===my.CP_CANNOT_BE
        && pR2===my.CP_CAN_BE){
            // selectVariant(cR, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' должна быть в клетке ' + cR + ', ' + clue.row2 + ', так как по правилу ' + clue + ' она находится в столбце, соседнем с картой ' + clue.card[2] + ', а слева от ' + clue.card[2] + ' её быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_triple_nl",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[2],
                action:{type:"select",col:cR, card:clue.card[1]}
            };
        }
        if(pC3===my.CP_IS_HERE
        && pLL1===my.CP_CAN_BE
        && pRR1===my.CP_CANNOT_BE){
            // selectVariant(cLL, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' должна быть в клетке ' + cLL + ', ' + clue.row1 + ', так как по правилу ' + clue
            // + ' она находится через один столбец от карты ' + clue.card[2] + ', а справа от ' + clue.card[2] + ' её быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_triple_nr1",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[2],
                action:{type:"select",col:cLL, card:clue.card[0]}
            };
        }
        if(pC3===my.CP_IS_HERE
        && pLL1===my.CP_CANNOT_BE
        && pR3===my.CP_CAN_BE){
            // selectVariant(cRR, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' должна быть в клетке ' + cRR + ', ' + clue.row1 + ', так как по правилу ' + clue
            // + ' она находится через один столбец от карты ' + clue.card[2] + ', а слева от ' + clue.card[2] + ' её быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_triple_nl1",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[2],
                action:{type:"select",col:cRR, card:clue.card[0]}
            };
        }
    }
    return {found:false};
}

/**
 * Поиск подсказок по горизонтальным ключам типа hcNotTriple
 * @param{Object} clue ключ
 * @return{Object} подсказка
 * @func module:SherlockGame#searchSHClueNotTriple
 */
var searchSHClueNotTriple=function(clue){
    for(var col=0; col < 6; col++){
        var cL=col - 1;
        var cLL=col - 2;
        var cR=col + 1;
        var cRR=col + 2;
        var pC1=my.checkPossibility(col, clue.card[0]);
        var pLL1=my.checkPossibility(cLL, clue.card[0]);
        var pRR1=my.checkPossibility(cRR, clue.card[0]);
        var pL2=my.checkPossibility(cL,  clue.card[1]);
        var pR2=my.checkPossibility(cR,  clue.card[1]);
        var pC3=my.checkPossibility(col, clue.card[2]);
        var pLL3=my.checkPossibility(cLL, clue.card[2]);
        var pRR3=my.checkPossibility(cRR, clue.card[2]);

        if(pC1===my.CP_IS_HERE
        && pLL3===my.CP_CAN_BE
        && pRR3===my.CP_CANNOT_BE){
            // selectVariant(cLL, clue.card[2]);
            // alert('Карта ' + clue.card[2] + ' должна быть в клетке ' + cLL + ', ' + clue.row3 + ', так как по правилу ' + clue + ' она находится через один столбец от карты ' + clue.card[0] + ', а справа от ' + clue.card[0] + ' её быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_triple_nr1",
                clue:clue,
                card1:clue.card[2],
                card2:clue.card[0],
                action:{type:"select",col:cLL, card:clue.card[2]}
            };
        }
        if(pC1===my.CP_IS_HERE
        && pRR3===my.CP_CAN_BE
        && pLL3===my.CP_CANNOT_BE){
            // selectVariant(cRR, clue.card[2]);
            // alert('Карта ' + clue.card[2] + ' должна быть в клетке ' + cRR + ', ' + clue.row3 + ', так как по правилу ' + clue + ' она находится через один столбец от карты ' + clue.card[0] + ', а слева от ' + clue.card[0] + ' её быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_triple_nl1",
                clue:clue,
                card1:clue.card[2],
                card2:clue.card[0],
                action:{type:"select",col:cRR, card:clue.card[2]}
            };
        }
        if(pC1===my.CP_IS_HERE
        && pR2===my.CP_IS_HERE
        && pLL3===my.CP_CAN_BE){
            // selectVariant(cLL, clue.card[2]);
            // alert('Карта ' + clue.card[2] + ' должна быть в клетке ' + cLL + ', ' + clue.row3 + ', так как по правилу ' + clue
            // + ' она находится через один столбец от карты ' + clue.card[0]
            // + ', а справа от ' + clue.card[0] + ' её быть не может, иначе между ними окажется ' + clue.card[1]);
            return {
                found:true,
                type:"hor",
                label:"s_not_triple_between_nr1",
                clue:clue,
                col:cLL,
                card1:clue.card[2],
                card2:clue.card[0],
                card3:clue.card[1],
                action:{type:"select",col:cLL, card:clue.card[2]}
            };
        }
        if(pC1===my.CP_IS_HERE
        && pL2===my.CP_IS_HERE
        && pRR3===my.CP_CAN_BE){
            // selectVariant(cRR, clue.card[2]);
            // alert('Карта ' + clue.card[2] + ' должна быть в клетке ' + cRR + ', ' + clue.row3 + ', так как по правилу ' + clue
            // + ' она находится через один столбец от карты ' + clue.card[0]
            // + ', а слева от ' + clue.card[0] + ' её быть не может, иначе между ними окажется ' + clue.card[1]);
            return {
                found:true,
                type:"hor",
                label:"s_not_triple_between_nl1",
                clue:clue,
                col:cRR,
                card1:clue.card[2],
                card2:clue.card[0],
                card3:clue.card[1],
                action:{type:"select",col:cRR, card:clue.card[2]}
            };
        }
        if(pC3===my.CP_IS_HERE
        && pLL1===my.CP_CAN_BE
        && pRR1===my.CP_CANNOT_BE){
            // selectVariant(cLL, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' должна быть в клетке ' + cLL + ', ' + clue.row1 + ', так как по правилу ' + clue
            // + ' она находится через один столбец от карты ' + clue.card[2] + ', а справа от ' + clue.card[2] + ' её быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_triple_nr1",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[2],
                action:{type:"select",col:cLL, card:clue.card[0]}
            };
        }
        if(pC3===my.CP_IS_HERE
        && pRR1===my.CP_CAN_BE
        && pLL1===my.CP_CANNOT_BE){
            // selectVariant(cRR, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' должна быть в клетке ' + cRR + ', ' + clue.row1 + ', так как по правилу ' + clue
            // + ' она находится через один столбец от карты ' + clue.card[2] + ', а слева от ' + clue.card[2] + ' её быть не может');
            return {
                found:true,
                type:"hor",
                label:"s_triple_nl1",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[2],
                action:{type:"select",col:cRR, card:clue.card[0]}
            };
        }
        if(pC3===my.CP_IS_HERE
        && pR2===my.CP_IS_HERE
        && pLL1===my.CP_CAN_BE){
            // selectVariant(cLL, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' должна быть в клетке ' + cLL + ', ' + clue.row1 + ', так как по правилу ' + clue
            // + ' она находится через один столбец от карты ' + clue.card[2] + ', а справа от ' + clue.card[2]
            // + ' её быть не может, иначе между ними окажется ' + clue.card[1]);
            return {
                found:true,
                type:"hor",
                label:"s_not_triple_between_nr1",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[1],
                card3:clue.card[2],
                action:{type:"select",col:cLL, card:clue.card[0]}
            };
        }
        if(pC3===my.CP_IS_HERE
        && pL2===my.CP_IS_HERE
        && pRR1===my.CP_CAN_BE){
            // alert('Карта ' + clue.card[0] + ' должна быть в клетке ' + cRR + ', ' + clue.row1 + ', так как по правилу ' + clue
            // + ' она находится через один столбец от карты ' + clue.card[2] + ', а слева от ' + clue.card[2]
            // + ' её быть не может, иначе между ними окажется ' + clue.card[1]);
            return {
                found:true,
                type:"hor",
                label:"s_not_triple_between_nl1",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[1],
                card3:clue.card[2],
                action:{type:"select",col:cRR, card:clue.card[0]}
            };
        }
    }
    return {found:false};
}

/**
 * Поиск возможност удаления вариантов по вертикальным ключам
 * @param{int} clue ключ
 * @return{Object} подсказка
 * @func module:SherlockGame#searchRVClue
 */
var searchRVClue=function(clue){
    for(var col=0; col < 6; col++){
        var p1=my.checkPossibility(col, clue.card[0]);
        var p2=my.checkPossibility(col, clue.card[1]);
        if(clue.type===my.VC_TOGETHER
        && p1===my.CP_CANNOT_BE
        && p2===my.CP_CAN_BE){
            // removeVariant(col, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' не может быть в ' + col + ', ' + clue.row2 + ' клетке, так как по правилу' + clue + ' она находится в одном столбце с картой ' + clue.card[0]);
            return {
                found:true,
                type:"ver",
                label:"r_together",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[0],
                action:{type:"remove", col:col, card:clue.card[1]}
            };
        }
        if(clue.type===my.VC_TOGETHER
        && p2===my.CP_CANNOT_BE
        && p1===my.CP_CAN_BE){
            // removeVariant(col, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' не может быть в ' + col + ', ' + clue.row1 + ' клетке, так как по правилу' + clue + ' она находится в одном столбце с картой ' + clue.card[1]);
            return {
                found:true,
                type:"ver",
                label:"r_together",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[1],
                action:{type:"remove", col:col, card:clue.card[0]}
            };
        }
        if(clue.type===my.VC_NOT_TOGETHER
        && p1===my.CP_IS_HERE
        && p2===my.CP_CAN_BE){
            // removeVariant(col, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' не может быть в ' + col + ', ' + clue.row2 + ' клетке, так как по правилу' + clue + ' она находится в одном столбце с картой ' + clue.card[0]);
            return {
                found:true,
                type:"ver",
                label:"r_not_together",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[0],
                action:{type:"remove", col:col, card:clue.card[1]}
            };
        }
        if(clue.type===my.VC_NOT_TOGETHER
        && p2===my.CP_IS_HERE
        && p1===my.CP_CAN_BE){
            // removeVariant(col, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' не может быть в ' + col + ', ' + clue.row1 + ' клетке, так как по правилу' + clue + ' она находится в одном столбце с картой ' + clue.card[1]);
            return {
                found:true,
                type:"ver",
                label:"r_not_together",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[1],
                action:{type:"remove", col:col, card:clue.card[0]}
            };
        }
    }//end for
    return {found:false};
}

/**
 * Поиск подсказок по горизонтальным ключам типа hcNextTo
 * @param{Object} clue ключ
 * @return{Object} подсказка
 * @func module:SherlockGame#searchRHClueNextTo
 */
var searchRHClueNextTo=function(clue){
    for( var col=0; col < 6; col++){
        var cL=col-1;
        var cR=col+1;
        var pC1=my.checkPossibility(col, clue.card[0]);
        var pL2=my.checkPossibility(cL,  clue.card[1]);
        var pR2=my.checkPossibility(cR,  clue.card[1]);
        var pC2=my.checkPossibility(col, clue.card[1]);
        var pL1=my.checkPossibility(cL,  clue.card[0]);
        var pR1=my.checkPossibility(cR,  clue.card[0]);

        if(pC1===my.CP_CAN_BE
        && pL2===my.CP_CANNOT_BE
        && pR2===my.CP_CANNOT_BE){
            // removeVariant(col, clue.card[0]);
            // alert('Карта ' + clue.card[1] + ' не может быть в клетке ' + col + ', ' + clue.row2 + ' , так как по указанному правилу в одном из соседних с ней столбцов должна быть карта ' + clue.card[0]);
            return {
                found:true,
                type:"hor",
                label:"r_next_to",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[1],
                action:{type:"remove",col:col, card:clue.card[0]}
            };
        }
        if(pC2===my.CP_CAN_BE
        && pL1===my.CP_CANNOT_BE
        && pR1===my.CP_CANNOT_BE){
            // removeVariant(col, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' не может быть в клетке  ' + col + ', ' + clue.row2 + ', так как по правилу ' + clue + ' в одном из соседних с ней столбцов должна быть карта ' + clue.card[0]);
            return {
                found:true,
                type:"hor",
                label:"r_next_to",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[0],
                action:{type:"remove",col:col, card:clue.card[1]}
            };
        }
    }
    return {found:false};
}

/**
 * Поиск подсказки по горизонтальным ключам типа hcNotNextTo
 * @param{Object} clue ключ
 * @return{Object} подсказка
 * @func module:SherlockGame#searchRHClueNotNextTo
 */
var searchRHClueNotNextTo=function(clue){
    for(var col=0; col < 6; col++){
        var cL=col - 1;
        var cR=col + 1;
        var pC1=my.checkPossibility(col, clue.card[0]);
        var pL2=my.checkPossibility(cL,  clue.card[1]);
        var pR2=my.checkPossibility(cR,  clue.card[1]);
        var pC2=my.checkPossibility(col, clue.card[1]);
        var pL1=my.checkPossibility(cL,  clue.card[0]);
        var pR1=my.checkPossibility(cR,  clue.card[0]);
        if(pC1===my.CP_IS_HERE
        && pL2===my.CP_CAN_BE){
            // removeVariant(cL, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' не может быть в  клетке ' + cL + ', ' + clue.row2 + ', так по правилу ' + clue + ' она не должна находится в столбце, соседнем с картой ' + clue.card[0]);
            return {
                found:true,
                type:"hor",
                label:"r_not_next_to",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[0],
                action:{type:"remove",col:cL, card:clue.card[1]}
            };
        }
        if(pC1===my.CP_IS_HERE
        && pR2===my.CP_CAN_BE){
            // removeVariant(cR, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' не может быть в  клетке ' + cR + ', ' + clue.row2 + ', так по правилу ' + clue + ' она не должна находится в столбце, соседнем с картой ' + clue.card[0]);
            return {
                found:true,
                type:"hor",
                label:"r_not_next_to",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[0],
                action:{type:"remove",col:cR, card:clue.card[1]}
            };
        }
        if(pC2===my.CP_IS_HERE
        && pL1===my.CP_CAN_BE){
            // removeVariant(cL, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' не может быть в  клетке ' + cL + ', ' + clue.row1 + ', так по правилу ' + clue + ' она не должна находится в столбце, соседнем с картой ' + clue.card[1]);
            return {
                found:true,
                type:"hor",
                label:"r_not_next_to",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[1],
                action:{type:"remove",col:cL, card:clue.card[0]}
            };
        }
        if(pC2===my.CP_IS_HERE
        && pR1===my.CP_CAN_BE){
            // removeVariant(cR, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' не может быть в  клетке ' + cR + ', ' + clue.row1 + ', так по правилу ' + clue + ' она не должна находится в столбце, соседнем с картой ' + clue.card[1]);
            return {
                found:true,
                type:"hor",
                label:"r_not_next_to",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[1],
                action:{type:"remove",col:cR, card:clue.card[0]}
            };
        }
    }
    return {found:false};
}

/**
 * Поиск подсказок по горизонтальным ключам типа hcTriple
 * @param{Object} clue ключ
 * @return{Object} подсказка
 * @func module:SherlockGame#searchRHClueTriple
 */
var searchRHClueTriple=function(clue){
    for(var col=0; col < 6; col+=1){
        var cL=col - 1;
        var cR=col + 1;
        var cLL=col - 2;
        var cRR=col + 2;
        var pC1=my.checkPossibility(col, clue.card[0]);
        var pL1=my.checkPossibility(cL,  clue.card[0]);
        var pR1=my.checkPossibility(cR,  clue.card[0]);
        var pLL1=my.checkPossibility(cLL, clue.card[0]);
        var pRR1=my.checkPossibility(cRR, clue.card[0]);
        var pC2=my.checkPossibility(col, clue.card[1]);
        var pL2=my.checkPossibility(cL,  clue.card[1]);
        var pR2=my.checkPossibility(cR,  clue.card[1]);
        var pC3=my.checkPossibility(col, clue.card[2]);
        var pL3=my.checkPossibility(cL,  clue.card[2]);
        var pR3=my.checkPossibility(cR,  clue.card[2]);
        var pLL3=my.checkPossibility(cLL, clue.card[2]);
        var pRR3=my.checkPossibility(cRR, clue.card[2]);

        // может ли card2 быть в центре
        if(pC2===my.CP_CAN_BE
        && pL1===my.CP_CANNOT_BE
        && pL3===my.CP_CANNOT_BE){
            // removeVariant(col, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' не может быть в клетке  ' + col + ', ' + clue.row2 + ', так как по правилу ' + clue + ' она находится между ' + clue.card[0] + ' и ' + clue.card[2] + ', а слева не может быть ни ' + clue.card[0] + ', ни ' + clue.card[2]);
            return {
                found:true,
                type:"hor",
                label:"r_triple_between_nl",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[0],
                card3:clue.card[2],
                action:{type:"remove",col:col, card:clue.card[1]}
            };
        }
        if(pC2===my.CP_CAN_BE
        && pR1===my.CP_CANNOT_BE
        && pR3===my.CP_CANNOT_BE){
            // removeVariant(col, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' не может быть в клетке  ' + col + ', ' + clue.row2 + ', так как по правилу ' + clue + ' она находится между ' + clue.card[0] + ' и ' + clue.card[2] + ', а справа не может быть ни ' + clue.card[0] + ', ни ' + clue.card[2]);
            return {
                found:true,
                type:"hor",
                label:"r_triple_between_nr",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[0],
                card3:clue.card[2],
                action:{type:"remove",col:col, card:clue.card[1]}
            };
        }
        if(pC2===my.CP_CAN_BE
        && pL1===my.CP_CANNOT_BE
        && pR1===my.CP_CANNOT_BE){
            // removeVariant(col, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' не может быть в клетке ' + col + ', ' + clue.row2 + ', так как по правилу '
            // + clue + ' она находится между ' + clue.card[0] + ' и ' + clue.card[2] + ', а карты ' + clue.card[0] + ' нет ни справа, ни слева');
            return {
                found:true,
                type:"hor",
                label:"r_triple_between_nlr",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[2],
                card3:clue.card[0],
                action:{type:"remove",col:col, card:clue.card[1]}
            };
        }
        if(pC2===my.CP_CAN_BE
        && pL3===my.CP_CANNOT_BE
        && pR3===my.CP_CANNOT_BE){
            // removeVariant(col, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' не может быть в клетке ' + col + ', ' + clue.row2 + ', так как по правилу ' + clue
            // + ' она находится между ' + clue.card[0] + ' и ' + clue.card[2] + ', а карты ' + clue.card[2] + ' нет ни справа, ни слева');
            return {
                found:true,
                type:"hor",
                label:"r_triple_between_nlr",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[0],
                card3:clue.card[2],
                action:{type:"remove",col:col, card:clue.card[1]}
            };
        }

        // может ли card1 быть в центре
        if(pC1===my.CP_CAN_BE
        && pL2===my.CP_CANNOT_BE
        && pR2===my.CP_CANNOT_BE){
            // removeVariant(col, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' не может быть в клетке ' + col + ', ' + clue.row1 + ', так как по правилу ' + clue
            // + ' в одном из соседних с ней столбцов должна быть карта ' + clue.card[1]);
            return {
                found:true,
                type:"hor",
                label:"r_triple_near",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[1],
                action:{type:"remove",col:col, card:clue.card[0]}
            };
        }
        if(pC1===my.CP_CAN_BE
        && pLL3===my.CP_CANNOT_BE
        && pRR3===my.CP_CANNOT_BE){
            // removeVariant(col, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' не может быть в клетке ' + col + ', ' + clue.row1 + ', так как по правилу ' + clue +
            // ' через один столбец от неё должна быть карта ' + clue.card[2]);
            return {
                found:true,
                type:"hor",
                label:"r_triple_near1",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[2],
                action:{type:"remove",col:col, card:clue.card[0]}
            };
        }

        // может ли card3 быть в центре
        if(pC3===my.CP_CAN_BE
        && pL2===my.CP_CANNOT_BE
        && pR2===my.CP_CANNOT_BE){
            // removeVariant(col, clue.card[2]);
            // alert('Карта ' + clue.card[2] + ' не может быть в клетке ' + col + ', ' + clue.row3 + ', так как по правилу ' + clue
            // + ' в одном из соседних с ней столбцов должна быть карта ' + clue.card[1]);
            return {
                found:true,
                type:"hor",
                label:"r_triple_near",
                clue:clue,
                card1:clue.card[2],
                card2:clue.card[1],
                action:{type:"remove",col:col, card:clue.card[2]}
            };
        }
        if(pC3===my.CP_CAN_BE
        && pLL1===my.CP_CANNOT_BE
        && pRR1===my.CP_CANNOT_BE){
            // removeVariant(col, clue.card[2]);
            // alert('Карта ' + clue.card[2] + ' не может быть в клетке ' + col + ', ' + clue.row3 + ', так как по правилу ' + clue
            // + ' через один столбец от неё должна быть карта ' + clue.card[0]);
            return {
                found:true,
                type:"hor",
                label:"r_triple_near1",
                clue:clue,
                card1:clue.card[2],
                card2:clue.card[0],
                action:{type:"remove",col:col, card:clue.card[2]}
            };
        }
    }
    return {found:false};
}

/**
 * Поиск подсказок по горизонтальным ключам типа hcNotTriple
 * @param{Object} clue ключ
 * @return{Object} подсказка
 * @func module:SherlockGame#searchRHClueNotTriple
 */
var searchRHClueNotTriple=function(clue){
    for(var col=0; col < 6; col++){
        var cL=col - 1;
        var cLL=col - 2;
        var cR=col + 1;
        var cRR=col + 2;
        var pC1=my.checkPossibility(col, clue.card[0]);
        var pL1=my.checkPossibility(cL, clue.card[0]);
        var pR1=my.checkPossibility(cR, clue.card[0]);
        var pLL1=my.checkPossibility(cLL, clue.card[0]);
        var pRR1=my.checkPossibility(cRR, clue.card[0]);
        var pC2=my.checkPossibility(col, clue.card[1]);
        var pL2=my.checkPossibility(cL,  clue.card[1]);
        var pR2=my.checkPossibility(cR,  clue.card[1]);
        var pC3=my.checkPossibility(col, clue.card[2]);
        var pL3=my.checkPossibility(cL, clue.card[2]);
        var pR3=my.checkPossibility(cR, clue.card[2]);
        var pLL3=my.checkPossibility(cLL, clue.card[2]);
        var pRR3=my.checkPossibility(cRR, clue.card[2]);

        if(pC1===my.CP_CAN_BE
        && pLL3===my.CP_CANNOT_BE
        && pRR3===my.CP_CANNOT_BE){
            // removeVariant(col, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' не может быть в клетке ' + col + ', ' + clue.row1 + ', так как по правилу ' + clue
            // + ' через один столбец от неё должна быть карта ' + clue.card[2]);
            return {
                found:true,
                type:"hor",
                label:"r_triple_near1",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[2],
                action:{type:"remove",col:col, card:clue.card[0]}
            };
        }
        if(pC1===my.CP_CAN_BE
        && pLL3===my.CP_CANNOT_BE
        && pR2===my.CP_IS_HERE){
            // removeVariant(col, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' не может быть в клетке ' + col + ', ' + clue.row1
            // + ', так как через столбец слева нет ' + clue.card[2] + ', а в соседнем столбце справа стоит ' + clue.card[1]
            // + ', и правило' + clue + ' не может быть выполнено');
            return {
                found:true,
                type:"hor",
                label:"r_not_triple_nl1",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[1],
                card3:clue.card[2],
                action:{type:"remove",col:col, card:clue.card[0]}
            };
        }
        if(pC1===my.CP_CAN_BE
        && pRR3===my.CP_CANNOT_BE
        && pL2===my.CP_IS_HERE){
            // removeVariant(col, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' не может быть в клетке ' + col + ', ' + clue.row1
            // + ', так как через столбец справа нет ' + clue.card[2] + ', а в соседнем столбце слева стоит ' + clue.card[1]
            // + ', и правило' + clue + ' не может быть выполнено');
            return {
                found:true,
                type:"hor",
                label:"r_not_triple_nr1",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[1],
                card3:clue.card[2],
                action:{type:"remove",col:col, card:clue.card[0]}
            };
        }
        if(pC3===my.CP_CAN_BE
        && pLL1===my.CP_CANNOT_BE
        && pRR1===my.CP_CANNOT_BE){
            // removeVariant(col, clue.card[2]);
            // alert('Карта ' + clue.card[2] + ' не может быть в клетке ' + col + ', ' + clue.row3 + ', так как по правилу ' + clue
            // + ' через один столбец от неё должна быть карта ' + clue.card[0]);
            return {
                found:true,
                type:"hor",
                label:"r_triple_near1",
                clue:clue,
                card1:clue.card[2],
                card2:clue.card[0],
                action:{type:"remove",col:col, card:clue.card[2]}
            };
        }
        if(pC3===my.CP_CAN_BE
        && pLL1===my.CP_CANNOT_BE
        && pR2===my.CP_IS_HERE){
            // removeVariant(col, clue.card[2]);
            // alert('Карта ' + clue.card[2] + ' не может быть в клетке ' + col + ', ' + clue.row3
            // + ', так как через столбец слева нет ' + clue.card[0] + ', а в соседнем столбце справа стоит ' + clue.card[1]
            // + ', и правило ' + clue + ' не может быть выполнено');
            return {
                found:true,
                type:"hor",
                label:"r_not_triple_nl1",
                clue:clue,
                card1:clue.card[2],
                card2:clue.card[1],
                card3:clue.card[0],
                action:{type:"remove",col:col, card:clue.card[2]}
            };
        }
        if(pC3===my.CP_CAN_BE
        && pRR1===my.CP_CANNOT_BE
        && pL2===my.CP_IS_HERE){
            // removeVariant(col, clue.card[2]);
            // alert('Карта ' + clue.card[2] + ' не может быть в клетке ' + col + ', ' + clue.row3
            // + ', так как через столбец справа нет ' + clue.card[0] + ', а в соседнем столбце слева стоит ' + clue.card[1]
            // + ', и указанное правило не может быть выполнено');
            return {
                found:true,
                type:"hor",
                label:"r_not_triple_nr1",
                clue:clue,
                card1:clue.card[2],
                card2:clue.card[1],
                card3:clue.card[0],
                action:{type:"remove",col:col, card:clue.card[2]}
            };
        }

        if(pC2===my.CP_CAN_BE
        && pL1===my.CP_IS_HERE
        && pR3===my.CP_IS_HERE){
            // removeVariant(col, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' не может быть в клетке ' + col + ', ' + clue.row2 + ', так как по правилу ' + clue
            // + ' не может находиться между ' + clue.card[0] + ' и ' + clue.card[2]);
            return {
                found:true,
                type:"hor",
                label:"r_not_triple_between",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[0],
                card3:clue.card[2],
                action:{type:"remove",col:col, card:clue.card[1]}
            };
        }
        if(pC2===my.CP_CAN_BE
        && pL3===my.CP_IS_HERE
        && pR1===my.CP_IS_HERE){
            // removeVariant(col, clue.card[1]);
            // alert('Карта ' + clue.card[1] + ' не может быть в клетке ' + col + ', ' + clue.row2 + ', так как по правилу ' + clue
            // + ' не может находиться между ' + clue.card[0] + ' и ' + clue.card[2]);
            return {
                found:true,
                type:"hor",
                label:"r_not_triple_between",
                clue:clue,
                card1:clue.card[1],
                card2:clue.card[0],
                card3:clue.card[2],
                action:{type:"remove",col:col, card:clue.card[1]}
            };
        }
    }
    return {found:false};
}

/**
 * Поиск подсказки по горизонтальным ключам типа hcOrder
 * @param{Object} clue ключ
 * @return{Object} подсказка
 * @func module:SherlockGame#searchRHClueOrder
 */
var searchRHClueOrder=function(clue){
    for(var LeftmostLeft=0; LeftmostLeft<6; LeftmostLeft++){
        if(my.checkPossibility(LeftmostLeft, clue.card[0])!==my.CP_CANNOT_BE){
            break;
        }
    }
    for(var col=0; col <=LeftmostLeft; col++){
        if(my.checkPossibility(col, clue.card[2])===my.CP_CAN_BE){
            // removeVariant(col, clue.card[2]);
            // alert('Карта ' + clue.card[2] + ' не может быть в клетке ' + col + ', ' + clue.row3 + ', так как по правилу ' + clue
            // + ' она должна находиться правее карты ' + clue.card[0]);
            return {
                found:true,
                type:"hor",
                label:"r_order_r",
                clue:clue,
                card1:clue.card[2],
                card2:clue.card[0],
                action:{type:"remove",col:col, card:clue.card[2]}
            };
        }
    }
    for(var RightmostRight=5; RightmostRight>=0; RightmostRight--){
        if(my.checkPossibility(RightmostRight, clue.card[2])!==my.CP_CANNOT_BE){
            break;
        }
    }
    for(col=RightmostRight; col < 6; col++){
        if(my.checkPossibility(col, clue.card[0])===my.CP_CAN_BE){
            // removeVariant(col, clue.card[0]);
            // alert('Карта ' + clue.card[0] + ' не может быть в клетке ' + col + ', ' + clue.row1 + ', так как по правилу ' + clue
            // + ' она должна находиться левее карты ' + clue.card[2]);
            return {
                found:true,
                type:"hor",
                label:"r_order_l",
                clue:clue,
                card1:clue.card[0],
                card2:clue.card[2],
                action:{type:"remove",col:col, card:clue.card[0]}
            };
        }
    }
    return {found:false};
}

/**
 * проверка горизонтальных ключей. Вызывает нужную функцию в зависимости от типа ключа
 * @param{Object} clue ключ
 * @return{Object} подсказка
 * @func module:SherlockGame#searchSHClue
 */
var searchSHClue=function(clue){
    switch(clue.type){
        case my.HC_NEXT_TO:
            return searchSHClueNextTo(clue);
        case my.HC_NOT_NEXT_TO:
            return {found:false};
        case my.HC_TRIPLE:
                return searchSHClueTriple(clue);
        case my.HC_NOT_TRIPLE:
            return searchSHClueNotTriple(clue);
        case my.HC_ORDER:
            return {found:false};
        default:
            alert("searchSHClue: Unknown clue type "+clue.type);   
    }
    return {found:false};
}

/**
 * проверка горизонтальных ключей. Вызывает нужную функцию в зависимости от типа ключа
 * @param{Object} clue ключ
 * @return{Object} подсказка
 * @func module:SherlockGame#searchRHClue
 */
var searchRHClue=function(clue){
    switch(clue.type){
        case my.HC_NEXT_TO:
            return searchRHClueNextTo(clue);
        case my.HC_NOT_NEXT_TO:
            return searchRHClueNotNextTo(clue);
        case my.HC_TRIPLE:
            return searchRHClueTriple(clue);
        case my.HC_NOT_TRIPLE:
            return searchRHClueNotTriple(clue);
        case my.HC_ORDER:
            return searchRHClueOrder(clue);
        default:
            alert("searchRHClue: Unknown clue type "+clue.type);   
    }
    return {found:false};
}

/**
 * Главная функция поиска очередного хода. Вызывает все остальные функции.
 * Поиск сначала производится по вертикальным ключам, затем по горизонтальным.
 * Сначала ищутся способы выбрать карту, затем исключить вариант.
 * @return{Object} подсказка
 * @func module:SherlockGame#findNextStep
 */
my.findNextStep=function(){
    var index;
    var result=searchUniqValue();
    index=0;
    while(!result.found && index < my.vClues.length){
        result=searchSVClue(my.vClues[index]);
        index++;
    }
    index=0;
    while(!result.found && index < my.hClues.length){
        result=searchSHClue(my.hClues[index]);
        index++;
    }
    index=0;
    while(!result.found && index < my.vClues.length){
        result=searchRVClue(my.vClues[index]);
        index++;
    }
    index=0;
    while(!result.found && index < my.hClues.length){
        result=searchRHClue(my.hClues[index]);
        index++;
    }
    return result;
}

/**
 * Функция поиска подсказок. Проверяет поле на противоречие ключам.
 * В случае, если ошибок не найдено, вызывает поиск хода по ключам,
 * @return{Object} подсказка
 * @func module:SherlockGame#findHint
 */
my.findHint=function(){
    var hint=checkCommonError();
    if(hint.found && hint.action.steps===1){
        var savedhint=hint;
        hint=checkVariantError();
        var i=0;
        while(!hint.found && i<my.hClues.length){
            hint=checkHClueError(my.hClues[i]);
            i+=1;
        }
        i=0;
        while(!hint.found && i<my.vClues.length){
            hint=checkVClueError(my.vClues[i]);
            i+=1;
        }
        if(!hint.found) hint=savedhint;
    }
    if(!hint.found) hint=my.findNextStep();
    return hint;
}

return my;

}(SherlockGame||{}));