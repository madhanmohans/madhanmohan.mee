## New CSS attributes
```CSS
text-transform: uppercase;
letter-spacing: 8px;
transition: background .5s // takes half a second to render background
opacity: 0.5; (0 -> 1)
```
## Inline Styles
```CSS
<p style:'color:red'> Hi </p>
```
## Internal Stylesheet
```CSS
<head>
	<style>
		
	<style/>
<head/>
```
## External Stylesheet
```CSS
New file -> style.css
```
- Type Selector OR Element Selector OR Tag Name
    
    ```CSS
    p {
    	color: green;
    }
    ```
    
- Class Selector (use dots)
    
    ```CSS
    .green {
    	color: green;
    }
    	
    .bold {
    	font-style: bold;
    }
    
    <h1 classname="green bold"> Hello </h1>
    ```
    
- ID Selector (use #)
    
    ```CSS
    \#large-title {
    	font-size:300%;
    }
    ```
    
- Attribute Selector (use [])
    
    ```CSS
    [href]{
       color: magenta;
    }
    
    a[href*='florence'] {
      color: lightgreen;
    }
    
    a[href*='beijing'] {
      color: lightblue;
    }
    
    a[href*='seoul'] {
      color: lightpink;
    }
    ```
    
- Pseudo Class
    
    ```CSS
    :focus
    :hover
    :visited
    :disabled
    :active
    ```
    
- Classes and IDS> [!important]  
    > For instance, imagine a page with two headlines. One headline needs to be bold and blue, and the other needs to be bold and green. Instead of writing separate CSS rules for each headline that repeat each other’s code, it’s better to write a .bold CSS rule, a .green CSS rule, and a .blue CSS rule. Then you can give one headline the bold green classes, and the other the bold blue classes.While classes are meant to be used many times, an ID is meant to style only one elementIDs override the styles of types and classes. Since IDs override these styles, they should be used sparingly and only on elements that need to always appear the same.  
    
Type Selector << Class Selector << ID Selector
Order of Specificity
- Chaining
    
    ```CSS
    h1.special {
    
    }
    
    // Styles the below element
    
    <h1 class='special'> Header 1 </h1>
    <h1 > Header 1.1 </h1> // not this one
    <p class='special'> Paragraph </p> // not this one
    ```
    
- Chaining
    
    ```CSS
    h1.special {
    
    }
    
    // Styles the below element
    
    <h1 class='special'> Header 1 </h1>
    <h1 > Header 1.1 </h1> // not this one
    <p class='special'> Paragraph </p> // not this one
    ```
    
- Descendant Combinator
    
    ```CSS
    h1 .special {
    
    }
    
    // Styles the below element
    
    <h1> <p class='special'> Paragraph </p> </h1> // this one
    <h1> <p> Paragraph </p> </h1> // not this one
    <p class='special'> Paragraph </p> // not this one
    
    ```
    
- Child Combinator
    
    ```CSS
    h1 > .special {
    
    }
    
    // Styles the below element
    
    <h1> <p class='special'> Paragraph </p> </h1> // this one
    <h1 > <p> Paragraph </p> </h1> // not this one
    <p class='special'> Paragraph </p> // not this one
    ```
    
- General Sibling Combinator
    
    ```CSS
    h1 ~ .special {
    
    }
    
    // Styles the below element
    
    <h1> Header </h1>
    <p> Paragraph </p>
    <p class='special'> Paragraph </p> // this one
    
    ```
    
- Adjacent Sibling Combinator
    
    ```CSS
    h1 + .special {
    
    }
    
    // Styles the below element
    
    <h1> Header </h1>
    <p class='special'> Paragraph </p> // this one
    <h1 > Header </h1>
    <p> Paragraph </p> // not this one
    ```
    
- CSS can select HTML elements by type, class, ID, and attribute.
- All elements can be selected using the universal selector.
- An element can have different states using the pseudo-class selector.
- Multiple CSS classes can be applied to one HTML element.
- Classes can be reusable, while IDs can only be used once.
- IDs are more specific than classes, and classes are more specific than type. That means IDs will override any styles from a class, and classes will override any styles from a type selector.
- Multiple [selectors](https://www.codecademy.com/resources/docs/css/selectors) can be chained together to select an element. This raises the specificity but can be necessary.
- Nested elements can be selected by separating selectors with a space.
- Multiple unrelated selectors can receive the same styles by separating the selector names with commas.