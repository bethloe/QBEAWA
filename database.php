<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "wikidata";

// Create connection
$conn = new mysqli ( $servername, $username, $password, $dbname );

// Check connection
if ($conn->connect_error) {
	die ( "Connection failed: " . $conn->connect_error );
}

//I know sql injections are possible :-(

header("Content-type: text/plain");

$operation = $_POST ['operation'];
$username = $_POST ['username'];

if($operation == 'storeFormula'){
	$name = $_POST ['name'];
	$formula = $_POST ['formula'];
	//$sql = "insert into formulas (f_content) values ('"+ $formula +"')";
	$sql = "insert into formulas (f_name, f_content) VALUES ('".$name."', '".$formula."')";
	if ($conn->query($sql) === TRUE) {
		echo "operation storeForumla done ";
	} else {
		echo "Error: " . $sql . "<br>" . $conn->error;
	}
}else if($operation == 'getAllFormulas'){
	$sql = "SELECT f_content FROM formulas";
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		// output data of each row
		$help = array();
		while($row = $result->fetch_assoc()) {
			array_push($help, $row["f_content"]);
		}
		$post_data = json_encode(array('formulas' => $help));
		echo $post_data;
	} else {
		echo "no results";
	}	
}else if($operation == 'storeVizToQM'){
	$qmvizName = $_POST ['QMVizName'];
	$qmvizData = $_POST ['QMVizData'];
	$sql = "insert into qmvisualization (q_name, q_content) VALUES ('". $qmvizName ."','".$qmvizData."')";
	if ($conn->query($sql) === TRUE) {
		echo "operation storeVizToQM done ";
	} else {
		echo "Error: " . $sql . "<br>" . $conn->error;
	}
}else if($operation == 'getAllQMVizs'){
	$sql = "SELECT q_name, q_content FROM qmvisualization";
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		// output data of each row
		$help = array();
		while($row = $result->fetch_assoc()) {
			$help[$row["q_name"]] = $row["q_content"];
		}
		$post_data = json_encode(array('qmvizs' => $help));
		echo $post_data;
	} else {
		echo "no results";
	}	
}


if($operation == 'storeEquation'){
	$name = $_POST ['name'];
	$equation = $_POST ['equation'];
	$text = $_POST ['text'];
	//$sql = "insert into formulas (f_content) values ('"+ $formula +"')";
	$sql = "insert into equations".$username." (e_name, e_content, e_text) VALUES ('".$name."', '".$equation."', '".$text."')";
	if ($conn->query($sql) === TRUE) {
		echo "operation storeEquation done ";
	} else {
		$sql = "update equations".$username." set e_content = '".$equation."' , e_text = '".$text."'  where e_name = '".$name."'";
		if ($conn->query($sql) === TRUE) {
			echo "operation storeEquation done ";
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
		}
	}
}else if($operation == 'getAllEquations'){
	$sql = "SELECT e_name, e_content FROM equations".$username."";
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		// output data of each row
		$help = array();
		while($row = $result->fetch_assoc()) {
			$help[$row["e_name"]] = $row["e_content"];
		}
		$post_data = json_encode(array('equations' => $help));
		echo $post_data;
	} else {
		echo "no results";
	}	
}else if($operation == 'getAllEquationTexts'){
	$sql = "SELECT e_name, e_text FROM equations".$username."";
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		// output data of each row
		$help = array();
		while($row = $result->fetch_assoc()) {
			$help[$row["e_name"]] = $row["e_text"];
		}
		$post_data = json_encode(array('equationTexts' => $help));
		echo $post_data;
	} else {
		echo "no results";
	}	
}else if($operation == 'storeEquationViz'){
	$qmvizName = $_POST ['QMVizName'];
	$qmvizData = $_POST ['QMVizData'];
	$sql = "insert into equationviz".$username." (ev_name, ev_content) VALUES ('". $qmvizName ."','".$qmvizData."')";
	if ($conn->query($sql) === TRUE) {
		echo "operation storeVizToQM done ";
	} else {
		$sql = "update equationviz".$username." set ev_content = '".$qmvizData."' where ev_name = '".$qmvizName."'";
		if ($conn->query($sql) === TRUE) {
			echo "operation storeVizToQM done ";
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
		}
	}
}else if($operation == 'getEquationViz'){
	$sql = "SELECT ev_name, ev_content FROM equationviz".$username."";
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		// output data of each row
		$help = array();
		while($row = $result->fetch_assoc()) {
			$help[$row["ev_name"]] = $row["ev_content"];
		}
		$post_data = json_encode(array('qmvizs' => $help));
		echo $post_data;
	} else {
		echo "no results";
	}	
}else if($operation == 'delteEquationInclViz'){
	$name = $_POST ['equationName'];
	$sql = "DELETE FROM equations".$username." where e_name='".$name."'";
	if ($conn->query($sql) === TRUE) {
		$sql = "DELETE FROM equationviz".$username." where ev_name='".$name."'";
		if ($conn->query($sql) === TRUE) {
			echo "operation delteEquationInclViz done ";
		}else {
			echo "Error: " . $sql . "<br>" . $conn->error;
		}
	} else {
		echo "Error: " . $sql . "<br>" . $conn->error;
	}	
}


$conn->close ();

?>