function GetRow(card) { //console.log(card);
    for (var i = 0; i < 6; i++) {
        //console.log(FField[i][div(Clue.Card1,6)].UserValue===FMainHClues[Index].Card1,FField[i][div(Clue.Card1,6)].UserValue,FMainHClues[Index].Card1, i, Clue.Card1, FField[i][div(Clue.Card1,6)].UserValue, div(Clue.Card1,6));
        if (FField[i][div(card, 6)].Initial && FField[i][div(card, 6)].UserValue === card) return i;
    }
    return -1;
}

function CheckHClueError(Index) {
    var Left, Center, Right;
    var SCard1 = FMainHClues[Index].Card1 % 6;
    var SCard2 = FMainHClues[Index].Card2 % 6;
    var SCard3 = FMainHClues[Index].Card3 % 6;
    var Clue = {
            'ClueType': FMainHClues[Index].ClueType,
            'Card1': FMainHClues[Index].Card1,
            'Card2': FMainHClues[Index].Card2,
            'Card3': FMainHClues[Index].Card3
        }
        //console.log(Clue);
    var Result = '';
    switch (Clue['ClueType']) {
        case 'hcNextTo':
            {
                Left = GetRow(Clue.Card1);
                Center = GetRow(Clue.Card2);

                // console.log(Left,Center,Index);
                if (Math.abs(Left - Center) !== 1 && Left >= 0 && Center >= 0) {
                    alert('Комбинация противоречит ключу:' + Index + ' карты ' + SCard1 + ' и ' + SCard2 + ' должны находиться в соседних столбцах');
                    return 'Комбинация противоречит ключу:' + Index + ' карты ' + SCard1 + ' и ' + SCard2 + ' должны находиться в соседних столбцах';
                }
                break;

            }
        case 'hcNotNextTo':
            {
                Left = GetRow(Clue.Card1);
                Center = GetRow(Clue.Card2);
                if (Math.abs(Left - Center) === 1 && Left >= 0 && Center >= 0) {
                    alert('Комбинация противоречит ключу:' + Index + ' карты ' + SCard1 + ' и ' + SCard2 + ' не должны находиться в соседних столбцах');
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
                    alert('Комбинация противоречит ключу ' + Index + ': карты ' + SCard1 + ' и ' + SCard3 + ' должны находиться рядом с картой ' + SCard2 + ' по разные стороны от неё');
                    return 'Комбинация противоречит ключу ' + Index + ': карты ' + SCard1 + ' и ' + SCard3 + ' должны находиться рядом с картой ' + SCard2 + ' по разные стороны от неё'
                }
                break;
            }
        case 'hcNotTriple':
            {
                Left = GetRow(Clue.Card1);
                Center = GetRow(Clue.Card2);
                Right = GetRow(Clue.Card3);
                ////console.log(Index, Left, Center, Right);

                if ((Math.abs(Center - Left) === 1 || Math.abs(Center - Right) === 1) && Center !== -1 && Left !== -1 && Right !== -1) {
                    alert('Комбинация противоречит  ключу' + Index + ': между картами ' + SCard1 + ' и ' + SCard3 + ' должен быть один столбец, в котором нет карты ' + SCard2);
                    return 'Комбинация противоречит  ключу' + Index + ': между картами ' + SCard1 + ' и ' + SCard3 + ' должен быть один столбец, в котором нет карты ' + SCard2
                }
                break;
            }
        case 'hcOrder':
            {
                Left = GetRow(Clue.Card1);
                Right = GetRow(Clue.Card3);
                if (Left > Right && Right !== -1) {
                    alert('Комбинация противоречит  ключу ' + Index + ': карта ' + SCard1 + ' должна быть левее, чем карта ' + SCard3);
                    return 'Комбинация противоречит  ключу ' + Index + ': карта ' + SCard1 + ' должна быть левее, чем карта ' + SCard3
                }
            }
    }
}

function CheckVClueError(Index) {
    console.log(Index, FMainVClues[Index]);
    var Top, Bottom;
    var SCard1 = FMainVClues[Index].Card1 % 6;
    var SCard2 = FMainVClues[Index].Card2 % 6;
    var Clue = {
        'ClueType': FMainVClues[Index].ClueType,
        'Card1': FMainVClues[Index].Card1,
        'Card2': FMainVClues[Index].Card2
    }
    if (Clue.ClueType.indexOf('Together') !== -1) {
        Top = GetRow(Clue.Card1);
        Bottom = GetRow(Clue.Card2);
        console.log(Top, Bottom);
        if (Clue.ClueType === 'vcTogether' && Top !== Bottom && Top !== -1 && Bottom !== -1) {
            alert('Комбинация противоречит  ключу ' + Index + ': карты #' + SCard1 + ' и #' + SCard2 + ' должны находиться в одном столбце');
            return 'Комбинация противоречит  ключу ' + Index + ': карты #' + SCard1 + ' и #' + SCard2 + ' должны находиться в одном столбце'
        }
        if (Clue.ClueType === 'vcNotTogether' && Top === Bottom && Top !== -1 && Bottom !== -1) {
            alert('Комбинация противоречит  ключу ' + Index + ': карты #' + SCard1 + ' и #' + SCard2 + ' не могут  находиться в одном столбце');
            return 'Комбинация противоречит  ключу ' + Index + ': карты #' + SCard1 + ' и #' + SCard2 + ' не могут  находиться в одном столбце'
        }
    }
    return

}

function CheckCorrect() {
    if (!error_flag) {
        alert('Решение ошибочно, но противоречие выявляется только в результате многоходовой комбинации');
        return 'Решение ошибочно, но противоречие выявляется только в результате многоходовой комбинации'
    }
}


function CheckPresence() {
    for (var i = 0; i < 6; i++)
        for (var j = 0; j < 6; j++)
            if (!FField[i][j].Initial && FField[i][j].Variants.length === 0) {
                alert('Поле ' + j + ', ' + i + 'не содержит вариантов');
                return 'Поле ' + j + ', ' + i + 'не содержит вариантов'
            }
    return
}

function CheckSimpleValues() {
    console.log('CheckSimpleValues');
    var Col, Col2, Row, I, Count, Card;
    var VCount = [];

    Card = -1;
    for (Row = 0; Row < 6; Row++) {
        for (I = 0; I < 6; I++) VCount[I] = 0;
        for (Col = 0; Col < 6; Col++) {
            if (!FField[Col][Row].Initial) {
                //begin
                for (Col2 = 0; Col2 < 6; Col2++)
                    if ((Col2 !== Col) && (FField[Col2][Row].initial) && (FField[Col, Row].Variants.indexOf(FField[Col2, Row].UserValue % 6)) !== -1) {
                        alert('Карта #' + FField[Col2][Row].UserValue + ' не может находиться в этой клетке' + Col + ', ' + Row + ', так как она уже размещена в другом столбце');
                        return 'Карта #' + FField[Col2][Row].UserValue + ' не может находиться в этой клетке' + Col + ', ' + Row + ', так как она уже размещена в другом столбце'
                    }
            }
            Count = 0;
            for (I = 0; I < 6; I++)
                if (FField[Col][Row].Variants.indexOf(I) !== -1) {
                    console.log(FField[Col][Row].Variants.indexOf(I), I, Col, Row)
                    Count++
                    Card = Row * 6 + I;
                    VCount[I]++;
                }
            console.log(VCount);
            if (Count === 1) {
                alert('В клетке' + Col + ', ' + Row + ' остался только один возможный вариант: карта #' + Card);
                return 'В клетке' + Col + ', ' + Row + ' остался только один возможный вариант: карта #' + Card

            }
        }

        console.log(VCount);
        for (I = 0; I < 36; I++)
            if (VCount[I] === 1)
                for (Col = 0; Col < 6; Col++)
                    if (!FField[Col][Row].Initial && (FField[Col][Row].Variants.indexOf(I) !== -1)) {
                        var c = Row * 6 + I;
                        alert('Карта #' + c + ' должна находится в клетке, ' + Col + ', ' + Row + ' потому что в остальных столбцах этот вариант уже исключён');
                        return 'Карта #' + c + ' должна находится в клетке, ' + Col + ', ' + Row + ' потому что в остальных столбцах этот вариант уже исключён'
                    }
                    //for Col2:=0 to 5 do
                    //if Col2<>Col then
                    //Result.AddHighlightedCell(Col2,Row);
                    //Exit
                    //end
    }
    //}
    return
}

function CheckVClue(Index, Direct) {
    var Col = 0,
        P1 = '',
        P2 = '';
    // P1,P2:TCardPossibility; TCardPossibility=(cpCannotBe,cpCanBe,cpIsHere);
    var SCard1 = FPMainVClues[Index].Card1 % 6;
    var SCard2 = FPMainVClues[Index].Card2 % 6;
    // function SCard1:string;
    //  begin
    //   Result:='#'+IntToStr(FPMainVClues[Index].Card1)
    //  end;

    // function SCard2:string;
    //  begin
    //   SCard2:='#'+IntToStr(FPMainVClues[Index].Card2)
    //  end;

    if (FPMainVClues[Index].ClueType === 'vcTogether') {
        for (Col = 0; Col < 6; Col++) {
            var row1 = div(FPMainVClues[Index].Card1, 6);

            var row2 = div(FPMainVClues[Index].Card2, 6);
            P1 = CheckPossibility(Col, FPMainVClues[Index].Card1);
            //console.log(P1);
            P2 = CheckPossibility(Col, FPMainVClues[Index].Card2);
            if (Direct && (P1 === 'cpIsHere') && (P2 === 'cpCanBe')) {
                alert('Карта ' + SCard2 + ' должна быть в ' + Col + ', ' + row2 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard1);
                return 'Карта ' + SCard2 + ' должна быть в ' + Col + ', ' + row2 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard1
            } else
            if (!Direct && (P1 === 'cpCanNotBe') && (P2 === 'cpCanBe')) {
                alert('Карта ' + SCard2 + ' не может быть в ' + Col + ', ' + row2 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard1);
                return 'Карта ' + SCard2 + ' не может быть в ' + Col + ', ' + row2 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard1

                // Result:=TVClueHint.Create(Self,'Карта '+SCard2+' не может быть в этой клетке, так как по указанному правилу она находится в одном столбце с картой '+SCard1,Index,Col,FPMainVClues^[Index].Card2,haRemoveVariant);
                // Result.AddHighlightedCell(Col,FPMainVClues^[Index].Card1 div 6);
                // Exit
            } else
            if (Direct && (P2 === 'cpIsHere') && (P1 === 'cpCanBe')) {
                alert('Карта ' + SCard1 + ' должна быть в ' + Col + ', ' + row1 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard2);
                return 'Карта ' + SCard1 + ' должна быть в ' + Col + ', ' + row1 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard2
            } else
            if (!Direct && (P2 === 'cpCanNotBe') && (P1 === 'cpCanBe')) {
                alert('Карта ' + SCard1 + ' не может быть в ' + Col + ', ' + row1 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard2);
                return 'Карта ' + SCard1 + ' не может быть в ' + Col + ', ' + row1 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard2
            }
        }
    } else {
        if (Direct && (FPMainVClues[Index].ClueType === 'vcNotTogether')) {
            for (Col = 0; Col < 6; Col++) {
                P1 = CheckPossibility(Col, FPMainVClues[Index].Card1);
                P2 = CheckPossibility(Col, FPMainVClues[Index].Card2);
                if ((P1 === 'cpIsHere') && (P2 === 'cpCanBe')) {
                    alert('Карта ' + SCard2 + ' не может быть в ' + Col + ', ' + row2 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard1);
                    return 'Карта ' + SCard2 + ' не может быть в ' + Col + ', ' + row2 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard1
                } else {
                    if ((P2 === 'cpIsHere') && (P1 === 'cpCanBe')) {
                        alert('Карта ' + SCard1 + ' не может быть в ' + Col + ', ' + row1 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard2);
                        return 'Карта ' + SCard1 + ' не может быть в ' + Col + ', ' + row1 + ' клетке, так как по правилу' + Index + ' она находится в одном столбце с картой ' + SCard2
                    }
                }
            }
        }
    }
    return
}

function CheckHClueNextTo(Index, Direct) {
    var Col;
    var PC, PL, PR;
    var SCard1 = FPMainVClues[Index].Card1 % 6;
    var SCard2 = FPMainVClues[Index].Card2 % 6;
    var row1 = div(FPMainVClues[Index].Card1, 6);
    var row2 = div(FPMainVClues[Index].Card2, 6);
    for (Col = 0; Col < 6; Col++) {
        PC = CheckPossibility(Col, FPMainHClues[Index].Card1);
        PL = CheckPossibility(Col - 1, FPMainHClues[Index].Card2);
        PR = CheckPossibility(Col + 1, FPMainHClues[Index].Card2);
        if (Direct && PC === 'cpIsHere') {
            if (PL === 'cpCanBe' && PR === 'cpCannotBe') {
                var q = Col - 1;
                alert('Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ' , так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а справа от ' + SCard1 + ' её быть не может');
                return 'Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ' , так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а справа от ' + SCard1 + ' её быть не может'
            } else
            if (PR === 'cpCanBe' && PL === 'cpCannotBe') {
                var q = Col + 1;
                alert('Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ' , так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а слева от ' + SCard1 + ' её быть не может');
                return 'Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ' , так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а слева от ' + SCard1 + ' её быть не может'
            } else
            if (!Direct && PC === 'cpCanBe' && PL === 'cpCannotBe' && PR === 'cpCannotBe') {
                alert('Карта ' + SCard1 + ' не может быть в клетке ' + Col + ', ' + row2 + ' , так как по указанному правилу в одном из соседних с ней столбцов должна быть карта ' + SCard2);
                return 'Карта ' + SCard1 + ' не может быть в клетке ' + Col + ', ' + row2 + ' , так как по указанному правилу в одном из соседних с ней столбцов должна быть карта ' + SCard2;
            }
        }
        PC = CheckPossibility(Col, FPMainHClues[Index].Card2);
        PL = CheckPossibility(Col - 1, FPMainHClues[Index].Card1);
        PR = CheckPossibility(Col + 1, FPMainHClues[Index].Card1);
        if (Direct && PC === 'cpIsHere') {
            if (PL === 'cpCanBe' && PR === 'cpCannotBe') {
                var q = Col - 1;
                alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ' , так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard2 + ', а справа от ' + SCard2 + ' её быть не может');
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ' , так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard2 + ', а справа от ' + SCard2 + ' её быть не может'
            } else
            if (PR === 'cpCanBe' && PL === 'cpCannotBe') {
                var q = Col + 1;
                alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ' , так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard2 + ', а слева от ' + SCard2 + ' её быть не может');
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ' , так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard2 + ', а слева от ' + SCard2 + ' её быть не может'
            }
        } else
        if (!Direct && PC === 'cpCanBe' && PL === 'cpCannotBe' && PR === 'cpCannotBe') {
            alert('Карта ' + SCard2 + ' не может быть в клетке  ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' в одном из соседних с ней столбцов должна быть карта ' + SCard1);
            return 'Карта ' + SCard2 + ' не может быть в клетке  ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' в одном из соседних с ней столбцов должна быть карта ' + SCard1;
        }
    }
    return
}

function CheckHClueNotNextTo(Index, Direct) {
    var Col, PC, PL, PR;
    var SCard1 = FPMainVClues[Index].Card1 % 6;
    var SCard2 = FPMainVClues[Index].Card2 % 6;
    var row1 = div(FPMainVClues[Index].Card1, 6);
    var row2 = div(FPMainVClues[Index].Card2, 6);
    if (Direct) {
        for (Col = 0; Col < 6; Col++) {
            PC = CheckPossibility(Col, FPMainHClues[Index].Card1);
            PL = CheckPossibility(Col - 1, FPMainHClues[Index].Card2);
            PR = CheckPossibility(Col + 1, FPMainHClues[Index].Card2);
            if (PC === 'cpIsHere' && PL === 'cpCanBe') {
                var q = Col - 1;
                alert('Карта ' + SCard2 + ' не может быть в  клетке ' + q + ', ' + row2 + ', так по правилу ' + Index + ' она не должна находится в столбце, соседнем с картой ' + SCard1);
                return 'Карта ' + SCard2 + ' не может быть в  клетке ' + q + ', ' + row2 + ', так по правилу ' + Index + ' она не должна находится в столбце, соседнем с картой ' + SCard1;
            }
            if (PC === 'cpIsHere' && PR === 'cpCanBe') {
                var q = Col + 1;
                alert('Карта ' + SCard2 + ' не может быть в  клетке ' + q + ', ' + row2 + ', так по правилу ' + Index + ' она не должна находится в столбце, соседнем с картой ' + SCard1);
                return 'Карта ' + SCard2 + ' не может быть в  клетке ' + q + ', ' + row2 + ', так по правилу ' + Index + ' она не должна находится в столбце, соседнем с картой ' + SCard1;
            }
            PC = CheckPossibility(Col, FPMainHClues[Index].Card2);
            PL = CheckPossibility(Col - 1, FPMainHClues[Index].Card1);
            PR = CheckPossibility(Col + 1, FPMainHClues[Index].Card1);
            if (PC === 'cpIsHere' && PL === 'cpCanBe') {
                var q = Col - 1;
                alert('Карта ' + SCard1 + ' не может быть в  клетке ' + q + ', ' + row1 + ', так по правилу ' + Index + ' она не должна находится в столбце, соседнем с картой ' + SCard2);
                return 'Карта ' + SCard1 + ' не может быть в  клетке ' + q + ', ' + row1 + ', так по правилу ' + Index + ' она не должна находится в столбце, соседнем с картой ' + SCard2;
            }
            if (PC === 'cpIsHere' && PR === 'cpCanBe') {
                var q = Col + 1;
                alert('Карта ' + SCard1 + ' не может быть в  клетке ' + q + ', ' + row1 + ', так по правилу ' + Index + ' она не должна находится в столбце, соседнем с картой ' + SCard2);
                return 'Карта ' + SCard1 + ' не может быть в  клетке ' + q + ', ' + row1 + ', так по правилу ' + Index + ' она не должна находится в столбце, соседнем с картой ' + SCard2;
            }
        }
    }
    return
}

function CheckHClueTriple(Index, Direct) {
    var Col, PC, PL1, PR1, PL2, PR2, PL3, PR3;
    var SCard1 = FPMainVClues[Index].Card1 % 6;
    var SCard2 = FPMainVClues[Index].Card2 % 6;
    var SCard3 = FPMainVClues[Index].Card3 % 6;
    var row1 = div(FPMainVClues[Index].Card1, 6);
    var row2 = div(FPMainVClues[Index].Card2, 6);
    var row3 = div(FPMainVClues[Index].Card3, 6);
    for (Col = 0; Col < 6; Col++) {
        PC = CheckPossibility(Col, FPMainHClues[Index].Card2);
        PL1 = CheckPossibility(Col - 1, FPMainHClues[Index].Card1);
        PR1 = CheckPossibility(Col + 1, FPMainHClues[Index].Card1);
        PL3 = CheckPossibility(Col - 1, FPMainHClues[Index].Card3);
        PR3 = CheckPossibility(Col + 1, FPMainHClues[Index].Card3);
        if (Direct && PC === 'cpIsHere') {
            if (PL1 === 'cpIsHere' && PR3 === 'cpCanBe') {
                var q = Col + 1;
                alert('Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' карта ' + SCard2 + ' находится между ' + SCard1 + ' и ' + SCard3 + ', а ' + SCard1 + ' уже находится слева от ' + SCard2);
                return 'Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' карта ' + SCard2 + ' находится между ' + SCard1 + ' и ' + SCard3 + ', а ' + SCard1 + ' уже находится слева от ' + SCard2;
            }
            if (PR1 === 'cpIsHere' && PL3 === 'cpCanBe') {
                var q = Col - 1;
                alert('Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' карта ' + SCard2 + ' находится между ' + SCard1 + ' и ' + SCard3 + ', а ' + SCard1 + ' уже находится справа от ' + SCard2);
                return 'Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' карта ' + SCard2 + ' находится между ' + SCard1 + ' и ' + SCard3 + ', а ' + SCard1 + ' уже находится справа от ' + SCard2;
            }
            if (PL3 === 'cpIsHere' && PR1 === 'cpCanBe') {
                var q = Col + 1;
                alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' карта ' + SCard2 + ' находится между ' + SCard1 + ' и ' + SCard3 + ', а ' + SCard3 + ' уже находится слева от ' + SCard2);
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' карта ' + SCard2 + ' находится между ' + SCard1 + ' и ' + SCard3 + ', а ' + SCard3 + ' уже находится слева от ' + SCard2;
            }
            if (PR3 === 'cpIsHere' && PL1 === 'cpCanBe') {
                var q = Col - 1;
                alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' карта ' + SCard2 + ' находится между ' + SCard1 + ' и ' + SCard3 + ', а ' + SCard3 + ' уже находится справа от ' + SCard2);
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' карта ' + SCard2 + ' находится между ' + SCard1 + ' и ' + SCard3 + ', а ' + SCard3 + ' уже находится справа от ' + SCard2;
            }
            if (PL1 === 'cpCanBe' && PR1 === 'cpCannotBe') {
                var q = Col - 1;
                alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится рядом с картой ' + SCard2 + ', а справа от ' + SCard2 + ' она быть не может');
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится рядом с картой ' + SCard2 + ', а справа от ' + SCard2 + ' она быть не может'
            }
            if (PL1 === 'cpCannotBe' && PR1 === 'cpCanBe') {
                var q = Col + 1;
                alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится рядом с картой ' + SCard2 + ', а слева от ' + SCard2 + ' она быть не может');
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится рядом с картой ' + SCard2 + ', а слева от ' + SCard2 + ' она быть не может'
            }
            if (PL3 === 'cpCanBe' && PR3 === 'cpCannotBe') {
                var q = Col - 1;
                alert('Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится рядом с картой ' + SCard2 + ', а справа от ' + SCard2 + ' она быть не может');
                return 'Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится рядом с картой ' + SCard2 + ', а справа от ' + SCard2 + ' она быть не может';
            }
            if (PL3 === 'cpCannotBe' && PR3 === 'cpCanBe') {
                var q = Col + 1;
                alert('Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится рядом с картой ' + SCard2 + ', а слева от ' + SCard2 + ' она быть не может');
                return 'Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится рядом с картой ' + SCard2 + ', а слева от ' + SCard2 + ' она быть не может';
            }
        } else if (PC === 'cpCanBe') {
            if (!Direct && PL1 === 'cpCannotBe' && PL3 === 'cpCannotBe') {
                var q = Col;
                alert('Карта ' + SCard2 + ' не может быть в клетке  ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3 + ', а слева не может быть ни ' + SCard1 + ', ни ' + SCard3);
                return 'Карта ' + SCard2 + ' не может быть в клетке  ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3 + ', а слева не может быть ни ' + SCard1 + ', ни ' + SCard3;
            }
            if (!Direct && PR1 === 'cpCannotBe' && PR3 === 'cpCannotBe') {
                var q = Col;
                alert('Карта ' + SCard2 + ' не может быть в клетке  ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3 + ', а справа не может быть ни ' + SCard1 + ', ни ' + SCard3);
                return 'Карта ' + SCard2 + ' не может быть в клетке  ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3 + ', а справа не может быть ни ' + SCard1 + ', ни ' + SCard3;
            }
            if (!Direct && PL1 === 'cpCannotBe' && PR1 === 'cpCannotBe') {
                var q = Col;
                alert('Карта ' + SCard2 + ' не может быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3 + ', а карты ' + SCard1 + ' нет ни справа, ни слева');
                return 'Карта ' + SCard2 + ' не может быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3 + ', а карты ' + SCard1 + ' нет ни справа, ни слева';
            }
            if (!Direct && PL3 === 'cpCannotBe' && PR3 === 'cpCannotBe') {
                var q = Col;
                alert('Карта ' + SCard2 + ' не может быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3 + ', а карты ' + SCard3 + ' нет ни справа, ни слева');
                return 'Карта ' + SCard2 + ' не может быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3 + ', а карты ' + SCard3 + ' нет ни справа, ни слева';
            }
            if (Direct && PL1 === 'cpIsHere' && PR3 === 'cpIsHere') {
                var q = Col;
                alert('Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3);
                return 'Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3;
            }
            if (Direct && PL3 === 'cpIsHere' && PR1 === 'cpIsHere') {
                var q = Col;
                alert('Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3);
                return 'Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится между ' + SCard1 + ' и ' + SCard3;
            }
        }
        PC = CheckPossibility(Col, FPMainHClues[Index].Card1);
        PL2 = CheckPossibility(Col - 1, FPMainHClues[Index].Card2);
        PR2 = CheckPossibility(Col + 1, FPMainHClues[Index].Card2);
        PL3 = CheckPossibility(Col - 2, FPMainHClues[Index].Card3);
        PR3 = CheckPossibility(Col + 2, FPMainHClues[Index].Card3);
        if (Direct && PC === 'cpIsHere') {
            if (PL2 === 'cpCanBe' && PR2 === 'cpCannotBe') {
                var q = Col - 1;
                alert('Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а справа от ' + SCard1 + ' её быть не может');
                return 'Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а справа от ' + SCard1 + ' её быть не может';
            }
            if (PL2 === 'cpCannotBe' && PR2 === 'cpCanBe') {
                var q = Col + 1;
                alert('Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а слева от ' + SCard1 + ' её быть не может');
                return 'Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а слева от ' + SCard1 + ' её быть не может';
            }
            if (PL3 === 'cpCanBe' && PR3 === 'cpCannotBe') {
                var q = Col - 2;
                alert('Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а справа от ' + SCard1 + ' её быть не может');
                return 'Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а справа от ' + SCard1 + ' её быть не может';
            }
            if (PL3 === 'cpCannotBe' && PR3 === 'cpCanBe') {
                var q = Col + 2;
                alert('Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а слева от ' + SCard1 + ' её быть не может');
                return 'Карта ' + SCard3 + ' должна быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard1 + ', а слева от ' + SCard1 + ' её быть не может';
            }
        } else if (!Direct && PC === 'cpCanBe') {
            if (PL2 === 'cpCannotBe' && PR2 === 'cpCannotBe') {
                var q = Col;
                alert('Карта ' + SCard1 + ' не может быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' в одном из соседних с ней столбцов должна быть карта ' + SCard2);
                return 'Карта ' + SCard1 + ' не может быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' в одном из соседних с ней столбцов должна быть карта ' + SCard2;
            }
            if (PL3 === 'cpCannotBe' && PR3 === 'cpCannotBe') {
                alert('Карта ' + SCard1 + ' не может быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' через один столбец от неё должна быть карта ' + SCard3);
                return 'Карта ' + SCard1 + ' не может быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' через один столбец от неё должна быть карта ' + SCard3;
            }
        }
        PC = CheckPossibility(Col, FPMainHClues[Index].Card3);
        PL3 = CheckPossibility(Col - 2, FPMainHClues[Index].Card1);
        PR3 = CheckPossibility(Col + 2, FPMainHClues[Index].Card1);
        if (Direct && PC === 'cpIsHere') {
            if (PL2 === 'cpCanBe' && PR2 === 'cpCannotBe') {
                var q = Col - 1;
                alert('Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard3 + ', а справа от ' + SCard3 + ' её быть не может');
                return 'Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard3 + ', а справа от ' + SCard3 + ' её быть не может';
            }
            if (PL2 === 'cpCannotBe' && PR2 === 'cpCanBe') {
                var q = Col + 1;
                alert('Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard3 + ', а слева от ' + SCard3 + ' её быть не может');
                return 'Карта ' + SCard2 + ' должна быть в клетке ' + q + ', ' + row2 + ', так как по правилу ' + Index + ' она находится в столбце, соседнем с картой ' + SCard3 + ', а слева от ' + SCard3 + ' её быть не может';
            }
            if (PL3 === 'cpCanBe' && PR3 === 'cpCannotBe') {
                var q = Col - 2;
                alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard3 + ', а справа от ' + SCard3 + ' её быть не может');
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard3 + ', а справа от ' + SCard3 + ' её быть не может';
            }
            if (PL3 === 'cpCannotBe' && PR3 === 'cpCanBe') {
                var q = Col + 2;
                alert('Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard3 + ', а слева от ' + SCard3 + ' её быть не может');
                return 'Карта ' + SCard1 + ' должна быть в клетке ' + q + ', ' + row1 + ', так как по правилу ' + Index + ' она находится через один столбец от карты ' + SCard3 + ', а слева от ' + SCard3 + ' её быть не может';
            }
        } else
        if (!Direct && PC === 'cpCanBe') {
            if (PL2 === 'cpCannotBe' && PR2 === 'cpCannotBe') {
                var q = Col;
                alert('Карта ' + SCard3 + ' не может быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' в одном из соседних с ней столбцов должна быть карта ' + SCard2);
                return 'Карта ' + SCard3 + ' не может быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' в одном из соседних с ней столбцов должна быть карта ' + SCard2;
            }
            if (PL3 === 'cpCannotBe' && PR3 === 'cpCannotBe') {
                var q = Col;
                alert('Карта ' + SCard3 + ' не может быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' через один столбец от неё должна быть карта ' + SCard1);
                return 'Карта ' + SCard3 + ' не может быть в клетке ' + q + ', ' + row3 + ', так как по правилу ' + Index + ' через один столбец от неё должна быть карта ' + SCard1;
            }
        }
    }
    return
}

function CheckHClueNotTriple(Index, Direct) {
    var Col, PC, PL1, PR1, PL2, PR2, PL3, PR3;

    var SCard1 = FPMainVClues[Index].Card1 % 6;
    var SCard2 = FPMainVClues[Index].Card2 % 6;
    var SCard3 = FPMainVClues[Index].Card3 % 6;
    var row1 = div(FPMainVClues[Index].Card1, 6);
    var row2 = div(FPMainVClues[Index].Card2, 6);
    var row3 = div(FPMainVClues[Index].Card3, 6);

    return
}

function CheckHClueOrder(Index, Direct) {

}

function CheckHClue(Index, Direct) {
    //var Result;
    switch (FPMainHClues[Index].ClueType) {
        case 'hcNextTo':
            {
                console.log(Index);
                return CheckHClueNextTo(Index, Direct);
                break;
            }
        case 'hcNotNextTo':
            {
                return CheckHClueNotNextTo(Index, Direct);
                break;
            }
        case 'hcTriple':
            {
                return CheckHClueTriple(Index, Direct);
                break;
            }
        case 'hcNotTriple':
            {
                return CheckHClueNotTriple(Index, Direct);
                break;
            }
        case 'hcOrder':
            {
                return CheckHClueOrder(Index, Direct);
                break;
            }
    }
    return
}

function FindHint() {
        var Index;

        var Result = CheckSimpleValues();
        Index = 0;
        while (!Result && Index < 20) {

            Result = CheckVClue(Index, true);
            Index++;
        }
        Index = 0;
        while (!Result && (Index < 25)) {
            Result = CheckHClue(Index, true);
            Inc(Index)
            end;
        }
            // Index:=0;
            // while (Result=nil) and (Index<=High(TVClues)) do
            //  begin
            //   Result:=CheckVClue(Index,False);
            //   Inc(Index)
            //  end;
            // Index:=0;
            // while (Result=nil) and (Index<=High(THClues)) do
            //  begin
            //   Result:=CheckHClue(Index,False);
            //   Inc(Index)
            //  end
        }