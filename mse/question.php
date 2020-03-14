<?php
	include_once("connection.php");

	$postdata = file_get_contents("php://input");

	if(isset($postdata) && !empty($postdata)){

		$request = json_decode($postdata, false);
		$action = $request->action;
		switch($action){
			case 'read':
                $u_id = $request->userid;
                $profile = $request->profile;
				getQuestionnaireList($request, $conn, $profile, $u_id);
				break;
		}
	}

	function getQuestionnaireList($request, $conn, $profile, $u_id){
	    $data = [];
        switch($profile){
            case "business_profile":
                $sql = "SELECT * FROM tbl_business_quiz";
                break;
            case "employer_profile":
                $sql = "SELECT * FROM tbl_bee_quiz";
                break;
            case "scouter_profile":
                $sql = "SELECT * FROM tbl_scout_quiz";
                break;
        }
		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_all($result,MYSQLI_ASSOC);
		$data['data'] = $row;
		$data['countBusinessQuiz'] = count($row);
		$data['stakeholderRings'] = getContent($conn, 'tbl_stakeholder_scoring');
		$data['country'] = getContent($conn, 'tbl_country_basic_information');
		$data['instruments'] = getContent($conn, 'tbl_instrument_types');
		$data['currency_code'] = getContent($conn, 'tbl_available_currency');
		$data['stakeholder'] = getContent($conn, 'tbl_stakeholder_map');
		$data['goals'] = getContent($conn, 'tbl_unsdg_database');
		$data['balances'] = getContent($conn, 'tbl_balance_sheet');
		$data['incomes'] = getContent($conn, 'tbl_income_sheet');
		$data['cashFlows'] = getContent($conn, 'tbl_cash_flow_sheet');
		$data['sectors'] = getContent($conn, 'tbl_sector_selection');
		$data['goalInteractions'] = getContent($conn, 'tbl_unsdg_goal_interactions');
		$data['scoreBusiness'] = getContent($conn, 'tbl_score_business');
		$data['Municipalities'] = getContent($conn, 'tbl_local_dist_muni');
		$data['provinceList'] = getProvince($conn);
		$sql = 'SELECT id_business_quiz, business_id FROM tbl_business_answer WHERE u_id ="' .$u_id. '" AND profile = "' .$profile. '" ORDER BY time_started DESC LIMIT 1';
		$result = mysqli_query($conn, $sql);
		$data['rememberValue'] = mysqli_fetch_all($result, MYSQLI_ASSOC);
		echo json_encode($data);
	}
	function getContent($conn, $table){
	    $sql = "SELECT * FROM ".$table;
	    $result = mysqli_query($conn, $sql);
		return mysqli_fetch_all($result, MYSQLI_ASSOC);
	}
	function getProvince($conn) {
		$sql = "SELECT country, `names` FROM tbl_country_provinces  GROUP By `names` ORDER BY country ASC";
		$temp = mysqli_query($conn, $sql);
		$temp = mysqli_fetch_all($temp, MYSQLI_ASSOC);
		$result = utf8_converter($temp);
		return $result;
	}
	function utf8_converter($array)
	{
		array_walk_recursive($array, function(&$item, $key){
			if(!mb_detect_encoding($item, 'utf-8', true)){
				$item = utf8_encode($item);
			}
		});
		return $array;
	}
	$conn->close();
?>
