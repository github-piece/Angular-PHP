<?php
	header('Access-Control-Allow-Origin: http://localhost:3000');
	header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding");

	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "mse_db";
	$conn = new mysqli($servername, $username, $password, $dbname);

	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}
?>
