 <?php
header('Access-Control-Allow-Origin: *');

$operation = $_POST['operation'];
if ($operation == 'sensium') {
	try {
		echo sensiumRequestTest();
	} catch (Exception $e) {
		echo "FAILED: ".$e->getMessage();
	}
} else if ($operation == 'sensiumURLRequest') {
	try {
		echo sensiumURLRequest('Sentiment');
	} catch (Exception $e) {
		echo "FAILED: ".$e->getMessage();
	}
} else if ($operation == 'sensiumTextRequest') {
	try {
		echo sensiumTextRequest('Sentiment');
	} catch (Exception $e) {
		echo "";
		//echo "FAILED: ".$e->getMessage();
	}
}else if ($operation == 'sensiumSummarize') {
	try {
		echo sensiumURLRequest('Summary');
	} catch (Exception $e) {
		echo "FAILED: ".$e->getMessage();
	}
}else if ($operation == 'sensiumSummarizeText') {
	try {
		echo sensiumTextRequest('Summary');
	} catch (Exception $e) {
		echo "FAILED: ".$e->getMessage();
	}
}else if ($operation == 'sensiumEventExtraction') {
	try {
		echo sensiumURLRequest('TemporalEvents');
	} catch (Exception $e) {
		echo "FAILED: ".$e->getMessage();
	}
}else if ($operation == 'sensiumEventExtractionText') {
	try {
		echo sensiumTextRequest('TemporalEvents');
	} catch (Exception $e) {
		echo "FAILED: ".$e->getMessage();
	}
}else if ($operation == 'sensiumEntitiyExtraction') {
	try {
		echo sensiumURLRequest('Entities');
	} catch (Exception $e) {
		echo "FAILED: ".$e->getMessage();
	}
}else if ($operation == 'sensiumEntitiyExtractionText') {
	try {
		echo sensiumTextRequest('Entities');
	} catch (Exception $e) {
		echo "FAILED: ".$e->getMessage();
	}
}

function httpRequest($url, $post = "") {
	$ch = curl_init();
	//Change the user agent below suitably
	curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.9) Gecko/20071025 Firefox/2.0.0.9');
	curl_setopt($ch, CURLOPT_URL, ($url));
	curl_setopt($ch, CURLOPT_ENCODING, "UTF-8");
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_COOKIEFILE, "cookies.tmp");
	curl_setopt($ch, CURLOPT_COOKIEJAR, "cookies.tmp");
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
	if (!empty($post))
		curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
	//UNCOMMENT TO DEBUG TO output.tmp
	curl_setopt($ch, CURLOPT_VERBOSE, true); // Display communication with server
	$fp = fopen("output.tmp", "w");
	curl_setopt($ch, CURLOPT_STDERR, $fp); // Display communication with server

	$xml = curl_exec($ch);

	if (!$xml) {
		throw new Exception("Error getting data from server ($url): ".curl_error($ch));
	}

	curl_close($ch);

	return $xml;
}

function sensiumURLRequest($type) {
	$API_url = "http://api.sensium.io/v1/extract";
	$API_key = "9f31a709-5d40-4eb4-bb79-43cac4030cfb";
	$url = $_POST['url'];
	$params = '{"apiKey" : "'.$API_key.'", "url" : "'.$url.'", "language": "en",  "extractors": ["'.$type.'"]}';
	$data = httpRequest($API_url, $params);
	if (empty($data)) {
		throw new Exception("No data received from server. Check that API is enabled.");
	}
	return $data;
}

function sensiumTextRequest($type) {
	$API_url = "http://api.sensium.io/v1/extract";
	$API_key = "9f31a709-5d40-4eb4-bb79-43cac4030cfb";
	$text = $_POST['text'];

	$params = '{"apiKey" : "'.$API_key.'", "text" : "'.$text.'", "language": "en",  "extractors": ["'.$type.'"]}';
	$data = httpRequest($API_url, $params);
	$data = $_POST['sectionName']."||splithere||".$data;
	if (empty($data)) {
		throw new Exception("No data received from server. Check that API is enabled.");
	}
	return $data;
}

function sensiumRequestTest() {
	$url = "http://api.sensium.io/v1/extract";
	$params = '{"apiKey" : "9f31a709-5d40-4eb4-bb79-43cac4030cfb", "url" : "https://en.wikipedia.org/wiki/User:Dst2015/sandbox", "language": "en",  "extractors": ["Sentiment"]}';
	$data = httpRequest($url, $params);

	if (empty($data)) {
		throw new Exception("No data received from server. Check that API is enabled.");
	}

	return $data;
}

?>
