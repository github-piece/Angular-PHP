<?php
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding");

	include_once("connection.php");
	$postdata = file_get_contents("php://input");


	if(isset($postdata) && !empty($postdata)){
		
		$request = json_decode($postdata);
		$userId = $request->userId;
		$action = $request->action;
		$return_arr = array();

		if($userId === '')
		{
			return http_response_code(400);
		}
		//$sql = "SELECT * FROM tbl_business WHERE u_id ='".$userid."'";
		$sql = "SELECT tbl_business.*, tbl_user.u_email, tbl_user.u_avatar, tbl_user.u_name FROM tbl_business LEFT JOIN tbl_user ON tbl_business.u_id = tbl_user.u_id";
		$result = mysqli_query($conn, $sql);
		$i = 1;

		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$row_array['id'] = $row['id'];
			$row_array['no'] = $i;

			$row_array['u_id'] = $row['u_id'];
			$row_array['u_email'] = $row['u_email'];
			$row_array['business'] = $row['sector'];
			$row_array['tenure'] = $row['tenure to see return'];
			$row_array['goal'] = $row['goal name'];
			$row_array['name'] = $row['business name'];
			$row_array['country'] = $row['country'];
			$row_array['address'] = $row['address'];
			$row_array['business_id'] = $row['business_id'];
			$row_array['pic'] = 'mse/'.$row['image for front page'];
			$row_array['userName'] = $row['u_name'];
			if (substr($row['u_avatar'], 0, 6) == 'https:') {
				$row_array['avatar'] = $row['u_avatar'];
			} else {
				$row_array['avatar'] = 'mse/uploaded/avatar/'.$row['u_avatar'];
			}
			$row_array['amount'] = $row['how much they\'re raising'];
			array_push($return_arr, $row_array);
			$i++;
		}
		echo json_encode($return_arr);	
	}
	$conn->close();
?>
