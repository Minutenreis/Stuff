#include <stdio.h>
#include <stdlib.h>
struct node *makeNode(char character, int pos);
char pop(void);
void push(char x, int pos);
int checkBrackets(char string[]);
char topValue(void);
char topValueConverted(void);

struct node *top;

struct node
{
    char data;
    int position;
    struct node *next;
};

int main()
{
    char string[1024];
    int error;
    printf("Geben sie ihren Text ein:\n");
    scanf("%[^\n]", string);
    error = checkBrackets(string);
    if (error == -1)
    {
        printf("korrekte Klammerung\n");
    }
    else
    {
        printf("fehlerhafte Klammerung:\n");
        printf("%s\n", string);
        for (error; error > 0; error--)
        {
            printf(" ");
        }
        printf("^\n");
    }
    return 0;
}

// returns position of error, return -1 if no error is found
int checkBrackets(char string[])
{
    int i = 0;
    int error = -1;
    while (string[i] != '\0')
    {
        if (string[i] == '{' || string[i] == '(' || string[i] == '[')
        {
            push(string[i], i);
        }
        else if (string[i] == '}' || string[i] == ')' || string[i] == ']')
        {
            if (string[i] == topValueConverted())
            {
                pop();
            }
            else
            {
                error = i;
                break;
            }
        }
        i++;
    }
    if (top != NULL && error == -1)
    {
        error = top->position;
    }
    return error;
}

void push(char x, int pos)
{
    struct node *p = makeNode(x, pos);
    p->next = top;
    top = p;
}

char pop(void)
{
    if (top == NULL)
    {
        return '\0';
    }
    int result = top->data;
    struct node *p = top;
    top = top->next;
    free(p);
    return result;
}

char topValue(void)
{
    if (top == NULL)
    {
        return '\0';
    }
    return top->data;
}

char topValueConverted(void)
{
    char topVal = topValue();
    switch (topVal)
    {
    case '{':
        return '}';
    case '(':
        return ')';
    case '[':
        return ']';
    default:
        return '\0';
    }
}

struct node *makeNode(char character, int pos)
{
    struct node *node = NULL;
    if ((node = malloc(sizeof(struct node))) != NULL)
    {
        node->data = character;
        node->position = pos;
        node->next = NULL;
        return node;
    }
    else
    {
        return NULL;
    }
}
