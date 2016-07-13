#include "levels.h"
#include <unistd.h>
#include <stdio.h>
#define NOT_A_CARD 36
#define HC_NONE -1
#define HC_NEXT_TO 0
#define HC_NOT_NEXT_TO 2
#define HC_TRIPLE 1
#define HC_NOT_TRIPLE 3
#define HC_ORDER 4

char *rnames[]={
"NextTo",
"Triple",
"NotNextTo",
"Triple",
"Order"
};

int idiv(int val, int by) {
    return (val - val % by) / by;
}

int main(int argc, char *argv[]){
int P=0;
int count;
int i,j;
char fname[32];
FILE *fp;
int Col,Card,Row,CType,Cards[3];
   for (j = 0; j < 65535; j++) {
   sprintf(fname,"shlevel%d.js",j);
   fp=fopen(fname,"w");
   
    fprintf(fp,"var Level = [");
    count = FBLevels[P];
    fprintf(fp,"%d,",FBLevels[P]);
    P++;
    for (i = 0; i < count; i++) {
        fprintf(fp,"%d,",FBLevels[P]);
        P++;
    }
    count=FBLevels[P];
    fprintf(fp,"%d,",FBLevels[P]);
    P++;
    for (i = 0; i < count; i++) {
        fprintf(fp,"%d,",FBLevels[P]);
        P++;
        switch (CType) {
            case HC_NEXT_TO:
            case HC_NOT_NEXT_TO:
               fprintf(fp,"%d,",FBLevels[P]);
                P++;
                break;
            case HC_TRIPLE:
            case HC_NOT_TRIPLE:
                fprintf(fp,"%d,",FBLevels[P]);
                P++;
                fprintf(fp,"%d,",FBLevels[P]);
                P++;
                break;
            case HC_ORDER:
                fprintf(fp,"%d,",FBLevels[P]);
                P++;
                break;
        }
    }

    fprintf(fp,"%d,",FBLevels[P]);
    P++;
    for (i = 0; i < count; i++) {
        fprintf(fp,"%d,",FBLevels[P]);
        P++;
        fprintf(fp,"%d,",FBLevels[P]);
        P++;
    }
    fprintf(fp,"];\n");
    fclose(fp);
    }

}