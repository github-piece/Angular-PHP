<?php
include_once("connection.php");
if ($_POST) {
    $query_values = "'" . $_POST['userid'] . "'" . "," . "'" . $_POST['profile'] . "'" . "," . "'" . $_POST['id_business_quiz'] . "'";
    if ($_POST['action'] === 'insert') {
        $token_questionTypeID = md5($_POST['questionTypeID']);
        $query_values = "'".$token_questionTypeID."'".",".$query_values;
    } else {
        $query_values = "'".$_POST['businessId']."'".",".$query_values;
    }
    putAnswerList($_POST['profile'], $conn, $query_values);
}
//if ($_POST) {
//    if ($_POST['action'] === 'excel') {
//        $answers = json_decode($_POST['excelAnswer'], true);
//        $userId = $_POST['userid'];
//        $profile = $_POST['profile'];
//        foreach($answers as $answer) {
//            echo $answer['no'];
//            $sql = "INSERT INTO tbl_business_answer (u_id, profile, id_business_quiz, col_1_header, col_2_header, col_3_header, col_4_header, col_5_header, col_6_header, col_7_header, col_8_header, business_id)
//                    VALUES ('".$userId."', '".$answer['no']."', '".$answer['answer1']."', '".$answer['answer2']."', '".$answer['answer3']."', '".$answer['answer4']."', '".$answer['answer5']."', '".$answer['answer6']."', '".$answer['answer7']."', '".$answer['answer8']."', '".$businessId."')";
//            mysqli_query($conn, $sql);
//        }
//    }
//}
//insert answers into tbl_business_answer table.
function putAnswerList($profile, $conn, $query_values)
{

    switch ($profile) {
        case "business_profile":
            if(!empty($_POST['addItem_rowsData'])){
                $addItem_rowsData = json_decode($_POST['addItem_rowsData'],true);
                foreach($addItem_rowsData as $value){
                    $sql = getQuery($value,$query_values,$profile);
                    $answer_id = InsertRowData($sql, $conn);
                    echo $answer_id;
                }
            }
            else{
                $sql = getQuery($_POST, $query_values,$profile) ;
                $answer_id = InsertRowData($sql, $conn);
                echo $answer_id;
            }
            break;
        case "scouter_profile":
            $sql = getQuery($_POST, $query_values,$profile) ;
            $answer_id = InsertRowData($sql, $conn);
            echo $answer_id;
            break;
        case "employer_profile":
            $sql = getQuery($_POST, $query_values,$profile);
            $answer_id = InsertRowData($sql, $conn);
            echo $answer_id;
            break;
    }

}

//file upload
function upload($upload_index)
{
    if (isset($_FILES['upload_file_'.$upload_index])) {
        $path = 'uploaded/';
        if (!file_exists($path)) {
            mkdir($path, 0777, true);
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

// getQuery function.
function getQuery($rowData, $query_values, $profile){
    //check answers from 0 to 9 column.
    $tag_list = '';
    for ($i = 0; $i < 10; $i++) {
        if (!empty($rowData['col_' . $i . '_header'])) {
            //If input tag exists.
            if(is_array($rowData['col_' . $i . '_header'])){
                foreach($rowData['col_' . $i . '_header'] as $value){
                    $tag_list = $tag_list.$value.",";
                }
                $query_values = $query_values . "," . "'" . $tag_list . "'";
            }
            else {
                $query_values = $query_values . "," . "'" . $rowData['col_' . $i . '_header'] . "'";
            }

        } else {
            if (isset($rowData['upload_index_'.$i])) {
                if ($i == $rowData['upload_index_'.$i]) {
                    //check if upload file exists.
                    $upload_index = $rowData['upload_index_'.$i];
                    $file_name = upload($upload_index);
                    $query_values = $query_values . "," . "'" . $file_name . "'";
                }
                else {
                   $query_values = $query_values . "," . "''";
                }
            } else {
                $query_values = $query_values . "," . "''";
            }

        }
    }
    if($profile=='business_profile'){
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

function InsertRowData($sql, $conn){
    mysqli_query($conn, $sql);
    $answer_id = mysqli_insert_id($conn);
    return $answer_id;
}

$conn->close();
?>
