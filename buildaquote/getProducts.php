<?php

/**
 *
 * @author Tavo
 */

$config = parse_ini_file("config.ini");
$link = mysql_connect('localhost', $config['dbuser'], $config['dbpassword'])
    or die('Could not connect: ' . mysql_error());
//echo 'Connected successfully to mysql';
mysql_select_db($config['database']) or die('Could not select database');

$table = "Products_Table";

$query = 'SELECT * FROM ' . $table;
$result = mysql_query($query) or die('Query failed: ' . mysql_error());


while($row = mysql_fetch_array($result,MYSQLI_ASSOC)){

    echo "<li class=\"js-option js-radio\" data-price=\"0.00\" data-model=\"" . $row['Name'] . "\">\n";
        echo "<span class=\"name\">" . $row['Description'] . "</span>\n";
        echo "<img src=\"" . $row['Image'] . "\" alt=\"" . $row['Name'] . "\">\n";
        echo "<span class=\"price\">from " . $row['StartingPrice'] . "</span>\n";
        echo "<div class=\"radio\"></div>\n"; 
    echo "</li>";
}
mysql_close($link);

