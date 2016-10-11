import math
def evalRPN(tokens):
    OPERATORS = ['+','-','*','/']
    """
    :type tokens: List[str]
    :rtype: int
    """
    stack = []
    for i in tokens:
        print stack
        # reduce 
        if i in OPERATORS:
            if len(stack) < 2:
                return None
            else:
                right = stack.pop()
                left = stack.pop()
                if i == '+':
                    stack.append(right + left)
                elif i == '-':
                    stack.append(left - right)
                elif i == '*':
                    stack.append(left * right)
                elif i == '/':
                    r = float(left) / right
                    if r <= 0:
                        r = int(math.ceil(r))
                    else:
                        r = int(r)
                    stack.append(r)
        # shift
        else:
            stack.append(int(i))
    return stack.pop()

print evalRPN(["10","6","9","3","+","-11","*","/","*","17","+","5","+"])