## Two Fer
```JavaScript
public class Twofer {
    public String twofer(String name) {
        if (name == null) return "One for you, one for me.";
        else return "One for " + name + ", one for me.";
    }
}
// Using Ternary Operator
public class Twofer {
    public String twofer(String name) {
        String result = (name == null) ? "One for you, one for me." : "One for " + name + ", one for me.";
        return result;
    }
}
```
## Resistor Color
```JavaScript
class ResistorColor {
    int colorCode(String color) {
        for(int i = 0; i < colors().length; i ++)
            if (color == colors()[i]) return i;
        return -1;
    }
    String[] colors() {
        return new String[] {"black", "brown", "red", "orange", "yellow", "green", "blue", "violet", "grey", "white"};
    }
}
```
[[exceptions]]