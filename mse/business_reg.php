<?php
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding");

	include_once("connection.php");

	
	//if (!file_exists('uploaded/'.$_POST['u_id'])) 	
	//	mkdir('uploaded/', 0755, true);
	
	//Uploading personal logo file.
	$pfilename = isset($_FILES["p_uploadfile"]["name"]) != '' ? $_FILES["p_uploadfile"]["name"] : '';
	if(!empty($pfilename)){
		if(is_uploaded_file($_FILES['p_uploadfile']['tmp_name']))
		{
			sleep(1);
			$source_path = $_FILES['p_uploadfile']['tmp_name'];
			
			
			if( $pfilename != '' ){
				move_uploaded_file($_FILES['p_uploadfile']['tmp_name'], 'uploaded/'. $pfilename);		
			}
			
		}
	}
	
	//Uploading business logo file.
	$bfilename = isset($_FILES["b_uploadfile"]["name"]) != '' ? $_FILES["b_uploadfile"]["name"] : '';
	if(!empty($bfilename)){
		if(is_uploaded_file($_FILES['b_uploadfile']['tmp_name']))
		{
			sleep(1);
			$source_path = $_FILES['b_uploadfile']['tmp_name'];
			
			
			if( $bfilename != '' ){
				move_uploaded_file($_FILES['b_uploadfile']['tmp_name'], 'uploaded/'.$bfilename);		
			}
			
		}
	}
	
	date_default_timezone_set('Africa/Johannesburg');
	$date = date('Y-m-d h:i:s a', time());
	
	$address = $_POST['b_address'];; // Address
	// Get JSON results from this request
	$geo = file_get_contents('https://maps.google.com/maps/api/geocode/json?address='.urlencode($address).'&sensor=false&key=AIzaSyA7MXJTDU8raUAbNASH37S-EtzkaWCHfNg');
	$geo = json_decode($geo, true); // Convert the JSON to an array
	if (isset($geo['status']) && ($geo['status'] == 'OK')) {
	  $lat = $geo['results'][0]['geometry']['location']['lat']; // Latitude
	  $long = $geo['results'][0]['geometry']['location']['lng']; // Longitude
	}

	$sql = "INSERT INTO tbl_business (u_id, p_name, p_surename, p_email, p_phonenumber, p_nationality, p_idnumber, p_passportnumber, p_street,
									  p_city, p_postalcode, p_country, p_uploadfile, b_name, b_quantity, b_currency, b_remaining, b_phonenumber, b_location, b_companysector, b_address,
									  b_city, b_postalcode, b_country, b_profile, b_uploadfile, c_registered, c_regnumber, c_vatnumber, c_operationalyears,
									  c_moneytype, c_explain, date_created, latitude, longitude) 
			VALUES('".$_POST['u_id']."', '".$_POST['p_name']."', '".$_POST['p_surename']."', '".$_POST['p_email']."', '". $_POST['p_phonenumber']."', '".$_POST['p_nationality']."', '".
			$_POST['p_idnumber']."', '".$_POST['p_passportnumber']."', '".$_POST['p_street']."', '".$_POST['p_city']."', '".
			$_POST['p_postalcode']."', '".$_POST['p_country']."', '".$pfilename."', '".$_POST['b_name']."', '".$_POST['b_quantity']."', '".$_POST['b_currency']."', '".$_POST['b_quantity']."', '".$_POST['b_phonenumber']."', '".$_POST['b_location'].
			"', '".$_POST['b_companysector']."', '".$_POST['b_address']."', '".$_POST['b_city']."', '".$_POST['b_postalcode']."', '".$_POST['b_country'].
			"', '".$_POST['b_profile']."', '".$bfilename."', '".$_POST['c_registered']."', '".$_POST['c_regnumber']."', '".$_POST['c_vatnumber'].
			"', '".$_POST['c_operationalyears']."', '".$_POST['c_moneytype']."', '".$_POST['c_explain']."', '".$date."', '".$lat."', '".$long."')";
	
	if ($conn->query($sql) === TRUE) {
		echo 1;
	}else {
		echo 0;
	}

	$conn->close();
?>
