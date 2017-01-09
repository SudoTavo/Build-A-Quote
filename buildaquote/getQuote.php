<?php

// $output = "Progress";
//       echo $output;


if (isset($_POST["quoteData"]) && $_POST["costTable"]) {
    
    $quoteID = $_POST['quoteID'];
    $total = $_POST['total'];
    
    $dir = "temp/" . $quoteID ;
    

    
    if (!file_exists($dir)) {
         mkdir($dir, 0777, true);
    }
    
    $htmlFilePath = $dir . "/quote.html";
    
    $tableFilePath = $dir . "/table.txt";
    
    $htmlFile = fopen($htmlFilePath, "w") or die("Unable to open output file. Please try again");
    
    $tableFile = fopen($tableFilePath, "r") or die("Unable to read itemized list. Please try again");
    $table = fread($tableFile,filesize($tableFilePath));
    fclose($tableFile);
    
    $pdfFilePath = $dir . "/quote.pdf";
    if (!file_exists($pdfFilePath)) {
        unlink($pdfFilePath);
    }
    $options = $_POST['quoteData'];
    
    $comment = $_POST["comment"];
    
    $image = $_POST["image"];
    $desc = $_POST["description"];
    
    setlocale(LC_MONETARY, 'en_US.UTF-8');
    
    
   $date =  date("F jS, Y", strtotime(date("Y-m-d")));
    
   
    $txt = "<html><head><meta content=\"text/html; charset=UTF-8\" http-equiv=\"content-type\"><link rel=\"stylesheet\" href=\"../../css/styles.css\">";
    $txt .="</head><body class=\"c21\">"
            . "<h2 class=\"c4 c17\" id=\"h.ewge2v6acotx\">"
            . "<span>Sandwich Build-a-Quote</span></h2>"
            . "<p class=\"c4\"><span class=\"c13\">"
            . "Quote: </span><span>#".$quoteID."</span></p><p class=\"c4\"><span class=\"c13\">"
            . "Date: </span><span>"
            . $date;
            
           $txt.= "</span></p><p class=\"c4 c12\"><span></span></p><p class=\"c4 c12\"><span></span></p><a id=\"t.95398f24d88eafdde6a491b39ce570f497a9315d\"></a><a id=\"t.0\"></a>";
    
    $txt.= $table;
    
    
    $txt .=  "Pricing and specification subject to change. All amounts USD unless otherwise noted.";
    
    $txt.= "</span></p><p class=\"c4 c12\"><span></span></p><p class=\"c4 c12\"><span></span></p><a id=\"t.95398f24d88eafdde6a491b39ce570f497a9315d\"></a><a id=\"t.0\"></a>";
    
    if($comment!=""){
    $txt.="<p class=\"c4\"><span class=\"c13\">Comment</span>";
    $txt.= "<table><tr><td>" .$comment."</td></tr><table>";
    }
    
    fwrite($htmlFile, $txt);
    fclose($htmlFile);
    
    
    
    $exOut;
    exec("xvfb-run -a wkhtmltopdf '$htmlFilePath' '$pdfFilePath'");

    
    $summaryFilePath = $dir . "/summary.txt";    
    $summaryFile = fopen($summaryFilePath, "r") or die("Unable to get quote overview. Please try again" . $exOut);
    $summary = fread($summaryFile,filesize($summaryFilePath));
    fclose($summaryFile);
    
    
    $config = parse_ini_file("config.ini");
    $link = mysql_connect('localhost', $config['dbuser'], $config['dbpassword'])  or die('Could not connect: ' . mysql_error());
    //echo 'Connected successfully to mysql';
    mysql_select_db($config['database']) or die('Could not select database');
    $query = "REPLACE INTO Quotes_Table (QuoteID, ProductName, ItemTotalCost) VALUES ('" . $quoteID . "','" .$summary . "','" . $total . "')";
    $result = mysql_query($query) or die('Query failed: ' . mysql_error());
    
    mysql_close($link);    
    
    
    while (!file_exists($pdfFilePath)){
        sleep(1);
    }
    
    if( isset($_POST["email"]) && $_POST['email']!="none"){
        $email = $_POST['email'];
        $cmd = "python mail.py '$email' '$quoteID'";  	
	exec( $cmd, $scriptout );
         echo "Email sent to $email";
    }
    else{
        echo "Quote Ready!";
    }
   
    // header("Location: testfile.pdf");
    exit();
} else {
    echo "Error Level > 9000";
    exit();
}
?> 

