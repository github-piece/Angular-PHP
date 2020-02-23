<?php

	include_once("connection.php");
	$return_arr = array();

	$postdata = file_get_contents("php://input");
	if(isset($postdata) && !empty($postdata)){
		$request = json_decode($postdata);
		$userid = $request->userid;
		$sql = "select b_country,  COUNT(*) as b_count  from tbl_business GROUP BY b_country";
		$result = mysqli_query($conn, $sql);
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$row_array['b_country'] = $row['b_country'];			
			$row_array['b_count'] = $row['b_count'];
			array_push($return_arr,$row_array);
		}
	}

	echo json_encode($return_arr);	

	$conn->close();
?>
