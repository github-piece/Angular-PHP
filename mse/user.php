<?php
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding");
	include_once("connection.php");
	$method = isset($_POST["action"]) != '' ? $_POST["action"] : '';
	if ($method == 'upload') {
		uploadPhoto($_POST, $conn);
	} else if ($method == 'create') {
		createUser($_POST, $conn);
	} else if ($method == 'social') {
		socialLogin($_POST, $conn);
	} else {
		$postdata = file_get_contents("php://input");
		if(isset($postdata) && !empty($postdata)){
			$request = @json_decode($postdata);
			$action = $request->action;
			$u_email = $request->u_email;
			$sql = "SELECT u_id FROM tbl_user WHERE u_email = '".$u_email."'";
			$result = $conn->query($sql);
			while($row = $result->fetch_assoc()) {
				$u_id = $row['u_id'];
			}
			switch($action){
				case "get":
					getUserList($request, $conn, $u_id);
					break;
				case "signup":
					registerUser($request, $conn);
					break;
				case "login":
					loginUser($request, $conn);
					break;
				case "sendmail":
					sendMail($request, $conn);
					break;
				case "freeze":
					setFreezeUser($request, $conn);
					break;
				case "update":
					updateUser($request, $conn);
					break;
				case "changepwd":
					ChangePwd($request, $conn, $u_id);
					break;
				case "freezeflag":
					getFreezeflag($request, $conn, $u_id);
					break;
				case "social":
					socialLogin($request, $conn);
					break;
			}
		}
	}
	function getFreezeflag($request, $conn, $u_id){
		$sql = "SELECT * FROM tbl_user WHERE u_id = '".$u_id."' LIMIT 1";
		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_assoc($result);
		echo json_encode($row);
	}
	function ChangePwd($request, $conn, $u_id){
		if(trim($u_id) === '')
		{
			return http_response_code(400);
		}
		$confirm_pwd = mysqli_real_escape_string($conn, trim($request->confirm_pwd));
		$sql = "UPDATE tbl_user SET u_password = '".$confirm_pwd."' WHERE u_id = '".$u_id."'";
		$result = mysqli_query($conn, $sql) or die("error to insert employee data");
		getUserList($request, $conn, $u_id);

	}
	function updateUser($request, $conn, $u_id){
		if(trim($request->seleted_uid) === '')
		{
			return http_response_code(400);
		}
		$seleted_uid = mysqli_real_escape_string($conn, trim($request->seleted_uid));
		$radio_accounttype = mysqli_real_escape_string($conn, trim($request->radio_accounttype));
		$sql = "UPDATE tbl_user SET u_accounttype = '".$radio_accounttype."' WHERE u_id = '".$seleted_uid."'";
		$result = mysqli_query($conn, $sql) or die("error to insert employee data");
		getUserList($request, $conn, $u_id);

	}
	function setFreezeUser($request, $conn, $u_id){
		if(trim($request->seleted_uid) === '')
		{
			return http_response_code(400);
		}
		$seleted_uid = mysqli_real_escape_string($conn, trim($request->seleted_uid));
		$userstate = mysqli_real_escape_string($conn, trim($request->userstate));
		switch($userstate){
			case "inactive":
				$activeflag = 1;
			break;
			case "active":
				$activeflag = 0;
			break;
		}
		$sql = "UPDATE tbl_user SET u_freezedflag = '".$activeflag."' WHERE u_id = '".$seleted_uid."'";
		$result = mysqli_query($conn, $sql) or die("error to insert employee data");
		getUserList($request, $conn, $u_id);

	}
	function getUserList($request, $conn, $u_id){
		if(trim($request->u_accounttype) === '')
		{
			return http_response_code(400);
		}
		$u_accounttype = mysqli_real_escape_string($conn, trim($request->u_accounttype));
		$where = "";

		switch($u_accounttype){
			case "Super Admin":
				$where = " WHERE u_accounttype NOT LIKE '%Super%'";
				break;
			case "Senior Admin":
				$where = " WHERE u_accounttype NOT LIKE '%Senior%' AND u_accounttype NOT LIKE '%Super%'";
				break;
			case "Junior Admin":
				$where = " WHERE u_accounttype LIKE '%Moderator%' OR u_parentid = '".$u_id."'";
				break;
			case "Moderator":
				$where = " WHERE u_parentid = '".$u_id."'";
				break;
			case "User":
				$where = " WHERE u_id = -1";
				break;

		}
		$return_arr = array();

		$sql = "SELECT * FROM tbl_user ".$where;
		$result = mysqli_query($conn, $sql);
		$i = 1;
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$row_array['u_id'] = $row['u_id'];
			$row_array['u_name'] = $row['u_name'];
			$row_array['u_email'] = $row['u_email'];
			$row_array['u_createddate'] = $row['u_createddate'];
			$row_array['no'] = $i;
			$row_array['u_freezedflag'] = $row['u_freezedflag'];
			$row_array['u_accounttype'] = $row['u_accounttype'];
			$row_array['password'] = $row['u_password'];
			$row_array['u_avatar'] = $row['u_avatar'];

			if($row['u_freezedflag'] == 0)
				$row_array['u_active'] = "Active";
			else
				$row_array['u_active'] = "InActive";

			array_push($return_arr,$row_array);
			$i++;
		}
		echo json_encode($return_arr);
	}
	function checkDuplicateMail($u_email, $conn){
		$checkedState = 0;
		$sql = "SELECT u_id FROM tbl_user WHERE u_email = '".$u_email."' LIMIT 1";
		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_assoc($result);
		if(count($row) > 0)
			$checkedState = 1;

		return $checkedState;


	}
	function registerUser($request, $conn){
		if(trim($request->u_name) === '' || trim($request->u_email) === '' || trim($request->u_password) === '' || trim($request->u_phonenum) === '')
		{
			return http_response_code(400);
		}

		$u_name = mysqli_real_escape_string($conn, trim($request->u_name));
		$u_email = mysqli_real_escape_string($conn, trim($request->u_email));
		$u_password = mysqli_real_escape_string($conn, trim($request->u_password));
		$u_phonenum = mysqli_real_escape_string($conn, trim($request->u_phonenum));
		$today = date("Y-m-d");

		if(checkDuplicateMail($u_email, $conn) == 1){
			echo 2;
			return;
		}

		$sql = "INSERT INTO tbl_user (u_name, u_password, u_email, u_phonenum, u_createddate, u_accounttype) VALUES('".$u_name."', '".$u_password."', '".$u_email."', '".$u_phonenum."', '". $today."', 'Moderator')";

		if ($conn->query($sql) === TRUE) {
			echo 1;
		}else {
			echo 0;
		}

	}
	function socialLogin($request, $conn){
		$u_name = $request->name;
		$u_email = $request->email;
		$u_avatar = $request->photoUrl;
		$authToken = $request->authToken;
		$idToken = $request->idToken;
		$provider = $request->provider;
		$today = date("Y-m-d");

		$sql = "SELECT authToken FROM tbl_user WHERE u_email = '".$u_email."'";
		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_assoc($result);
		$return_arr = array();
		if (count($row) == 0) {
			$sql = "INSERT INTO tbl_user (u_name, u_email, u_avatar, u_createddate, u_accounttype, authToken, idToken, provider, socialUser) 
			VALUES('".$u_name."', '".$u_email."', '".$u_avatar."', '".$today."', 'Moderator', '".$authToken."', '".$idToken."', '".$provider."', 1)";
			$result = $conn->query($sql);
		}
		$sql = "SELECT * FROM tbl_user WHERE u_email = '".$u_email."'";
		$result = mysqli_query($conn, $sql);
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$row_array['u_id'] = $row['u_id'];
			$row_array['u_name'] = $row['u_name'];
			$row_array['u_email'] = $row['u_email'];
			$row_array['u_createddate'] = $row['u_createddate'];
			$row_array['u_freezedflag'] = $row['u_freezedflag'];
			$row_array['u_accounttype'] = $row['u_accounttype'];
			$row_array['password'] = $row['u_password'];
			$row_array['u_avatar'] = $row['u_avatar'];

			if($row['u_freezedflag'] == 0)
				$row_array['u_active'] = "Active";
			else
				$row_array['u_active'] = "InActive";

			array_push($return_arr,$row_array);
		}
		echo json_encode($return_arr);
	}
	function loginUser($request, $conn){
		if(trim($request->u_email) === '' || trim($request->u_password) === '')
		{
			return http_response_code(400);
		}

		$u_email = mysqli_real_escape_string($conn, trim($request->u_email));
		$u_password = mysqli_real_escape_string($conn, trim($request->u_password));
		$sql = "SELECT * FROM tbl_user WHERE u_email ='".$u_email."' AND u_password = '".$u_password."' LIMIT 1";

		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_assoc($result);
		if($row['u_id'] != NULL){
			$json_data = array(
				"status" => 1,
				"u_id" => $row['u_id'],
				"u_parentid" => $row['u_parentid'],
				"u_name" => $row['u_name'],
				"u_email" => $row['u_email'],
				"u_freezedflag" => $row['u_freezedflag'],
				"u_password" => $row['u_password'],
				"u_createddate" => $row['u_createddate'],
				"u_accounttype" => $row['u_accounttype'],
				"u_phonenum" => $row['u_phonenum'],
				"u_avatar" => 'mse/uploaded/avatar/'.$row['u_avatar']
			);
		}else
		{
			$json_data = array(
				"status" => 0
			);
		}
		echo json_encode($json_data);
	}
	function sendMail($request, $conn){
		if(trim($request->u_email) === '')
		{
			return http_response_code(400);
		}
		 $to = $request->u_email;
		 echo $to;
         $subject = "Reset password from Mse.";

         $message = "<b>Reset password from Mse.</b>";
         $message .= "<h1>If you want to reset password Please click below link.</h1>";
		 $message .= "<br/> <a href='http://localhost:3000/sendmail'></a>";

         $header = "From:mse.support@mse.com \r\n";
         $header .= "Cc:afgh@somedomain.com \r\n";
         $header .= "MIME-Version: 1.0\r\n";
         $header .= "Content-type: text/html\r\n";

         $retval = mail ($to,$subject,$message,$header);

         if( $retval == true ) {
            echo "Message sent successfully...";
         }else {
            echo "Message could not be sent...";
         }
	}
	function createUser($param, $conn){

		$username = $param['name'];
		$u_email = $param['email'];
		$u_pwd = $param['password'];
		$radio_accounttype = 'User';
		$parentID = $param['adminId'];

		date_default_timezone_set('Africa/Johannesburg');
		$date = date('Y-m-d h:i:s a', time());

		if(checkDuplicateMail($u_email, $conn) == 1){
			return;
		}
		$filename = isset($_FILES["file"]["name"]) != '' ? $_FILES["file"]["name"] : '';
		if(!empty($filename)){
			if(is_uploaded_file($_FILES['file']['tmp_name']))
			{
				$t = time();
				$ext = '.' . pathinfo($filename, PATHINFO_EXTENSION);
				$generatedName = md5($t . $filename) . $ext;
				if( $filename != '' ){
					move_uploaded_file($_FILES['file']['tmp_name'], 'uploaded/avatar/'. $generatedName);
				}

			}
		}
		$sql = "INSERT INTO tbl_user (u_name, u_password, u_email, u_phonenum, u_createddate, u_accounttype, u_parentid, u_avatar) 
		VALUES('".$username."', '".$u_pwd."', '".$u_email."', '', '". $date."', '".$radio_accounttype."', '".$parentID."', '".$generatedName."')";
		$result = mysqli_query($conn, $sql) or die("error to insert employee data");
	}
	function uploadPhoto($param, $conn) {
		$filename = isset($_FILES["file"]["name"]) != '' ? $_FILES["file"]["name"] : '';
		if(!empty($filename)){
			if(is_uploaded_file($_FILES['file']['tmp_name']))
			{
				$t = time();
				$ext = '.' . pathinfo($filename, PATHINFO_EXTENSION);
				$generatedName = md5($t . $filename) . $ext;
				if( $filename != '' ){
					move_uploaded_file($_FILES['file']['tmp_name'], 'uploaded/avatar/'. $generatedName);
				}

			}
		}
		$sql = "UPDATE tbl_user SET u_avatar = '".$generatedName."' WHERE u_email = '".$param['userEmail']."'";
		$result = $conn->query($sql);
		$sql = "SELECT * From tbl_user WHERE u_email = '".$param['userEmail']."'";
		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_assoc($result);
		$json_data = array(
			"status" => 1,
			"u_id" => $row['u_id'],
			"u_parentid" => $row['u_parentid'],
			"u_name" => $row['u_name'],
			"u_email" => $row['u_email'],
			"u_freezedflag" => $row['u_freezedflag'],
			"u_password" => $row['u_password'],
			"u_createddate" => $row['u_createddate'],
			"u_accounttype" => $row['u_accounttype'],
			"u_phonenum" => $row['u_phonenum'],
			"u_avatar" => $row['u_avatar']
		);
		echo json_encode($json_data);
	}

	$conn->close();
?>
