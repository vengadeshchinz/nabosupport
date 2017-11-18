<?php

function getDB() {

	$dbhost="localhost";

	$dbuser="rayiipsb_nabo";

	$dbpass="Vy162nN@_liD";

	$dbname="rayiipsb_nabo_support";

	$dbConnection = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	

	$dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	return $dbConnection;

}

