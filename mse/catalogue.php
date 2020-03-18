<?php
    include_once('connection.php');
    $postData = file_get_contents('php://input');
    if(isset($postData) && !empty($postData)){
        $return_arr = Array();
        $answer_list = Array();
        $request = json_decode($postData);
        $userId = $request->userid;
        if($userId === '') {
            return http_response_code(400);
        }
        $action = $request->action;
        switch($action){
            case 'create':
                $business_id = md5($request->questionTypeID);
                registerNewBusiness($userId, $business_id, $conn);
                break;
            case 'createByExcel':
                $business_id = $request->questionTypeID;
                registerNewBusiness($userId, $business_id, $conn);
                break;
            case 'readTab':
                $tab = $request->tab;
                $mainBusiness = json_decode($request->mainBusiness, true);
                getTabBusiness( $mainBusiness, $tab, $conn);
                break;
        }
    }
    function registerNewBusiness($userId, $business_id, $conn){
        $sql = "INSERT INTO tbl_business(u_id, business_id)  VALUES   ('".$userId."', '".$business_id."')";
        mysqli_query($conn, $sql);
        try {
            $answers = getAnswersByBusinessId($userId, $business_id, $conn);
            businessInformation($userId, $business_id, $answers, $conn);
            financialInformation($userId, $business_id, $answers, $conn);
            financialBalance($userId, $business_id, $conn);
            financialIncome($userId, $business_id, $answers, $conn);
            financialCash($userId, $business_id, $conn);
            sustainabilityUnSdg($userId, $business_id, $answers, $conn);
            sustainabilityStakeholderCountry($userId, $business_id, $answers, $conn);
            scoringFinancial($answers, $userId, $business_id, $conn);
            badgeBusinessMunicipal($answers, $userId, $business_id, 'badge', $conn);
            notification($userId, $business_id, $conn);
        } catch (Exception $e) {
            die('There are some problems to check in your business list.');
        }

    }

    /*------------- tbl_business create start---------------*/
    //Insert answers into tbl_business about business.
    function businessInformation($userId, $business_id, $answers, $conn){
        $count_question = count($answers);
        $key_business_info = getKeyFromCatalogue('Business Summary', 'Business Information:', '', 'tbl_business_answer', $conn);
        $business_info = [];
        $business_info[] = getAnswerByIdCol(1, 'col_0_header', $answers);
        $business_info[] = $answers[$count_question - 1]['time_started'];
        $business_info[] = $business_id;
        $business_info[] = getAnswerByIdCol(7, 'col_5_header', $answers);
        $business_info[] = getAnswerByIdCol(2, 'col_0_header', $answers);
        $business_info[] = getAnswerByIdCol(6, 'col_0_header', $answers);
        $business_info[] = getAnswerByIdCol(14, 'col_1_header', $answers);
        $business_info[] = getAnswerByIdCol(12, 'col_0_header', $answers);
        $business_info[] = getAnswerByIdCol(44, 'col_1_header', $answers);
        $business_info[] = getAnswerByIdCol(38, 'col_0_header', $answers);
        $business_info[] = getAnswerByIdCol(5, 'col_0_header', $answers);
        $business_info[] = getAnswerByIdCol(55, 'col_0_header', $answers);
        insertNewTab($key_business_info, $business_info,'key',$userId,$business_id,$conn);
    }

    //Insert new answers into tbl_business about financial.
    function financialInformation($userId, $business_id, $answers, $conn) {
        $key_financial_info = getKeyFromCatalogue('Financial Summary', 'Financial Information', '', 'tbl_business_answer', $conn);
        $business_info = [];
        $business_info[] = getSum($answers, 30, 'col_1_header', '', '', '');
        $business_info[] = getSum($answers, 31, 'col_4_header', '', '', '') / getCount(31, 'col_0_header', $answers);
        $business_info[] = (getSum($answers, 57, 'col_1_header', '', '', '') + getSum($answers, 57, 'col_1_header', '', '', '') + getSum($answers, 57, 'col_3_header', '', '', '')) * 4;
        $business_info[] = (getSum($answers, 57, 'col_1_header', '', '', '') + getSum($answers, 57, 'col_1_header', '', '', '') + getSum($answers, 57, 'col_3_header', '', '', '')) * 4 / getSum($answers, 61, 'col_2_header', '', '', '');
        $business_info[] = (getSum($answers, 57, 'col_1_header', '', '', '') + getSum($answers, 57, 'col_1_header', '', '', '') + getSum($answers, 57, 'col_3_header', '', '', '')) * 4 / getSum($answers, 61, 'col_2_header', 61, 'col_3_header', 'No');
        $business_info[] = getSum($answers, 57, 'col_8_header', '', '', '') / (getSum($answers, 40, 'col_9_header', '', '', '') * 12);
        $business_info[] = ((getSum($answers, 40, 'col_9_header', '', '', '') + getSum($answers, 57, 'col_4_header', '', '', '')) * 12 / getSum($answers, 62, 'col_2_header', 61, 'col_3_header', 'Yes'));
        $business_info[] = (getSum($answers, 57, 'col_4_header', '', '', '') * 12 / (getSum($answers, 62, 'col_2_header', 61, 'col_3_header', 'Yes')));
        $business_info[] = (getSum($answers, 57, 'col_4_header', '', '', '') * 12 + getSum($answers, 57, 'col_9_header', '', '', '') * (getSum($answers, 57, 'col_1_header', '', '', '') + getSum($answers, 57, 'col_2_header', '', '', '') + getSum($answers, 57, 'col_3_header', '', '', '')) * 4) / getSum($answers, 46, 'col_1_header', '', '', '');
        $business_info[] = getSum($answers, 62, 'col_2_header', '', '', '') / (getSum($answers, 61, 'col_2_header', '', '', '') - getSum($answers, 62, 'col_2_header', '', '', ''));
        $business_info[] = getSum($answers, 62, 'col_2_header', '', '', '') / getSum($answers, 61, 'col_2_header', '', '', '');
        $business_info[] = getSum($answers, 56, 'col_5_header', '', '', '') - getSum($answers, 56, 'col_7_header', '', '', '') + getSum($answers, 56, 'col_9_header', '', '', '');
        $business_info[] = getSum($answers, 32, 'col_1_header', '', '', '') * 12 / getSum($answers, 56, 'col_0_header', '', '', '');
        $business_info[] = (getSum($answers, 56, 'col_0_header', '', '', '') - (getSum($answers, 57, 'col_6_header', '', '', '') + getSum($answers, 57, 'col_7_header', '', '', '')) * 6) / getSum($answers, 56, 'col_0_header', '', '', '');
        $business_info[] = (getSum($answers, 57, 'col_6_header', '', '', '') + getSum($answers, 57, 'col_7_header', '', '', '')) * 6;
        $business_info[] = getSum($answers, 32, 'col_1_header', '', '', '') * 12 / getSum($answers, 61, 'col_2_header', '', '', '');
        insertNewTab($key_financial_info, $business_info, 'key', $userId, $business_id, $conn);
    }
    //Insert new answers into tbl_business about balance sheet.
    function financialBalance($userId,$business_id,$conn){
        $key_balance_info = getKeyFromCatalogue('Financial Summary', 'Balance Sheet', '', 'tbl_business_answer', $conn);
        insertNewTab($key_balance_info,  getAnswerByQuery($key_balance_info, $conn), 'key', $userId,$business_id,$conn);
    }

    //Insert new answers into tbl_business about income statement.
    function financialIncome($userId, $business_id, $answers, $conn)
    {
        $business_info = [];
        $business_info['income amounts'] = '';
        $business_info['income items'] = '';
        $answer_by_id = getAnswerById($answers, 64);
        foreach ($answer_by_id as $answer) {
            if ($business_info['income items']) {
                $business_info['income items'] = $business_info['income items'] . "," . $answer['col_1_header'];
                $business_info['income amounts'] = $business_info['income amounts'] . "," . $answer['col_2_header'];
            } else {
                $business_info['income items'] = $answer['col_1_header'];
                $business_info['income amounts'] = $answer['col_2_header'];
            }
        }
        insertNewTab('', $business_info, 'query', $userId, $business_id, $conn);
    }
    //Insert new answers into tbl_business about cash flow statement.
    function financialCash($userId, $business_id, $conn){
        $key_cash_info = getKeyFromCatalogue('Financial Summary', 'Cash Flow Statement', '', 'tbl_business_answer', $conn);
        insertNewTab($key_cash_info,  getAnswerByQuery($key_cash_info, $conn), 'key', $userId,$business_id,$conn);
    }
    //Insert new answers into tbl_business about UN SDG.
    function sustainabilityUnSdg($userId, $business_id, $answers, $conn){
        $goal_name = getAnswerByIdCol(47, 'col_0_header', $answers);
        $business_info['goal name'] = $goal_name;
        insertNewTab('', $business_info, 'query', $userId,$business_id,$conn);
    }
    //Insert new answers into tbl_business about Interactions.
    function sustainabilityStakeholderCountry($userId, $business_id, $answers, $conn)
    {
        $business_info = [];
        $country = getAnswerByIdCol(6, 'col_1_header', $answers);
        $business_info['country'] = $country;
        $business_info['province'] = getAnswerByIdCol(51, 'col_3_header', $answers);
        $business_info['district'] = getNewArea(getAnswerById($answers, 40), 'col_6_header', 'district');
        $business_info['municipality'] = getNewArea(getAnswerById($answers, 40), 'col_6_header', 'municipality');
        $business_info['municipality_link'] = getMunicipalLink(badgeBusinessMunicipal($answers, $userId, $business_id, 'Municipal', $conn), $conn);
        insertNewTab('', $business_info, 'query', $userId, $business_id, $conn);
    }
    //Insert new answers into tbl_business about Scoring summary.
    function scoringFinancial($answers, $userId, $business_id, $conn)
    {
        $scoringDataList = [];
        $key_scoring_info = getKeyFromCatalogue('Scoring Summary', 'Financial Scoring', '', 'tbl_business_answer&score_business', $conn);
        $scoringData = getScoringData($answers, $conn);
        foreach ($key_scoring_info as $key_info) {
            $scoringDataList[$key_info['description']] = 0;
            foreach ($scoringData as $key_data => $value) {
                foreach ($value as $row_item) {
                    $scoringDataList[$key_info['description']] = ($scoringDataList[$key_info['description']] + floatval($row_item[strtolower($key_info['description'])]));
                }
            }
        }
        insertNewTab('', $scoringDataList, 'query', $userId, $business_id, $conn);
    }
    function badgeBusinessMunicipal($answers, $userId, $business_id, $action, $conn)
    {
        $goal_path = '';
        $municipal = '';
        $business_info = [];
        $goals = getContent('tbl_unsdg_database', '', $conn);
        $goal_name = getAnswerByIdCol(47, 'col_0_header', $answers);
        $goals_name = explode(',', $goal_name);
        foreach ($goals_name as $item) {
            foreach ($goals as $goal) {
                if ($goal['goal_name'] === $item) {
                    if ($action === 'badge') {
                        if ($goal_path) {
                            $goal_path .= ',' . $goal['path'];
                        } else {
                            $goal_path = $goal['path'];
                        }
                    } else if ($action === 'Municipal') {
                        if ($municipal) {
                            $municipal .= ',' . $goal['goal_number'];
                        } else {
                            $municipal = $goal['goal_number'];
                        }
                    }
                }
            }
        }
        if ($action === 'Municipal') {
            return $municipal;
        }
        $business_info['badge name'] = $goal_path;
        insertNewTab('', $business_info, 'query', $userId, $business_id, $conn);
    }
    //Get completed new answers from tbl_business_answer by business id.
    function getAnswersByBusinessId($userId, $business_id, $conn){
        $sql = "SELECT * FROM tbl_business_answer WHERE u_id='".$userId."' AND business_id = '".$business_id."'";
        $result = mysqli_query($conn, $sql);
        return mysqli_fetch_all($result, MYSQLI_ASSOC);
    }
    function getKeyFromCatalogue($tab, $subTab, $button, $tbl_pull_request_1_source, $conn){
        $sql = "SELECT `description` FROM tbl_catalogue_summary WHERE tab = '".$tab."' AND sub_tab = '".$subTab."' AND button_in_sub_tab = '".$button."' AND tbl_pull_request_1_source = '".$tbl_pull_request_1_source."'";
        $result = mysqli_query($conn, $sql);
        return mysqli_fetch_all($result, MYSQLI_ASSOC);
    }
    function getAnswerByIdCol($id, $col, $answers){
        foreach($answers as $key=>$value){
            if($value['id_business_quiz']==$id){
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
            foreach($catalogue as $row){
                if($row['description'] === $key['description']){
                    $sql = $row['tbl_pull_request_1'];
                    $result = mysqli_query($conn, $sql);
                    $answer = mysqli_fetch_all($result, MYSQLI_ASSOC);
                    if(isset($answer[0])) {
                        $answers[] = $answer[0]['value'];
                    }
                    else{
                        $answers[] = '';
                    }
                }
            }
        }
        return $answers;
    }
    //Get answers by question id.
    function getAnswerById($answers,$id_business_quiz){
        //Needs group by the same name.
        $AnswersById = [];
        foreach($answers as $key=>$value){
            if($value['id_business_quiz'] === $id_business_quiz){
                $AnswersById[] = $value;
            }
        }
        return $AnswersById;
    }
    //Insert key value pair into tbl_business
    function insertNewTab($key_info, $business_info, $type, $userId, $business_id, $conn){
        if ($type==='key') {
            foreach ($key_info as $key => $value) {
                $sql = 'UPDATE tbl_business SET `'.strtolower($value['description']).'` = "'. $business_info[$key] .'" WHERE u_id= "'.$userId.'" AND business_id= "'.$business_id.'"';
                mysqli_query($conn, $sql);
            }
        }
        if ($type==='query'){
            foreach ($business_info as $key=>$value) {
                $sql = "UPDATE tbl_business SET `".$key."`='".$value."' WHERE u_id='".$userId."' AND business_id='".$business_id."'";
                mysqli_query($conn, $sql);
            }
        }
    }
    //Sum all the same id_business_id row data by col_i_header =='yes, or no'.
    function getSum($answers,$id, $col,$id_cond,$col_cond,$condition){
        $sum =0;
        foreach ( $answers as $key =>$row){
            $value = floatval($row[$col]);
            if($row[$col] === ''){
                $value = 0;
            }
            if ($condition){
                if($id_cond){
                    if(($row['id_business_quiz'] === $id_cond) && trim($row[$col_cond]) === $condition) {
                        $sum += $value;
                    }
                }
                else if($row[$col]===$condition){
                    $sum += $value;
                }
            }
            else if($row['id_business_quiz'] === $id){
                if(strchr($row[$col],'between')){
                    $sum = $row[$col];
                }
                else{
                    $sum += $value;
                }
            }
        }
        return floatval($sum);
    }
    //Count all the  id_business_quiz row data.
    function  getCount($id, $col, $answers) {
        $count =0;
        foreach($answers as $key=>$row){
            if($row['id_business_quiz'] === $id) {
                ++$count;
            }
        }
        return $count;
    }

    //Get scoring data from the tbl_business_answer.
    function getScoringData($answers, $conn){
        $totalScoringData = [];
        $scoreBusiness = getContent('tbl_score_business', '', $conn);

        $questions_id = $index_questions_id = [];
        foreach($scoreBusiness as $scoreBusiness_item){
            $questions_id[] = $scoreBusiness_item['question_id'];
        }
        $index_questions_id = array_unique($questions_id);
        foreach($index_questions_id as $index_question_id){
            $index_cols_id = getUniqueColsId($scoreBusiness, $index_question_id);
            $answersById = getAnswerById($answers, $index_question_id);
            //Get scoring by the id_business_quiz
            $scoringAnswersById = getScoringAnswersById($answersById,$index_question_id, $index_cols_id,$scoreBusiness);
            //Arrange each scoring answers by id, which has several score about sub answers.
            $totalScoringData[] = arrangeEachScoring($scoringAnswersById);
        }
        return $totalScoringData;
    }
    //Get unique column(col) about unique question id from the tbl_scoring_business.
    function getUniqueColsId($scoreBusiness, $index_question_id){
        $cols_id = [];$temp=[];
        foreach($scoreBusiness as $row){
            if($row['question_id'] === $index_question_id){
                $temp[] = $row;
            }
        }
        foreach($temp as $temp_item){
            $cols_id[] = $temp_item['col_header'];
        }
        return array_unique($cols_id);
    }
    //user customized numbers answers for each id_business_quiz from tbl_business_quiz.
    function getScoringAnswersById($answersById, $index_question_id, $index_cols_id, $scoreBusiness) {
        $scoringData = [];
        //Get score for each id_business_quiz(=index).
        foreach($index_cols_id as $col_header){
            foreach($answersById as $answerById){
                $scoringData[] = getScoreEachAnswer($answerById['col_' . $col_header . '_header'], $index_question_id, $col_header, $scoreBusiness);
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
            if($row_score['question_id'] === $id_business_quiz && $row_score['col_header'] === $col && $row_score['answer'] === '(Blank)') {
                $answer_type = 'Blank_type';
            }
        }
        foreach($scoreBusiness as $row_score){
            if($row_score['question_id']===$id_business_quiz&&$row_score['col_header']===$col){
                if($answer_type==='Blank_type'){
                    if ($each_answer&&$row_score['answer']!=='Blank'){
                        $score_each_answer[] = $row_score;break;
                    }
                    if(!$each_answer&&$row_score['answer']==='Blank'){
                        $score_each_answer[] = $row_score;break;
                    }
                }
                else if($row_score['answer']===$each_answer){
                    $score_each_answer[] = $row_score;
                    break;
                }
            }
        }
        return $score_each_answer;
    }
    //Arrange scoring data.
    function arrangeEachScoring($each_scoring){
        $totalScoringData = [];
        foreach($each_scoring as $col_scoring){
            foreach($col_scoring as $sub_scoring) {
                $totalScoringData[] = $sub_scoring;
            }
        }
        return $totalScoringData;
    }
    function getNewArea($answer, $col, $area) {
        $result[$area] = '';
        foreach ($answer as $key => $value) {
            $district_municipality = explode(',', rtrim($value[$col], ','));
            foreach ($district_municipality as $item) {
                $row = explode('!!', $item);
                foreach ($row as $k => $v){
                    if (($area === 'district' && $k === 0) || ($area === 'municipality' && $k === 1)) {
                        if (!$result[$area]) {
                            $result[$area] = $v;
                        } else {
                            $result[$area] .= "," . $v;
                        }
                    }
                }
            }
        }
        return rtrim($result[$area], ',');
    }
    function getMunicipalLink($goal_number, $conn)
    {
        $sql = "SELECT `local_municipality_link` FROM `tbl_muni_measure` WHERE `unsdg_direct`='" . $goal_number . "'";
        $query = mysqli_query($conn, $sql);
        $result = mysqli_fetch_all($query, MYSQLI_ASSOC);
        if($result) {
            return $result['local_municipality_link'];
        }
        return 'No Found Municipality link';
    }
    /*---------------------tbl_business create end------------------------*/

    /*-----------------------tbl_business read start  ---------------------*/

    //Get new business from current user.
    function getUnSdg($mainBusiness, $conn){
        $unSdg = [];
        foreach ($mainBusiness as $mainBusiness_item){
            $unSdg_item['goal_number'] = $unSdg_item['goal_description'] = $unSdg_item['path'] = [];
            $goal_names = explode(',',$mainBusiness_item['goal name']);
            $goals = getContent('tbl_unsdg_database','', $conn);
            foreach($goals as $goal){
                foreach ($goal_names as $goal_name){
                    if($goal['goal_name']==$goal_name){
                        array_push($unSdg_item['goal_number'], $goal['goal_number']);
                        array_push($unSdg_item['goal_description'], $goal['short_description']);
                        array_push($unSdg_item['path'], $goal['path']);
                    }
                }
            }
            array_push($unSdg, $unSdg_item);
        }
        return $unSdg;
    }
    //Get interactions from tbl un sdg goal interactions.
    function getInteractions($mainBusiness, $unSdg, $conn){
        $interactions = [];
        foreach ($mainBusiness as $key=>$mainBusiness_item){
            $interaction=[];
            $goals_number = $unSdg[$key]['goal_number'];
            foreach ($goals_number as $goal_number){
                $interaction[$goal_number] = [];
                $sql = "SELECT `goal_main`, `goal_alternative_1`, `interaction_1`, `key_points`, `key_uncertainties`, `comprehensive_breakdown`,
                        `illustrative_example_1`, `key_dimensions_1`, `key_dimensions_2`, `key_dimensions_3`, `key_dimensions_4`
                        FROM `tbl_unsdg_goal_interactions`
                        WHERE
                        `goal_main` = '".$goal_number."'
                        OR
                        `goal_alternative_1` = '".$goal_number."'
                        ";
                $result = mysqli_query($conn, $sql);
                $interaction[$goal_number]= mysqli_fetch_all($result, MYSQLI_ASSOC);
            }
            array_push($interactions, $interaction);
        }
        return $interactions;
    }
    function getStakeholders($mainBusiness, $conn){
        $stakeholders = [];
        $stakeholders['country'] = $stakeholders['button3'] = $stakeholders['button4'] = $stakeholders['consideration'] = [];
        $stakeholders['country'] = getStakeholderItem($mainBusiness, $conn, 'Country');
        $stakeholders['button3'] = getStakeholderItem($mainBusiness, $conn, 'Button 3');
        $stakeholders['button4'] = getStakeholderItem($mainBusiness, $conn, 'Button 4');
        $stakeholders['consideration'] = getStakeholderItem($mainBusiness, $conn, 'Considerations');
        $stakeholders['maps'] = getStakeholderMap($mainBusiness,25, $conn);
        return $stakeholders;
    }
    //Get stake holder country.
    function getStakeholderItem($mainBusiness, $conn, $item){
        $stakeholders = []; $stakeholder = [];
        $sql_key_info = "SELECT `description` FROM tbl_catalogue_summary WHERE tab = 'Sustainability Measures' AND sub_tab = 'Stakeholders' AND button_in_sub_tab = '$item'";
        $result_key_info =mysqli_query($conn, $sql_key_info);
        $key_info = mysqli_fetch_all($result_key_info, MYSQLI_ASSOC);
        //Get tables name from tbl_catalogue_summary.
        $sql_tables = "SELECT tbl_pull_request_1_source FROM tbl_catalogue_summary WHERE tab = 'Sustainability Measures' AND sub_tab = 'Stakeholders' AND button_in_sub_tab = '$item'";
        $result_table = mysqli_query($conn, $sql_tables);
        $tables = mysqli_fetch_all($result_table, MYSQLI_ASSOC);
        foreach ($mainBusiness as $mainBusiness_item){
            foreach ($key_info as $key => $key_info_item){
                $country_name = $mainBusiness_item['country'];
                $col = $key_info_item['description'];
                $table = $tables[$key]['tbl_pull_request_1_source'];
                //Get table content from $tables.
                $content = getContent($table, '', $conn);
                foreach ($content as $content_item){
                    if(isset($content_item['country'])&&isset($content_item[$col])){
                        if($content_item['country']==$country_name){
                            $result_col = [];
                            $result_col[$col] = $content_item[$col];
                            array_push($stakeholder, $result_col);
                        }
                    }
                }
            }
            array_push($stakeholders, $stakeholder);
        }
        return $stakeholders;
    }
    //Arrange stake holder data from the id_business_quiz = 25.
    function getStakeholderMap($mainBusiness, $id_business_quiz, $conn){
        $stakeholders_map = []; $stakeholders_maps = [];
        foreach ($mainBusiness as $business_item){
            $answer = getAnswersByBusinessId($business_item['u_id'],$business_item['business_id'], $conn);
            $answersById = getAnswerById($answer, $id_business_quiz);
            if(isset($answersById[0])){
                $stakeholders = explode(',', $answersById[0]['col_0_header']);
                $rings = explode(',', $answersById[0]['col_1_header']);
                $stakeholderRings = getContent('tbl_stakeholder_scoring','', $conn);
                foreach($stakeholderRings as $stakeholderRing){
                    $stakeholder_map = [];
                    foreach ($rings as $index=>$ring){
                        if($stakeholderRing['ring']==$ring){
                            array_push($stakeholder_map, $stakeholders[$index]);
                        }
                    }
                    $stakeholders_map[$stakeholderRing['ring']] = $stakeholder_map;
                }
                array_push($stakeholders_maps, $stakeholders_map);
            }
        }
        return $stakeholders_maps;
    }
    /*-------------------------tbl_business read end-------------------------*/
    function notification($userId, $businessId, $conn) {
        $sql = "SELECT u_id FROM tbl_user WHERE NOT u_id = '".$userId."'";
        $result_table = mysqli_query($conn, $sql);
        $tables = mysqli_fetch_all($result_table, MYSQLI_ASSOC);
        date_default_timezone_set('Africa/Johannesburg');
        $date = date('Y-m-d h:i:s a', time());
        for ( $i = 0; $i < count($tables); $i++) {
            $sql = "INSERT INTO tbl_notification (userId, businessId, sended_at)
                        VALUES ('".$tables[$i]['u_id']."', '".$businessId."', '".$date."')";
            mysqli_query($conn, $sql);
        }
    }
    //Get table data.
    function getContent($table, $option,$conn){
        if($option){
            $sql = "SELECT * FROM ".$table." WHERE  u_id='".$option."'";
        }
        else{
            $sql = "SELECT * FROM ".$table;
        }
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_all($result, MYSQLI_ASSOC);

        return $row;
    }

    //Get data for each tab.
    function getTabBusiness($mainBusiness, $tab, $conn) {
        $businessList = [];
        switch($tab) {
            case 'Sustainability':
                $businessList['unSdg'] = getUnSdg($mainBusiness, $conn);
                $businessList['interactions'] = getInteractions($mainBusiness,$businessList['unSdg'], $conn);
                $businessList['stakeholders'] = getStakeholders($mainBusiness, $conn);
                echo json_encode($businessList);
                break;
            case 'Badges':
                $businessList['unSdg'] = getUnSdg($mainBusiness, $conn);
                echo json_encode($businessList);
                break;
        }
    }
    $conn->close();
?>
