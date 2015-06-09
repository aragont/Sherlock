/* jshint browser: true */
/* global console */
/**@module Main*/
/**
 * номер таймера
 * @type {Number}
 */
var myVar = 0;
/**
 * отрисовывает игровое поле при запуске окна
 *  @func module:Main#onload
 */
window.onload = function() {
    var temp = 0;
    for (var i = 0; i < 6; i++)
        for (var j = 0; j < 6; j++) {
            $('#s' + j + i + ' > div').css('background', 'url(BasicBig.bmp)' + temp + 'px 0px');
            temp -= 60;
        }
};

/**
 * отрисовка уровня игры
 * @func module:Main#send_level
 */
send_level = function() {
    $('.window_info_level')[0].innerHTML = 'Уровень: ' + $('.number_level >input')[0].value;
    $('.input ').css('display', 'none');
};

/**
 * отрисовка блока для ввода номера уровня
 * @func module:Main#change_level
 */
change_level = function() {
    $('.number_level').css('display', 'block');
};

/**
 * отрисовка имени игрока
 * @func module:Main#send_name
 */
send_name = function() {
    $('.sherlock_name')[0].innerHTML = $('.set_name >input')[0].value + '<p></p>';
    $('.input ').css('display', 'none');
};

/**
 * показывает блок для ввода имени игрока
 * @func module:Main#show_set_name
 */
show_set_name = function() {
    $('.set_name').css('display', 'block');
};

/**
 * Отрисовывает карту, которую выбрал игрок в качестве заполнения поля
 * @param  {Int} col  колонка, в которой выбрана карта
 * @param  {Int} row  строка, в которой выбрана карта
 * @param  {Int} card номер карты.
 * @func module:Main#draw_big
 */
draw_big = function(col, row, card) {
    if (choose_big(col, row, card)) {
        $('#s' + col + row).append(' <div class="sherlock_pict"> </div>');
        var was = [];
        add_step({
            'col': col,
            'row': row,
            'card': card,
            'type': 'big',
            'act': 'add'
        });
        $('#s' + col + row + '> table').remove();
        var w = card * 60 + row * 60 * 6;
        $('#s' + col + row + '>div').css('background', 'url(BasicBig.bmp) -' + w + 'px 0px');
        for (var r = 0; r < 6; r++) {
            $('#' + row + r + card + '> span').css('background', 'none');
        }
    }
};

/**
 * Отрисовывает варианты для заполнения поля
 * @param  {Int} i  колонка, в которой выбрана карта
 * @param  {Int} j  строка, в которой выбрана карта
 * @param  {Int} Variants массив вариантов
 * @func module:Main#draw_variants
 */
draw_variants = function(i, j, Variants) {
    var count = 0;
    var table = '<table><tr>';
    for (var k = 0; k < 6; k++) {
        if (count === 3) table += '</tr><tr>';
        var w = -k * 30 - j * 180;
        if (Variants.indexOf(k) >= 0) {
            table += '<td class = "small" id = ' + j + '' + i + '' + k + '><span style = "background-image:url(BasicSmall.bmp);background-position:' + w + 'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span> </td>';
        } else table += '<td class = "small" id = ' + j + '' + i + '' + k + '><span  onclick = "td_click(this.parentNode.id);"></span> </td>';
        count++;
    }
    table += '</tr></table>';
    $('#s' + i + j + '>div').remove();
    $('#s' + i + j).append(table);
};

/**
 * Отрисовывает все игровое поле
 * @func module:Main#draw_field
 */
draw_field = function() {
    for (var i = 0; i < 6; i++)
        for (var j = 0; j < 6; j++) {
            if (!FField[i][j].Initial) {
                var count = 0;
                var table = '<table><tr>';
                for (var k = 0; k < 6; k++) {
                    if (count === 3) table += '</tr><tr>';
                    var w = -k * 30 - j * 180;
                    if (FField[i][j].Variants.indexOf(k) >= 0) {
                        table += '<td class = "small" id = ' + j + '' + i + '' + k + '><span style = "background-image:url(BasicSmall.bmp);background-position:' + w + 'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span> </td>';
                    } else table += '<td class = "small" id = ' + j + '' + i + '' + k + '><span  onclick = "td_click(this.parentNode.id);"></span> </td>';
                    count++;
                }
                table += '</tr></table>';
                $('#s' + i + j + '>div').remove();
                $('#s' + i + j + '>table').remove();
                $('#s' + i + j).append(table);
            } else {
                $('#s' + i + j + '>table').remove();
                if (!($('#s' + i + j + '>div').length)) $('#s' + i + j).append('<div class="sherlock_pict" > </div>');
                $('#s' + i + j + '>div').css('background', 'url(BasicBig.bmp) -' + FField[i][j].UserValue * 60 + 'px 0px');
            }
        }
};

/**
 * таймер игры
 *@func module:Main#Sherlock_Timer
 */
Sherlock_Timer = function() {
    var time = $('.sherlock_timer')[0].innerHTML;
    var time_value = time.split(':');
    time_value[2]++;
    for (var i = 0; i < 3; i++) time_value[i] = parseInt(time_value[i]);
    if (time_value[2] === 60) {
        time_value[1]++;
        time_value[2] = 0;
    }
    if (time_value[1] === 60) {
        time_value[0]++;
        time_value[1] = 0;
    }
    $('.sherlock_timer')[0].innerHTML = correct_length(time_value[0]) + ":" + correct_length(time_value[1]) + ":" + correct_length(time_value[2]);

};

/**
 * корректирует длину строки, до двух символов. Используется для таймера, чтобы секунды и минуты всегда отображались двумя цифрами
 * @param  {Int} data цифра, которую нужно откорректировать
 * @return {String}      полученная строка
 * @func module:Main#correct_length
 */
correct_length = function(data) {
    if (data <= 9) return '0' + data;
    else return '' + data;
};

/**
 * Начало новой игры
 * @param  {Int} level уровень
 * @func module:Main#start_new_game
 */
start_new_game = function(level) {
    $('.sherlock_timer')[0].innerHTML = '00:00:00';
    if (myVar) clearInterval(myVar); //(myVar);
    myVar = setInterval(function() {
        Sherlock_Timer();
    }, 1000);
    var l = $('.window_info_level')[0].innerHTML.replace('Уровень: ', '');
    l = parseInt(l);
    l += level;
    $('.window_info_level')[0].innerHTML = 'Уровень: ' + l;
    InitLevel(l);
    document.querySelector('.window_buttons').classList.add('Sherlock_state_game');
    draw_field();
    $('body').on('contextmenu', '.Sherlock_game_main', function(e) {
        return false;
    });
    $('.down_tips>div>table').remove();
    $('.left_tips>div>table').remove();
    var w, v, tips, e;
    for (var i = 0; i < 21; i++) {
        w = FMainVClues[i].Card1 * (-60);
        v = FMainVClues[i].Card2 * (-60);
        tips = '<table><tr><td class = "down-tip"><span style = "background-image:url(BasicBig.bmp);background-position: ' + w + 'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></td></tr><tr><td class="down-tip"><span style = "background-image:url(BasicBig.bmp);background-position:' + v + 'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></td></tr></table';
        $('#down_tips_' + i).append(tips);
    }
    for (i = 0; i < 24; i++) {
        w = FMainHClues[i].Card1 * (-60);
        v = FMainHClues[i].Card2 * (-60);
        e = FMainHClues[i].Card3 * (-60);
        if (FMainHClues[i].ClueType === 'hcTriple') {
            tips = '<table><tr><td class = "down-tip"><span style = "background-image:url(BasicBig.bmp);background-position: ' + w + 'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"><span style = "background-image:url(BasicBig.bmp);background-position: -2340px 0px;opacity:0.5" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></span></td><td class="down-tip"><span style = "background-image:url(BasicBig.bmp);background-position:' + v + 'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"><span style = "background-image:url(BasicBig.bmp);background-position: -2400px 0px;opacity:0.5" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></span></td><td class="down-tip"><span style = "background-image:url(BasicBig.bmp);background-position:' + e + 'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"><span style = "background-image:url(BasicBig.bmp);background-position: -2460px 0px;opacity:0.5" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></span></td></tr></table';
        } else
        if (FMainHClues[i].ClueType === 'hcNotTriple') {
            tips = '<table><tr><td class = "down-tip"><span style = "background-image:url(BasicBig.bmp);background-position: ' + w + 'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"><span style = "background-image:url(BasicBig.bmp);background-position: -2340px 0px;opacity:0.5" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></span></td><td class="down-tip"><span style = "background-image:url(BasicBig.bmp);background-position:' + v + 'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"><span style = "background-image:url(BasicBig.bmp);background-position: -2280px 0px;opacity:0.5" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"><span style = "background-image:url(BasicBig.bmp);background-position: -2400px 0px;opacity:0.5" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></span></span></td><td class="down-tip"><span style = "background-image:url(BasicBig.bmp);background-position:' + e + 'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"><span style = "background-image:url(BasicBig.bmp);background-position: -2460px 0px;opacity:0.5" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></span></td></tr></table';
        } else
        if (FMainHClues[i].ClueType === 'hcNotNextTo') {
            tips = '<table><tr><td class = "down-tip"><span style = "background-image:url(BasicBig.bmp);background-position: ' + w + 'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></td><td class="down-tip"><span style = "background-image:url(BasicBig.bmp);background-position:' + v + 'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"><span style = "background-image:url(BasicBig.bmp);background-position: -2280px 0px;opacity:0.5" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></span></td><td class="down-tip"><span style = "background-image:url(BasicBig.bmp);background-position:' + e + 'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></td></tr></table';
        } else tips = '<table><tr><td class = "down-tip"><span style = "background-image:url(BasicBig.bmp);background-position: ' + w + 'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></td><td class="down-tip"><span style = "background-image:url(BasicBig.bmp);background-position:' + v + 'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></td><td class="down-tip"><span style = "background-image:url(BasicBig.bmp);background-position:' + e + 'px 0px" onclick = "td_click(this.parentNode.id);" oncontextmenu = "td_right_click(this.parentNode.id);"></span></td></tr></table';
        $('#left_tip_' + i).append(tips);
    }
};

/**
 * правый щелчок мышки на варианте заполнения поля. Щелчок на уже убранном варианте восстанавливает его, на существующем - убирает
 * @param  {Int} data трехзначное число: первая цифра - строка, вторая - колонка, третья - номер варианта
 * @func module:Main#td_right_click
 */
td_right_click = function(data) {
    if (data!=='') {
        var col, row;
        while (data.length < 3) data = '0' + data;
        if ($('#' + data + '> span').css('background-image') !== 'none') {
            $('#' + data + '> span').css('background', 'none');
            col = div(data, 10) % 10;
            row = div(data, 100);
            add_step({
                'col': col,
                'row': row,
                'card': data % 10,
                'type': 'small',
                'act': 'del'
            });
            delete_variants(col, row, data % 10);
            if (FField[col][row].Variants.length === 1) {
                draw_big(col, row, FField[col][row].Variants[0]);
            }
        } else {
            var w = (data % 10) * (-30) - div(data, 100) * 180;
            col = div(data, 10) % 10;
            row = div(data, 100);
            add_step({
                'col': col,
                'row': row,
                'card': data % 10,
                'type': 'small',
                'act': 'add'
            });
            add_variants(col, row, data % 10);
            $('#' + data + '> span').css('background-image', 'url(BasicSmall.bmp)');
            $('#' + data + '> span').css('background-position', w + 'px 0px');
        }
    }
};

/**
 * левый щелчок мыши. Выбирает данный вариант.
 * @param  {Int} data трехзначное число: первая цифра - строка, вторая - колонка, третья - номер варианта
 * @func module:Main#td_click
 */
td_click = function(data) {
    if (data) {
        var k = data % 10;
        data = div(data, 10);
        data = (data % 10) * 10 + div(data, 10);
        if (data < 10) data = '0' + data;
        draw_big(div(data, 10), data % 10, k);
    }
};

/**
 * показать следующую подсказку
 * @func module:Main#next_hint
 */
next_hint = function() {
    var Hint = '';
    var I;
    Hint = CheckPresence();
    I = 0;
    while (!Hint && I < 24) {
        Hint = CheckHClueError(I);
        I++;
    }
    I = 0;
    while (!Hint && I < 20) {
        Hint = CheckVClueError(I);
        I++;
    }
    if (!Hint) Hint = FindHint(true);
    draw_field();
};