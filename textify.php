<?php
$file = 'input.txt';
// Open the file to get existing content
$current = $_POST[taxonomy];
$current .= $_POST[concepts];
$current .= $_POST[keyword];
$current .= $_POST[relation];
$current .= $_POST[sentiment];
// Write the contents back to the file
file_put_contents($file, $current);
?>