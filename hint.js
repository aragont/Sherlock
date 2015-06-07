/* jshint browser: true */
/* global console */
var solved = false;
function GetRow(card) {
    //console.log(card);
    if (card!==36) {
        for (var i = 0; i < 6; i++) {
            //console.log(i,div(card, 6),FField[i][div(card, 6)].Initial, FField[i][div(card,6)].Initial)
            if (FField[i][div(card, 6)].Initial && FField[i][div(card, 6)].UserValue === card) return i;
        }
    }
    return -1;
}

function CheckHClueError(Index) {
    //console.log(Index,'index');
    var Left, Center, Right;
    var SCard1 = FMainHClues[Index].Card1 % 6;
    var SCard2 = FMainHClues[Index].Card2 % 6;
    var SCard3 = FMainHClues[Index].Card3 % 6;
    var Clue = {
        'ClueType': FMainHClues[Index].ClueType,
        'Card1': FMainHClues[Index].Card1,
        'Card2': FMainHClues[Index].Card2,
        'Card3': FMainHClues[Index].Card3
    };
    var Result = '';
    switch (Clue.ClueType) {
        case 'hcNextTo':
            {
                Left = GetRow(Clue.Card1);
                Center = GetRow(Clue.Card2);
                if (Math.abs(Left - Center) !== 1 && Left >= 0 && Center >= 0) {
                    if (solved) alert('Комбинация противоречит ключу: ' + Index + ' карты ' + SCard1 + ' и ' + SCard2 + ' должны находиться в соседних столбцах');
                    return 'Комбинация противоречит ключу: ' + Index + ' карты ' + SCard1 + ' и ' + SCard2 + ' должны находиться в соседних столбцах';
                }
                break;

            }
        case 'hcNotNextTo':
            {
                Left = GetRow(Clue.Card1);
                Center = GetRow(Clue.Card2);
                if (Math.abs(Left - Center) === 1 && Left >= 0 && Center >= 0) {
                    if (solved) alert('Комбинация противоречит ключу:' + Index + ' карты ' + SCard1 + ' и ' + SCard2 + ' не должны находиться в соседних столбцах');
                    return 'Комбинация противоречит ключу:' + Index + ' карты ' + SCard1 + ' и ' + SCard2 + ' не должны находиться в соседних столбцах';
                }
                break;

            }
        case 'hcTriple':
            {
                Left = GetRow(Clue.Card1);
                Center = GetRow(Clue.Card2);
                Right = GetRow(Clue.Card3);
                if ((Math.abs(Center - Left) !== 1 || Math.abs(Center - Right) !== 1) && Center !== -1 && Left !== -1 && Right !== -1) {
                    if (solved)  alert('Комбинация противоречит ключу ' + Index + ': карты ' + SCard1 + ' и ' + SCard3 + ' должны находиться рядом с картой ' + SCard2 + ' по разные стороны от неё');
                    return 'Комбинация противоречит ключу ' + Index + ': карты ' + SCard1 + ' и ' + SCard3 + ' должны находиться рядом с картой ' + SCard2 + ' по разные стороны от неё';
                }
                break;
            }
        case 'hcNotTriple':
            {
                Left = GetRow(Clue.Card1);
                Center = GetRow(Clue.Card2);
                Right = GetRow(Clue.Card3);
                if ((Math.abs(Center - Left) === 1 || Math.abs(Center - Right) === 1) && Center !== -1 && Left !== -1 && Right !== -1) {
                    if (solved)alert('Комбинация противоречит  ключу' + Index + ': между картами ' + SCard1 + ' и ' + SCard3 + ' должен быть один столбец, в котором нет карты ' + SCard2);
                    return 'Комбинация противоречит  ключу' + Index + ': между картами ' + SCard1 + ' и ' + SCard3 + ' должен быть один столбец, в котором нет карты ' + SCard2;
                }
                break;
            }
        case 'hcOrder':
            {
                Left = GetRow(Clue.Card1);
                Right = GetRow(Clue.Card3);
                if (Left > Right && Right !== -1) {
                    if (solved) alert('Комбинация противоречит  ключу ' + Index + ': карта ' + SCard1 + ' должна быть левее, чем карта ' + SCard3);
                    return 'Комбинация противоречит  ключу ' + Index + ': карта ' + SCard1 + ' должна быть левее, чем карта ' + SCard3;
                }
            }
    }
}

function CheckVClueError(Index) {
    var Top, Bottom;
    var SCard1 = FMainVClues[Index].Card1 % 6;
    var SCard2 = FMainVClues[Index].Card2 % 6;
    var Clue = {
        'ClueType': FMainVClues[Index].ClueType,
        'Card1': FMainVClues[Index].Card1,
        'Card2': FMainVClues[Index].Card2
    };
    if (Clue.ClueType.indexOf('Together') !== -1) {
        Top = GetRow(Clue.Card1);
        Bottom = GetRow(Clue.Card2);
        //console.log(Top, Bottom);
        if (Clue.ClueType === 'vcTogether' && Top !== Bottom && Top !== -1 && Bottom !== -1) {
            if (solved)alert('Комбинация противоречит  ключу ' + Index + ': карты #' + SCard1 + ' и #' + SCard2 + ' должны находиться в одном столбце');
            return 'Комбинация противоречит  ключу ' + Index + ': карты #' + SCard1 + ' и #' + SCard2 + ' должны находиться в одном столбце';
        }
        if (Clue.ClueType === 'vcNotTogether' && Top === Bottom && Top !== -1 && Bottom !== -1) {
            if (solved) alert('Комбинация противоречит  ключу ' + Index + ': карты #' + SCard1 + ' и #' + SCard2 + ' не могут  находиться в одном столбце');
            return 'Комбинация противоречит  ключу ' + Index + ': карты #' + SCard1 + ' и #' + SCard2 + ' не могут  находиться в одном столбце';
        }
    }
    return;
}

function CheckCorrect() {
    if (!error_flag) {
        if (solved) alert('Решение ошибочно, но противоречие выявляется только в результате многоходовой комбинации');
        return 'Решение ошибочно, но противоречие выявляется только в результате многоходовой комбинации';
    }
}


function CheckPresence() {
    for (var i = 0; i < 6; i++)
        for (var j = 0; j < 6; j++)
            if (!FField[i][j].Initial && FField[i][j].Variants.length === 0) {
                if (solved) alert('Поле ' + j + ', ' + i + 'не содержит вариантов');
                return 'Поле ' + j + ', ' + i + 'не содержит вариантов';
            }
    return;
}

function CheckSimpleValues() {
   // console.log('CheckSimpleValues');
    var Col, Col2, Row, I, Count, Card;
    var VCount = [];
    Card = -1;
    for (Row = 0; Row < 6; Row++) {
        for (I = 0; I < 6; I++) 
            VCount[I] = 0;
        for (Col = 0; Col < 6; Col++) {
            if (!FField[Col][Row].Initial) {
                for (Col2 = 0; Col2 < 6; Col2++)
                    if ((Col2 !== Col) && (FField[Col2][Row].initial) && (FField[Col][Row].Variants.indexOf(FField[Col2][Row].UserValue % 6)) !== -1) {
                         //FField[Col2][Row].Variants.splice(FField[Col2][Row].Variants.indexOf(FField[Col2][Row].UserValue), 1);
                         var c= FField[Col2][Row].UserValue %6;
                        if (solved) alert('Карта #' + c + ' не может находиться в этой клетке' + Col + ', ' + Row + ', так как она уже размещена в другом столбце');
                        FField[Col2][Row].Variants.splice(FField[Col2][Row].Variants.indexOf(FField[Col2][Row].UserValue), 1);
                        return 'Карта #' + c + ' не может находиться в этой клетке' + Col + ', ' + Row + ', так как она уже размещена в другом столбце';
                    }
            }
            Count = 0;
            for (I = 0; I < 6; I++)
                if (FField[Col][Row].Variants.indexOf(I) !== -1) {
                    //console.log(FField[Col][Row].Variants.indexOf(I), I, Col, Row);
                    Count++;
                    Card = Row * 6 + I;
                    VCount[I]++;
                    }
            //console.log(Row, Count,VCount, I);
                
                
            if (Count === 1) {
                if (solved) alert('В клетке' + Col + ', ' + Row + ' остался только один возможный вариант: карта #' + Card);
                FField[Col][Row].UserValue = Card;
                return 'В клетке' + Col + ', ' + Row + ' остался только один возможный вариант: карта #' + Card;
            }
        }
        for (I = 0; I < 36; I++)
            if (VCount[I] === 1)
                for (Col = 0; Col < 6; Col++)
                    if (!FField[Col][Row].Initial && (FField[Col][Row].Variants.indexOf(I) !== -1)) {
                        var c = Row * 6 + I;
                          FField[Col][Row].UserValue = c;
                          c=c%6;
                        if (solved) alert('Карта #' + c + ' должна находится в клетке, ' + Col + ', ' + Row + ' потому что в остальных столбцах этот вариант уже исключён');
                      
                        return 'Карта #' + c + ' должна находится в клетке, ' + Col + ', ' + Row + ' потому что в остальных столбцах этот вариант уже исключён';
                    }
    }
    return;
}

function CheckVClue(Index, Direct) {
    var Col = 0,
        P1 = '',
        P2 = '';
    var SCard1 = FMainVClues[Index].Card1 % 6;
    var SCard2 = FMainVClues[Index].Card2 % 6;
    var row1 = div(FMainVClues[Index].Card1, 6);
    var row2 = div(FMainVClues[Index].Card2, 6);
    if (FMainVClues[Index].ClueType === 'vcTogether') {
        for (Col = 0; Col < 6; Col++) {

            P1 = CheckPossibility(Col, FMainVClues[Index].Card1);
            //console.log(P1);
            P2 = CheckPossibility(Col, FMainVClues[Index].Card2);
            //console.log('CheckVClue', P1,P2, Index,Direct, !Direct,P1 === 'cpCannotBe',P2 === 'cpCanBe', !Direct && (P1 === 'cpCannotBe') && (P2 === 'cpCanBe'));
            if (Direct && (P1 === 'cpIsHere') && (P2 === 'cpCanBe')) {
                if (solved) alert('Карта ' + SCard2 + ' должна быть в ' + Col + ', ' + row2 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard1);
                FField[Col][row2].UserValue = FMainVClues[Index].Card2;
                correct=false;
                return 'Карта ' + SCard2 + ' должна быть в ' + Col + ', ' + row2 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard1;
            } 
            if (!Direct && (P1 === 'cpCannotBe') && (P2 === 'cpCanBe')) {
                if (solved) alert('Карта ' + SCard2 + ' не может быть в ' + Col + ', ' + row2 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard1);
                FField[Col][row2].Variants.splice(FField[Col][row2].Variants.indexOf(SCard2),1);
                correct=false;
                return 'Карта ' + SCard2 + ' не может быть в ' + Col + ', ' + row2 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard1;
            } 
            if (Direct && (P2 === 'cpIsHere') && (P1 === 'cpCanBe')) {
                if (solved) alert('Карта ' + SCard1 + ' должна быть в ' + Col + ', ' + row1 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard2);
                  FField[Col][row1].UserValue = FMainVClues[Index].Card1;
                  correct=false;
                return 'Карта ' + SCard1 + ' должна быть в ' + Col + ', ' + row1 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard2;
            } 
            if (!Direct && (P2 === 'cpCannotBe') && (P1 === 'cpCanBe')) {
                if (solved) alert('Карта ' + SCard1 + ' не может быть в ' + Col + ', ' + row1 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard2);
                FField[Col][row1].Variants.splice(FField[Col][row1].Variants.indexOf(SCard1),1);
                correct=false;
                return 'Карта ' + SCard1 + ' не может быть в ' + Col + ', ' + row1 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard2;
            }
        }
    } else {
        if (Direct && (FMainVClues[Index].ClueType === 'vcNotTogether')) {
            for (Col = 0; Col < 6; Col++) {
                P1 = CheckPossibility(Col, FMainVClues[Index].Card1);
                P2 = CheckPossibility(Col, FMainVClues[Index].Card2);
                if ((P1 === 'cpIsHere') && (P2 === 'cpCanBe')) {
                    if (solved) alert('Карта ' + SCard2 + ' не может быть в ' + Col + ', ' + row2 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard1);
                    FField[Col][row2].Variants.splice(FField[Col][row2].Variants.indexOf(SCard2),1);
               correct=false;
                    return 'Карта ' + SCard2 + ' не может быть в ' + Col + ', ' + row2 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard1;
                } else {
                    if ((P2 === 'cpIsHere') && (P1 === 'cpCanBe')) {
                        if (solved) alert('Карта ' + SCard1 + ' не может быть в ' + Col + ', ' + row1 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard2);
                        FField[Col][row1].Variants.splice(FField[Col][row1].Variants.indexOf(SCard1),1);
               correct=false;
                        return 'Карта ' + SCard1 + ' не может быть в ' + Col + ', ' + row1 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard2;
                    }
                }
            }
        }
    }
    return;
}

function CheckHClueNextTo(Index, Direct) {
    var Col;
    var PC, PL, PR;
    var SCard1 = FMainHClues[Index].Card1 % 6;
    var SCard2 = FMainHClues[Index].Card2 % 6;
    var row1 = div(FMainHClues[Index].Card1, 6);
    var row2 = div(FMainHClues[Index].Card2, 6);
    var q;
    for (Col = 0; Col < 6; Col++) {
        PC = CheckPossibility(Col, FMainHClues[Index].Card1);
        PL = CheckPossibility(Col - 1, FMainHClues[Index].Card2);
        PR = CheckPossibility(Col + 1, FMainHClues[Index].Card2);
        //console.log(Col,PL,PC,PR, !Direct, PC === 'cpCanBe' ,PL === 'cpCannotBe' ,PR === 'cpCannotBe',!Direct && PC === 'cpCanBe' && PL === 'cpCannotBe' && PR === 'cpCannotBe');
        if (Direct && PC === 'cpIsHere') {
            if (PL === 'cpCanBe' && PR === 'cpCannotBe') {
                q = Col - 1;
                if (solved) alert('Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ' , так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а справа от ' + SCard1 + ' её быть не может');
                FField[q][row2].UserValue=FMainHClues[Index].Card2;
                correct=false;
                return 'Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ' , так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а справа от ' + SCard1 + ' её быть не может';
            } else
            if (PR === 'cpCanBe' && PL === 'cpCannotBe') {
                q = Col + 1;
                if (solved) alert('Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ' , так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а слева от ' + SCard1 + ' её быть не может');
                FField[q][row2].UserValue=FMainHClues[Index].Card2;correct=false;
                return 'Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ' , так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а слева от ' + SCard1 + ' её быть не может';
            } else
            //???????????????
            if (!Direct && PC === 'cpCanBe' && PL === 'cpCannotBe' && PR === 'cpCannotBe') {
                if (solved) alert('Карта ' + SCard1 + ' не может быть в клетке ' + Col + ', ' + row2 + ' , так как по указанному правилу в одном из соседних с ней столбцов должна быть карта ' + SCard2);
                FField[Col][row2].Variants.splice(FField[Col][row2].Variants.indexOf(SCard1),1);correct=false;
               //console.log('Карта ' + SCard1 + ' не может быть в клетке ' + Col + ', ' + row2 + ' , так как по указанному правилу в одном из соседних с ней столбцов должна быть карта ' + SCard2);
                return 'Карта ' + SCard1 + ' не может быть в клетке ' + Col + ', ' + row2 + ' , так как по указанному правилу в одном из соседних с ней столбцов должна быть карта ' + SCard2;
            }
        } else {
             if (!Direct && PC === 'cpCanBe' && PL === 'cpCannotBe' && PR === 'cpCannotBe') {
                 q=Col;
                // console.log(FField[q][row2].Variants);
                FField[q][row1].Variants.splice(FField[q][row1].Variants.indexOf(SCard1),1);
                correct=false;
                if (solved) alert('Карта ' + SCard1 + ' не может быть в клетке  ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' в одном из соседних с ней столбцов должна быть карта ' + SCard2);
           // console.log('Карта ' + SCard2 + ' не может быть в клетке  ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' в одном из соседних с ней столбцов должна быть карта ' + SCard1);
            
            return 'Карта ' + SCard1 + ' не может быть в клетке  ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' в одном из соседних с ней столбцов должна быть карта ' + SCard2;
        }
        }
        PC = CheckPossibility(Col, FMainHClues[Index].Card2);
        PL = CheckPossibility(Col - 1, FMainHClues[Index].Card1);
        PR = CheckPossibility(Col + 1, FMainHClues[Index].Card1);
        //console.log(Col,PL,PC,PR, !Direct, PC === 'cpCanBe' ,PL === 'cpCannotBe' ,PR === 'cpCannotBe',!Direct && PC === 'cpCanBe' && PL === 'cpCannotBe' && PR === 'cpCannotBe');
         if (Direct && PC === 'cpIsHere') {
            if (PL === 'cpCanBe' && PR === 'cpCannotBe') {
                q = Col - 1;
                FField[q][row1].UserValue = FMainHClues[Index].Card1;
                correct=false;
                if (solved) alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ' , так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard2 + ', а справа от ' + SCard2 + ' её быть не может');
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ' , так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard2 + ', а справа от ' + SCard2 + ' её быть не может';
            } else
            if (PR === 'cpCanBe' && PL === 'cpCannotBe') {
                q = Col + 1;
                 FField[q][row1].UserValue = FMainHClues[Index].Card1;
                 correct=false;
                if (solved) alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ' , так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard2 + ', а слева от ' + SCard2 + ' её быть не может');
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ' , так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard2 + ', а слева от ' + SCard2 + ' её быть не может';
            }
        } else
        ///???????????
        //console.log("qwqwq");
        if (!Direct && PC === 'cpCanBe' && PL === 'cpCannotBe' && PR === 'cpCannotBe') {
            q=Col;
           // console.log(FField[q][row2].Variants);
             FField[q][row2].Variants.splice(FField[q][row2].Variants.indexOf(SCard2),1);
               correct=false;
            if (solved) alert('Карта ' + SCard2 + ' не может быть в клетке  ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' в одном из соседних с ней столбцов должна быть карта ' + SCard1);
           // console.log('Карта ' + SCard2 + ' не может быть в клетке  ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' в одном из соседних с ней столбцов должна быть карта ' + SCard1);
            
            return 'Карта ' + SCard2 + ' не может быть в клетке  ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' в одном из соседних с ней столбцов должна быть карта ' + SCard1;
        }
    }
    return;
}

function CheckHClueNotNextTo(Index, Direct) {
    var Col, PC, PL, PR, q;
    var SCard1 = FMainHClues[Index].Card1 % 6;
    var SCard2 = FMainHClues[Index].Card2 % 6;
    var row1 = div(FMainHClues[Index].Card1, 6);
    var row2 = div(FMainHClues[Index].Card2, 6);
    if (Direct) {
        for (Col = 0; Col < 6; Col++) {
            PC = CheckPossibility(Col, FMainHClues[Index].Card1);
            PL = CheckPossibility(Col - 1, FMainHClues[Index].Card2);
            PR = CheckPossibility(Col + 1, FMainHClues[Index].Card2);
            if (PC === 'cpIsHere' && PL === 'cpCanBe') {
                q = Col - 1;
                
                FField[q][row2].Variants.splice(FField[q][row2].Variants.indexOf(SCard2),1);correct=false;
                if (solved) alert('Карта ' + SCard2 + ' не может быть в  клетке ' + q + ', ' + row2 + ', так по правилу ' + Index + ' она не должна находится в столбце, соседнем с картой ' + SCard1);
                return 'Карта ' + SCard2 + ' не может быть в  клетке ' + q + ', ' + row2 + ', так по правилу ' + Index + ' она не должна находится в столбце, соседнем с картой ' + SCard1;
            }
            if (PC === 'cpIsHere' && PR === 'cpCanBe') {
                q = Col + 1;
                FField[q][row2].Variants.splice(FField[q][row2].Variants.indexOf(SCard2),1);
                correct=false;
                if (solved) alert('Карта ' + SCard2 + ' не может быть в  клетке ' + q + ', ' + row2 + ', так по правилу ' + Index + ' она не должна находится в столбце, соседнем с картой ' + SCard1);
                return 'Карта ' + SCard2 + ' не может быть в  клетке ' + q + ', ' + row2 + ', так по правилу ' + Index + ' она не должна находится в столбце, соседнем с картой ' + SCard1;
            }
            PC = CheckPossibility(Col, FMainHClues[Index].Card2);
            PL = CheckPossibility(Col - 1, FMainHClues[Index].Card1);
            PR = CheckPossibility(Col + 1, FMainHClues[Index].Card1);
            if (PC === 'cpIsHere' && PL === 'cpCanBe') {
                q = Col - 1;
                FField[q][row1].Variants.splice(FField[q][row1].Variants.indexOf(SCard1),1);
                correct=false;
                if (solved) alert('Карта ' + SCard1 + ' не может быть в  клетке ' + q + ', ' + row1 + ', так по правилу ' + Index + ' она не должна находится в столбце, соседнем с картой ' + SCard2);
                return 'Карта ' + SCard1 + ' не может быть в  клетке ' + q + ', ' + row1 + ', так по правилу ' + Index + ' она не должна находится в столбце, соседнем с картой ' + SCard2;
            }
            if (PC === 'cpIsHere' && PR === 'cpCanBe') {
                q = Col + 1;
                FField[q][row1].Variants.splice(FField[q][row1].Variants.indexOf(SCard1),1);
                if (solved) alert('Карта ' + SCard1 + ' не может быть в  клетке ' + q + ', ' + row1 + ', так по правилу ' + Index + ' она не должна находится в столбце, соседнем с картой ' + SCard2);
                return 'Карта ' + SCard1 + ' не может быть в  клетке ' + q + ', ' + row1 + ', так по правилу ' + Index + ' она не должна находится в столбце, соседнем с картой ' + SCard2;
            }
        }
    }
    return;
}

function CheckHClueTriple(Index, Direct) {//????????????????????//
    var Col, PC, PL1, PR1, PL2, PR2, PL3, PR3, q;
    var SCard1 = FMainHClues[Index].Card1 % 6;
    var SCard2 = FMainHClues[Index].Card2 % 6;
    var SCard3 = FMainHClues[Index].Card3 % 6;
    var row1 = div(FMainHClues[Index].Card1, 6);
    var row2 = div(FMainHClues[Index].Card2, 6);
    var row3 = div(FMainHClues[Index].Card3, 6);
    for (Col = 0; Col < 6; Col++) {
        PC = CheckPossibility(Col, FMainHClues[Index].Card2);
        PL1 = CheckPossibility(Col - 1, FMainHClues[Index].Card1);
        PR1 = CheckPossibility(Col + 1, FMainHClues[Index].Card1);
        PL3 = CheckPossibility(Col - 1, FMainHClues[Index].Card3);
        PR3 = CheckPossibility(Col + 1, FMainHClues[Index].Card3);
        //console.log(Col,PL1,PL3,PC,PR1,PR3)
        if (Direct && PC === 'cpIsHere') {
            if (PL1 === 'cpIsHere' && PR3 === 'cpCanBe') {
                q = Col + 1;
                FField[q][row3].UserValue = FMainHClues[Index].Card3; 
                if (solved) alert('Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' карта ' + SCard2 + ' находится между ' + SCard1 + ' и ' + SCard3 + ', а ' + SCard1 + ' уже находится слева от ' + SCard2);
                return 'Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' карта ' + SCard2 + ' находится между ' + SCard1 + ' и ' + SCard3 + ', а ' + SCard1 + ' уже находится слева от ' + SCard2;
            }
            if (PR1 === 'cpIsHere' && PL3 === 'cpCanBe') {
                q = Col - 1;
                FField[q][row3].UserValue = FMainHClues[Index].Card3; 
                if (solved) alert('Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' карта ' + SCard2 + ' находится между ' + SCard1 + ' и ' + SCard3 + ', а ' + SCard1 + ' уже находится справа от ' + SCard2);
                return 'Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' карта ' + SCard2 + ' находится между ' + SCard1 + ' и ' + SCard3 + ', а ' + SCard1 + ' уже находится справа от ' + SCard2;
            }
            if (PL3 === 'cpIsHere' && PR1 === 'cpCanBe') {
                q = Col + 1;
                FField[q][row1].UserValue = FMainHClues[Index].Card1; 
                if (solved) alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' карта ' + SCard2 + ' находится между ' + SCard1 + ' и ' + SCard3 + ', а ' + SCard3 + ' уже находится слева от ' + SCard2);
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' карта ' + SCard2 + ' находится между ' + SCard1 + ' и ' + SCard3 + ', а ' + SCard3 + ' уже находится слева от ' + SCard2;
            }
            if (PR3 === 'cpIsHere' && PL1 === 'cpCanBe') {
                q = Col - 1;
                FField[q][row1].UserValue = FMainHClues[Index].Card1; 
                if (solved) alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' карта ' + SCard2 + ' находится между ' + SCard1 + ' и ' + SCard3 + ', а ' + SCard3 + ' уже находится справа от ' + SCard2);
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' карта ' + SCard2 + ' находится между ' + SCard1 + ' и ' + SCard3 + ', а ' + SCard3 + ' уже находится справа от ' + SCard2;
            }
            if (PL1 === 'cpCanBe' && PR1 === 'cpCannotBe') {
                q = Col - 1;
                FField[q][row1].UserValue = FMainHClues[Index].Card1; 
                if (solved) alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится рядом с картой ' + SCard2 + ', а справа от ' + SCard2 + ' она быть не может');
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится рядом с картой ' + SCard2 + ', а справа от ' + SCard2 + ' она быть не может';
            }
            if (PL1 === 'cpCannotBe' && PR1 === 'cpCanBe') {
                q = Col + 1;
                FField[q][row1].UserValue = FMainHClues[Index].Card1; 
                if (solved) alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится рядом с картой ' + SCard2 + ', а слева от ' + SCard2 + ' она быть не может');
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится рядом с картой ' + SCard2 + ', а слева от ' + SCard2 + ' она быть не может';
            }
            if (PL3 === 'cpCanBe' && PR3 === 'cpCannotBe') {
                q = Col - 1;
                FField[q][row3].UserValue = FMainHClues[Index].Card3; 
                if (solved) alert('Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится рядом с картой ' + SCard2 + ', а справа от ' + SCard2 + ' она быть не может');
                return 'Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится рядом с картой ' + SCard2 + ', а справа от ' + SCard2 + ' она быть не может';
            }
            if (PL3 === 'cpCannotBe' && PR3 === 'cpCanBe') {
                q = Col + 1;
                FField[q][row3].UserValue = FMainHClues[Index].Card3; 
                if (solved) alert('Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится рядом с картой ' + SCard2 + ', а слева от ' + SCard2 + ' она быть не может');
                return 'Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится рядом с картой ' + SCard2 + ', а слева от ' + SCard2 + ' она быть не может';
            }
        } else if (PC === 'cpCanBe') {
            if (!Direct && PL1 === 'cpCannotBe' && PL3 === 'cpCannotBe') {
                q = Col;
                FField[q][row2].Variants.splice(FField[q][row2].Variants.indexOf(SCard2), 1);
                if (solved) alert('Карта ' + SCard2 + ' не может быть в клетке  ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3 + ', а слева не может быть ни ' + SCard1 + ', ни ' + SCard3);
                return 'Карта ' + SCard2 + ' не может быть в клетке  ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3 + ', а слева не может быть ни ' + SCard1 + ', ни ' + SCard3;
            }
            if (!Direct && PR1 === 'cpCannotBe' && PR3 === 'cpCannotBe') {
                q = Col;
                FField[q][row2].Variants.splice(FField[q][row2].Variants.indexOf(SCard2), 1);
                if (solved) alert('Карта ' + SCard2 + ' не может быть в клетке  ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3 + ', а справа не может быть ни ' + SCard1 + ', ни ' + SCard3);
                return 'Карта ' + SCard2 + ' не может быть в клетке  ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3 + ', а справа не может быть ни ' + SCard1 + ', ни ' + SCard3;
            }
            if (!Direct && PL1 === 'cpCannotBe' && PR1 === 'cpCannotBe') {
                q = Col;
                FField[q][row2].Variants.splice(FField[q][row2].Variants.indexOf(SCard2), 1);
                if (solved) alert('Карта ' + SCard2 + ' не может быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3 + ', а карты ' + SCard1 + ' нет ни справа, ни слева');
                return 'Карта ' + SCard2 + ' не может быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3 + ', а карты ' + SCard1 + ' нет ни справа, ни слева';
            }
            if (!Direct && PL3 === 'cpCannotBe' && PR3 === 'cpCannotBe') {
                q = Col;
                FField[q][row2].Variants.splice(FField[q][row2].Variants.indexOf(SCard2), 1);
                if (solved) alert('Карта ' + SCard2 + ' не может быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3 + ', а карты ' + SCard3 + ' нет ни справа, ни слева');
                return 'Карта ' + SCard2 + ' не может быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3 + ', а карты ' + SCard3 + ' нет ни справа, ни слева';
            }
            if (Direct && PL1 === 'cpIsHere' && PR3 === 'cpIsHere') {
                q = Col;
                FField[q][row2].UserValue = FMainHClues[Index].Card2; 
                if (solved) alert('Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3);
                return 'Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3;
            }
            if (Direct && PL3 === 'cpIsHere' && PR1 === 'cpIsHere') {
                q = Col;
                FField[q][row2].UserValue = FMainHClues[Index].Card2; 
                if (solved) alert('Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3);
                return 'Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3;
            }
        }
        PC = CheckPossibility(Col, FMainHClues[Index].Card1);
        PL2 = CheckPossibility(Col - 1, FMainHClues[Index].Card2);
        PR2 = CheckPossibility(Col + 1, FMainHClues[Index].Card2);
        PL3 = CheckPossibility(Col - 2, FMainHClues[Index].Card3);
        PR3 = CheckPossibility(Col + 2, FMainHClues[Index].Card3);
        if (Direct && PC === 'cpIsHere') {
            if (PL2 === 'cpCanBe' && PR2 === 'cpCannotBe') {
                q = Col - 1;
                FField[q][row2].UserValue = FMainHClues[Index].Card2; 
                if (solved) alert('Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а справа от ' + SCard1 + ' её быть не может');
                return 'Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а справа от ' + SCard1 + ' её быть не может';
            }
            if (PL2 === 'cpCannotBe' && PR2 === 'cpCanBe') {
                q = Col + 1;
                FField[q][row2].UserValue = FMainHClues[Index].Card2; 
                if (solved) alert('Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а слева от ' + SCard1 + ' её быть не может');
                return 'Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а слева от ' + SCard1 + ' её быть не может';
            }
            if (PL3 === 'cpCanBe' && PR3 === 'cpCannotBe') {
                q = Col - 2;
                FField[q][row3].UserValue = FMainHClues[Index].Card3; 
                          if (solved) alert('Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а справа от ' + SCard1 + ' её быть не может');
                return 'Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а справа от ' + SCard1 + ' её быть не может';
            }
            if (PL3 === 'cpCannotBe' && PR3 === 'cpCanBe') {
                q = Col + 2;
                FField[q][row3].UserValue = FMainHClues[Index].Card3; 
                if (solved) alert('Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а слева от ' + SCard1 + ' её быть не может');
                return 'Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а слева от ' + SCard1 + ' её быть не может';
            }
        } else if (!Direct && PC === 'cpCanBe') {
            if (PL2 === 'cpCannotBe' && PR2 === 'cpCannotBe') {
                q = Col;
                FField[q][row1].Variants.splice(FField[q][row1].Variants.indexOf(SCard1), 1);
                if (solved) alert('Карта ' + SCard1 + ' не может быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' в одном из соседних с ней столбцов должна быть карта ' + SCard2);
                return 'Карта ' + SCard1 + ' не может быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' в одном из соседних с ней столбцов должна быть карта ' + SCard2;
            }
            if (PL3 === 'cpCannotBe' && PR3 === 'cpCannotBe') {
                q = Col;
                FField[q][row1].Variants.splice(FField[q][row1].Variants.indexOf(SCard1), 1);
                if (solved) alert('Карта ' + SCard1 + ' не может быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' через один столбец от неё должна быть карта ' + SCard3);
                return 'Карта ' + SCard1 + ' не может быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' через один столбец от неё должна быть карта ' + SCard3;
            }
        }
        PC = CheckPossibility(Col, FMainHClues[Index].Card3);
        PL3 = CheckPossibility(Col - 2, FMainHClues[Index].Card1);
        PR3 = CheckPossibility(Col + 2, FMainHClues[Index].Card1);
        if (Direct && PC === 'cpIsHere') {
            if (PL2 === 'cpCanBe' && PR2 === 'cpCannotBe') {
                q = Col - 1;
                FField[q][row2].UserValue = FMainHClues[Index].Card2; 
                if (solved) alert('Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard3 + ', а справа от ' + SCard3 + ' её быть не может');
                return 'Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard3 + ', а справа от ' + SCard3 + ' её быть не может';
            }
            if (PL2 === 'cpCannotBe' && PR2 === 'cpCanBe') {
                q = Col + 1;
                FField[q][row2].UserValue = FMainHClues[Index].Card2; 
                if (solved) alert('Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard3 + ', а слева от ' + SCard3 + ' её быть не может');
                return 'Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard3 + ', а слева от ' + SCard3 + ' её быть не может';
            }
            if (PL3 === 'cpCanBe' && PR3 === 'cpCannotBe') {
                q = Col - 2;

                FField[q][row1].UserValue = FMainHClues[Index].Card1; 
                if (solved) alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard3 + ', а справа от ' + SCard3 + ' её быть не может');
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard3 + ', а справа от ' + SCard3 + ' её быть не может';
            }
            if (PL3 === 'cpCannotBe' && PR3 === 'cpCanBe') {
                q = Col + 2;
                FField[q][row1].UserValue = FMainHClues[Index].Card1; 
                if (solved) alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard3 + ', а слева от ' + SCard3 + ' её быть не может');
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard3 + ', а слева от ' + SCard3 + ' её быть не может';
            }
        } else
        if (!Direct && PC === 'cpCanBe') {
            if (PL2 === 'cpCannotBe' && PR2 === 'cpCannotBe') {
                q = Col;
                FField[q][row3].Variants.splice(FField[q][row3].Variants.indexOf(SCard3), 1);
                if (solved) alert('Карта ' + SCard3 + ' не может быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' в одном из соседних с ней столбцов должна быть карта ' + SCard2);
                return 'Карта ' + SCard3 + ' не может быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' в одном из соседних с ней столбцов должна быть карта ' + SCard2;
            }
            if (PL3 === 'cpCannotBe' && PR3 === 'cpCannotBe') {
                q = Col;
                FField[q][row3].Variants.splice(FField[q][row3].Variants.indexOf(SCard3), 1);
                if (solved) alert('Карта ' + SCard3 + ' не может быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' через один столбец от неё должна быть карта ' + SCard1);
                return 'Карта ' + SCard3 + ' не может быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' через один столбец от неё должна быть карта ' + SCard1;
            }
        }
    }
    return;
}

function CheckHClueNotTriple(Index, Direct) {
    var Col, PC, PL1, PR1, PL2, PR2, PL3, PR3, q;
    var SCard1 = FMainHClues[Index].Card1 % 6;
    var SCard2 = FMainHClues[Index].Card2 % 6;
    var SCard3 = FMainHClues[Index].Card3 % 6;
    var row1 = div(FMainHClues[Index].Card1, 6);
    var row2 = div(FMainHClues[Index].Card2, 6);
    var row3 = div(FMainHClues[Index].Card3, 6);
    //console.error(SCard3, SCard2, SCard1, row1, row2, row3);
    for (Col = 0; Col < 6; Col++) {
        PC = CheckPossibility(Col, FMainHClues[Index].Card1);
        PL2 = CheckPossibility(Col - 1, FMainHClues[Index].Card2);
        PR2 = CheckPossibility(Col + 1, FMainHClues[Index].Card2);
        PL3 = CheckPossibility(Col - 2, FMainHClues[Index].Card3);
        PR3 = CheckPossibility(Col + 2, FMainHClues[Index].Card3);
        if (!Direct && PC === 'cpCanBe') {
            if (PL3 === 'cpCannotBe' && PR3 === 'cpCannotBe') {
                q = Col;
                FField[q][row1].Variants.splice(FField[q][row1].Variants.indexOf(SCard1), 1);
                if (solved) alert('Карта ' + SCard1 + ' не может быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' через один столбец от неё должна быть карта ' + SCard3);
                return 'Карта ' + SCard1 + ' не может быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' через один столбец от неё должна быть карта ' + SCard3;
            }
            if (PL3 === 'cpCannotBe' && PR2 === 'cpIsHere') {
                q = Col;
                FField[q][row1].Variants.splice(FField[q][row1].Variants.indexOf(SCard1), 1);
                if (solved) alert('Карта ' + SCard1 + ' не может быть в клетке ' + q + ', ' + row1 + ', так как через столбец слева нет ' + SCard3 + ', а в соседнем столбце справа стоит ' + SCard2 + ', и правило' + Index + ' не может быть выполнено');
                return 'Карта ' + SCard1 + ' не может быть в клетке ' + q + ', ' + row1 + ', так как через столбец слева нет ' + SCard3 + ', а в соседнем столбце справа стоит ' + SCard2 + ', и правило' + Index + ' не может быть выполнено';
            }
            if (PR3 === 'cpCannotBe' && PL2 === 'cpIsHere') {
                q = Col;
                FField[q][row1].Variants.splice(FField[q][row1].Variants.indexOf(SCard1), 1);
                if (solved) alert('Карта ' + SCard1 + ' не может быть в клетке ' + q + ', ' + row1 + ', так как через столбец справа нет ' + SCard3 + ', а в соседнем столбце слева стоит ' + SCard2 + ', и правило' + Index + ' не может быть выполнено');
                return 'Карта ' + SCard1 + ' не может быть в клетке ' + q + ', ' + row1 + ', так как через столбец справа нет ' + SCard3 + ', а в соседнем столбце слева стоит ' + SCard2 + ', и правило' + Index + ' не может быть выполнено';
            }
        } else if (Direct && PC === 'cpIsHere') {
            if (PL3 === 'cpCanBe' && PR3 === 'cpCannotBe') {
                q = Col - 2;
                FField[q][row3].UserValue = FMainHClues[Index].Card3; 
                if (solved) alert('Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard1 + ', а справа от ' + SCard1 + ' её быть не может');
                return 'Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard1 + ', а справа от ' + SCard1 + ' её быть не может';
            }
            if (PR3 === 'cpCanBe' && PL3 === 'cpCannotBe') {
                q = Col + 2;
                FField[q][row3].UserValue = FMainHClues[Index].Card3; 
                if (solved) alert('Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard1 + ', а слева от ' + SCard1 + ' её быть не может');
                return 'Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard1 + ', а слева от ' + SCard1 + ' её быть не может';
            }
            if (PL2 === 'cpIsHere' && PR3 === 'cpCanBe') {
                q = Col + 2;
                FField[q][row3].UserValue = FMainHClues[Index].Card3; 
                if (solved) alert('Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard1 + ', а слева от ' + SCard1 + ' её быть не может, иначе между ними окажется ' + SCard2);
                return 'Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard1 + ', а слева от ' + SCard1 + ' её быть не может, иначе между ними окажется ' + SCard2;
            }
            if (PR2 === 'cpIsHere' && PL3 === 'cpCanBe') {
                q = Col - 2;
                FField[q][row3].UserValue = FMainHClues[Index].Card3; 
                if (solved) alert('Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard1 + ', а справа от ' + SCard1 + ' её быть не может, иначе между ними окажется ' + SCard2);
                return 'Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard1 + ', а справа от ' + SCard1 + ' её быть не может, иначе между ними окажется ' + SCard2;
            }
        }
        PC = CheckPossibility(Col, FMainHClues[Index].Card3);
        PL3 = CheckPossibility(Col - 2, FMainHClues[Index].Card1);
        PR3 = CheckPossibility(Col + 2, FMainHClues[Index].Card1);
        if (!Direct && PC === 'cpCanBe') {
            if (PL3 === 'cpCannotBe' && PR3 === 'cpCannotBe') {
                q = Col;
                FField[q][row3].Variants.splice(FField[q][row3].Variants.indexOf(SCard3), 1);
                if (solved) alert('Карта ' + SCard3 + ' не может быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' через один столбец от неё должна быть карта ' + SCard1);
                return 'Карта ' + SCard3 + ' не может быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' через один столбец от неё должна быть карта ' + SCard1;
            }
            if (PL3 === 'cpCannotBe' && PR2 === 'cpIsHere') {
                q = Col;
                FField[q][row3].Variants.splice(FField[q][row3].Variants.indexOf(SCard3), 1);
                if (solved) alert('Карта ' + SCard3 + ' не может быть в клетке ' + q + ', ' + row3 + ', так как через столбец слева нет ' + SCard1 + ', а в соседнем столбце справа стоит ' + SCard2 + ', и правило ' + Index + ' не может быть выполнено');
                return 'Карта ' + SCard3 + ' не может быть в клетке ' + q + ', ' + row3 + ', так как через столбец слева нет ' + SCard1 + ', а в соседнем столбце справа стоит ' + SCard2 + ', и правило ' + Index + ' не может быть выполнено';
            }
            if (PR3 === 'cpCannotBe' && PL2 === 'cpIsHere') {
                q = Col;
                FField[q][row3].Variants.splice(FField[q][row3].Variants.indexOf(SCard3), 1);
                if (solved) alert('Карта ' + SCard3 + ' не может быть в клетке ' + q + ', ' + row3 + ', так как через столбец справа нет ' + SCard1 + ', а в соседнем столбце слева стоит ' + SCard2 + ', и указанное правило не может быть выполнено');
                return 'Карта ' + SCard3 + ' не может быть в клетке ' + q + ', ' + row3 + ', так как через столбец справа нет ' + SCard1 + ', а в соседнем столбце слева стоит ' + SCard2 + ', и указанное правило не может быть выполнено';
            }
        } else if (Direct && PC === 'cpIsHere') {
            if (PL3 === 'cpCanBe' && PR3 === 'cpCannotBe') {
                q = Col - 2;

                FField[q][row1].UserValue = FMainHClues[Index].Card1; 
                if (solved) alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard3 + ', а справа от ' + SCard3 + ' её быть не может');
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard3 + ', а справа от ' + SCard3 + ' её быть не может';
            }
            if (PR3 === 'cpCanBe' && PL3 === 'cpCannotBe') {
                q = Col + 2;
                FField[q][row1].UserValue = FMainHClues[Index].Card1; 
                if (solved) alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard3 + ', а слева от ' + SCard3 + ' её быть не может');
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard3 + ', а слева от ' + SCard3 + ' её быть не может';
            }
            if (PL2 === 'cpIsHere' && PR3 === 'cpCanBe') {
                q = Col + 2;
                FField[q][row1].UserValue = FMainHClues[Index].Card1; 
                if (solved) alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard3 + ', а слева от ' + SCard3 + ' её быть не может, иначе между ними окажется ' + SCard2);
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard3 + ', а слева от ' + SCard3 + ' её быть не может, иначе между ними окажется ' + SCard2;
            }
            if (PR2 === 'cpIsHere' && PL3 === 'cpCanBe') {
                q = Col - 2;
                FField[q][row1].UserValue = FMainHClues[Index].Card1; 
                if (solved) alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard3 + ', а справа от ' + SCard3 + ' её быть не может, иначе между ними окажется ' + SCard2);
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard3 + ', а справа от ' + SCard3 + ' её быть не может, иначе между ними окажется ' + SCard2;
            }
        }
        PC = CheckPossibility(Col, FMainHClues[Index].Card2);
        PL1 = CheckPossibility(Col - 1, FMainHClues[Index].Card1);
        PR1 = CheckPossibility(Col + 1, FMainHClues[Index].Card1);
        PL3 = CheckPossibility(Col - 1, FMainHClues[Index].Card3);
        PR3 = CheckPossibility(Col + 1, FMainHClues[Index].Card3);
        if (!Direct && PC === 'cpCanBe') {
            if (PL1 === 'cpIsHere' && PR3 === 'cpIsHere') {
                q = Col;
                FField[q][row2].Variants.splice(FField[q][row2].Variants.indexOf(SCard2), 1);
                if (solved) alert('Карта ' + SCard2 + ' не может быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' не может находиться между ' + SCard1 + ' и ' + SCard3);
                return 'Карта ' + SCard2 + ' не может быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' не может находиться между ' + SCard1 + ' и ' + SCard3;
            }
            if (PL3 === 'cpIsHere' && PR1 === 'cpIsHere') {
                q = Col;
                FField[q][row2].Variants.splice(FField[q][row2].Variants.indexOf(SCard2), 1);
                if (solved) alert('Карта ' + SCard2 + ' не может быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' не может находиться между ' + SCard1 + ' и ' + SCard3);
                return 'Карта ' + SCard2 + ' не может быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' не может находиться между ' + SCard1 + ' и ' + SCard3;
            }
        }
    }
    return;
}

function CheckHClueOrder(Index, Direct) {
    var Col, Col2, LeftmostLeft, RightmostRight, q;
    var SCard1 = FMainHClues[Index].Card1 % 6;
    var SCard3 = FMainHClues[Index].Card3 % 6;
    var row1 = div(FMainHClues[Index].Card1, 6);
    var row3 = div(FMainHClues[Index].Card3, 6);
    if (Direct) {
        LeftmostLeft = 0;
        while (CheckPossibility(LeftmostLeft, FMainHClues[Index].Card1) === 'cpCannotBe') {
            LeftmostLeft++;
        }
        for (Col = 0; Col <= LeftmostLeft; Col++) {
            if (CheckPossibility(Col, FMainHClues[Index].Card3) === 'cpCanBe') {
                q = Col;
                FField[q][row3].Variants.splice(FField[q][row3].Variants.indexOf(SCard3), 1);
                if (solved) alert('Карта ' + SCard3 + ' не может быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она должна находиться правее карты ' + SCard1);
                return 'Карта ' + SCard3 + ' не может быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она должна находиться правее карты ' + SCard1;
            }
        }
        RightmostRight = 5;
            while (CheckPossibility(RightmostRight, FMainHClues[Index].Card3) === 'cpCannotBe')
                RightmostRight--;
            for (Col = RightmostRight; Col < 6; Col++)
                if (CheckPossibility(Col, FMainHClues[Index].Card1) === 'cpCanBe') {
                    q = Col;
                    FField[q][row1].Variants.splice(FField[q][row1].Variants.indexOf(SCard1), 1);
                    if (solved) alert('Карта ' + SCard1 + ' не может быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она должна находиться левее карты ' + SCard3);
                    return 'Карта ' + SCard1 + ' не может быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она должна находиться левее карты ' + SCard3;
                }
        }
    
    return;
}

function CheckHClue(Index, Direct) {
    switch (FMainHClues[Index].ClueType) {
        case 'hcNextTo':
            {
                return CheckHClueNextTo(Index, Direct);
            }
        case 'hcNotNextTo':
            {
                return CheckHClueNotNextTo(Index, Direct);
            }
        case 'hcTriple':
            {
                return CheckHClueTriple(Index, Direct);
            }
        case 'hcNotTriple':
            {
                return CheckHClueNotTriple(Index, Direct);
            }
        case 'hcOrder':
            {
                return CheckHClueOrder(Index, Direct);
            }
    }
    return;
}

function FindHint(solve) {
    solved=solve;
    var Index;
    var Result = CheckSimpleValues();
    Index = 0;
    while (!Result && Index < 20) {
        Result = CheckVClue(Index, true);

        Index++;
    }
    console.log(Result);
    Index = 0;
    while (!Result && Index < 23) {
        Result = CheckHClue(Index, true);
        Index++;
    }
    console.log(Result);
    Index = 0;
    while (!Result && Index < 20) {
        Result = CheckVClue(Index, false);
        Index++;
    }
    console.log(Result);
    Index = 0;
    while (!Result && Index <= 23) {
        Result = CheckHClue(Index, false);
        Index++;
    }
    return Result;
}