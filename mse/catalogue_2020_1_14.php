<?php

	include_once("connection.php");
	$postdata = file_get_contents("php://input");
	if(isset($postdata) && !empty($postdata)){
	    $return_arr = Array();
    	$answer_list = Array();
		$request = json_decode($postdata);
		$userid = $request->userid;
		if($userid === '')
		{
			return http_response_code(400);
		}
		$users_list = getUsersInfo($conn,$userid);
		$business_id_list = getBusinessId($conn);
		$answer_list = getAnswerByBusinessId($business_id_list , $userid, $conn);
		$catalogue_list = getCatalogueSummary($conn);
        $data['users'] = $users_list;
        $data['answers'] = $answer_list;
        $data['catalogues'] = $catalogue_list;
        $data['countryGovernment'] = getContent($conn, 'tbl_country_government');
        $data['countryGeography'] = getContent($conn, 'tbl_country_geography');
        $data['countryTransport'] = getContent($conn, 'tbl_country_transport');
		echo json_encode($data);
	}

	//Get all business id  by each user.
	function getBusinessId($conn){
        $sql = "SELECT COUNT(id_business_quiz), business_id
        FROM tbl_business_answer
        GROUP BY business_id
        ORDER BY COUNT(time_started) DESC";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_all($result, MYSQLI_ASSOC);
        return $row;
	}
	//Get and sort all the completed answers from tbl_business_answer by business id.
	function getAnswerByBusinessId($business_id_list,$userid, $conn){
        $answer_list = Array();
	    foreach($business_id_list as  $value){
            $business_id = $value['business_id'];
            $sql = "SELECT * FROM tbl_business_answer WHERE u_id='".$userid."' AND business_id = '".$business_id."'";
            $result = mysqli_query($conn, $sql);
            $answers_by_id = mysqli_fetch_all($result, MYSQLI_ASSOC);
            $checkCompleted = checkAnswerCompleted($answers_by_id, $conn);
            //If answers exist for id, and check questions complete by user.
            if(!empty($answers_by_id)&&$checkCompleted){
                array_push($answer_list, $answers_by_id);
            }
        }
        return $answer_list;
	}
    //Get all the users info from the tbl_business.
    function getUsersInfo($conn,$userid){
        $return_arr = Array();
        $sql = "SELECT * FROM tbl_business";
        $result = mysqli_query($conn, $sql);
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $row_array['id'] = $row['id'];
            $row_array['u_id'] = $row['u_id'];

            if($row_array['u_id'] == $userid){
                if($row['b_remaining'] !=0 )
                    $row_array['sell_enabled'] = true;
            }
            else
                $row_array['sell_enabled'] = false;

            if($row['b_remaining'] == 0)
                $row_array['business_enabled'] = false;
            else
                $row_array['business_enabled'] = true;
            $row_array['p_name'] = $row['p_name'];
            $row_array['p_surename'] = $row['p_surename'];
            $row_array['p_email'] = $row['p_email'];
            $row_array['p_phonenumber'] = $row['p_phonenumber'];
            $row_array['p_nationality'] = $row['p_nationality'];
            $row_array['p_idnumber'] = $row['p_idnumber'];
            $row_array['p_passportnumber'] = $row['p_passportnumber'];
            $row_array['p_street'] = $row['p_street'];
            $row_array['p_city'] = $row['p_city'];
            $row_array['p_postalcode'] = $row['p_postalcode'];
            $row_array['p_country'] = $row['p_country'];
            $row_array['p_uploadfile'] = $row['p_uploadfile'];
            $row_array['b_name'] = $row['b_name'];
            $row_array['b_phonenumber'] = $row['b_phonenumber'];
            $row_array['b_location'] = $row['b_location'];
            $row_array['b_quantity'] = $row['b_quantity'];
            $row_array['b_currency'] = $row['b_currency'];
            $row_array['b_remaining'] = $row['b_remaining'];
            if($row['b_companysector'] == "1"){
                $row['b_companysector'] = "Agriculture";
                $row_array['b_companysectorval'] = 1;
            }
            if($row['b_companysector'] == "2"){
                $row['b_companysector'] = "Industrial";
                $row_array['b_companysectorval'] = 2;
            }
            if($row['b_companysector'] == "3"){
                $row['b_companysector'] = "Resources";
                $row_array['b_companysectorval'] = 3;

            }

            $row_array['b_companysector'] = $row['b_companysector'];
            $row_array['b_address'] = $row['b_address'];
            $row_array['b_city'] = $row['b_city'];
            $row_array['b_postalcode'] = $row['b_postalcode'];
            $row_array['b_country'] = $row['b_country'];
            $row_array['b_profile'] = $row['b_profile'];
            $row_array['b_uploadfile'] = '/'.$row['b_uploadfile'];
            $row_array['c_registered'] = $row['c_registered'];
            $row_array['c_regnumber'] = $row['c_regnumber'];
            $row_array['c_vatnumber'] = $row['c_vatnumber'];
            $row_array['c_operationalyears'] = $row['c_operationalyears'];
            $row_array['c_moneytype'] = $row['c_moneytype'];
            $row_array['c_explain'] = $row['c_explain'];
            $row_array['date_created'] = $row['date_created'];
            $row_array['lat'] = $row['latitude'];
            $row_array['lng'] = $row['longitude'];
            array_push($return_arr,$row_array);
        }
        return $return_arr;
    }
    //Get tbl_catalogue_summary
    function getCatalogueSummary($conn){
        $sql = "SELECT * FROM tbl_catalogue_summary";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_all($result, MYSQLI_ASSOC);
        return $row;
    }
    //Check if the business answer is completed.
    function checkAnswerCompleted($answers_by_id,$conn){
        $sql = "SELECT COUNT(*) AS count FROM tbl_business_quiz";
        $result = mysqli_query($conn, $sql);
        $count_quiz = mysqli_fetch_all($result, MYSQLI_ASSOC);
        $count_answers_by_id = count($answers_by_id);
        $length_quiz_completed = $answers_by_id[$count_answers_by_id-1]['id_business_quiz'];
        if($count_quiz[0]['count'] == $length_quiz_completed){
            return true;
        }
        return false;
        //print_r($answers_by_id);
    }
    //Get table data from database.
    function getContent($conn, $table){
    	    $sql = "SELECT * FROM ".$table;
    	    $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_all($result, MYSQLI_ASSOC);
            return $row;
    	}
	$conn->close();
?>





<?php

    include_once("connection.php");
    $postdata = file_get_contents("php://input");
    if(isset($postdata) && !empty($postdata)){
        $return_arr = Array();
        $answer_list = Array();
        $request = json_decode($postdata);
        $userid = $request->userid;
        if($userid === '')
        {
            return http_response_code(400);
        }
        $action = $request->action;
        //$business_id = md5($request->business_id);
        $business_id = $request->business_id;
        switch($action){
            case 'create':
                registerNewBusiness($userid, $business_id, $conn);
                break;
            case 'read':
                // getBusinessList();
                break;
        }
    }

    //Register new answers from current user.
    function registerNewBusiness($userid, $business_id, $conn){
        //Register user id first.
        $sql = "INSERT INTO tbl_business(u_id)  VALUES   ($userid)";
        mysqli_query($conn, $sql);
        //Register tab content
        $answers = getNewAnswersByBusinessId($userid, $business_id, $conn);
        businessInformation($userid, $business_id, $answers,$conn);
        financialInformation($userid, $business_id, $answers,$conn);
        financialBalance($userid, $business_id,$conn);
        financialIncome($userid, $business_id, $answers, $conn);
        financialCash($userid, $business_id, $conn);
        sustainabilityUnSdg($userid, $business_id, $answers, $conn);
        sustainabilityStakeholderCountry($userid, $business_id, $answers, $conn);
        scoringFinancial($answers, $userid, $business_id, $conn);
        badgeBusiness($answers, $userid, $business_id, $conn);
    }

    /*-------------read tbl_business start---------------*/
    //Insert answers into tbl_business about business.
    function businessInformation($userid, $business_id, $answers, $conn){
        $count_question = count($answers);
        $key_business_info = getKeyFromCatalogue('Business Summary', 'Business Information', '', '', $conn);
        $business_info = [];
        array_push($business_info, getAnswerByIdCol(1, 'col_0_header', $answers));
        array_push($business_info, $answers[$count_question-1]['time_started']);
        array_push($business_info, $business_id);
        array_push($business_info, getAnswerByIdCol(7, 'col_5_header',$answers));
        array_push($business_info, getAnswerByIdCol(30, 'col_1_header', $answers));
        array_push($business_info, getAnswerByIdCol(6, 'col_0_header', $answers));
        array_push($business_info, getAnswerByIdCol(14, 'col_1_header', $answers));
        array_push($business_info, getAnswerByIdCol(38, 'col_0_header', $answers));
        array_push($business_info, getAnswerByIdCol(44, 'col_1_header', $answers));
        array_push($business_info, getAnswerByIdCol(2, 'col_0_header', $answers));
        array_push($business_info, getAnswerByIdCol(9, 'col_0_header', $answers));
        insertNewTab($key_business_info,$business_info,'key',$userid,$business_id,$conn);
    }

    //Insert new answers into tbl_business about financial.
    function financialInformation($userid, $business_id, $answers,$conn){
        $key_financial_info = getKeyFromCatalogue('Financial Summary', 'Financial Information', '', 'tbl_business_answer', $conn);
        $business_info = [];
        array_push($business_info, getAnswerByIdCol(30, 'col_1_header', $answers));
        array_push($business_info, getAnswerByIdCol(31, 'col_4_header', $answers)/getCount(31,'col_0_header', $answers));
        array_push($business_info, (getAnswerByIdCol(57, 'col_1_header', $answers)+getAnswerByIdCol(57, 'col_1_header', $answers)+getAnswerByIdCol(57, 'col_3_header', $answers))*4);
        array_push($business_info, (getAnswerByIdCol(57, 'col_1_header', $answers)+getAnswerByIdCol(57, 'col_1_header', $answers)+getAnswerByIdCol(57, 'col_3_header', $answers))*4/getSum($answers,61,'col_2_header','', '',''));
        array_push($business_info, (getAnswerByIdCol(57, 'col_1_header', $answers)+getAnswerByIdCol(57, 'col_1_header', $answers)+getAnswerByIdCol(57, 'col_3_header', $answers))*4/getSum($answers,61,'col_2_header',61, 'col_3_header','No'));
        array_push($business_info, getSum($answers,57,'col_8_header','','','')/(getSum($answers,40,'col_9_header','','','')*12));
        array_push($business_info, ((getSum($answers,40,'col_9_header','','','')+getSum($answers,57,'col_4_header','','',''))*12/getSum($answers,62,'col_2_header',61,'col_3_header','Yes')));
        array_push($business_info, (getSum($answers,57,'col_4_header','','','')*12/(getSum($answers,62,'col_2_header',61,'col_3_header','Yes'))));
        array_push($business_info, (getSum($answers,57,'col_4_header','','','')*12+getSum($answers,57,'col_9_header','','','')*(getSum($answers,57,'col_1_header','','','')+getSum($answers,57,'col_2_header','','','')+getSum($answers,57,'col_3_header','','',''))*4)/getSum($answers,46,'col_1_header','','',''));
        array_push($business_info, getSum($answers,62,'col_2_header','','','')/(getSum($answers,61,'col_2_header','','','')-getSum($answers,62,'col_2_header','','','')));
        array_push($business_info, getSum($answers,62,'col_2_header','','','')/getSum($answers,61,'col_2_header','','',''));
        array_push($business_info, getSum($answers,56,'col_5_header','','','')-getSum($answers,56,'col_7_header','','','')+getSum($answers,56,'col_9_header','','',''));
        array_push($business_info, getSum($answers,32,'col_1_header','','','')*12/getSum($answers,56,'col_0_header','','',''));
        array_push($business_info, (getSum($answers,56,'col_0_header','','','')-(getSum($answers,57,'col_6_header','','','')+getSum($answers,57,'col_7_header','','',''))*6)/getSum($answers,56,'col_0_header','','',''));
        array_push($business_info, (getSum($answers,57,'col_6_header','','','')+getSum($answers,57,'col_7_header','','',''))*6);
        array_push($business_info, getSum($answers,32,'col_1_header','','','')*12/getSum($answers,61,'col_2_header','','',''));
        insertNewTab($key_financial_info, $business_info, 'key',$userid,$business_id,$conn);
    }
    //Insert new answers into tbl_business about balance sheet.
    function financialBalance($userid,$business_id,$conn){
        $key_balance_info = getKeyFromCatalogue('Financial Summary', 'Balance Sheet', '', 'tbl_business_answer', $conn);
        $business_info = [];
        array_push($business_info, getAnswerByQuery($key_balance_info, $conn));
        insertNewTab($key_balance_info, $business_info, 'key', $userid,$business_id,$conn);
    }

    //Insert new answers into tbl_business about income statement.
    function financialIncome($userid, $business_id, $answers, $conn){
        $business_info = [];$business_info['income_amounts'] = '';$business_info['income_items'] = '';
        $answer_by_id = getAnswerById($answers, 64);
        foreach($answer_by_id as  $answer ){
            if($business_info['income_items']){
                $business_info['income_items'] = $business_info['income_items'].",".$answer['col_1_header'];
                $business_info['income_amounts'] = $business_info['income_amounts'].",".$answer['col_2_header'];
            }
            else{
                $business_info['income_items'] = $answer['col_1_header'];
                $business_info['income_amounts'] = $answer['col_2_header'];
            }
        }
        insertNewTab('', $business_info, 'query',$userid, $business_id, $conn);
    }
    //Insert new answers into tbl_business about cash flow statement.
    function financialCash($userid, $business_id, $conn){
        $key_cash_info = getKeyFromCatalogue('Financial Summary', 'Cash Flow Statement', '', 'tbl_business_answer', $conn);
        $business_info = [];
        array_push($business_info, getAnswerByQuery($key_cash_info, $conn));
        insertNewTab($key_cash_info, $business_info, 'key', $userid,$business_id,$conn);
    }
    //Insert new answers into tbl_business about UN SDG.
    function sustainabilityUnSdg($userid, $business_id, $answers, $conn){
        $goal_name = getAnswerByIdCol(47, 'col_0_header', $answers);
        $business_info['goal_name'] = $goal_name;
        insertNewTab('', $business_info, 'query', $userid,$business_id,$conn);
    }
    //Insert new answers into tbl_business about Interactions.
    function sustainabilityStakeholderCountry($userid, $business_id, $answers, $conn){
        $business_info = [];
        $country = getAnswerByIdCol(6,'col_0_header', $answers);
        $business_info['country'] = $country;
        insertNewTab('', $business_info, 'query', $userid, $business_id, $conn);
    }
    //Insert new answers into tbl_business about Scoring summary.
    function scoringFinancial($answers, $userid, $business_id, $conn){
        $scoringDataList = [];
        $key_scoring_info = getKeyFromCatalogue('Scoring Summary', 'Financial Scoring', '', 'tbl_business_answer&score_business', $conn);
        $scoringData =  getScoringData($answers, $conn);
         foreach($key_scoring_info as $key){
             $scoringDataList[$key] = 0;
         }
        foreach($scoringData as $key=>$value){
            foreach($value as $row_item){
                foreach($key_scoring_info as $key){
                    $scoringDataList[$key] =$scoringDataList[$key]+floatval($row_item[$key]);
                }
            }
        }
        insertNewTab('', $scoringDataList, 'query', $userid, $business_id, $conn);
        return $scoringDataList;
    }
    //Insert new answers into tbl_business about Badge business
    function badgeBusiness($answers, $userid, $business_id, $conn){
        $goal_path= '';
        $goal_name = getAnswerByIdCol(47, 'col_0_header', $answers);
        $goals_path = split(',',$goal_name);
        foreach($goals_path as $item){
            if(!$goal_name){
                $goal_path = $goal_path.','.$item;
            }
            else{
                $goal_path = $item;
            }
        }
        $business_info['goal_path'] = $goals_path;
        insertNewTab('', $business_info, 'query', $userid, $business_id, $conn);
    }
    //Get completed new answers from tbl_business_answer by business id.
    function getNewAnswersByBusinessId($userid, $business_id, $conn){
    $sql = "SELECT * FROM tbl_business_answer WHERE u_id='".$userid."' AND business_id = '".$business_id."'";
    $result = mysqli_query($conn, $sql);
    $answers = mysqli_fetch_all($result, MYSQLI_ASSOC);
    return $answers;
}

//Get key for tbl_business column using tab, sub tab from catalogue.
    function getKeyFromCatalogue($tab, $subTab, $button, $tbl_pull_request_1_source, $conn){
        $sql = "SELECT description FROM tbl_catalogue_summary WHERE tab = '$tab' AND sub_tab = '$subTab' AND button_in_sub_tab = '$button' AND tbl_pull_request_1_source = '$tbl_pull_request_1_source'";
        $result = mysqli_query($conn, $sql);
        $key = mysqli_fetch_all($result, MYSQLI_ASSOC);
        return $key;
    }
    //Get answers by id = 'x', col = 'col_x_header'
    function getAnswerByIdCol($id, $col, $answers){
        foreach($answers as $key=>$value){
            if($key==$id-1){
                $answer = $value[$col];
                return $answer;
            }
        }
    }
    //Get answers by query.
    function getAnswerByQuery($key_info, $conn){
        $answers = [];
        $sql = "SELECT * FROM tbl_catalogue_summary";
        $result = mysqli_query($conn, $sql);
        $catalogue = mysqli_fetch_all($result, MYSQLI_ASSOC);
        foreach($key_info as $key){
            foreach($catalogue as $value){
                if($value['description']==$key){
                    $sql = $value['tbl_pull_request_1'];
                }
            }
            $result = mysqli_query($conn, $sql);
            $answer = mysqli_fetch_all($result, MYSQLI_ASSOC);
            $answers[$catalogue[$key]['description']] = $answer;
        }
        return $answers;
    }
    //Get answers by question id.
    function getAnswerById($answers,$id_business_quiz){
        //Needs group by the same name.
        $AnswersById = [];
        foreach($answers as $key=>$value){
            if($value['id_business_quiz'] == $id_business_quiz){
                array_push($AnswersById, $value);
            }
        }
        return $AnswersById;
    }
    //Insert key value pair into tbl_business
    function insertNewTab($key_info, $business_info, $key, $userid, $business_id, $conn){
        if($key=='key'){
            foreach($key_info as $key=>$value){
                $sql = "INSERT INTO tbl_business($value)  VALUES   ($business_info[$key]) WHERE u_id = '$userid' AND business_id='$business_id'";
                mysqli_query($conn, $sql);
                $answer_id = mysqli_insert_id($conn);
            }
        }
        if($key=='query'){
            foreach($business_info as $key=>$value){
                $sql = "INSERT INTO tbl_business($key)  VALUES   ($value) WHERE u_id = '$userid' AND business_id='$business_id'";
                mysqli_query($conn, $sql);
                $answer_id = mysqli_insert_id($conn);
            }
        }
        return $answer_id;
    }
    //Sum all the same id_business_id row data by col_i_header =='yes, or no'.
    function getSum($answers,$id, $col,$id_cond,$col_cond,$condition){
        $sum =0;
        foreach ( $answers as $key =>$row){
            $value = parseFloat($row[col]);
            //If the value for col is empty, then sum is NAN.
            if($row[$col]==''){
                $value=0;
            }
            if($condition){
                if($id_cond){
                    if($row['id_business_quiz']==$id_cond){
                        if(trim($row[$col_cond])==$condition){
                            $sum =$sum+$value;
                        }
                    }
                }
                else{
                    if($row[$col]==$condition){
                        $sum =$sum+$value;
                    }
                }
            }
            else{
                if($row['id_business_quiz'] ==$id){
                    if(strchr($row[$col],'between')){
                        $sum = $row[$col];
                    }
                    else{
                        $sum =$sum+$value;
                    }
                }
            }
        }
        return $sum;
    }
    //Count all the  id_business_quiz row data.
    function  getCount($id, $col, $answers){
        $count =0;
        foreach($answers as $key=>$row){
            if($row['id_business_quiz'] ==$id){
                $count =$count+1;
            }
        }
        return $count;
    }

    //Get scoring data from the tbl_business_answer.
    function getScoringData($answers, $conn){
        $totalScoringData = [];
        $scoreBusiness = getContent($conn, 'tbl_score_business');
        $questions_id = $index_questions_id = [];$index_cols_id=[];
        foreach($scoreBusiness as $scoreBusiness_item){
            array_push($questions_id, $scoreBusiness_item['question_id']);
        }
        $index_questions_id = array_unique($questions_id);
        foreach($index_questions_id as $index_question_id){
            $index_cols_id = getUniqueColsId($scoreBusiness, $index_question_id);
            $answersById = getAnswerById($answers, $index_question_id);
            //Get scoring by the id_business_quiz
            $scoringAnswersById = getScoringAnswersById($answersById,$index_question_id, $index_cols_id,$scoreBusiness);
            //Arrange each scoring answers by id, which has several score abuot sub answers.
            arrangeEachScoring($scoringAnswersById);
        }
        return $totalScoringData;
    }
    //Get unique column(col) about unique question id from the tbl_scoring_business.
    function getUniqueColsId($scoreBusiness, $index_question_id){
        $cols_id = [];$temp=[];
        foreach($scoreBusiness as $row){
            if($row['question_id'] == $index_question_id){
                array_push($temp, $row);
            }
        }
        foreach($temp as $temp_item){
            array_push($cols_id, $temp_item['col_header']);
        }
        return array_unique($cols_id);
    }
    //user customized numbers answers for each id_business_quiz from tbl_business_quiz.
    function getScoringAnswersById($answersById, $index_question_id, $index_cols_id, $scoreBusiness){
        $scoringData = [];
        //Get score for each id_business_quiz(=index).
        foreach($index_cols_id as $col_header){
            foreach($answersById as $answerById){
                array_push($scoringData,getScoreEachAnswer($answerById['col_'.$col_header.'_header'], $index_question_id, $col_header, $scoreBusiness));
            }
        }
        return $scoringData;
    }
    //Get each score.
    function getScoreEachAnswer($each_answer, $id_business_quiz, $col, $scoreBusiness){
        //Get answers type when question_di=id,col=col,  from answer column in tbl_score_business.
        $score_each_answer = []; $answer_type='';
        //Check answer type.
        foreach($scoreBusiness as $row_score){
            if($row_score['question_id']==$id_business_quiz&&$row_score['col_header']==$col){
                if($row_score['answer']=='(Blank)'){
                    $answer_type = 'Blank_type';
                }
            }
        }
        foreach($scoreBusiness as $row_score){
            if($row_score['question_id']==$id_business_quiz&&$row_score['col_header']==$col){
                if($answer_type=='Blank_type'){
                    if($each_answer&&$row_score['answer']!='Blank'){
                        array_push($score_each_answer, $row_score);break;
                    }
                    else if(!$each_answer&&$row_score['answer']=='Blank'){
                        array_push($score_each_answer, $row_score);break;
                    }
                }//If answer type is match.
                else{
                    if($row_score['answer']==$each_answer){
                        array_push($score_each_answer, $row_score);
                        break;
                    }
                }
            }
        }

        return $score_each_answer;
    }
    //Arrange scoring data.
    function arrangeEachScoring($each_scoring){
        $totalScoringData = [];
        foreach($each_scoring as $sub_scoring){
            array_push($totalScoringData, $sub_scoring);
        }
        return $totalScoringData;
    }
    //Get table data.
    function getContent($conn, $table){
        $sql = "SELECT * FROM ".$table;
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_all($result, MYSQLI_ASSOC);
        return $row;
    }

    /*---------------------tbl_business read end------------------------*/
    $conn->close();
?>
