
<?php
	$servername = "";
	$username = "";
	$password = "";
	$dbname = "";
	$conn = mysql_connect($servername, $username, $password, $dbname);
	// Check connection
	
	
	$query = "SELECT * FROM printers.printdata";
	$result = mysql_query($query);
	$insertcount = 0;
	$return = "";
	
	while($row = mysql_fetch_array($result)){
		if($insertcount == 0){
		$return.= '<div class="entry-content"><div class="uw-outer-row row-1 default-background" ><div class="uw-inner-row">';
		}
		$status = "";
		$name = $row['name'];
		$timetotal = $row['timetotal'];
		$timeelapsed = $row['timeelapsed'];
		$material = $row['material'];
		$manualstatus = $row['manualstatus'];
		$autostatus = $row['autostatus'];
		$snapshot = $row['snapshot'];
		$timeunit = "";
		$timeleft = $timetotal - $timeelapsed;
	    $percentagevalue = round (($timeleft / $timetotal) * 100);
		if ($timeleft <= 90)  {
			$timeunit = "seconds";
			
		}
		else if ($timeleft < 3600 & $timeleft > 90){
			$timeunit = "minutes";
	        $timeleft = $timeleft/60;
		} 
		else {
			$timeunit = "hours";
			$timeleft = $timeleft/3600;
		}
		
	
		if ($manualstatus == 'working'){
		$status = $autostatus;
		}
		else {
		$status = $manualstatus;
		}
		$return .= '<div class="uw-column three-column"><div class="uw-pe uw-pe-text_block"><div class="uw-content-box">';
		$return .= "\r\n
		<b>Name</b>: $name
		<br>
		<b>Status</b>: $status
	    <br>
		<b>Material</b>: $material
		<br>
		<b>Time Left</b>: $timeleft $timeunit
		<br>
		<progress value='$percentagevalue' max='100'>
        </progress>$percentagevalue%
		<img src='$snapshot'>
		<br>";
		$return .= '</div></div></div>';
			    $insertcount++;
		if($insertcount == 3) {
			$return .= '</div></div></div>';
			$insertcount = 0;
		}
	}		
	if ($return != ""){
	echo $return;
	}		
	mysql_close($con);
?> 
