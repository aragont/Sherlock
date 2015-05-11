var FLevelMap = [];
var FField = {};
var THorizontalClue = {};
var FMainHClues = [];
var FMainVClues = [];
var FAlternateHClues = [];
var FAlternateVClues = [];
var FCompleted;
var steps_history = new Array();
var Level = 0; //??????????????????????/
var count_step=0;
var error_step=0;
var error_flag=true;
var count_big_card=0;
function DrawLevel() {
  //for (var i=0; i<6; i++)
    //for (var j=0; j<6; j++)
      //console.log (i, FField[0][i].CorrectValue,FField[1][i].CorrectValue,FField[2][i].CorrectValue,FField[3][i].CorrectValue,FField[4][i].CorrectValue,FField[5][i].CorrectValue);
}
function choose_big(col,row,card) {
  //console.log("choose", col,row,card);
  FField[col][row].UserValue = card+6*row;
  FField[col][row].Initial = true;
  for (var i=0; i<6; i++) {
    //if (col!==i) 
     delete_variants(i,row,card);
  }
  for (var i=0; i<FField[col][row].Variants.length; i++) {
    delete_variants(col, row, FField[col][row].Variants[i]);
  }
  count_big_card++;
  if (count_big_card==36) {
    var done=true;
    for (var i=0; i<6;i++)
      for (var j=0; j<6; j++)
        if (FField[i][j].UserValue!==FField[i][j].CorrectValue) done=false;
      if (done) console.log("WIN");
  }
}
function add_step(data){
  var was=[];
  if (data.type=='big') {
    val = FField[data.col][data.row].Variants;  
    for (var i=0; i<6;i++) {
      //Sconsole.log(FField[i][data.row].Variants, data.card, FField[i][data.row].Variants.indexOf(data.card.number));
      if (FField[i][data.row].Variants.indexOf(data.card)>=0) was.push(i);
    }
    //console.log(data.card+data.row*6,FField[data.col][data.row].CorrectValue);
     if (data.card+data.row*6!==FField[data.col][data.row].CorrectValue) {error_flag = false;} 
  } else {
    val=[]; 
    //console.log(FField[data.col][data.row], data);
   if (data.card+data.row*6===FField[data.col][data.row].CorrectValue) {error_flag=false;}
  }
  //console.log("was", was);
 // if (data.card.number+row*6!==FField[col][row].CorrectValue) error_flag = false;
  steps_history.push({
    'col':data.col,
    'row':data.row,
    'was':was,
    'right': error_flag,//???????????????????
    'card': {
      'type':data.type,
      'action':data.act,
      'number':data.card,
      'Variants': val
    }

  })
  count_step++;
}


function remove_steps(count) {
  //var step = count_step-1;
  if (!count) count = steps_history.length;
 // count++;
 //count--;
  console.log(count);
  //console.log(steps_history[count].right);
 var h = steps_history.pop();
 //console.log("hghhhhh", h);
  while ( count && !h.right) {
     console.log(h);
    if (h.card.type==='small') {
      //console.log(steps_history[count]);
      td_right_click((h.row*100+h.col*10+h.card.number).toString());
      steps_history.pop();
    } else {console.log('big');
      //draw_variants(h.col,h.row, h.card.Variants);

      FField[h.col][h.row].Initial=false;
      //add_variants( steps_history[step].col,  steps_history[step].row, )
      //console.log(steps_history[step].was.length);
      for (var i=0; i<h.was.length;i++)
       // td_right_click((steps_history[step].row*100+steps_history[step].was[i]*10+steps_history[step].card.number).toString());
        add_variants(h.was[i],h.row,h.card.number);
      }
      h = steps_history.pop();
    //step--;
    count--;
    //console.log(step, steps_history[step].right, count, step>-1 && !steps_history[step].right && count);
  }
 draw_field();
  //count_step=step+1;
  error_flag=true;
}
function InitLevel(level) {
  console.log(level);
level=0;
  var Col,Row,Card,I,Cnt,P, Variants = [], CType;
     var Found = [];
  //count_big_card=0;
   FCompleted=false;
   P=FLevelMap[level];
   //console.log(P);
   for (Col=0; Col<6; Col++) 
    for (Row=0 ; Row<6;Row++)
     {
      FField[Col][Row].Initial=false,
      FField[Col][Row].CorrectValue=36,
      FField[Col][Row].UserValue=36,
      FField[Col][Row].Variants=[]
    }
    var count = P;
    //console.log("dsdwq", FBLevels[count], count);
   for (var i=0; i<FBLevels[count]; i++) {//?????????????/
    //begin
     P++;
     Col=FBLevels[P] % 6;
     Card=div(FBLevels[P], 6);
     Row = div(Card,6);
    // console.log(Col, Row, Card);
     FField[Col][Row].Initial=true;
     FField[Col][Row].CorrectValue=Card;
     FField[Col][Row].UserValue=Card
    }
    count_big_card = count;
    P++;
   for (Row=0; Row<6; Row++){
     Variants = [0,1,2,3,4,5];
     for (Col=0; Col<6; Col++) 
      if (FField[Col][Row].Initial) {
        Variants.splice(Variants.indexOf(FField[Col][Row].CorrectValue % 6),1);
        //console.log(Col,Row, FField[Col][Row].CorrectValue % 6, FField[Col][Row].Initial,Variants);
      }
       //Variants=Variants-[FField[Col,Row].CorrectValue mod 6];
     for (Col=0; Col<6; Col++)
      if (!FField[Col][Row].Initial) 
       
       for (var ii in Variants) 

       FField[Col][Row].Variants[ii]=Variants[ii];
     
     
      }
      count=P;
       Cnt=FBLevels[count];
        P++;
        //console.log(Cnt);
   for (I=0; I<24;I++){
     if (I<Cnt) {
      //count=P;
       CType=div(FBLevels[P], 36);

       FMainHClues[I].Card1=FBLevels[P] % 36;
       switch (CType) { 
        case 0:
        case 2:
             if (CType=0) 
              FMainHClues[I].ClueType='hcNextTo';
             else
              FMainHClues[I].ClueType='hcNotNextTo';
             P++;
             FMainHClues[I].Card2=FBLevels[P];
             FMainHClues[I].Card3=FMainHClues[I].Card1;
            break;
        case 1:
        case 3:
        //console.log(CType, i);
             if (CType==1) 
              FMainHClues[I].ClueType='hcTriple';
             else
              FMainHClues[I].ClueType='hcNotTriple';//console.log('not');
          
             P++;
             FMainHClues[I].Card2=FBLevels[P];
             P++;
             FMainHClues[I].Card3=FBLevels[P]
            break
        case 4:
           FMainHClues[I].ClueType='hcOrder';
           FMainHClues[I].Card2=37;
           P++;
           FMainHClues[I].Card3=FBLevels[P];
          break;
       }
       P++;
      }
     else
      FMainHClues[I]={'ClueType': 'hcNone','Card1':36,'Card2':36,'Card3':36};
     FAlternateHClues[I]={'ClueType': 'hcNone','Card1':36,'Card2':36,'Card3':36};
    }
   Cnt=FBLevels[P];
   //console.log(Cnt);
   P++;
   for (I=0; I<21; I++) {//}    begin
     if (I<Cnt) {
      //console.dir(I);
      FMainVClues[I]={};
       if ((FBLevels[P] && 128)>=0){   //  console.log(I, P, FBLevels[P], FBLevels[P] && 128);
            FMainVClues[I].ClueType='vcNotTogether';}
       else
        {
          //console.log(I, P, FBLevels[P], FBLevels[P]&& 128);
        FMainVClues[I].ClueType='vcTogether';}
      // console.log(FBLevels[P]);
      // var q = FBLevels[P] && 127;
      // console.log(q);
       FMainVClues[I].Card1=FBLevels[P];
        P++;
       FMainVClues[I].Card2=FBLevels[P];
       P++;
      }
     else
    FMainVClues[I]={'ClueType':'vcNone','Card1':36,'Card2':36};
    FAlternateVClues[I]={'ClueType':'vcNone','Card1':36,'Card2':36};
    }
    if (1)  {
    
    // FillChar(Found,SizeOf(Found),0);
    Found = [];
     for (var Col=0 ; Col<6; Col++) 
      for (var Row=0; Row<6; Row++) 
       if (FField[Col][Row].Initial) 
        Found[FField[Col][Row].CorrectValue]=true;
    //  console.log(Found);
     for (var I=0; I<24; I++)
      if (FMainHClues[I].ClueType!='hcNone') 
      {
        Found[FMainHClues[I].Card1]=true;
        if (FMainHClues[I].Card2<36) 
         Found[FMainHClues[I].Card2]=true;
        Found[FMainHClues[I].Card3]=true
      }
           for (var I=0;I<20; I++)
      if (FMainVClues[I].ClueType!=='vcNone')
       {
        Found[FMainVClues[I].Card1]=true;
        Found[FMainVClues[I].Card2]=true
       }
     for (var I=0; I<36; I++)
      if (!Found[I])
       {
        if (Cnt>23)
         {
          //Application.MessageBox('Ñëèøêîì ìíîãî âåðòèêàëüíûõ êëþ÷åé. Îáðàòèòåñü ê ðàçðàáîò÷èêó','Îøèáêà',MB_OK or MB_IconStop);
          break;
         }
        FMainVClues[Cnt].ClueType='vcNoClues';
        FMainVClues[Cnt].Card1=I;
        FMainVClues[Cnt].Card2=36;
        Cnt++;
       }
    }
   FPMainHClues=FMainHClues;
   FPAlternateHClues=FAlternateHClues;
   FPMainVClues=FMainVClues;
   FPAlternateVClues=FAlternateVClues;
   //FMoveStack.InitStack(FAllowCluesUndo);
   //FieldCopy:=FField;
   //repeat
   // Hint:=FindHint;
   // Hint.Free
   //until Hint=nil;
  
   for (var Col=0; Col<6; Col++)
    for (var Row=0; Row<6; Row++)
     {
      //if (FField[Col,Row].UserValue=36) then
      // {
       // Application.MessageBox('Óðîâåíü íå èìååò ðåøåíèÿ. Îáðàòèòåñü ê ðàçðàáîò÷èêó','Îøèáêà',MB_OK or MB_IconStop);
        //exit
     //  }
      if (!FField[Col][Row].Initial)
       {
        FField[Col][Row].CorrectValue=FField[Col][Row].UserValue;
        FField[Col][Row].UserValue=36;
       // FField[Col][Row].Variants=FieldCopy[Col][Row].Variants
       }
     }
      //console.log(FField);
   //FCompleted:=True;
   //FMoveStack.InitStack(FAllowCluesUndo)
  }
   // end;
   // FPMainHClues:=@FMainHClues;
   // FPAlternateHClues:=@FAlternateHClues;
   // FPMainVClues:=@FMainVClues;
   // FPAlternateVClues:=@FAlternateVClues;
   // FMoveStack.InitStack(FAllowCluesUndo);
   // FieldCopy:=FField;
   // repeat
   //  Hint:=FindHint;
   //  Hint.Free
   // until Hint=nil;
   // for Col:=0 to 5 do
   //  for Row:=0 to 5 do
   //   begin
   //    if FField[Col,Row].UserValue=36 then
   //     begin
   //      Application.MessageBox('Óðîâåíü íå èìååò ðåøåíèÿ. Îáðàòèòåñü ê ðàçðàáîò÷èêó','Îøèáêà',MB_OK or MB_IconStop);
   //      Exit
   //     end;
   //    if not FField[Col,Row].Initial then
   //     begin
   //      FField[Col,Row].CorrectValue:=FField[Col,Row].UserValue;
   //      FField[Col,Row].UserValue:=36;
   //      FField[Col,Row].Variants:=FieldCopy[Col,Row].Variants
   //     end
   //   end;
   // FCompleted:=True;
   // FMoveStack.InitStack(FAllowCluesUndo)
 //}

function CheckPossibility(Col,Card){

 var Row, Result;
  
   if ((Col<0)|| (Col>5))
    Result='cpCannotBe';
   else
    {    
     Row=div(Card, 6);
    // console.log(Col, Row, Card);
     if (FField[Col][Row].UserValue==36)
      if (FField[Col][Row].Variants.indexOf(Card%6)>=0)
     // if (Card % 6) in FField[Col,Row].Variants then
       Result='cpCanBe';
      else
       Result='cpCannotBe';
     else
      if (Card==FField[Col][Row].UserValue)
       Result='cpIsHere'
      else
       Result='cpCannotBe'
    }
  }

function CheckCorrectness() {
 //var Col,Row;
  
   var Result=true;
   for (var Col=0; Col<6; Col++)
    for (var Row=0; Row<6; Row++)
     if (CheckPossibility(Col,FField[Col][Row].CorrectValue)=='cpCannotBe'){
       Result=false;
     break;
      }
      return Result;
  }
function delete_variants(col,row,variant){
 // console.log(col,row);
  if (FField[col][row].Variants.indexOf(variant)>=0)   FField[col][row].Variants.splice(FField[col][row].Variants.indexOf(variant),1);
 return FField[col][row].Variants.length;
};
function add_variants(col,row,variant){
  FField[col][row].Variants[FField[col][row].Variants.length]=variant;
  //console.log(FField[col][row].Variants);
};
 
function CreateFField() {
  for (var i=0; i<6; i++) {
    FField[i] = {};
    for (var j=0; j<6; j++) {
      FField[i][j] = { 
        'Initial': false,
        'CorrectValue': 0,
        'UserValue': 0
      };
    }
  }
}

function div (val, by) {
  return (val-val%by) / by;
}

function FirstInitField() {
 var x=0,y=0,i=0;
  for (y=0; y<6; y++)
  for (x=0; x<6; x++) {
      FField[x][y].Initial=true;
      FField[x][y].CorrectValue=x+6*y;
      FField[x][y].UserValue=x+6*y;
   }
    for (i=0; i<24; i++) {
      FMainHClues[i] = {'ClueType': 'hcNone','Card1':36,'Card2':36,'Card3':36};
    }
   for (i=0; i<21; i++) 
    FMainHClues[i] = {'ClueType':'vcNone','Card1':36,'Card2':36};
    //FPMainHClues:=@FMainHClues;
   // FPAlternateHClues:=@FAlternateHClues;
   // FPMainVClues:=@FMainVClues;
   // FPAlternateVClues:=@FAlternateVClues
}

function CreateLevelMap() {
 var i=0,current=0,cnt=0,ctype=0;
   for (i=0; i<65535; i++) {
     FLevelMap[i]=current;
     current = current+1+FBLevels[current];
     cnt = FBLevels[current];
    current++;
     for (var j=0; j< cnt; j++) {
       ctype=div (FBLevels[current], 36);
       switch (ctype) {
       	case 0:
       	case 2:
       	case 4: 
       		current+=2;
       		break;
       	case 1:
       	case 3:
       		current+=3;
       		break;
       }
      }
      current+=1+2*FBLevels[current];
     
	   }
	}
  function next_tips(){
    alert(1);
    var i=0;
    while(i<20) {
      console.log(i);
      if (FMainVClues[i].ClueType!=='vcNoClues') {
        var card1 = FMainVClues[i].Card1 % 6;
        var card2 = FMainVClues[i].Card2 % 6;
        var row1 = div(FMainVClues[i].Card1, 6);
       // row1--;row2--;
        var row2 = div(FMainVClues[i].Card2, 6);
        //console.log(row1, row2, card1,card2);
        for (var j=0; j<6; j++) {
          if (FField[j][row1].Initial || FField[j][row2].Initial) {
              console.log(card1,card2, row1,row2, j);
            //console.log(row1, i);
            console.log(FField[j][row1].UserValue, FMainVClues[i].Card1, FField[j][row2].Variants.indexOf(card2),FField[j][row1].Initial,FField[j][row1].UserValue!== FMainVClues[i].Card1 && FField[j][row2].Variants.indexOf(card2)>=0 && FField[j][row1].Initial);
           // console.log (FField[j][row1].UserValue, FField[row1][j].UserValue, FField[j][row2].UserValue, FField[row2][j].UserValue, FMainVClues[i].Card1, FMainVClues[i].Card2 , FField[j][row2].Variants.indexOf(card2));
            if (FField[j][row1].UserValue!== FMainVClues[i].Card1 && FField[j][row2].Variants.indexOf(card2)>=0 && FField[j][row1].Initial) {
              alert("Поле " + j+ ', '+ row1 + " инициализировано, поэтому карта " + FMainVClues[i].Card2 %6+ " не должна быть на месте "+j+ ", "+row2 + ' 1');
            //  alert('card ' + card2 + ' not to be in ' + row2 + ',' + j + 'because Initial');
           i=21;break;} 
            if (FField[j][row2].UserValue!== FMainVClues[i].Card2 && FField[j][row1].Variants.indexOf(card1)>=0 && FField[j][row2].Initial) {
                 alert("Поле " + j + ', '+ row2 + " инициализировано, поэтому карта " + FMainVClues[i].Card1 % 6+ " не должна быть на месте "+j+ ", "+row1 + " 2");
           
              //alert('card ' + card1 + ' not to be in ' + row1 + ',' + j + 'because Initial');
            i=21;break;}
            if (FField[j][row1].UserValue=== FMainVClues[i].Card1 && FField[j][row2].Variants.indexOf(card2)>=0 && FField[j][row1].Initial) {//+++++++++++++
                 alert("Поле " + j + ', '+ row1 + " инициализировано, поэтому карта " + card2 + " должна быть на месте "+j+ ", "+row1 + " 3");
           
              //alert('card ' + card2 + ' must be in ' + row2 + ',' + j + 'because Initial');
            i=21;break;} 
            if (FField[j][row2].UserValue=== FMainVClues[i].Card2 && FField[j][row2].Variants.indexOf(card1)>=0 && FField[j][row2].Initial) {
                 alert("Поле " + j + ', '+ row2 + " инициализировано, поэтому карта " + card1 + " не должна быть на месте "+j+", "+row2 + " 4");
           
              //alert('card ' + card1 + ' must be in ' + row1 + ',' + j + 'because Initial');
            i=21;break;}
          } else {
          //   if (FField[j][row1].Variants.indexOf(card1)>=0)
          //     if (FField[j][row2].Variants.indexOf(card2)<0) alert ("Card "+card2 + " not in variants in 1");
          //   if (FField[j][row1].Variants.indexOf(card1)<0)
          //     if (FField[j][row2].Variants.indexOf(card2)>=0) alert ("Card "+card1 + " not in variants in 2");
           }//++++++++++++++++++
        }
         i++;  
        console.log('we2e23', i);
        //i++;      
       } else {console.log('www');i=21;}
     }
       i=0;
       while (i<24) {
          i=25;
       }
      
    
    console.log('end');
  }
//CreateLevelMap();
function decto6(number){
  var q = number;
  str='';
  while (q>0) {
    t = q%6;
    str = t+''+str;
    q = div(q,6);
    console.log(t,str,q);
  }
  console.log(str);
}

CreateLevelMap();
CreateFField();
FirstInitField();
var level0 = [5,3,0,1,2,4,4,5,1,0,3,2,5,0,3,2,1,4,3,2,4,1,5,0,2,1,0,3,4,5,3,4,5,1,0,2]
//InitLevel();
for (var i=0; i<36; i++) {
  FField[i%6][div(i,6)].CorrectValue = level0[i]+6*div(i,6);
}

//for (var i=0; i<30; i++) {console.log(FBLevels[i]);}

//console.log(CheckCorrectness());
//DrawLevel();
