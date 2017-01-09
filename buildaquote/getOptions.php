<?php

/**
 *
 * @author Tavo
 */

setlocale(LC_MONETARY, 'en_US.UTF-8');



$docOpen = "<li data-selection=\"accessories\" class=\"builder-step first-load\">"
        . "<section class=\"cd-step-content\">"
        . "<header>"
        . "<h1>Options</h1>"
        . "<span class=\"steps-indicator\">Step <b>2</b> of 3</span>"
        . "</header>"
        . "<p>This quoting system does not present all possible configuration options. For advanced sandwich configurations, contact us.</p>"
        . "<br>";					
$categoryOpen = "<div class=\"category\">";                       
			
$requiredCatOpen = "<ul class=\"accessories-list options-list required";		
             
$optionPlaceHolder = "<p>None</p> <span class=\"opPrice\"></span>";
$optionOpen = "<li class=\"js-option js-radio\" data-price=\"";

$radio = "<div class=\"radio\"></div>";

$catOpen = "<ul class=\"accessories-list options-list";

  
$categoryExtraOpen = "<div class=\"category extra\">";
$catExtraOpen = "<ul class=\"accessories-list options-list extra\" >";
 
$extraText = "<h1>Extra cost/discount</h1><li>"
        . "<p>Enter description:</p>"
        . "<input type=\"text\" class=\"desc\" name=\"extraDesc\" id='extraDesc'><br>"
        . "<p>Cost (negative for discount):</p>"
        . "<span class=\"input-symbol-dollar\">"
        . "<input type=\"number\" class=\"cost\" name=\"extraCost\" id='extraCost'></span><br></li> ";
                         		

        
$mobileFoot = "<div class=\"mobile-only\">"
        . "<p>Select required options to continue.</p>"
        . "</div>";
            
            
 $sumOpen = "</section></li>"
         . "<li data-selection=\"summary\" class=\"builder-step first-load\">"
         . "<section class=\"cd-step-content\">"
         . "<header>"
         . "<h1>Summary</h1>"
         . "<span class=\"steps-indicator\">Step <b>3</b> of 3</span>"
         . "</header>"
         . "<ul class=\"summary-list\">"
         . "<li><h2>Model</h2>";        
$imgPreviewOpen = "<img src=\"";	

$imgPreviewClose = "class=\"product-preview\">";

$docClose = "<li data-summary=\"accessories\">"
        . "<h2>Options</h2>"
        . "<ul class=\"summary-accessories options\"></ul>"
        
        ."<li></li>"
        . "<h2>Quote Overview</h2></li>"
        . "<ul class=\"summary-accessories additional-products\">"
        . "<table><tr><td style='text-align:center;'><p>You have 1 item in your quote. Click below to add another to your quote.<p></td></tr></table>"
        . "</ul>"
        
         ."<li></li>"
        . "<ul class=\"summary-accessories\"></ul>"
        . "<form action='' id=\"comment\" class=\"comment\" method = \"POST\"> "
        . "<h2>Comment</h2>"
        . " <textarea name=\"comment\" id=\"textcomment\"  placeholder=\"Enter your comment here! This will be included in the generated quote.\"></textarea> "
        . "</form>"
        . "<form class=\"emailform\">"
        . "<input style=\"width:45%;\" type=\"email\" name =\"email\" class=\"email\" placeholder=\"Enter your email\" required>"
        . "<input type=\"submit\" value=\"Email Quote\" class=\"emailbutton\" >"
        . "</form>"
        . "<div id='blank' style='height:\"100px;\"'></div>"
        . " <script>   "
        . "</script>"
        . "</li>"
        . "</ul>"
        . "</section>"
        . "</li>";



if ( isset($_GET["product"]) ) {
    $product = $_GET['product'];
    $image = $_GET['image'];
    $desc =  $_GET['description'];        
    
    $config = parse_ini_file("config.ini");
    $link = mysql_connect('localhost', $config['dbuser'], $config['dbpassword'])
    or die('Could not connect: ' . mysql_error());
    mysql_select_db($config['database']) or die('Could not select database');

    $catTable = "Categories_Table";
    $opTable = "Options_Table";
    
    $query = 'SELECT * FROM '. $catTable . ' WHERE Product = \'' . $product . '\' OR Product = \'All\'';
    $result = mysql_query($query) or die('Query failed: ' . mysql_error());
    
    $categories = array();
    $catDescriptions = array();
    $catRequired = array();
    $service = array();
    while($row = mysql_fetch_array($result,MYSQLI_ASSOC)){
        $categories[] = $row['Name'];
        $catDescriptions[] = $row['Description'];
        $catRequired[] = $row['Required'];
        $service[] = $row['Service'];
    }
    
    echo $docOpen;
    
    for($i = 0; $i < count($categories); ++$i) {
        
      $query = 'SELECT * FROM '. $opTable . ' WHERE Category = \'' . $categories[$i] . '\'';
      $result = mysql_query($query) or die('Query failed: ' . mysql_error());
       
      
        echo $categoryOpen;
        
       $fin = "\">";     
       if($service[$i]==1){
           $fin = " service\">";
       }
        
        if($catRequired[$i] == 1){
          echo $requiredCatOpen . $fin; //Required Option
          echo "<h1>". $catDescriptions[$i] . " (Required)</h1>";
        }
        else{
          echo $catOpen . $fin;     //Not Required
          echo "<h1>". $catDescriptions[$i] . "</h1>";
        }
        echo $optionPlaceHolder;
        
        
        
        while($row = mysql_fetch_array($result,MYSQLI_ASSOC)){

            echo $optionOpen . $row['Cost'] . "\">";
            echo "<p>" . $row['Description'] . "</p>";
            
            if( ($row['Cost'] >= 1.0) || ($row['Cost'] <= -1.0) || ($row['Cost'] == 0)  ){
                if( $row['Cost'] == 0){
                    echo "<span class=\"price\">Free!</span>";
                }
                else{
                    echo "<span class=\"price\"> " . money_format('%.2n', floatval($row['Cost'])) . "</span>";
                }
                
            }
            
            else{  //Cost is a percentage
                echo "<span class=\"price\"> " . intval(floatval($row['Cost'])*100) . "% of Hardware Cost</span>"  ;
            }
            
            echo $radio . "</li>";
        }
        echo "</ul>"
        . "</div>";
    }
mysql_close($link);    
    
echo $categoryExtraOpen . $catExtraOpen . $extraText . "</ul></div>";    
    
echo  $mobileFoot;
        
echo $sumOpen . $imgPreviewOpen
        . $image
        . "\" alt=\"" . $product . "\" " 
        . $imgPreviewClose;
echo "<h3>".$desc ."</h3>";
echo "<p>Made with extra love";
echo "</li>";
echo $docClose;

   
}

       
		
              
	
