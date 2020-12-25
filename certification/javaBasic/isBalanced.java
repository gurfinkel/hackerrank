import java.util.*;
import java.util.Scanner;

class Parser {
    public boolean isBalanced(String str) {
        Stack<Character> store = new Stack<>();

        for (char letter : str.toCharArray()) {
            if ('(' == letter || '{' == letter) {
                store.add(letter);
            } else {
                if (store.isEmpty() || (')' == letter && '(' != store.peek()) || ('}' == letter && '{' != store.peek())) {
                    return false;
                } else {
                    store.pop();
                }
            }
        }

        return 0 == store.size();
    }
}

// Write your code here. DO NOT use an access modifier in your class declaration.

class Solution {

	public static void main(String[] args) {
		Parser parser = new Parser();

		Scanner in = new Scanner(System.in);

		while (in.hasNext()) {
			System.out.println(parser.isBalanced(in.next()));
		}

		in.close();
	}
}
