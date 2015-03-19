<?php


header("Content-type: text/plain");

$operation = $_POST ['operation'];

if($operation == 'einstein'){
	$myfile = fopen("dataset/einstein.txt", "r") or die("Unable to open file!");
	echo fread($myfile,filesize("dataset/einstein.txt"));
	fclose($myfile);
}

?>