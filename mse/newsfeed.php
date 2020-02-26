<?php
header('Access-Control-Allow-Origin');
?>

<?php
	include_once("connection.php");

	$postdata = file_get_contents("php://input");
	
	if(isset($postdata) && !empty($postdata)){

		$request = json_decode($postdata);
		$action = $request->action;
		switch($action){
			case "get_admin":
				$where = " WHERE tbl_article.account_type LIKE '%Admin%'";
				break;
			case "get_user":
				$where = " WHERE tbl_article.account_type LIKE '%Moderator%' OR tbl_article.account_type LIKE '%User%'";
				break;
			case "get_all":
				$where = "";
				break;
		}
		getArticleList($request, $conn, $where);
	}
	
	function getArticleList($request, $conn, $where){
		if(trim($request->u_accounttype) === '')
		{
			return http_response_code(400);
		}
		$u_accounttype = mysqli_real_escape_string($conn, trim($request->u_accounttype));

		$return_arr = array();
		
		$sql = "SELECT tbl_article.*, tbl_user.* FROM tbl_article left join tbl_user on tbl_article.article_uid = tbl_user.u_id".$where;
		$result = mysqli_query($conn, $sql);
		$i = 1;
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$row_array['id'] = $row['id'];
			$row_array['section1'] = $row['section1'];
			$row_array['section2'] = $row['section2'];
			$row_array['account_type'] = $row['account_type'];
			$row_array['no'] = $i;
			$row_array['article_uid'] = $row['article_uid'];
			$row_array['article_date'] = date_format(date_create($row['article_createdate']), "j M Y");
			$row_array['imgurl1'] = $row['imgurl1'];
			$row_array['imgurl2'] = $row['imgurl2'];
			$row_array['headline'] = $row['headline'];		
			$row_array['u_name'] = $row['u_name'];
			$row_array['u_avatar'] = 'mse/uploaded/avatar/'.$row['u_avatar'];
			
			array_push($return_arr,$row_array);
			$i++;
		}
		echo json_encode($return_arr);	
	}
	
	function getArticleList_Admin($request, $conn){
		if(trim($request->u_accounttype) === '')
		{
			return http_response_code(400);
		}
		$u_accounttype = mysqli_real_escape_string($conn, trim($request->u_accounttype));
		$u_id = mysqli_real_escape_string($conn, trim($request->u_id));

		$return_arr = array();
		
		$sql = "SELECT tbl_article.*, tbl_user.* FROM tbl_article left join tbl_user on tbl_article.article_uid = tbl_user.u_id WHERE tbl_article.account_type LIKE '%Admin%'";
		$result = mysqli_query($conn, $sql);
		$i = 1;
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$row_array['id'] = $row['id'];
			$row_array['section1'] = $row['section1'];
			$row_array['section2'] = $row['section2'];
			$row_array['account_type'] = $row['account_type'];
			$row_array['no'] = $i;
			$row_array['article_uid'] = $row['article_uid'];
			$row_array['article_createdate'] = $row['article_createdate'];
			$row_array['imgurl1'] = $row['imgurl1'];
			$row_array['imgurl2'] = $row['imgurl2'];
			$row_array['headline'] = $row['headline'];		
			$row_array['u_name'] = $row['u_name'];
			
			array_push($return_arr,$row_array);
			$i++;
		}
		echo json_encode($return_arr);	
	}
	
	function ChangePwd($request, $conn){
		if(trim($request->u_id) === '')
		{
			return http_response_code(400);
		}
		$confirm_pwd = mysqli_real_escape_string($conn, trim($request->confirm_pwd));
		$u_id = mysqli_real_escape_string($conn, trim($request->u_id));
		$sql = "UPDATE tbl_user SET u_password = '".$confirm_pwd."' WHERE u_id = '".$u_id."'";
		$result = mysqli_query($conn, $sql) or die("error to insert employee data");
		getUserList($request, $conn);

	}
	
	function updateUser($request, $conn){
		if(trim($request->seleted_uid) === '')
		{
			return http_response_code(400);
		}
		$seleted_uid = mysqli_real_escape_string($conn, trim($request->seleted_uid));
		$radio_accounttype = mysqli_real_escape_string($conn, trim($request->radio_accounttype));
		$sql = "UPDATE tbl_user SET u_accounttype = '".$radio_accounttype."' WHERE u_id = '".$seleted_uid."'";
		$result = mysqli_query($conn, $sql) or die("error to insert employee data");
		getUserList($request, $conn);

	}

	function createUser($request, $conn){

		$username = mysqli_real_escape_string($conn, trim($request->username));
		$u_email = mysqli_real_escape_string($conn, trim($request->u_email));
		$u_pwd = mysqli_real_escape_string($conn, trim($request->u_pwd));
		$radio_accounttype = mysqli_real_escape_string($conn, trim($request->radio_accounttype));
		$parentID = mysqli_real_escape_string($conn, trim($request->parentID));

		date_default_timezone_set('Africa/Johannesburg');
		$date = date('Y-m-d h:i:s a', time());

		if(checkDuplicateMail($u_email, $conn) == 1){
			return;
		}
			
		$sql = "INSERT INTO tbl_user (u_name, u_password, u_email, u_phonenum, u_createddate, u_accounttype, u_parentid) VALUES('".$username."', '".$u_pwd."', '".$u_email."', '', '". $date."', '".$radio_accounttype."', '".$parentID."')";
		$result = mysqli_query($conn, $sql) or die("error to insert employee data");
		getUserList($request, $conn);

	}	
	function setFreezeUser($request, $conn){
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
		getUserList($request, $conn);

	}
	function getUserList($request, $conn){
		if(trim($request->u_accounttype) === '')
		{
			return http_response_code(400);
		}
		$u_accounttype = mysqli_real_escape_string($conn, trim($request->u_accounttype));
		$u_id = mysqli_real_escape_string($conn, trim($request->u_id));
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
				"u_accounttype" => $row['u_accounttype'],
				"u_phonenum" => $row['u_phonenum']				
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
		$message .= "<br/> <a href='http://localhost:4200/sendmail'></a>";
		
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
	$conn->close();
?>
