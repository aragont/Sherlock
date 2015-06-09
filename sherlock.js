/* jshint browser: true */
/* global console */

/** @module Sherlock */

/**
 * Карта уровней
 * @type {Array}
 */
var FLevelMap = [];

/**
 * Основной массив игры. Каждый элемент - клетка игрового поля. Все шаги игрока изменяют этот массив. При изменении массива, игроку отрисовывается новое поле
 * @type {Array}
 */
var FField = [];

/**
 * Массив горизонтальных ключнй
 * @type {Array}
 */
var FMainHClues = [];

/**
 * Массив вертикальных ключей
 * @type {Array}
 */
var FMainVClues = [];

/**
 * массив истории ходов
 * @type {Array}
 */
var steps_history = [];

/**
 * Правильно и заполнено поле при текущей раскладке карт
 * @type {Boolean}
 */
var error_flag = true;

/**
 * Определили местоположение карты
 * @param  {Int} col  колонка, в которой расположена карта
 * @param  {Int} row  строка, в которой расположена карта
 * @param  {Int} card выбранная карта
 * @return {True|False}      Возможно ли расположение заданной карты в данной клетке
 * @func module:Sherlock#choose_big
 */
function choose_big(col, row, card) {
    if (FField[col][row].Variants.indexOf(card) !== -1) {
        FField[col][row].UserValue = card + 6 * row;
        FField[col][row].Initial = true;
        if (CheckCorrectness()) alert("You are WIN!");
        return true;
    }
    return false;
}

/**
 * добавление хода в историю ходов
 * @param {obj} data описание шага
 * @param {Int} data.col колонка, в которой было совершен ход
 * @param {Int} data.row строка, в которой было совершен ход
 * @param {Int} data.card карта
 * @param {String} data.type тип карты (big, small)
 * @param {Int} data.act действие (add, delete)
 * @func module:Sherlock#add_step
 */
function add_step(data) {
    var was = [];
    var val = [];
    var obj = {
        'col': data.col,
        'row': data.row,
        'was': [],
        'var': [],
        'right': error_flag,
        'card': {
            'type': data.type,
            'action': data.act,
            'number': data.card,
        }
    };
    if (data.type == 'big') {
        obj.val = FField[data.col][data.row].Variants;
        for (var i = 0; i < 6; i++) {
            //console.log(FField[i][data.row].Variants, data.row, data.col);
            if (FField[i][data.row].Variants.indexOf(data.card) >= 0) {
                obj.was.push(i);
                FField[i][data.row].Variants.splice(FField[i][data.row].Variants.indexOf(data.card), 1);
            }
        }
        console.log(FField[data.col][data.row].CorrectValue!==data.card+data.row*6,FField[data.col][data.row].CorrectValue,data.card+data.row*6);
        if (FField[data.col][data.row].CorrectValue!==data.card+data.row*6) {
            error_flag = false;
        }
    } else {
        if (FField[data.col][data.row].CorrectValue===data.card+data.row*6) {
            error_flag = false;
        }
    }
    obj.right=error_flag;
    steps_history.push(obj);
}

/**
 * Производит откат ходов до верного расположения карт на поле
 * @func  module:Sherlock#remove_many
 */
function remove_many() {
    var c = 0;
    for (var i = steps_history.length - 1; i >= 0; i--)
        if (!steps_history[i].right) c++;
    for (i = 0; i < c; i++)
        remove_step();
    alert("Все верно");
}

/**
 * Производит откат одного хода
 * @func  module:Sherlock#remove_step
 */
function remove_step() {
    var h = steps_history.pop();
    if (h.card.type === 'small') {
        td_right_click((h.row * 100 + h.col * 10 + h.card.number).toString());
        steps_history.pop();
    } else {
        FField[h.col][h.row].Initial = false;
        FField[h.col][h.row].UserValue = 36;
        for (var i = 0; i < h.was.length; i++)
            add_variants(h.was[i], h.row, h.card.number);
    }
    draw_field();
    error_flag = true;
}

/**
 * Инициализация уровня. Заполнение всех необходимых для игры массивов
 * @param {Int} level уровень игры
 * @func  module:Sherlock#InitLevel
 */
function InitLevel(level) {
    var Col, Row, Card, I, Cnt, P, Variants = [],
        CType;
    var Found = [];
    var tempField = [];
    P = FLevelMap[level];
    for (Col = 0; Col < 6; Col++)
        for (Row = 0; Row < 6; Row++) {
            FField[Col][Row].Initial = false,
                FField[Col][Row].CorrectValue = 36,
                FField[Col][Row].UserValue = 36,
                FField[Col][Row].Variants = []; //jshint ignore:line
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
                for (var ii in Variants) {
                    FField[Col][Row].Variants[ii] = Variants[ii];
                }
    }
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

    }
    solve_game();
    for (i = 0; i < 6; i++)
        for (var j = 0; j < 6; j++) {
            FField[i][j].Initial = false;
            FField[i][j].CorrectValue = FField[i][j].UserValue;
            FField[i][j].UserValue = 36;
        }
    P = FLevelMap[level];

    count = P;
    for (i = 0; i < FBLevels[count]; i++) {
        P++;
        Col = FBLevels[P] % 6;
        Card = div(FBLevels[P], 6);
        Row = div(Card, 6);
        FField[Col][Row].Initial = true;
        FField[Col][Row].CorrectValue = Card;
        FField[Col][Row].UserValue = Card;
    }
    for (Row = 0; Row < 6; Row++) {
        Variants = [0, 1, 2, 3, 4, 5];
        for (Col = 0; Col < 6; Col++)
            if (FField[Col][Row].Initial) {
                Variants.splice(Variants.indexOf(FField[Col][Row].CorrectValue % 6), 1);
            }
        for (Col = 0; Col < 6; Col++)
            if (!FField[Col][Row].Initial)
                for (var ii in Variants) { //console.log(FField[Col][Row])
                    FField[Col][Row].Variants[ii] = Variants[ii];
                }
    }
    FPMainHClues = FMainHClues;
    FPMainVClues = FMainVClues;
    return true;
}

/**
 * Проверка возможности нахождения карты в данной клетке
 * @param {Int} Col - колонка, которую необходимо проверить
 * @param {Int} Card - карта
 * @returns {String} cpCanBe может быть расположена 
 * @returns {String} cpCannotBe не может быть расположена
 * @returns {String} cpIsHere уже расположена
 * @func  module:Sherlock#CheckPossibility
 */
function CheckPossibility(Col, Card) {
    var Row, Result = '';
    if ((Col < 0) || (Col > 5) || Card === 36) Result = 'cpCannotBe';
    else {
        Row = div(Card, 6);
        if (FField[Col][Row].UserValue === 36)
            if (FField[Col][Row].Variants.indexOf(Card % 6) >= 0)
                Result = 'cpCanBe';
            else
                Result = 'cpCannotBe';
        else
        if (Card === FField[Col][Row].UserValue) {
            Result = 'cpIsHere';
        } else
            Result = 'cpCannotBe';
    }
    return Result;
}

/**
 * проверяет корректность заполнения поля
 * @return {True|False} правильность заполнения поля
 * @func  module:Sherlock#CheckCorrectness
 */
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

/**
 * Удаляе вариант заполнения данной клетки
 * @param  {Int} col     колонка
 * @param  {Int} row     строка
 * @param  {Int} variant номер карты (0,,5)
 * @return {Int}         количество оставшихмя вариантов заполнения
 * @func   module:Sherlock#delete_variants
 */
function delete_variants(col, row, variant) {
    if (FField[col][row].Variants.indexOf(variant) >= 0) FField[col][row].Variants.splice(FField[col][row].Variants.indexOf(variant), 1);
    return FField[col][row].Variants.length;
}

/**
 * Добавляет вариант заполнения клетки
 * @param {Int} col     колонка
 * @param {Int} row     строка
 * @param {Int} variant карта (0..5)
 * @func   module:Sherlock#add_variants
 */
function add_variants(col, row, variant) {
    FField[col][row].Variants[FField[col][row].Variants.length] = variant;
}

/**
 * Создание массива, описываюзего поле
 * @func   module:Sherlock#CreateFField

 */
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

/**
 * решение игры. Заполняет массив FField вместо игрока
 * @func   module:Sherlock#solve_game
 */
function solve_game() {
    var i = 0;
    while (i < 300) {
        var Hint = '';
        var I;
        I = 0;
        Hint = FindHint(false);
        if (!Hint) break;
        for (var j = 0; j < 6; j++)
            for (var k = 0; k < 6; k++)
                if (FField[j][k].UserValue !== 36) {
                    FField[j][k].Initial = true;
                    FField[j][k].Variants = [];
                    for (var l = 0; l < 6; l++)
                        delete_variants(l, k, FField[j][k].UserValue % 6);
                }
        i++;
    }
    if (i === 300) alert('Error');
}


/**
 * первоначальная инициализация массивов
 * @func   module:Sherlock#FirstInitField
 */
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

/**
 * инициализация и заполнение массива с картой уровней
 * @func   module:Sherlock#CreateLevelMap
 */
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

/**
 * Целочисленной деление
 * @param  {Int} val Делитель
 * @param  {Int} by  Делимое
 * @example
 * //returns 5
 * div(11,2)
 * @example
 * //returns 4
 * div(111,23)
 * @return {Int}     Частное
 * @func   module:Sherlock#div
 */
function div(val, by) {
    return (val - val % by) / by;
}

CreateLevelMap();
CreateFField();
FirstInitField();