	<?php
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding");
	
	$postdata = file_get_contents("php://input");
	if(isset($postdata) && !empty($postdata)){
		$request = json_decode($postdata);
		$address = $request->address;
		if($address == "")
			$address = "China+Shenyang";
			
	}

	
	$url = "https://maps.google.com/maps/api/geocode/json?address=$address&sensor=false&key=AIzaSyA7MXJTDU8raUAbNASH37S-EtzkaWCHfNg";
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_PROXYPORT, 3128);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	$response = curl_exec($ch);
	curl_close($ch);
	$response_a = json_decode($response);
	//print_r($response_a);
	$lat = $response_a->results[0]->geometry->location->lat;
	$long = $response_a->results[0]->geometry->location->lng;	
	$json_data = array(
		"lat" => $lat,
		"long" => $long
	);
	echo json_encode($json_data);

?>
