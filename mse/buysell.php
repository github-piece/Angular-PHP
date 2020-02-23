<?php
	include_once("connection.php");
	$postdata = file_get_contents("php://input");
	if(isset($postdata) && !empty($postdata)){
		$request = json_decode($postdata);
		$action = $request->action;
		switch($action){
			case "get_portfolio":
				get_portfolio($conn, $request);
				break;
			case "buy":
				buy_history($conn, $request);
				buy_portfolio($conn, $request);
				break;
			case "sell":
				sell_history($conn, $request);
				break;
			case "set";
				set_history($conn, $request);
				break;
			case "get";
				get_history($conn, $request);
				break;
			default:
				get_history($conn, $request);
				break;
		}
	}
	function get_portfolio($conn, $request){
		$return_arr = array();

		$user_id = $request->userid;
		$sql = "SELECT tbl_portfolio.*, tbl_business.* FROM tbl_portfolio left join tbl_business on tbl_portfolio.business_id = tbl_business.id WHERE tbl_portfolio.u_id ='".$user_id."'";
		$result = mysqli_query($conn, $sql);
		$i = 1;

		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$row_array['id'] = $row['id'];
			$row_array['no'] = $i;

			$row_array['u_id'] = $row['u_id'];
			$row_array['business_id'] = $row['business_id'];
			$row_array['b_name'] = $row['b_name'];
			$row_array['amount'] = $row['amount'];
			$row_array['b_address'] = $row['b_address'];
			$row_array['b_location'] = $row['b_location'];
			
			array_push($return_arr,$row_array);
			$i++;
		}
		echo json_encode($return_arr);	
	}
	
	function get_history($conn, $request){
		$return_arr = array();
		$user_id = $request->userid;
		$action = $request->action;
		if($action == "get")
			$sql = " SELECT tbl_history.*, tbl_user.u_name FROM tbl_history LEFT JOIN tbl_user ON tbl_history.u_id = tbl_user.u_id WHERE tbl_history.u_id = '".$user_id."'";
		if($action == "get_all")
			// $sql = "SELECT tbl_history.*, tbl_business.b_name, tbl_user.u_name, tbl_business.b_companysector FROM tbl_history left join tbl_business on tbl_history.business_id = tbl_business.id left join tbl_user on tbl_history.u_id = tbl_user.u_id";
			$sql = "SELECT tbl_business.*, tbl_history.*, tbl_user.u_name FROM tbl_history LEFT JOIN tbl_business ON tbl_history.business_id = tbl_business.business_id LEFT JOIN tbl_user ON tbl_history.u_id = tbl_user.u_id WHERE tbl_business.u_id = '".$user_id."'";
		$result = mysqli_query($conn, $sql);
		if($action == "get") {
			while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
				// if($action == "get_all")
				// 	$row_array['u_name'] = $row['u_name'];
					
				$row_array['u_id'] = $row['u_id'];
				$row_array['business_id'] = $row['business_id'];
				$row_array['amount'] = $row['amount'];
				$row_array['fundtype'] = $row['fundtype'];
				$row_array['rate'] = $row['rate'];
				$row_array['frequency'] = $row['frequency'];
				$row_array['type'] = $row['type'];
				$row_array['userName'] = $row['u_name'];
				
				// if($row['b_companysector'] == 1)
				// 	$row_array['b_companysector'] = "Agriculture";
				// if($row['b_companysector'] == 2)
				// 	$row_array['b_companysector'] = "Industrial";
				// if($row['b_companysector'] == 3)
				// 	$row_array['b_companysector'] = "Resources";
				
	
				$row_array['date_created'] = $row['date_created'];
				
				// if($row['type'] == "buy"){
				// 	$row_array['state'] = "I bought ".$row_array['b_companysector'];
				// }
				// if($row['type'] == "sell"){
				// 	$row_array['state'] = "I selled ".$row_array['b_companysector'];
				// }			
	
				array_push($return_arr, $row_array);
			}
		}
		if($action == "get_all") {
			while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
				$row_array['date_created'] = $row['date_created'];
				$row_array['business_id'] = $row['business_id'];
				$row_array['userName'] = $row['u_name'];
				$row_array['amount'] = $row['amount'];
				$row_array['fundtype'] = $row['fundtype'];
				$row_array['rate'] = $row['rate'];
				$row_array['frequency'] = $row['frequency'];
				$row_array['businessName'] = $row['business name'];
				array_push($return_arr, $row_array);
			}
		}
		echo json_encode($return_arr);	
	}

	function buy_portfolio($conn, $request){
		$amount = $request->amount;
		$business_id = $request->business_id;
		$user_id = $request->userid;
		date_default_timezone_set('Africa/Johannesburg');
		$date = date('Y-m-d h:i:s a', time());
		
		//updating remaining in tbl_business
		$sql = "SELECT b_remaining FROM tbl_business WHERE id = '".$business_id."'";
		$result = mysqli_query($conn, $sql);
		$remain_row = mysqli_fetch_assoc($result);
		$remain = $remain_row['b_remaining'];
		$remain = (int)$remain - (int)$amount;

		
		$sql = "UPDATE tbl_business SET b_remaining = '".$remain."' WHERE id = '".$business_id."'";
		$result = mysqli_query($conn, $sql) or die("error to insert employee data");
		//-------
		
		$sql = "SELECT * FROM tbl_portfolio WHERE business_id ='".$business_id."' AND u_id = '".$user_id."' LIMIT 1";
		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_assoc($result);
		
		if($row['id'] != NULL){    //again buying
			$amount = (int)$row['amount'] + (int)$amount;
			$sql = "UPDATE tbl_portfolio SET amount = '".$amount."' WHERE id = '".$row['id']."'";
		}
		else
			$sql = "INSERT INTO `tbl_portfolio` (u_id, business_id, amount, date_created) VALUES('" . $user_id . "', '" . $business_id . "','" . $amount . "', '". $date ."'); ";
		
		echo mysqli_query($conn, $sql) or die("error to insert employee data");
	}
	
	function buy_history($conn, $request){
		$u_id = $request->userId;
		$business_id = $request->businessId;
		$amount = $request->amount;
		$fundType = $request->fund;
		$rate = $request->rate;
		$frequency = $request->frequency;
		date_default_timezone_set('Africa/Johannesburg');
		$date = date('Y-m-d h:i:s a', time());
		$sql = "INSERT INTO `tbl_history` (u_id, business_id, amount, fundtype, rate, frequency, type, date_created)
			VALUES
			(
				'".$u_id."', 
				'".$business_id."',
				'".$amount."',
				'".$fundType."',
				'".$rate."',
				'".$frequency."',
				'buy',
				'".$date."'
			);";
		echo mysqli_query($conn, $sql) or die("error to insert employee data");
	}
	
	function sell_history($conn, $request){
		$amount = $request->amount;
		$amount_history = $request->amount;
		$business_id = $request->business_id;
		$user_id = $request->userid;
		date_default_timezone_set('Africa/Johannesburg');
		$date = date('Y-m-d h:i:s a', time());

		/*$row_array = array();
		$row_array = checkExistForSell($conn, $request);
		if($row_array['id'] == ""){
			echo 0;
			return;
		}
		date_default_timezone_set('Africa/Johannesburg');
		$date = date('Y-m-d h:i:s a', time());
		
		$amount = (int)$row_array['amount'] - (int)$amount;

		$sql = "UPDATE tbl_portfolio SET amount = '".$amount."' WHERE id = '".$row_array['id']."'";
		$result = mysqli_query($conn, $sql) or die("error to insert employee data");*/
		
		$sql = "SELECT * FROM `tbl_business` WHERE id = '".$business_id."' LIMIT 1";
		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_assoc($result);
		$quantity = (int)$row['b_remaining'] + (int)$amount;
		
		$sql = "UPDATE tbl_business SET b_remaining = '".$quantity."' WHERE id = '".$business_id."' LIMIT 1";
		$result = mysqli_query($conn, $sql) or die("error to insert employee data");
		
		$sql = "INSERT INTO `tbl_history` (u_id, business_id, amount, type, date_created) VALUES('" . $user_id . "', '" . $business_id . "','" . $amount_history . "','sell', '". $date ."'); ";
		echo mysqli_query($conn, $sql) or die("error to insert employee data");
		
	}
	
	function checkExistForSell($conn, $request){
		$amount = $request->amount;
		$business_id = $request->business_id;
		$user_id = $request->userid;

		$sql = "SELECT * FROM `tbl_portfolio` WHERE id = '".$business_id."' AND u_id = '".$user_id."' AND amount > '".$amount."' LIMIT 1";
		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_assoc($result);
		return $row;
	}

	function set_history($conn, $request) {
		$u_id = $request->userId;
		$business_id = $request->businessId;
		$balance = $request->balance;
		$amount_to_buy = $request->amount;
		$fundType = $request->fund;
		$rate = $request->rate;
		$frequency = $request->frequency;
		$merchant_id = $request->merchant_id;
		$merchant_key = $request->merchant_key;
		$sql = "INSERT INTO tbl_buyer_transaction (u_id, business_id, balance, amount_to_buy, fundType, rate, frequency, merchant_id, merchant_key)
		VALUES (
			'".$u_id."',
			'".$business_id."',
			'".$balance."',
			'".$amount_to_buy."',
			'".$fundType."',
			'".$rate."',
			'".$frequency."',
			'".$merchant_id."',
			'".$merchant_key."'
		)";
		mysqli_query($conn, $sql);
	}
	$conn->close();
?>
