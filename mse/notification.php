<?php
    include_once("connection.php");
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    $action = $request->action;
    $return_arr = array();
    if ($action == 'get') {
        $userId = $request->u_id;
        $sql = 
        "SELECT tbl_user.u_name, tbl_user.u_avatar, tbl_user.socialUser, tbl_business.*, tbl_notification.*
        FROM tbl_notification
        INNER JOIN tbl_user ON tbl_notification.userId = tbl_user.u_id 
        INNER JOIN tbl_business ON tbl_notification.businessId = tbl_business.business_id 
        WHERE tbl_notification.userId = '".$userId."'";
        $result = mysqli_query($conn, $sql);
        while ($row = $result->fetch_assoc()) {
            $sql = "SELECT u_name FROM tbl_user WHERE u_id = '".$row['u_id']."' LIMIT 1";
            $show = mysqli_query($conn, $sql);
            while($name = $show->fetch_assoc()) {
                $row_array['businessUser'] = $name['u_name'];
            }
            $row_array['id'] = $row['id'];
            $row_array['name'] = $row['u_name'];
            if ($row['socialUser'] == 1) {
                $row_array['avatar'] = $row['u_avatar'];
            } else {
                $row_array['avatar'] = 'mse/uploaded/avatar/'.$row['u_avatar'];
            }
            $row_array['businessName'] = $row['business name'];
            $row_array['status'] = $row['status'];
            $date = strtotime(date($row['sended_at']));
            date_default_timezone_set('Africa/Johannesburg');
            $now = strtotime(date('Y-m-d h:i:s a', time()));
            $row_array['time'] = diffTime($date, $now);
            array_push($return_arr, $row_array);
        }
        echo json_encode($return_arr);
    }
    if ($action == 'set') {
        $id = $request->id;
        $sql = "UPDATE tbl_notification SET status = 1 WHERE id = '".$id."'";
        $result = mysqli_query($conn, $sql);
    }
    
    $conn->close();

    function diffTime($date, $now) {
        $diff = abs($now - $date); 
        $years = floor($diff / (365*60*60*24));
        $months = floor(($diff - $years * 365*60*60*24) / (30*60*60*24));
        $days = floor(($diff - $years * 365*60*60*24 - $months*30*60*60*24)/ (60*60*24)); 
        $hours = floor(($diff - $years * 365*60*60*24 - $months*30*60*60*24 - $days*60*60*24) / (60*60)); 
        $minutes = floor(($diff - $years * 365*60*60*24 - $months*30*60*60*24 - $days*60*60*24  
                          - $hours*60*60)/ 60);
        $seconds = floor(($diff - $years * 365*60*60*24 - $months*30*60*60*24 - $days*60*60*24 - $hours*60*60 - $minutes*60));
        if($years > 0) {
            return $years.' years ago';
        } else if ($months > 0) {
            return $months.' months ago';
        } else if ($days > 0) {
            return $days.' days ago';
        } else if ($hours > 0) {
            return $hours.' hours ago';
        } else if ($minutes > 0) {
            return $minutes.' minutes ago';
        } else {
            return 'Just now';
        }
    }