<?php
header('Access-Control-Allow-Origin: *'); 


$operation = $_POST ['operation'];

if($operation == 'login'){
	try {
		$token = login($_POST ['username'], $_POST ['password']);
		//echo "TOKEN: ". $token . "<br>";
		login($_POST ['username'], $_POST ['password'], $token);
		echo ($token);
	} catch (Exception $e) {
		echo "FAILED: " . $e->getMessage();
		//die("FAILED: " . $e->getMessage());
	}
}
else if($operation == 'edit'){
	try {
		$ret = edit($_POST ['url'], $_POST ['params']);
		echo ($ret);
	} catch (Exception $e) {
		echo "FAILED: " . $e->getMessage();
		//die("FAILED: " . $e->getMessage());
	}
}
else if($operation == 'getEditToken'){
	try {
		$ret = getEditToken();
		echo ($ret);
	} catch (Exception $e) {
		echo "FAILED: " . $e->getMessage();
		//die("FAILED: " . $e->getMessage());
	}
}

function httpEditRequest($url, $post="") {
	$ch = curl_init();
	//Change the user agent below suitably
	curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.9) Gecko/20071025 Firefox/2.0.0.9');
	curl_setopt($ch, CURLOPT_URL, ($url));
	curl_setopt( $ch, CURLOPT_ENCODING, "UTF-8" );
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt ($ch, CURLOPT_COOKIEFILE, "cookies.tmp");
	curl_setopt ($ch, CURLOPT_COOKIEJAR, "cookies.tmp");
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt( $ch, CURLOPT_HTTPHEADER, array( 'Content-Type:multipart/form-data' ) );
	if (!empty($post)) curl_setopt($ch,CURLOPT_POSTFIELDS,$post);
	//UNCOMMENT TO DEBUG TO output.tmp
	curl_setopt($ch, CURLOPT_VERBOSE, true); // Display communication with server
	$fp = fopen("output.tmp", "w");
	curl_setopt($ch, CURLOPT_STDERR, $fp); // Display communication with server
	
	$xml = curl_exec($ch);
	
	if (!$xml) {
		throw new Exception("Error getting data from server ($url): " . curl_error($ch));
	}

	curl_close($ch);
	
	return $xml;
}

function httpRequest($url, $post="") {
	$ch = curl_init();
	//Change the user agent below suitably
	curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.9) Gecko/20071025 Firefox/2.0.0.9');
	curl_setopt($ch, CURLOPT_URL, ($url));
	curl_setopt( $ch, CURLOPT_ENCODING, "UTF-8" );
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt ($ch, CURLOPT_COOKIEFILE, "cookies.tmp");
	curl_setopt ($ch, CURLOPT_COOKIEJAR, "cookies.tmp");
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt( $ch, CURLOPT_HTTPHEADER, array( 'Content-Type: application/x-www-form-urlencoded' ) );
	if (!empty($post)) curl_setopt($ch,CURLOPT_POSTFIELDS,$post);
	//UNCOMMENT TO DEBUG TO output.tmp
	curl_setopt($ch, CURLOPT_VERBOSE, true); // Display communication with server
	$fp = fopen("output.tmp", "w");
	curl_setopt($ch, CURLOPT_STDERR, $fp); // Display communication with server
	
	$xml = curl_exec($ch);
	
	if (!$xml) {
		throw new Exception("Error getting data from server ($url): " . curl_error($ch));
	}

	curl_close($ch);
	
	return $xml;
}

function getEditToken(){
	$url = "https://en.wikipedia.org/w/api.php?action=query&meta=tokens&format=xml";
	$data = httpRequest($url);
	
	if (empty($data)) {
		throw new Exception("No data received from server. Check that API is enabled.");
	}
	
	$xml = simplexml_load_string($data);
	$result = $xml->xpath('/api/query/tokens[@csrftoken]');
	return $result[0]->attributes()->csrftoken;
}

function edit($url, $params){
	$data = httpEditRequest($url, $params);
	
	if (empty($data)) {
		throw new Exception("No data received from server. Check that API is enabled.");
	}
	return $data;
}

function login ($user, $pass, $token='') {
	$url = "http://en.wikipedia.org/w/api.php?action=login&format=xml";

	//echo $url . "<br>".$user . "<br>".$pass . "<br>" ;
	$params = "action=login&lgname=$user&lgpassword=$pass";
	if (!empty($token)) {
		$params .= "&lgtoken=$token";
	}

	$data = httpRequest($url, $params);
	
	if (empty($data)) {
		throw new Exception("No data received from server. Check that API is enabled.");
	}

	$xml = simplexml_load_string($data);
	
	if (!empty($token)) {
		//Check for successful login
		$expr = "/api/login[@result='Success']";
		$result = $xml->xpath($expr);

		if(!count($result)) {
			throw new Exception("Login failed");
		}
	} else {
		$expr = "/api/login[@token]";
		$result = $xml->xpath($expr);

		if(!count($result)) {
			throw new Exception("Login token not found in XML");
		}
	}
	
	return $result[0]->attributes()->token;
}
?>