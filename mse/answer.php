<?php
    include_once('connection.php');
    if ($_POST) {
        $query_values = "'" . $_POST['userid'] . "'" . ',' . "'" . $_POST['profile'] . "'" . ',' . "'" . $_POST['id_business_quiz'] . "'";
        if ($_POST['action'] === 'update') {
            $query_values = "'".$_POST['businessId']."'".','.$query_values;
        } else {
            $token_questionTypeID = md5($_POST['questionTypeID']);
            $query_values = "'".$token_questionTypeID."'".','.$query_values;
        }
        putAnswerList($_POST['profile'], $conn, $query_values);
    }

    function putAnswerList($profile, $conn, $query_values)
    {
        switch ($profile) {
            case 'business_profile':
                if(!empty($_POST['addItem_rowsData'])){
                    $addItem_rowsData = json_decode($_POST['addItem_rowsData'],true);
                    foreach($addItem_rowsData as $value){
                        $sql = getQuery($value,$query_values, $profile);
                        $answer_id = InsertRowData($sql, $conn);
                        echo $answer_id;
                    }
                } else {
                    $sql = getQuery($_POST, $query_values, $profile) ;
                    $answer_id = InsertRowData($sql, $conn);
                    echo $answer_id;
                }
                break;
            case 'employer_profile':
            case 'scouter_profile':
                $sql = getQuery($_POST, $query_values, $profile) ;
                $answer_id = InsertRowData($sql, $conn);
                echo $answer_id;
                break;
        }
    }
    function upload($upload_index) {
        $flag = $_FILES['upload_file_'.$upload_index];
        if (isset($flag)) {
            $path = 'uploaded/';
            if (!file_exists($path) && !mkdir($path, 0777, true) && !is_dir($path)) {
                throw new \RuntimeException(sprintf('Directory "%s" was not created', $path));
            }
            $originalName = $_FILES['upload_file_'.$upload_index]['name'];
            $ext = '.' . pathinfo($originalName, PATHINFO_EXTENSION);
            $t = time();
            $generatedName = md5($t . $originalName) . $ext;
            $filePath = $path . $generatedName;
            if (move_uploaded_file($_FILES['upload_file_'.$upload_index]['tmp_name'], $filePath)) {
                return $filePath;
            }
        }
    }
    function getQuery($rowData, $query_values, $profile) {
        $tag_list = '';
        for ($i = 0; $i < 10; $i++) {
            if (!empty($rowData['col_' . $i . '_header'])) {
                if(is_array($rowData['col_' . $i . '_header'])){
                    foreach($rowData['col_' . $i . '_header'] as $value){
                        $tag_list .= $value . ',';
                    }
                    $query_values .= ',' . "'" . $tag_list . "'";
                } else {
                    $query_values .= ',' . "'" . $rowData['col_' . $i . '_header'] . "'";
                }
            } else {
                $uploadFlag = $rowData['upload_index_'.$i];
                if (isset($uploadFlag) && $i === $rowData['upload_index_' . $i]) {
                    //check if upload file exists.
                    $upload_index = $rowData['upload_index_'.$i];
                    $file_name = upload($upload_index);
                    $query_values .= ',' . "'" . $file_name . "'";
                } else {
                    $query_values .= ',' . "''";
                }

            }
        }
        if($profile === 'business_profile') {
            $sql = "INSERT INTO tbl_business_answer(business_id,u_id,profile,id_business_quiz,
             col_0_header,col_1_header,col_2_header,col_3_header,col_4_header, col_5_header,
             col_6_header,col_7_header,col_8_header,col_9_header)  VALUES   ($query_values)";
        }
        else if($profile=='scouter_profile'){
            $sql = "INSERT INTO tbl_scout_answer(scout_id,u_id,profile,id_business_quiz,
             col_0_header,col_1_header,col_2_header,col_3_header,col_4_header, col_5_header,
             col_6_header,col_7_header,col_8_header,col_9_header)  VALUES   ($query_values)";
        }
        else {
            $sql = "INSERT INTO tbl_bee_answer(business_id,u_id,profile,id_business_quiz,
             col_0_header,col_1_header,col_2_header,col_3_header,col_4_header, col_5_header,
             col_6_header,col_7_header,col_8_header,col_9_header)  VALUES   ($query_values)";
        }
        return $sql;
    }
    function InsertRowData($sql, $conn) {
        mysqli_query($conn, $sql);
        return mysqli_insert_id($conn);
    }
    $conn->close();
?>
