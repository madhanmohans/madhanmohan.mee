---
aliases:
  - "Php smallest of two numbers "
---

<html>
<head>
<title>PHP Program To find out the Smallest of given two numbers</title>
</head>
<body>
<form method="post">
<table border="0">
<tr>
<td> <input type="text" name="num1" value="" placeholder="Enter 1st number"/>
</td>
</tr>
<tr>
<td> <input type="text" name="num2" value="" placeholder="Enter 2nd number"/>
</td>
</tr>
<tr>
<td> <input type="submit" name="submit" value="Submit"/>
</td>
</tr>
</table>
</form>
<?php
if(isset($_POST['submit']))
{
$num1 = $_POST['num1'];
$num2 = $_POST['num2'];
echo "Given Input : ";
echo $num1;
echo $num2;
if($num1 < $num2)
echo "$num1 is smallest number.";
else
echo "$num2 is smallest number.";
return 0;
}
?>
</body>
</html>