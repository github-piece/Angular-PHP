<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding");

include_once("connection.php");


$action = isset($_POST["action"]) != '' ? $_POST["action"] : '';
switch($action){
    case 'add' :
        addArticle($_POST, $conn);
        break;
    case 'update' :
        updateArticle($_POST, $conn);
        break;
    case 'delete' :
        deleteArticle($_POST, $conn);
        break;
    case 'get' :
        getArticleList($_POST, $conn);
        break;
}


function getArticleList($param, $conn){
    $u_accounttype = $param['u_accounttype'];
    $u_id = $param['u_id'];
    $where = "";

    switch($u_accounttype){
        case "Super Admin":
            $where = "";
            break;
        case "Senior Admin":
            $where = " WHERE account_type NOT LIKE '%Super%'";
            break;
        case "Junior Admin":
            $where = " WHERE account_type LIKE '%Moderator%' OR  article_uid = '".$u_id."' OR article_uparentid = '".$u_id."'";
            break;
        case "Moderator":
            $where = " WHERE article_uid = '".$u_id."' OR article_uparentid = '".$u_id."'";
            break;
        case "User":
            $where = " WHERE article_uid = '".$u_id."'";
            break;

    }
    $return_arr = array();

    $sql = "SELECT tbl_superuser_about_us.*, tbl_user.* FROM tbl_superuser_about_us left join tbl_user on tbl_superuser_about_us.article_uid = tbl_user.u_id".$where." order by tbl_superuser_about_us.article_createdate DESC";
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
        $row_array['imgurl'] = $row['imgurl'];
        $row_array['imgurl1'] = $row['imgurl1'];
        $row_array['imgurl2'] = $row['imgurl2'];
        $row_array['headline'] = $row['headline'];
        $row_array['u_name'] = $row['u_name'];
        $row_array['u_accounttype'] = $row['u_accounttype'];

        array_push($return_arr,$row_array);
        $i++;
    }
    echo json_encode($return_arr);
}

function addArticle($param, $conn){
    //Uploading first file.
    $filename1 = isset($_FILES["file1"]["name"]) != '' ? $_FILES["file1"]["name"] : '';
    if(!empty($filename1)){
        if(is_uploaded_file($_FILES['file1']['tmp_name']))
        {
            sleep(1);
            $source_path = $_FILES['file1']['tmp_name'];


            if( $filename1 != '' ){
                move_uploaded_file($_FILES['file1']['tmp_name'], 'uploaded/'. $filename1);
            }

        }
    }

    //Uploading second file.
    $filename2 = isset($_FILES["file2"]["name"]) != '' ? $_FILES["file2"]["name"] : '';
    if(!empty($filename2)){
        if(is_uploaded_file($_FILES['file2']['tmp_name']))
        {
            sleep(1);
            $source_path = $_FILES['file2']['tmp_name'];


            if( $filename2 != '' ){
                move_uploaded_file($_FILES['file2']['tmp_name'], 'uploaded/'.$filename2);
            }

        }
    }
    date_default_timezone_set('Africa/Johannesburg');
    $date = date('Y-m-d h:i:s a', time());
    $sql = "INSERT INTO tbl_superuser_about_us (section1, section2, headline, account_type, article_uid, article_uparentid, article_createdate, imgurl, imgurl1, imgurl2) VALUES('".$param['section1']."', '".$param['section2']."', '".$param['headline']."', '".$param['u_accounttype']."', '".$param['u_id']."', '".$param['u_parentid']."', '". $date."', '".$param['imgurl']."', '".$filename1."', '".$filename2."')";
    $result = $conn->query($sql);
    getArticleList($param, $conn);
}

function updateArticle($param, $conn){
    $sql = "UPDATE tbl_superuser_about_us SET section1 = '".$param['section1']."', section2 = '".$param['section2']."', imgurl = '".$param['imgurl']."', headline = '".$param['headline']."' WHERE article_createdate = '".$param['id']."' LIMIT 1";

    date_default_timezone_set('Africa/Johannesburg');
    $date = date('Y-m-d h:i:s a', time());
//    $sql = $sql." WHERE article_createdate= '".$param['article_createdate']."'";
    $result = $conn->query($sql);
    getArticleList($param, $conn);
}
function deleteArticle($param, $conn){
    $sql = "DELETE FROM tbl_superuser_about_us";
    $sql = $sql." WHERE id= '".$param['id']."'";
    $result = $conn->query($sql);
    getArticleList($param, $conn);
}

$conn->close();
?>
