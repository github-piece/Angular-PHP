<?php
require_once('connection.php');


$postdata = file_get_contents("php://input");

if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);
}


$section1 = $request->section1;
$section2 = $request->section2;
$headline = $request->headline;
$imgurl = $request->imgurl;
$id = (int)$request->id;


$statement = $conn->prepare("UPDATE tbl_superuser_about_us SET section1=:section1, section2=:section2, headline=:headline, imgurl=:imgurl WHERE id=:id ");

$result = $statement->execute([
    'section1' => $section1,
    'section2' => $section2,
    'headline' => $headline,
    'imgurl' => $imgurl,
    'id' => $id,
]);

if ($result) {
    http_response_code(201);
    echo json_encode(['data' => $result]);
} else {
    http_response_code(422);
}
return $result;

?>
