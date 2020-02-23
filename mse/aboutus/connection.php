<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, responseType, Accept");

define("USERNAME",'root');
define("PASSWORD",'');
define("DATABASE",'mse_db');
define("HOST",'localhost');

function connectToDatabase(){
    try {
        $conn = new PDO("mysql:host=".HOST.";dbname=".DATABASE, USERNAME, PASSWORD);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // print_r($conn->getAttribute(PDO::ATTR_CONNECTION_STATUS));        
        return $conn;
    }catch(PDOException $e){
        return "Connection failed: " . $e->getMessage();
    }
}

$conn = connectToDatabase();
