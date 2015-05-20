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
  if (FField[col][row].Variants.indexOf(card)!==-1) {
  FField[col][row].UserValue = card+6*row;
  FField[col][row].Initial = true;
  // for (var i=0; i<6; i++) {
  //   delete_variants(i,row,card);
  // }
  return true
}
return false
  // for (var i=0; i<FField[col][row].Variants.length; i++) {
  //   delete_variants(col, row, FField[col][row].Variants[i]);
  // }

  // count_big_card++;
  // if (count_big_card==36) {
  //   var done=true;
  //   for (var i=0; i<6;i++)
  //     for (var j=0; j<6; j++)
  //       if (FField[i][j].UserValue!==FField[i][j].CorrectValue) done=false;
  //     if (done) console.log("WIN");
  // }
}

function add_step(data){
  console.log(data);
  var was=[];
  var val = [];
    var obj = {
    'col':data.col,
    'row':data.row,
    'was':[],
    'var':[],
    'right': error_flag,//???????????????????
    'card': {
      'type':data.type,
      'action':data.act,
      'number':data.card,
    }
  }
  if (data.type=='big') {
   obj['val'] = FField[data.col][data.row].Variants;  
    for (var i=0; i<6;i++) {
      console.log(FField[i][data.row].Variants, data.row, data.col);
      if (FField[i][data.row].Variants.indexOf(data.card)>=0){ 
        obj['was'].push(i);
        FField[i][data.row].Variants.splice(FField[i][data.row].Variants.indexOf(data.card),1);
        console.log(i);
      }
    }
    if (data.card+data.row*6!==FField[data.col][data.row].CorrectValue) {error_flag = false;} 
  } else {
    if (data.card+data.row*6===FField[data.col][data.row].CorrectValue) {error_flag=false;}
  }
 //console.log(was);
  // var obj = {
  //   'var': val,
  //   'col':data.col,
  //   'row':data.row,
  //   'was':was,
  //   'right': error_flag,//???????????????????
  //   'card': {
  //     'type':data.type,
  //     'action':data.act,
  //     'number':data.card,
  //   }
  // }
  console.log(obj);
  steps_history.push(obj);
  count_step++;
}
function remove_many() {
  var c=0;
  for (var i=steps_history.length-1; i>=0; i--)
    if (!steps_history[i].right) c++;
  //console.log(c);
  for (var i=0; i<c; i++)
    remove_step();
  alert("Все верно");
}

function remove_step() {
  var h = steps_history.pop();
  //var count=1;
  //while ( count && !h.right) {
    //console.log(h);
    if (h.card.type==='small') {
      td_right_click((h.row*100+h.col*10+h.card.number).toString());
      steps_history.pop();
    } else {
        FField[h.col][h.row].Initial=false;
        for (var i=0; i<h.was.length;i++)
          add_variants(h.was[i],h.row,h.card.number);
      }
      //count--;
      //if (count) h = steps_history.pop();
   // }
  draw_field();
  error_flag=true;
}

function InitLevel(level) {
  console.log(level);
  level=2;
  var Col,Row,Card,I,Cnt,P, Variants = [], CType;
     var Found = [];
  //count_big_card=0;
   FCompleted=false;
   P=FLevelMap[level];
   console.log(P);
   for (Col=0; Col<6; Col++) 
    for (Row=0 ; Row<6;Row++){
      FField[Col][Row].Initial=false,
      FField[Col][Row].CorrectValue=36,
      FField[Col][Row].UserValue=36,
      FField[Col][Row].Variants=[]
    }
    var d = P;
    for (var i=P; i<P+6; i++) {
      var q = FBLevels[i];
      var n = decto6(q);
      console.log(n);
    for (var j=0; j<6; j++) {
    if (n.indexOf(j)<0) n.push(j);
    //console.log(j,i)
     FField[j][i-d].CorrectValue = n[j]+6*(i-d);
  }
    console.log(n);

    }
    P+=6;
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
              FMainHClues[I].ClueType='hcNotNextTo';
             else
              FMainHClues[I].ClueType='hcNextTo';
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
            FMainVClues[I].ClueType='vcTogether';}
       else
        {
          //console.log(I, P, FBLevels[P], FBLevels[P]&& 128);
        FMainVClues[I].ClueType='vcNotTogether';}
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
        FMainVClues[Cnt].Card1=36;
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
  
   // for (var Col=0; Col<6; Col++)
   //  for (var Row=0; Row<6; Row++)
   //   {
   //    //if (FField[Col,Row].UserValue=36) then
   //    // {
   //     // Application.MessageBox('Óðîâåíü íå èìååò ðåøåíèÿ. Îáðàòèòåñü ê ðàçðàáîò÷èêó','Îøèáêà',MB_OK or MB_IconStop);
   //      //exit
   //   //  }
   //    if (!FField[Col][Row].Initial)
   //     {
   //      FField[Col][Row].CorrectValue=FField[Col][Row].UserValue;
   //      FField[Col][Row].UserValue=36;
   //     // FField[Col][Row].Variants=FieldCopy[Col][Row].Variants
   //     }
   //   }
     //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // var cor = []; 
    // switch (level){
    //   case 0: cor=level0; break;
    // }
    // for (var i=0; i<36; i++) {
    //   FField[i%6][div(i,6)].CorrectValue = cor[i]+6*div(i,6);
    // }
  }
  

function CheckPossibility(Col,Card){

 var Row, Result='';
  
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
    return Result
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
  console.log(FField[col][row].Variants);
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
     current+=6
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
  // function next_tips(){
  //   var i=0;
  //       while (i<24) {
         
  //        var card1 = FMainHClues[i].Card1 % 6;
  //       var card2 = FMainHClues[i].Card2 % 6;
  //       var card3 = FMainHClues[i].Card3 % 6;
  //       var row1 = div(FMainHClues[i].Card1, 6);
  //      // row1--;row2--;
  //       var row2 = div(FMainHClues[i].Card2, 6);
  //       var row3 = div(FMainHClues[i].Card3, 6);
  //       //console.log(row1,row2,row3,card1,card2,card3);
  //       //hcNone,hcNextTo,hcNotNextTo,hcTriple,hcNotTriple,hcOrder
  //         if (FMainHClues[i].ClueType=='hcNotNextTo'){
  //           console.log(i);
  //          // console.log(row1,row2,row3);
  //           for (var j=0; j<6; j++) {
  //             //console.log(FField[j][row1].Initial,j,row1, "cikl for 1");
  //             if (FField[j][row1].Initial) {
  //               //console.log(FField[j][row1].UserValue, card1, FField[j][row1].UserValue===card1,"sda");
  //               if (FField[j][row1].UserValue===FMainHClues[i].Card1) {
  //                 for (var k=0; k<6; k++) {
  //                   //console.log(k,(Math.abs(k-j)>1) || (k===j && row1==row2),(k===j));
  //                   if (((Math.abs(k-j)>1) || (k===j)) && FField[k][row2].Variants.indexOf(card2)>=0) {
  //                     alert("Поле " + j+ ', '+ row1 + " инициализировано, поэтому карта " + card2+ " не должна быть на месте "+k+ ", "+row2 + ' 1 H');
  //                 //    console.log(FField[k][row2].Variants.indexOf(card2)>=0, k, j, (Math.abs(k-j)>1) || (k===j && row1==row2) ) ;
  //                     return
  //                   } 
  //                 }
  //               }
  //             }  else {
  //               console.log(FField[1][row1].Variants.indexOf(card1)<0 && FField[0][row2].Variants.indexOf(card2)>=0, row1, row2,card2,card1, i, "dwqewqe", FField[1][row1].Variants.indexOf(card1)<0);
  //               if (FField[1][row1].Variants.indexOf(card1)<0 && FField[0][row2].Variants.indexOf(card2)>=0 && !FField[1][row1].Initial && !FField[0][row2].Initial) {
  //                   alert ("Карта " + card2 + " не может быть на месте 0" +", "+row2+ "так как " + card1 + " нет в вариантах 1"+", "+row1 + " 3 H");
  //                   return
               
  //               }
  //               if (FField[4][row1].Variants.indexOf(card1)<0 && FField[5][row2].Variants.indexOf(card2)>=0 && !FField[4][row1].Initial && !FField[5][row2].Initial) {
  //                   alert ("Карта " + card2 + " не может быть на месте 5" +", "+row2+ "так как " + card1 + " нет в вариантах 4"+", "+row1 + " 4 H");
  //                   return
  //               }
  //               for (var k=1; k<5; k++) {
  //                 //console.log(k,FField[k-1][row1].Variants.indexOf(card1)<0 && FField[k][row2].Variants.indexOf(card2)>=0 && FField[k+1][row1].Variants.indexOf(card1)<0);
  //                 if (FField[k-1][row1].Variants.indexOf(card1)<0 && FField[k][row2].Variants.indexOf(card2)>=0 && FField[k+1][row1].Variants.indexOf(card1)<0 && !FField[k-1][row1].Initial && !FField[k][row2].Initial && !FField[k+1][row3].Initial) {
  //                   var q=k-1; var qq = k+1;
  //                   alert ("Карта " + card2 + " не может быть на месте "+ k  + ", "+row2+ "так как " + card1 + " нет в вариантах "+ q+", "+row1 + " и в вариантах " + qq+", "+row1 +"4 H");
  //                   return
               
  //                 }
  //               }
  //             }
  //             if (FField[j][row2].Initial) {
  //               if (FField[j][row2].UserValue===FMainHClues[i].Card2) {
  //                 //console.log(FField[j][row2].UserValue, j, row2, 'wewqewq');
  //                 for (var k=0; k<6; k++) {
  //                   if ((Math.abs(k-j)>1 || k===j) && FField[k][row1].Variants.indexOf(card1)>=0) {
  //                     alert("Поле " + j+ ', '+ row2 + " инициализировано, поэтому карта " + card1 + " не должна быть на месте "+k+ ", "+row1 + ' 2 H');
  //                     return
  //                   } 
  //                 }
  //               }
  //             } else {
  //                 if (FField[1][row2].Variants.indexOf(card2)<0 && FField[0][row1].Variants.indexOf(card1)>=0 && !FField[0][row1].Initial && !FField[1][row2].Initial) {
  //                    alert ("Карта " + card1 + " не может быть на месте 0" +", "+row1+ "так как " + card2 + " нет в вариантах 1"+", "+row2 + " 5 H");
  //                     return
  //                 }
  //                  if (FField[5][row1].Variants.indexOf(card1)>=0 && FField[4][row2].Variants.indexOf(card2)<0 && !FField[5][row1].Initial && !FField[4][row2].Initial) {
  //                   alert ("Карта " + card1 + " не может быть на месте 5" +", "+row1+ "так как " + card2 + " нет в вариантах 4"+", "+row2 + " 6 H");
  //                   return
  //                 }
  //                 for (var k=1; k<5; k++)
  //                    if (FField[k-1][row2].Variants.indexOf(card2)<0 && FField[k][row1].Variants.indexOf(card1)>=0 && FField[k+1][row2].Variants.indexOf(card2)<0 && !FField[k-1][row2].Initial && !FField[k][row1].Initial && !FField[k+1][row2].Initial) {
  //                       var q=k-1; var qq = k+1;
  //                       alert ("Карта " + card1 + " не может быть на месте "+ k  + ", "+row1+ "так как " + card2 + " нет в вариантах "+ q+", "+row2+ " и в вариантах " + qq+", "+row1 +"4 H");
  //                       return
  //              }
  //             }
  //           } 
  //         } 
  //         if (FMainHClues[i].ClueType=='hcNextTo') {

  //         }
  //         if (FMainHClues[i].ClueType=='hcTriple') {
  //           console.log(i, 'hcTriple');




  //           for (var j=0; j<6; j++) {
  //             if (FField[j][row2].Initial){ 
  //               if (FField[j][row2].UserValue===FMainHClues[i].Card2){
  //               for (var k=0; k<6; k++){
  //                 if (!Math.abs(k-j)===1) {
  //                   if (FField[k][row1].Variants.indexOf(card1)>=0) {
  //                     alert("Карта " + card1 + "не должна быть на месте "+ к + " , "+row1 + "так как поле "+j +" , " +row2 +" инициализировано Tripple 3H 7");
  //                     return
  //                   }
  //                   if (FField[k][row3].Variants.indexOf(card3)>=0) {
  //                     alert("Карта " + card3 + "не должна быть на месте "+ к + " , "+row3 + "так как поле "+j +" , " +row2 +" инициализировано Tripple 3H 7");
  //                     return
  //                     }
  //                   }
  //                 }
  //               } 
  //             }else {
  //                     if (FField[1][row1].Variants.indexOf(card1)<0 && FField[0][row2].Variants.indexOf(card2)>=0 && !FField[1][row1].Initial && !FField[0][row2].Initial) {
  //                   alert ("Карта " + card2 + " не может быть на месте 0" +", "+row2+ "так как " + card1 + " нет в вариантах 1"+", "+row1 + " 3 H");
  //                   return
               
  //               }
  //               if (FField[4][row1].Variants.indexOf(card1)<0 && FField[5][row2].Variants.indexOf(card2)>=0 && !FField[4][row1].Initial && !FField[5][row2].Initial) {
  //                   alert ("Карта " + card2 + " не может быть на месте 5" +", "+row2+ "так как " + card1 + " нет в вариантах 4"+", "+row1 + " 4 H");
  //                   return
  //               }
  //               for (var k=1; k<5; k++) {
  //                 //console.log(k,FField[k-1][row1].Variants.indexOf(card1)<0 && FField[k][row2].Variants.indexOf(card2)>=0 && FField[k+1][row1].Variants.indexOf(card1)<0);
  //                 if (FField[k-1][row1].Variants.indexOf(card1)<0 && FField[k][row2].Variants.indexOf(card2)>=0 && FField[k+1][row1].Variants.indexOf(card1)<0 && !FField[k-1][row1].Initial && !FField[k][row2].Initial && !FField[k+1][row3].Initial) {
  //                   var q=k-1; var qq = k+1;
  //                   alert ("Карта " + card2 + " не может быть на месте "+ k  + ", "+row2+ "так как " + card1 + " нет в вариантах "+ q+", "+row1 + " и в вариантах " + qq+", "+row1 +"4 H");
  //                   return
               
  //                 }
  //               }
  //             }


  //             if (FField[j][row1].Initial) {
  //               if (FField[j][row1].UserValue===FMainHClues[i].Card1) { 
  //                 if (j!=0 && FField[j-1][row2].Initial){
  //                   if (FField[j-1][row2].UserValue===FMainHClues[i].Card2) {
  //                     var q = j-2;
  //                     if (q>=0 && !FField[q][row3].Initial) {alert("Карта " + card3 + " должна быть на месте "+ q + " , "+row3 + "так как поле "+j +" , " +row1 +" инициализировано Tripple 3H 7");
  //                     return
  //                   }
  //                   } else {
  //                     var q = j-2;
  //                     if (q>=0 && !FField[q][row3].Initial && FField[q][row3].Variants.indexOf(card3)>=0) {alert("Карта " + card3 + " не может быть на месте "+ q + " , "+row3 + "так как поле "+j +" , " +row1 +" инициализировано Tripple 3H 8");
  //                     return
  //                   }
  //                   }
  //                 }

  //                   if (j!=5 && FField[j+1][row2].Initial ){
  //                   if (FField[j+1][row2].UserValue===FMainHClues[i].Card2) {
  //                     var q = j+2;
  //                     if (q<6 && !FField[q][row3].Initial) {alert("Карта " + card3 + " должна быть на месте "+ q + " , "+row3 + "так как поле "+j +" , " +row1 +" инициализировано Tripple 3H 1");
  //                     return
  //                   }
  //                   } else {
  //                     var q = j+2;
  //                     if (q<6 && !FField[q][row3].Initial && FField[q][row3].Variants.indexOf(card3)>=0) {alert("Карта " + card3 + " не может быть на месте "+ q + " , "+row3 + "так как поле "+j +" , " +row1 +" инициализировано Tripple 3H 2");
  //                     return
  //                   }
  //                   }
  //                 }

  //                    if (j>2 && FField[j-2][row3].Initial && !FField[j-1][row2].Initial){
  //                   if (FField[j-2][row3].UserValue===FMainHClues[i].Card3) {
  //                     var q = j-1;
  //                     alert("Карта " + card2 + " должна быть на месте "+ q + " , "+row2 + "так как поле "+j +" , " +row1 +" инициализировано Tripple 3H 3");
  //                     return
                    
  //                   } else {
  //                     var q = j-1;
  //                     if (FField[q][row2].Variants.indexOf(card2)>=0 ) {
  //                     alert("Карта " + card2 + " не может быть на месте "+ q + " , "+row2 + "так как поле "+j +" , " +row1 +" инициализировано Tripple 3H 4");
  //                     return
  //                   }
  //                   }
  //                 }
  //                 console.log(j<4 && FField[j+2][row3].Initial, j,FField[j+1][row2].Initial );
  //                    if (j<4 && FField[j+2][row3].Initial && !FField[j+1][row2].Initial){
  //                     if (FField[j+2][row3].UserValue===FMainHClues[i].Card3) {
  //                     var q = j+1;
  //                     alert("Карта " + card2 + " должна быть на месте "+ q + " , "+row2 + "так как поле "+j +" , " +row1 +" инициализировано Tripple 3H 5");
  //                     return
                    
  //                   } else {
  //                     var q = j+1;
  //                     if (FField[q][row2].Variants.indexOf(card2)>=0 ) {
  //                     alert("Карта " + card2 + " не может быть на месте "+ q + " , "+row2 + "так как поле "+j +" , " +row1 +" инициализировано Tripple 3H 6");
  //                     return
  //                   }
  //                   }
  //                 }
                   
  //                 for (var k=0; k<6; k++) {
  //                   if (!(Math.abs(k-j)==1) && FField[k][row2].Variants.indexOf(card2)>=0) {
  //                      alert("Поле " + j+ ', '+ row1 + " инициализировано, поэтому карта " + card2+ " не должна быть на месте "+k+ ", "+row2 + '1 Tripple H ' + i);
  //                     return
  //                  }
  //                   if (!(Math.abs(k-j)==2) && FField[k][row3].Variants.indexOf(card3)>=0){
  //                      alert("Поле " + j+ ', '+ row1 + " инициализировано, поэтому карта " + card3+ " не должна быть на месте "+k+ ", "+row3 + '2 Tripple H ' + i);
  //                     return
  //                  }

  //                 }
  //               }
  //             } else  {
  //                //console.log(FField[1][row1].Variants.indexOf(card1)<0 && FField[0][row2].Variants.indexOf(card2)>=0, row1, row2,card2,card1, i, "dwqewqe", FField[1][row1].Variants.indexOf(card1)<0);
  //               if (FField[1][row1].Variants.indexOf(card1)<0 && FField[0][row2].Variants.indexOf(card2)>=0 && !FField[1][row1].Initial && !FField[0][row2].Initial) {
  //                   alert ("Карта " + card2 + " не может быть на месте 0" +", "+row2+ "так как " + card1 + " нет в вариантах 1"+", "+row1 + " 3 H 1");
  //                   return
               
  //               }
  //               if (FField[4][row1].Variants.indexOf(card1)<0 && FField[5][row2].Variants.indexOf(card2)>=0 && !FField[4][row1].Initial && !FField[5][row2].Initial) {
  //                   alert ("Карта " + card2 + " не может быть на месте 5" +", "+row2+ "так как " + card1 + " нет в вариантах 4"+", "+row1 + " 4 H 1");
  //                   return
  //               }
  //                //console.log(FField[1][row1].Variants.indexOf(card1)<0 && FField[0][row2].Variants.indexOf(card2)>=0, row1, row2,card2,card1, i, "dwqewqe", FField[1][row1].Variants.indexOf(card1)<0);
  //               if (FField[2][row1].Variants.indexOf(card1)<0 && FField[0][row3].Variants.indexOf(card3)>=0 && !FField[2][row1].Initial && !FField[0][row3].Initial) {
  //                   alert ("Карта " + card3 + " не может быть на месте 0" +", "+row3+ "так как " + card1 + " нет в вариантах 2"+", "+row1 + " 3 H 2");
  //                   return
               
  //               }
  //               if (FField[3][row1].Variants.indexOf(card1)<0 && FField[5][row3].Variants.indexOf(card3)>=0 && !FField[3][row1].Initial && !FField[5][row3].Initial) {
  //                   alert ("Карта " + card3 + " не может быть на месте 5" +", "+row3+ "так как " + card1 + " нет в вариантах 3"+", "+row1 + " 4 H 2");
  //                   return
  //               }
  //               if (FField[3][row1].Variants.indexOf(card1)<0 && FField[1][row3].Variants.indexOf(card3)>=0 && !FField[3][row1].Initial && !FField[1][row3].Initial) {
  //                   alert ("Карта " + card3 + " не может быть на месте 1" +", "+row3+ "так как " + card1 + " нет в вариантах 3"+", "+row1 + " 3 H 5");
  //                   return
               
  //               }
  //               if (FField[2][row1].Variants.indexOf(card1)<0 && FField[4][row3].Variants.indexOf(card3)>=0 && !FField[2][row1].Initial && !FField[4][row3].Initial) {
  //                   alert ("Карта " + card3 + " не может быть на месте 4" +", "+row3+ "так как " + card1 + " нет в вариантах 2"+", "+row1 + " 4 H 5");
  //                   return
  //               }
  //               for (var k=1; k<5; k++) {
  //                 //console.log(k,FField[k-1][row1].Variants.indexOf(card1)<0 && FField[k][row2].Variants.indexOf(card2)>=0 && FField[k+1][row1].Variants.indexOf(card1)<0);
  //                 if (FField[k-1][row1].Variants.indexOf(card1)<0 && FField[k][row2].Variants.indexOf(card2)>=0 && FField[k+1][row1].Variants.indexOf(card1)<0 && !FField[k-1][row1].Initial && !FField[k][row2].Initial && !FField[k+1][row1].Initial) {
  //                   var q=k-1; var qq = k+1;
  //                   alert ("Карта " + card2 + " не может быть на месте "+ k  + ", "+row2+ "так как " + card1 + " нет в вариантах "+ q+", "+row1 + " и в вариантах " + qq+", "+row1 +"4 H 3");
  //                   return
  //                 }
                 
  //               }
  //                for (var k=2; k<4; k++) {
  //                 //console.log(k,FField[k-1][row1].Variants.indexOf(card1)<0 && FField[k][row2].Variants.indexOf(card2)>=0 && FField[k+1][row1].Variants.indexOf(card1)<0);
  //                 if (FField[k-2][row1].Variants.indexOf(card1)<0 && FField[k][row3].Variants.indexOf(card3)>=0 && FField[k+2][row1].Variants.indexOf(card1)<0 && !FField[k-2][row1].Initial && !FField[k][row3].Initial && !FField[k+2][row1].Initial) {
  //                   var q=k-2; var qq = k+2;
  //                   alert ("Карта " + card3 + " не может быть на месте "+ k  + ", "+row3+ "так как " + card1 + " нет в вариантах "+ q+", "+row1 + " и в вариантах " + qq+", "+row3 +"4 H 33");
  //                   return
  //                 }
                 
  //               }

  //             }






  //           }

  //         }
  //         if (FMainHClues[i].ClueType =='hcNotTriple') {

  //         }
  //         if (FMainHClues[i].ClueType=='hcOrder'){
  //           }
  //         //}
  //         i++;
  //      }
  //     i=21;
  //   while(i<20) {
  //     console.log(i);
  //     if (FMainVClues[i].ClueType!=='vcNoClues') {
  //       var card1 = FMainVClues[i].Card1 % 6;
  //       var card2 = FMainVClues[i].Card2 % 6;
  //       var row1 = div(FMainVClues[i].Card1, 6);
  //      // row1--;row2--;
  //       var row2 = div(FMainVClues[i].Card2, 6);
  //       //console.log(row1, row2, card1,card2);
  //       for (var j=0; j<6; j++) {
  //         if (FField[j][row1].Initial) {
  //            if (FField[j][row1].UserValue!== FMainVClues[i].Card1 && FField[j][row2].Variants.indexOf(card2)>=0 && FField[j][row1].Initial) {
  //             alert("Поле " + j+ ', '+ row1 + " инициализировано, поэтому карта " + FMainVClues[i].Card2 %6+ " не должна быть на месте "+j+ ", "+row2 + ' 1');
  //           //  alert('card ' + card2 + ' not to be in ' + row2 + ',' + j + 'because Initial');
  //          i=21;break;} 
  //           if (FField[j][row1].UserValue === FMainVClues[i].Card1 && (FField[j][row2].Variants.indexOf(card2)>=0) && FField[j][row1].Initial) {//+++++++++++++
  //                alert("Поле " + j + ', '+ row1 + " инициализировано, поэтому карта " + card2 + " должна быть на месте "+j+ ", "+row1 + " 3");
           
  //             //alert('card ' + card2 + ' must be in ' + row2 + ',' + j + 'because Initial');
  //           i=21;break;} 
  //         } else {
  //           if (FField[j][row2].Initial) {
  //             if (FField[j][row2].UserValue!== FMainVClues[i].Card2 && FField[j][row1].Variants.indexOf(card1)>=0 && FField[j][row2].Initial) {
  //                alert("Поле " + j + ', '+ row2 + " инициализировано, поэтому карта " + FMainVClues[i].Card1 % 6+ " не должна быть на месте "+j+ ", "+row1 + " 2");
           
  //             //alert('card ' + card1 + ' not to be in ' + row1 + ',' + j + 'because Initial');
  //           i=21;break;}
  //            if (FField[j][row2].UserValue === FMainVClues[i].Card2 && (FField[j][row1].Variants.indexOf(card1)>=0) && FField[j][row2].Initial) {
  //                alert("Поле " + j + ', '+ row2 + " инициализировано, поэтому карта " + card1 + "  должна быть на месте "+j+", "+row1 + " 4");
           
  //             //alert('card ' + card1 + ' must be in ' + row1 + ',' + j + 'because Initial');
  //           i=21;break;} 
  //           }else {
  //         } 
  //             if (FField[j][row1].Variants.indexOf(card1)>=0)
  //               if (FField[j][row2].Variants.indexOf(card2)<0) {
  //                 alert ("Карта " + card2 + " не может быть на месте " +j+", "+row1+ "так как " + card1 + " нет в вариантах "+j+", "+row2);
  //                 i=21;
  //               }
  //             if (FField[j][row1].Variants.indexOf(card1)<0)
  //               if (FField[j][row2].Variants.indexOf(card2)>=0) alert ("Карта " + card1 + " не может быть на месте " +j+", "+row2 + "так как " + card2 + " нет в вариантах "+j+", "+row1);
  //          }//++++++++++++++++++
  //       }
        
  //      // console.log('we2e23', i);
  //       //i++;      
  //      }
  //       i++;  
  //    }
  //      i=0;

    
  //   console.log('end');
  // }
//CreateLevelMap();
function decto6(number){
  var q = number;
  var arr = [];
  var rev = [];
  str='';
  while (q>0) {
    t = q%6;
    str = t+''+str;
    q = div(q,6);
    //console.log(t,str,q);
    arr.push(t);
  }
  if (arr.length!==5)arr.push(0);
  for (var i=0; i<arr.length; i++)
    rev[i] = arr[arr.length-1-i];
return rev
}

CreateLevelMap();
CreateFField();
FirstInitField();
// var level0 = [5,3,0,1,2,4,4,5,1,0,3,2,5,0,3,2,1,4,3,2,4,1,5,0,2,1,0,3,4,5,3,4,5,1,0,2]
//  var q = 1171;
//  var n = decto6(q);
// // for (var i=0; i<6; i++)
// // if (n.indexOf(i)<0) n.push(i);
//  console.log(n);

