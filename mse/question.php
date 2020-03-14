<?php
	include_once("connection.php");

	$postdata = file_get_contents("php://input");

	if(isset($postdata) && !empty($postdata)){

		$request = json_decode($postdata);
		$action = $request->action;
		switch($action){
			case "read":
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
		//Get business quiz from tbl_business_quiz.
		$data['data'] = $row;
		$data['countBusinessQuiz'] = count($row);
//		Get extra data from database.
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
         $data['countryEconomy'] = getContent($conn, 'tbl_country_economy');
         $data['countryBackgrounds'] = getContent($conn, 'tbl_country_basic_information');
         $data['countryClimate'] = getContent($conn, 'tbl_country_climates');
         $data['countryEnergy'] = getContent($conn, 'tbl_country_energy');
         $data['countryRefuge'] = getContent($conn, 'tbl_country_refugees');
         $data['countrySocioeconomic'] = getContent($conn, 'tbl_country_socioeconomic');
         $data['scoreBusiness'] = getContent($conn, 'tbl_score_business');
		$sql = 'SELECT id_business_quiz, business_id FROM tbl_business_answer WHERE u_id ='.$u_id.' ORDER BY time_started DESC LIMIT 1';
		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_all($result, MYSQLI_ASSOC);
		$data['rememberValue'] = $row;
		echo json_encode($data);
	}
	function getContent($conn, $table){
	    $sql = "SELECT * FROM ".$table;
	    $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_all($result, MYSQLI_ASSOC);
        return $row;
	}
	$conn->close();
?>
