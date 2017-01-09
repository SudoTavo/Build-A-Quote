<?php

//echo "here 1";

if (isset($_POST["quoteData"]) && $_POST["table"]) 
    {
    
    $newTable = $_POST["table"];
    
    $quoteID = $_POST['quoteID'];
    $newPrice = floatval( $_POST['price']);
    
    $options = $_POST['quoteData'];
    $desc = $_POST['description'];
    
    setlocale(LC_MONETARY, 'en_US.UTF-8');

    $dir = "temp/" . $quoteID ;
    
 //   echo "here 1.5";
    
    if (!file_exists($dir)) {
         mkdir($dir, 0777, true);
    }
    
    $tableFilePath = $dir . "/table.txt";
    $totalFilePath = $dir . "/total.txt";
    $summaryFilePath = $dir . "/summary.txt";
    
    $summaryFile = fopen($summaryFilePath, "a+") or die("Unable to open file!");
    $desc.= "{";
     fwrite($summaryFile, $desc);
    
     foreach ($options as $collect) {
      $op = json_decode($collect);
      $opName = (string) $op->option ;    
      $opName.=", ";
      
      fwrite($summaryFile, $opName);
      }
      fwrite($summaryFile,"}, ");
     fclose($summaryFile);
      
    $search = "<tr><th>Grand Total:</th><th>";
    
 //   echo "here 2";
    
    if (file_exists($tableFilePath) && file_exists($totalFilePath)) {
        
     //   echo "here 3";
        
        $tableFile = fopen($tableFilePath, "r") or die("Unable to open file!");
        $oldTable = fread($tableFile,filesize($tableFilePath));
        fclose($tableFile);
        $totalFile = fopen($totalFilePath, "r") or die("Unable to open file!");
        $total = fgets($totalFile);   
       // echo $total;
        
        $total = floatval($total) + floatval($newPrice);
        $totalRaw = $total;
        fclose($totalFile);
        
        $total = money_format('%.2n', floatval($total ));
        
        $oldTable = str_replace("<table>", "", $oldTable);
        
        //Get rid of extra table tags
        $newTable = strpos($newTable, $search) ? substr($newTable, 0, strpos($newTable, $search)) : $newTable;
        $oldTable = strpos($oldTable, $search) ? substr($oldTable, 0, strpos($oldTable, $search)) : $oldTable;
        
        $oldTable .= $search . $total . "</th></tr> </table>";
        
        $outTable = $newTable . $oldTable;                 
            
            $tableFile = fopen($tableFilePath, "w") or die("Unable to open file!");
            fwrite($tableFile, $outTable);
            fclose($tableFile);
            
                    $total = floatval($total) + floatval($newPrice);
        
            
            
            $totalFile = fopen($totalFilePath, "w") or die("Unable to open file!");
            fwrite($totalFile, $totalRaw);
            fclose($totalFile);
            
        echo $outTable;
        
    }
    else{
        
      //  echo "here 3+";
        
        $tableFile = fopen($tableFilePath, "w") or die("Unable to open file!");
        
        //Get rid of extra table tag
        $newTable = strpos($newTable, $search) ? substr($newTable, 0, strpos($newTable, $search)) : $newTable;
        
        
         $totalRaw = $newPrice;
        
         $total = money_format('%.2n', floatval($newPrice));
        $newTable .= $search . $total . "</th></tr> </table>";
        
            fwrite($tableFile, $newTable);
            fclose($tableFile);
            
           $totalFile = fopen($totalFilePath, "w") or die("Unable to open file!");
            fwrite($totalFile, $totalRaw);
            fclose($totalFile);
            
        echo $newTable;    
    }
    
    
    
}
else{
    echo "Error!";
}
    exit();
    
?> 

