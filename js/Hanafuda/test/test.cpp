#include <iostream>
void swap(char* a, char* b){
//    std::cout << *a << "," << *b << std::endl;

    *a = *a ^ *b;
    *b = *a ^ *b;
    *a = *b ^ *a;
//    std::cout << *a << "," << *b << std::endl;
}
void reverse(char* s, size_t start, size_t end){
    while (start < end){
        swap(&(s[start]), &(s[end]));
        start++; end--;
    }
}

void reverseWords(char* s){
    int l = strlen(s);
    reverse(s, 0, l-1);
    int i = 0;
    int swap_end = -1;
    int swap_start = -1;
    int space_counter = 0;
    int word_size = 0;
    bool size_count = false;
    bool swap = false;
    bool first_count = true;
    while (i < l){
        if (((s[i] != ' ' && i+1 >= l) || (s[i] != ' ' && s[i+1] == ' '))) {
            swap_end = i;
            swap = true;
        }
        if ( ((s[i] != ' ' && i-1 < 0) || (s[i] != ' ' && s[i-1] == ' ')) && swap_start == -1){
            swap_start = i;
            size_count = true;
        }
        if (s[i] == ' '){ 
            if ( (space_counter == 1 || first_count) && swap_start == -1){
                swap_start = i;
                first_count = false;
            }
            space_counter++; 
        }
        if (swap){
            reverse(s, swap_start, swap_end);
            swap = false; swap_start = -1; swap_end = -1; space_counter = 0; 
        }
        i++;
    }
}
int main(){
    char s[] = "    sky     shit    wahaha    pp     ";
    reverseWords(s);
    std::cout << s << std::endl;
    
}