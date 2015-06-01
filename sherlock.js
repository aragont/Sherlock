/* jshint browser: true */
/* global console */

var FLevelMap = [];
var FField = [];
var FMainHClues = [];
var FMainVClues = [];
//var FAlternateHClues = [];
//var FAlternateVClues = [];
//var FCompleted;
var steps_history = [];
//var Level = 0; //??????????????????????/
//var count_step = 0;
//var error_step = 0;
var error_flag = true;
var correct = false;
//var count_big_card = 0;

// function DrawLevel() {
//     //for (var i=0; i<6; i++)
//     //for (var j=0; j<6; j++)
//     //console.log (i, FField[0][i].CorrectValue,FField[1][i].CorrectValue,FField[2][i].CorrectValue,FField[3][i].CorrectValue,FField[4][i].CorrectValue,FField[5][i].CorrectValue);
//}

function choose_big(col, row, card) {
    if (FField[col][row].Variants.indexOf(card) !== -1) {
        FField[col][row].UserValue = card + 6 * row;
        FField[col][row].Initial = true;
        if (CheckCorrectness()) alert("You are WIN!");
        return true;
    }
    return false;
}

function add_step(data) {
    console.log(data);
    var was = [];
    var val = [];
    var obj = {
        'col': data.col,
        'row': data.row,
        'was': [],
        'var': [],
        'right': error_flag, //???????????????????
        'card': {
            'type': data.type,
            'action': data.act,
            'number': data.card,
        }
    };
    if (data.type == 'big') {
        obj.val = FField[data.col][data.row].Variants;
        for (var i = 0; i < 6; i++) {
            console.log(FField[i][data.row].Variants, data.row, data.col);
            if (FField[i][data.row].Variants.indexOf(data.card) >= 0) {
                obj.was.push(i);
                FField[i][data.row].Variants.splice(FField[i][data.row].Variants.indexOf(data.card), 1);
    //            console.log(i);
            }
        }
        console.log(CheckPossibility(data.col,data.card + data.row * 6 ),data.col,data.card + data.row * 6 )
        if (CheckPossibility(data.col,data.card + data.row * 6 ) !== 'cpCannotBe') {
        //if (data.card + data.row * 6 !== FField[data.col][data.row].CorrectValue) {
            error_flag = false;
        }
    } else {
        if (CheckPossibility(data.col,data.card + data.row * 6 ) !== 'cpCannotBe') {
       //r if (data.card + data.row * 6 === FField[data.col][data.row].CorrectValue) {
            error_flag = false;
        }
    }
    steps_history.push(obj);
   // count_step++;
}

function remove_many() {
    var c = 0;
    for (var i = steps_history.length - 1; i >= 0; i--)
        if (!steps_history[i].right) c++;
    for (i = 0; i < c; i++)
        remove_step();
    alert("Все верно");
}

function remove_step() {
    var h = steps_history.pop();
    if (h.card.type === 'small') {
        td_right_click((h.row * 100 + h.col * 10 + h.card.number).toString());
        steps_history.pop();
    } else {
        FField[h.col][h.row].Initial = false;
        for (var i = 0; i < h.was.length; i++)
            add_variants(h.was[i], h.row, h.card.number);
    }
    draw_field();
    error_flag = true;
}

function InitLevel(level) {
    var Col, Row, Card, I, Cnt, P, Variants = [],
        CType;
    var Found = [];
    var tempField = [];
    //FCompleted = false;
    P = FLevelMap[level];
    for (Col = 0; Col < 6; Col++)
        for (Row = 0; Row < 6; Row++) {
            FField[Col][Row].Initial = false,
                FField[Col][Row].CorrectValue = 36,
                FField[Col][Row].UserValue = 36,
                FField[Col][Row].Variants=[]; //jshint ignore:line
        }
    var count = P;
    for (var i = 0; i < FBLevels[count]; i++) { 
        P++;
        Col = FBLevels[P] % 6;
        Card = div(FBLevels[P], 6);
        Row = div(Card, 6);
        FField[Col][Row].Initial = true;
        FField[Col][Row].CorrectValue = Card;
        FField[Col][Row].UserValue = Card;
       // tempField[Col][Row].Initial=true;
       // tempField[Col][Row].Value = Card;
    }
  
   
    P++;
    for (Row = 0; Row < 6; Row++) {
        Variants = [0, 1, 2, 3, 4, 5];
        for (Col = 0; Col < 6; Col++)
            if (FField[Col][Row].Initial) {
                Variants.splice(Variants.indexOf(FField[Col][Row].CorrectValue % 6), 1);
            }
        for (Col = 0; Col < 6; Col++)
            if (!FField[Col][Row].Initial)
                for (var ii in Variants){//console.log(FField[Col][Row])
                    FField[Col][Row].Variants[ii] = Variants[ii];   
            }}
    count = P;
    Cnt = FBLevels[count];
    P++;
    for (I = 0; I < 24; I++) {
        if (I < Cnt) {
            CType = div(FBLevels[P], 36);
            FMainHClues[I].Card1 = FBLevels[P] % 36;
            switch (CType) {
                case 0:
                case 2:
                    if (CType === 0) {
                        FMainHClues[I].ClueType = 'hcNextTo';
                    } else
                        FMainHClues[I].ClueType = 'hcNotNextTo';
                    P++;
                    FMainHClues[I].Card2 = FBLevels[P];
                    FMainHClues[I].Card3 = FMainHClues[I].Card1;
                    break;
                case 1:
                case 3:
                    if (CType == 1)
                        FMainHClues[I].ClueType = 'hcTriple';
                    else
                        FMainHClues[I].ClueType = 'hcNotTriple'; //console.log('not');
                    P++;
                    FMainHClues[I].Card2 = FBLevels[P];
                    P++;
                    FMainHClues[I].Card3 = FBLevels[P];
                    break;
                case 4:
                    FMainHClues[I].ClueType = 'hcOrder';
                    FMainHClues[I].Card2 = 37;
                    P++;
                    FMainHClues[I].Card3 = FBLevels[P];
                    break;
            }
            P++;
        } else
            FMainHClues[I] = {
                'ClueType': 'hcNone',
                'Card1': 36,
                'Card2': 36,
                'Card3': 36
            };
        // FAlternateHClues[I] = {
        //     'ClueType': 'hcNone',
        //     'Card1': 36,
        //     'Card2': 36,
        //     'Card3': 36
        // };
    }
    Cnt = FBLevels[P];
    P++;
    for (I = 0; I < 21; I++) { 
        if (I < Cnt) {
            FMainVClues[I] = {};
            if ((FBLevels[P] && 128) >= 0) { 
                FMainVClues[I].ClueType = 'vcTogether';
            } else {
                FMainVClues[I].ClueType = 'vcNotTogether';
            }
            FMainVClues[I].Card1 = FBLevels[P];
            P++;
            FMainVClues[I].Card2 = FBLevels[P];
            P++;
        } else
            FMainVClues[I] = {
                'ClueType': 'vcNone',
                'Card1': 36,
                'Card2': 36
            };
        // FAlternateVClues[I] = {
        //     'ClueType': 'vcNone',
        //     'Card1': 36,
        //     'Card2': 36
        // };
    }
     FField[1][3].Initial=true;
     FField[1][3].CorrectValue=19;
     FField[1][3].UserValue=19;
      solve_game();  
    FPMainHClues = FMainHClues;
   // FPAlternateHClues = FAlternateHClues;
    FPMainVClues = FMainVClues;
    //FPAlternateVClues = FAlternateVClues;
    return true
}
function CheckSolve(Col, Card){
    var Row, Result = '';
    if ((Col < 0) || (Col > 5) || Card === 36) Result = 'cpCannotBe';
    else {
        Row = div(Card, 6);
        //console.log(Row);
        if (FField[Col][Row].CorrectValue === 36)
            if (FField[Col][Row].Variants.indexOf(Card % 6) >= 0)
                Result = 'cpCanBe';
            else
                Result = 'cpCannotBe';
        else
        if (  Card === FField[Col][Row].CorrectValue) {
            Result = 'cpIsHere';
            //console.log(FField[Col][Row].UserValue);
        }
        else
            Result = 'cpCannotBe';
    }
    return Result;
}

function CheckPossibility(Col, Card) {
    var Row, Result = '';
    if ((Col < 0) || (Col > 5) || Card === 36) Result = 'cpCannotBe';
    else {
        Row = div(Card, 6);
        //console.log(Row);
        if (FField[Col][Row].UserValue === 36)
            if (FField[Col][Row].Variants.indexOf(Card % 6) >= 0)
                Result = 'cpCanBe';
            else
                Result = 'cpCannotBe';
        else
        if (Card === FField[Col][Row].UserValue) {
            Result = 'cpIsHere';
            //console.log(FField[Col][Row].UserValue);
        }
        else
            Result = 'cpCannotBe';
    }
    return Result;
}

function CheckCorrectness() {
    var Result = true;
    for (var Col = 0; Col < 6; Col++)
        for (var Row = 0; Row < 6; Row++)
            if (CheckPossibility(Col, FField[Col][Row].UserValue) === 'cpCannotBe') {
                Result = false;
                break;
            }
    return Result;
}

function delete_variants(col, row, variant) {
    if (FField[col][row].Variants.indexOf(variant) >= 0) FField[col][row].Variants.splice(FField[col][row].Variants.indexOf(variant), 1);
    return FField[col][row].Variants.length;
}

function add_variants(col, row, variant) {
    FField[col][row].Variants[FField[col][row].Variants.length] = variant;
    console.log(FField[col][row].Variants);
}

function CreateFField() {
    for (var i = 0; i < 6; i++) {
        FField[i] = {};
        for (var j = 0; j < 6; j++) {
            FField[i][j] = {
                'Initial': false,
                'CorrectValue': 0,
                'UserValue': 0
            };
        }
    }
}

function solve_game(){
    console.log('solve');
 var i=0;
 while (!correct || i<100) {
    next_hint();
    i++;
 }
 console.log(i);
 for (var i=0; i<6;i++)
    for (var j=0; j<6; j++)
        if (FField[i][j].UserValue!==36) console.log(i,j);
};


function div(val, by) {
    return (val - val % by) / by;
}

function FirstInitField() {
    var x = 0,
        y = 0,
        i = 0;
    for (y = 0; y < 6; y++)
        for (x = 0; x < 6; x++) {
            FField[x][y].Initial = true;
            FField[x][y].CorrectValue = x + 6 * y;
            FField[x][y].UserValue = x + 6 * y;
        }
    for (i = 0; i < 24; i++) {
        FMainHClues[i] = {
            'ClueType': 'hcNone',
            'Card1': 36,
            'Card2': 36,
            'Card3': 36
        };
    }
    for (i = 0; i < 21; i++)
        FMainHClues[i] = {
            'ClueType': 'vcNone',
            'Card1': 36,
            'Card2': 36
        };
    }

function CreateLevelMap() {
    var i = 0,
        current = 0,
        cnt = 0,
        ctype = 0;
    for (i = 0; i < 65535; i++) {
        FLevelMap[i] = current;
        current = current + 1 + FBLevels[current];
        cnt = FBLevels[current];
        current++;
        for (var j = 0; j < cnt; j++) {
            ctype = div(FBLevels[current], 36);
            switch (ctype) {
                case 0:
                case 2:
                case 4:
                    current += 2;
                    break;
                case 1:
                case 3:
                    current += 3;
                    break;
            }
        }
        current += 1 + 2 * FBLevels[current];
    }
}

// function decto6(number) {
//     var q = number;
//     var arr = [];
//     var rev = [];
//     str = '';
//     while (q > 0) {
//         t = q % 6;
//         str = t + '' + str;
//         q = div(q, 6);
//         arr.push(t);
//     }
//     if (arr.length !== 5) arr.push(0);
//     for (var i = 0; i < arr.length; i++)
//         rev[i] = arr[arr.length - 1 - i];
//     return rev;
// }

CreateLevelMap();
CreateFField();
FirstInitField();
