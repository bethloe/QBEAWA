<?php


header("Content-type: text/plain");

$fileName = $_POST ['fileName'];
$logMessage = $_POST ['logMessage'];


if (file_exists($fileName)) {
  $fh = fopen($fileName, 'a');
  fwrite($fh, $logMessage."\n");
} else {
  $fh = fopen($fileName, 'w');
  fwrite($fh, $logMessage."\n");
}
fclose($fh);


?>