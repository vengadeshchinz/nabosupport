<?php
header("Access-Control-Allow-Origin: *");
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

include 'dbConfig.php';
require 'autoload.php';

$app = new Slim\App();
$app->post('/login', 'login');
$app->post('/signup', 'signup');
$app->post('/insertlocation', 'insertlocation');
$app->post('/getUser', 'getUser');
$app->post('/checkUserExist', 'checkUserExist');
$app->post('/forgotpassword', 'forgotpassword');
$app->post('/resetpassword', 'resetpassword');
$app->post('/product', 'product');
$app->get('/userlist', 'userlist');
$app->get('/productlist', 'productlist');
$app->post('/updateProfile','updateProfile');
$app->post('/sendmail','sendmail');
$app->post('/mycontact','mycontact');
$app->post('/getMycontact','getMycontact');
$app->post('/FBlogin','FBlogin');
$app->post('/getNearuser','getNearuser');
$app->get('/getUseraddress','getUseraddress');
$app->post('/outofhome','outofhome');
$app->post('/rangevalue','rangevalue');
$app->post('/dnd','dnd');
$app->run();


/*check the header orgin */
if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }
 
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
 
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
 
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
 
        exit(0);
    }

function login() {
 
    $postdata = file_get_contents("php://input");
    if (isset($postdata)) {
        $request = json_decode($postdata);
        $username = $request->username;
		$password = $request->password;
 
        if ($username != "") {
			try {
				$db = getDB();
				$stmt = $db->prepare("SELECT * FROM user WHERE username=:username1 AND password=:password1");
				$stmt->bindValue(':username1', $username, PDO::PARAM_STR);
				$stmt->bindValue(':password1', $password, PDO::PARAM_STR);
				$stmt->execute();
				$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
				foreach ($rows as $data) {
					$type=$data['id'];
					$user_type=$data['user_type_id'];
					$user_id=$data['user_id'];
				}
				$cur_time=date("Y-m-d H:i:s");
				$token = md5(microtime() . uniqid(). rand());

				$sql = "UPDATE user SET token = :token, expires = ADDTIME(now(), '1000') WHERE username=:username1 AND password=:password1";
				$stmt = $db->prepare($sql);
				$stmt->bindValue(':username1', $username, PDO::PARAM_STR);
				$stmt->bindValue(':password1', $password, PDO::PARAM_STR);
				$stmt->bindParam("token", $token);
				$status = $stmt->execute();
					if (count($rows) > 0) {
						echo '{"status": true,"token": "'.$token.'","user_type": "'.$user_type.'","user_id": "'.$user_id.'"}';
					} else
						echo '{"status": "false"}';
				} catch (PDOException $e) {
						echo '{"error":{"text":' . $e->getMessage() . '}}';
				}
        }
        else {
            echo "Empty username parameter!";
        }
    }
    else {
        echo "Not called properly with username parameter!";
    }
}

function userlist() {
    //  print_r($request->getParsedBody());exit;

    try {
        $db = getDB();
        $stmt = $db->prepare("SELECT * FROM user");
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rows);
    } catch (PDOException $e) {
        echo '{"error":{"text":' . $e->getMessage() . '}}';
    }
}

function productlist() {
    //  print_r($request->getParsedBody());exit;

    try {
        $db = getDB();
        $stmt = $db->prepare("SELECT * FROM product");
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rows);
    } catch (PDOException $e) {
        echo '{"error":{"text":' . $e->getMessage() . '}}';
    }
}

function signup(){
	$postdata = file_get_contents("php://input");
	//echo $postdata;// exit();
    if (isset($postdata)) {
        $request = json_decode($postdata);
        $username = $request->username;
		$password = $request->password;
		$email_id = $request->email_id;
		$url = "assets/imgs/user.jpg";
		$act = 1;
		$uti = 2;
		$street_address = $request->street_address;
	    $zipcode = $request->zipcode;
		$city = $request->city;
		$country = $request->country;
		$is_active = $request->is_active;
		$longitude = $request->longitude;
		$latitude = $request->latitude;
		$status_id = $request->status_id;
		//echo $username.'-'.$password.'-'.$email_id; exit();
		//$user_id = $request->user_id;
		//echo $user_id; exit();
		
		//echo $user_id.'-'.$street_address.'-'.$zipcode.'-'.$city.'-'.$country.'-'.$is_active.'-'.$longitude.'-'.$latitude.'-'.$status_id; exit();
        if ($username != "") {
			$data = checkUserExist($email_id); 
			//echo $data['status']; exit();
			if ($data['status'] == 'True') {
			   try {
					   $db = getDB();
					   $sql = "INSERT INTO user(`username`, `password`, `email_id`, `photo`, `is_active`, `user_type_id`) VALUES ( :username, :password,  :email_id, :photo, :is_active, :user_type_id)";
					   $stmt = $db->prepare($sql);
					   $stmt->bindParam("username", $username);
					   $stmt->bindParam("password", $password);
					   $stmt->bindParam("email_id", $email_id);
					   $stmt->bindParam("photo", $url);
					   $stmt->bindParam("is_active", $act);
					   $stmt->bindParam("user_type_id", $uti);
					   $stmt->execute();
					   //echo '{"status":true}';
					   $sql = "SELECT user_id FROM user WHERE email_id = :email_id";
					   $stmt1 = $db->prepare($sql);
					   $stmt1->bindParam("email_id", $email_id);
					   $stmt1->execute();
					   $rows = $stmt1->fetchAll(PDO::FETCH_ASSOC);
						foreach ($rows as $data) {
							$user_id=$data['user_id'];
						}
							
							//echo $user_id.'-'.$street_address.'-'.$zipcode.'-'.$city.'-'.$country.'-'.$is_active.'-'.$longitude.'-'.$latitude.'-'.$status_id; exit();
							$sql = "INSERT INTO address(`user_id`, `street_address`, `zipcode`, `city`, `country`, `is_active`, `longitude`, `latitude`, `status_id`) VALUES ( :user_id, :street_address,  :zipcode, :city, :country, :is_active, :longitude, :latitude, :status_id)";
							   $stmt = $db->prepare($sql);
							   $stmt->bindParam("user_id", $user_id);
							   $stmt->bindParam("street_address", $street_address);
							   $stmt->bindParam("zipcode", $zipcode);
							   $stmt->bindParam("city", $city);
							   $stmt->bindParam("country", $country);
							   $stmt->bindParam("is_active", $is_active);
							   $stmt->bindParam("longitude", $longitude);
							   $stmt->bindParam("latitude", $latitude);
							   $stmt->bindParam("status_id", $status_id);
							   $stmt->execute();
							   echo '{"status":true}';
							
						//echo $user_id; exit();
						//echo '{"status":true,"id":'.$user_id.'}';
					} catch(PDOException $e) {
					   echo '{"error":{"text":'. $e->getMessage() .'}}';
				   }
			}else {
				echo '{"status":false}';
			}
	    }else {
            echo "Empty username parameter!";
        }
    }
    else {
        echo "Not called properly with username parameter!";
    }
	
}

function insertlocation() {
	
	$postdata = file_get_contents("php://input");
	//var_dump($postdata); exit();
	//echo $postdata; exit();
    if (isset($postdata)) {
        $request = json_decode($postdata);
		//echo $request; exit();
        $user_id = $request->user_id;
		//echo $user_id; exit();
		$street_address = $request->street_address;
		$zipcode = $request->zipcode;
		$city = $request->city;
		$country = $request->country;
		$is_active = $request->is_active;
		$longitude = $request->longitude;
		$latitude = $request->latitude;
		$status_id = $request->status_id;
		//echo $user_id.'-'.$street_address.'-'.$zipcode.'-'.$city.'-'.$country.'-'.$is_active.'-'.$longitude.'-'.$latitude.'-'.$status_id; exit();
		
        
			   try {
					   $db = getDB();
					   $sql = "INSERT INTO address(`user_id`, `street_address`, `zipcode`, `city`, `country`, `is_active`, `longitude`, `latitude`, `status_id`) VALUES ( :user_id, :street_address,  :zipcode, :city, :country, :is_active, :longitude, :latitude, :status_id)";
					   $stmt = $db->prepare($sql);
					   $stmt->bindParam("user_id", $user_id);
					   $stmt->bindParam("street_address", $street_address);
					   $stmt->bindParam("zipcode", $zipcode);
					   $stmt->bindParam("city", $city);
					   $stmt->bindParam("country", $country);
					   $stmt->bindParam("is_active", $is_active);
					   $stmt->bindParam("longitude", $longitude);
					   $stmt->bindParam("latitude", $latitude);
					   $stmt->bindParam("status_id", $status_id);
					   $stmt->execute();
					   echo '{"status":true}';
				} catch(PDOException $e) {
					   echo '{"error":{"text":'. $e->getMessage() .'}}';
				   }
	    
    }
    else {
        echo "Not called properly with locationdata!";
    }
}




function checkUserExist($email_id) {
   try {
       $sql = "SELECT email_id FROM user WHERE email_id =:email_id";
       $db = getDB();
       $smt = $db->prepare($sql);
       $smt->bindParam("email_id", $email_id);
       $smt->execute();
       $count = $smt->rowCount();
       $db = null;
       if ($count > 0) {
		$data = array('status' => 'False');
       }else{
		$data = array('status' => 'True');
	   }
      
   } catch (Exception $e) {
   
       $data = array('status' => 'False', 'msg' => $e->getMessage());
   } finally {
       //print_r($data);
       return $data;
   }
}

function product($request) {
    $today = date("Y-m-d H:i:s");
    $product = $request->getParsedBody();
    $sql = "INSERT INTO `product`(`product_name`, `quantity`, `price`,`category`, `des`,  `created_at`,`status`) VALUES ( :product_name, :qty,  :price, :category, :des, :created_at, :status)";

    try {
        $db = getDB();

        $stmt = $db->prepare($sql);

        $stmt->bindParam("product_name", $product['pro_name']);
        $stmt->bindParam("price", $product['price']);
        $stmt->bindParam("qty", $product['qty']);
        $stmt->bindParam("category", $product['category']);
        $stmt->bindParam("des", $product['des']);
        $stmt->bindParam("status", $product['status']);
        $stmt->bindParam("created_at", $today);
        $status = $stmt->execute();
        $db = null;
        echo '{"status":' . $status . '}';
    } catch (PDOException $e) {
        echo '{"error":{"text":' . $e->getMessage() . '}}';
    }
}


function getUser(){
	    $postdata = file_get_contents("php://input");
	//echo $postdata;exit();
    if (isset($postdata)) {
        $request = json_decode($postdata);
        $user_id = $request->user_id;
		//echo "test";
		//echo $user_id;exit;
			try {
				$db = getDB();
				$stmt = $db->prepare("SELECT * FROM user as u INNER JOIN address as a ON u.user_id=a.user_id WHERE u.user_id=:userid");
				$stmt->bindValue(':userid', $user_id, PDO::PARAM_STR);
				$stmt->execute();
				$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
					if (count($rows) > 0) {
						echo json_encode($rows);
					} else
						echo '{"status": "false"}';
				} catch (PDOException $e) {
						echo '{"error":{"text":' . $e->getMessage() . '}}';
				}
           }
    else {
        echo "Not called properly with username parameter!";
    }
}
function updateProfile(){
//	echo "test";
	 $postdata = file_get_contents("php://input");
	//var_dump($postdata); //exit();
	//echo $postdata;
    if (isset($postdata)) {
        $request = json_decode($postdata);
		
		//var_dump($request);
	    $user_id = $request->user_id;
		$username = $request->username;
		$email_id = $request->email_id;
		$password = $request->password;
		$url = "assets/imgs/user.jpg";
		$uti = 2;
		$street_address = $request->street_address;
		$zipcode = $request->zipcode;
		$city = $request->city;
		$country = $request->country;
		$is_active = $request->is_active;
		$longitude = $request->longitude;
		$latitude = $request->latitude;
		$status_id = 1; 
	
		//echo $user_id.'-'.$username.'-'.$email_id.'-'.$password.'-'.$street_address.'-'.$zipcode.'-'.$city.'-'.$country.'-'.$is_active.'-'.$longitude.'-'.$latitude.'-'.$status_id; exit();
	/* 	"UPDATE the_delivery_process SET order_no = :order_no, order_date = :order_date, order_desc = :order_desc, delivery_date = :delivery_date, time_slot = :time_slot, contact_person = :contact_person, delivery_address = :delivery_address, contact_phone = :contact_phone, help_required = :help_required,persons=:persons, is_paid = :is_paid, amount = :amount, comment = :comment, assigned_to = :assigned_to, salesman= :salesman WHERE id = :id"; */
        
		   try {
					   $db = getDB();
					   $sql = "UPDATE address JOIN user ON (address.user_id = user.user_id)  SET user.username=:username,user.password=:password,user.email_id=:email_id,user.photo=:photo,user.is_active=:is_active,user.user_type_id=:user_type_id,address.street_address=:street_address,address.zipcode=:zipcode,address.city=:city,address.country=:country,address.is_active=:is_active,address.longitude=:longitude,address.latitude=:latitude,address.status_id=:status_id WHERE user.user_id = :user_id and address.user_id=:user_id";
					   $stmt = $db->prepare($sql);
					   $stmt->bindParam("user_id", $user_id);
					   $stmt->bindParam("street_address", $street_address);
					   $stmt->bindParam("zipcode", $zipcode);
					   $stmt->bindParam("city", $city);
					   $stmt->bindParam("country", $country);
					   $stmt->bindParam("is_active", $is_active);
					   $stmt->bindParam("longitude", $longitude);
					   $stmt->bindParam("latitude", $latitude);
					   $stmt->bindParam("status_id", $status_id);
					   $stmt->bindParam("username", $username);
					   $stmt->bindParam("password", $password);
					   $stmt->bindParam("email_id", $email_id);
					   $stmt->bindParam("photo", $url);
					   $stmt->bindParam("user_type_id", $uti);
					   $stmt->execute();
					   echo '{"status":true}';
				} catch(PDOException $e) {
					   echo '{"error":{"text":'. $e->getMessage() .'}}';
				   }
	    
    }
    else {
        echo "Not called properly with locationdata!";
    } 
}


function forgotpassword() {
	$postdata = file_get_contents("php://input");
    if (isset($postdata)) {
        $request = json_decode($postdata);
        $username = $request->username;
		$email = $request->email;
 
        if ($username != "" || $email != "") {
		//echo $username; exit();
			try {
				$db = getDB();
				$stmt = $db->prepare("SELECT * FROM user WHERE username=:username OR email_id=:email");
				$stmt->bindValue(':username', $username, PDO::PARAM_STR);
				$stmt->bindValue(':email', $email, PDO::PARAM_STR);
				$stmt->execute();
				$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
				foreach ($rows as $data) {
					$username=$data['username'];
					$email_id=$data['email_id'];
					$user_id=$data['user_id'];
				}
				//echo $username.'-'.$email_id.'-'.$user_id; exit();
					if (count($rows) > 0) {
						echo '{"status": true, "user_id":'.$user_id.'}';
					} else
						echo '{"status": false}';
				} catch (PDOException $e) {
						echo '{"error":{"text":' . $e->getMessage() . '}}';
				}
        }
        else {
            echo "Empty username parameter!";
        }
    }
    else {
        echo "Not called properly with username parameter!";
    }
}

function resetpassword(){
	$postdata = file_get_contents("php://input");
    if (isset($postdata)) {
        $request = json_decode($postdata);
		$user_id = $request->user_id;
        $password = $request->password;
		$cpassword = $request->cpassword;
        if ($password != "" && $cpassword != "") {
		//echo $username; exit();
			if($password == $cpassword){
					try {
					$db = getDB();
					$stmt = $db->prepare("UPDATE user SET password=:password WHERE user_id=:user_id");
					$stmt->bindValue(':password', $password, PDO::PARAM_STR);
					$stmt->bindValue(':user_id', $user_id, PDO::PARAM_STR);
					$stmt->execute();
					echo '{"status": true}';
					} catch (PDOException $e) {
							echo '{"error":{"text":' . $e->getMessage() . '}}';
					}
				} else {
					echo '{"msg": password mismatch}';
				}
			
        }
        else {
            echo "Empty username parameter!";
        }
    }
    else {
        echo "Not called properly with username parameter!";
    }
				   
}
function sendmail(){
	 $postdata = file_get_contents("php://input");
    // if (isset($postdata)) {
         $request = json_decode($postdata);
		 $name = $request->name;
        $email =$request->mail;
		 $subject = $request->subject;
		 $message = $request->message;
		



	//echo $name.','.$email.','.$subject.','.$message;
    $to = $email; // this is your Email address
    $from = "mail@rayi.in"; // this is the sender's Email address
    $first_name = $name;
    $subject = $subject;
    $message = $message;
	 $headers  = 'From: '.$first_name.'<'.$from.'>'. "\r\n";
    $headers .= "Cc: testsite < mail@testsite.com >\n"; 
    $headers .= "X-Sender: testsite < mail@testsite.com >\n";
    $headers .= 'X-Mailer: PHP/' . phpversion();
    $headers .= "X-Priority: 1\n"; // Urgent message!
    $headers .= "Return-Path: mail@testsite.com\n"; // Return path for errors
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=iso-8859-1\n";
    //$headers = "From:" . $from;
    //$headers2 = "From:" . $to;
    //mail($to,$subject,$message,$headers);
   // mail($from,$subject,$message,$headers2); // sends a copy of the message to the sender
   // echo "Mail Sent. Thank you " . $first_name . ", we will contact you shortly.";
    // You can also use header('Location: thank_you.php'); to redirect to another page.
	 if(mail($to,$subject,$message,$headers)&&mail($from,$subject,$message,$headers)){
                $statusMsg = 'Your contact request has been submitted successfully !';
                $msgClass = 'succdiv';
				
            }else{
                $statusMsg = 'Your contact request submission failed, please try again.';
                $msgClass = 'errordiv';
            }
		//	echo "status".$statusMsg;
	echo '{"status": true}';
   // }
}
function mycontact(){
	$postdata = file_get_contents("php://input");
    if (isset($postdata)) {
	//print_r($postdata);
        $request = json_decode($postdata);
		$name = $request->name;
        $email = $request->mail;
		$address = $request->address;
		$phone = $request->phone;
		$user_id = $request->user_id;
		
		
	   try {
					   $db = getDB();
					   $sql = "INSERT INTO my_contact(`user_id`, `name`, `address`, `email_id`, `phone_number`) VALUES ( :user_id, :name,  :address, :email, :phone)";
					   $stmt = $db->prepare($sql);
					   $stmt->bindParam("user_id", $user_id);
					   $stmt->bindParam("address", $address);
					   $stmt->bindParam("name", $name);
					   $stmt->bindParam("email", $email);
					   $stmt->bindParam("phone", $phone);
					   $stmt->execute();
					   echo '{"status":true}';
				} catch(PDOException $e) {
					   echo '{"error":{"text":'. $e->getMessage() .'}}';
				   }


	//echo $name.','.$email.','.$address.','.$phone;
	//exit;
	}else{
	echo "false";
	}
}
function getMycontact(){
	    $postdata = file_get_contents("php://input");
	//echo $postdata;exit();
    if (isset($postdata)) {
        $request = json_decode($postdata);
        $user_id = $request->user_id;
		//echo "test";
		//echo $user_id;exit;
			try {
				$db = getDB();
				$stmt = $db->prepare("SELECT * FROM my_contact WHERE user_id=:userid");
				$stmt->bindValue(':userid', $user_id, PDO::PARAM_STR);
				$stmt->execute();
				$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
					if (count($rows) > 0) { 
						echo json_encode($rows);
					} else
						echo '{"status": "false"}';
				} catch (PDOException $e) {
						echo '{"error":{"text":' . $e->getMessage() . '}}';
				}
           }
    else {
        echo "Not called properly with username parameter!";
    }
}

function FBlogin(){
	$postdata = file_get_contents("php://input");
	//echo $postdata;// exit();
	$request = json_decode($postdata);
    if (isset($request)) {
		$email_id = $request->email;
		$url = "assets/imgs/user.jpg";
		$act = 1;
		$uti = 2;
		$street_address = $request->street_address;
	    $zipcode = $request->zipcode;
		$city = $request->city;
		$country = $request->country;
		$is_active = $request->is_active;
		$longitude = $request->longitude;
		$latitude = $request->latitude;
		$status_id = $request->status_id;
		//echo $username.'-'.$password.'-'.$email_id; exit();
		//$user_id = $request->user_id;
		//echo $user_id; exit();
		
		//echo $user_id.'-'.$street_address.'-'.$zipcode.'-'.$city.'-'.$country.'-'.$is_active.'-'.$longitude.'-'.$latitude.'-'.$status_id; exit();
        if ($email_id != "") {
			$data = checkUserExist($email_id); 
			//echo $data['status']; exit();
			if ($data['status'] == 'True') {
			   try {
					   $db = getDB();
					   $sql = "INSERT INTO user(`email_id`, `photo`, `is_active`, `user_type_id`) VALUES ( :email_id, :photo, :is_active, :user_type_id)";
					   $stmt = $db->prepare($sql);
					   $stmt->bindParam("email_id", $email_id);
					   $stmt->bindParam("photo", $url);
					   $stmt->bindParam("is_active", $act);
					   $stmt->bindParam("user_type_id", $uti);
					   $stmt->execute();
					   //echo '{"status":true}';
					   $sql = "SELECT user_id FROM user WHERE email_id = :email_id";
					   $stmt1 = $db->prepare($sql);
					   $stmt1->bindParam("email_id", $email_id);
					   $stmt1->execute();
					   $rows = $stmt1->fetchAll(PDO::FETCH_ASSOC);
						foreach ($rows as $data) {
							$user_id=$data['user_id'];
						}
							
							//echo $user_id.'-'.$street_address.'-'.$zipcode.'-'.$city.'-'.$country.'-'.$is_active.'-'.$longitude.'-'.$latitude.'-'.$status_id; exit();
							$sql = "INSERT INTO address(`user_id`, `street_address`, `zipcode`, `city`, `country`, `is_active`, `longitude`, `latitude`, `status_id`) VALUES ( :user_id, :street_address,  :zipcode, :city, :country, :is_active, :longitude, :latitude, :status_id)";
							   $stmt = $db->prepare($sql);
							   $stmt->bindParam("user_id", $user_id);
							   $stmt->bindParam("street_address", $street_address);
							   $stmt->bindParam("zipcode", $zipcode);
							   $stmt->bindParam("city", $city);
							   $stmt->bindParam("country", $country);
							   $stmt->bindParam("is_active", $is_active);
							   $stmt->bindParam("longitude", $longitude);
							   $stmt->bindParam("latitude", $latitude);
							   $stmt->bindParam("status_id", $status_id);
							   $stmt->execute();
							   echo '{"status": true,"user_type": "'.$uti.'","user_id": "'.$user_id.'"}';
							
						//echo $user_id; exit();
						//echo '{"status":true,"id":'.$user_id.'}';
					} catch(PDOException $e) {
					   echo '{"error":{"text":'. $e->getMessage() .'}}';
				   }
			}else {
   try {
       $sql = "SELECT * FROM user WHERE email_id =:email_id";
       $db = getDB();
       $smt = $db->prepare($sql);
       $smt->bindParam("email_id", $email_id);
       $smt->execute();
	   $rows = $smt->fetchAll(PDO::FETCH_ASSOC);
	   foreach ($rows as $data) {
							$userid=$data['user_id'];
						}
	   //$userdata= json_encode($rows);
	 //  $destination_array[] = explode(',', $rows)
	// print_r( $destination_array) ;
    echo '{"status": true,"user_type": "'.$uti.'","user_id": "'.$userid.'"}';
   } catch (Exception $e) {
   
       $data = array('status' => 'False', 'msg' => $e->getMessage());
   }
			}
	    }else {
            echo "Empty username parameter!";
        }
    }
    else {
        echo "Not called properly with username parameter!";
    }
	
}
function getUseraddress(){
	
	  try {
       $sql = "SELECT user.user_id, username, street_address, zipcode, city, country, longitude, latitude FROM user LEFT JOIN address ON address.user_id = user.user_id";
       $db = getDB();
       $smt = $db->prepare($sql);
	   
       $smt->execute();
	   $rows = $smt->fetchAll(PDO::FETCH_ASSOC);
	   
	  echo json_encode($rows);
	 //  $destination_array[] = explode(',', $rows)
	// print_r( $destination_array) ;
   // echo '{"status": true,"user_type": "'.$uti.'","user_id": "'.$userid.'"}';
   } catch (Exception $e) {
   
       $data = array('status' => 'False', 'msg' => $e->getMessage());
   }
	
}
function rangevalue(){
 $postdata = file_get_contents("php://input");
 $request = json_decode($postdata);
   
		$rng_value = $request->valuedata;
		$user_id = $request->user_id;
	//echo $rng_value.','.$user_id;exit;
	try {
					   $db = getDB();
					   $sql = "UPDATE user SET distance=:rang WHERE user_id=:user_id";
					   $stmt = $db->prepare($sql);
					   $stmt->bindParam("user_id", $user_id);
					   $stmt->bindParam("rang", $rng_value);
					
					   $stmt->execute();
					  echo '{"status":true}';
					   
				} catch(PDOException $e) {
					   echo '{"error":{"text":'. $e->getMessage() .'}}';
				   } 
				  
}
function getNearuser(){
	//echo "testnear";
	$postdata = file_get_contents("php://input");
	//echo $postdata;// exit();
	$request = json_decode($postdata);
   
		$rng_value = $request->valuedata;
		$user_id = $request->user_id;
		//$data=range($rng_value,$user_id);
		//if($data['status']=='TRUE'){
		
		$lat=$request->latitude;
		$lng=$request->longitude;
		//echo $rng_value.','.$lat.','.$lng;exit;
		try{
			$sql="SELECT  latitude, longitude, SQRT( POW( 69.1 * ( latitude - :lat ) , 2 ) + POW( 69.1 * ( :lng - longitude ) * COS( latitude / 57.3 ) , 2 ) ) AS distance FROM address HAVING distance <:rang ORDER BY distance LIMIT 0 , 30";
			$db = getDB();
		    $smt = $db->prepare($sql);
			$smt->bindParam(':rang', $rng_value);
			$smt->bindParam(':lat', $lat);
			$smt->bindParam(':lng', $lng);
		    $smt->execute();
		    $rows = $smt->fetchAll(PDO::FETCH_ASSOC);
	   
	  echo json_encode($rows);
			}
			 catch (Exception $e) {
   
       $data = array('status' => 'False', 'msg' => $e->getMessage());
   }
		/* }else{
		echo "range not store";} */
	
}

function outofhome(){
	$postdata = file_get_contents("php://input");
//	print_r($postdata);exit;
	  $request = json_decode($postdata);
		$ooh = $request->outofhome;
		$userid=$request->user_id;		
		//echo $ooh.','.$userid;exit;
	   try {
					   $db = getDB();
					   $sql = "UPDATE user SET out_of_home=:ooh WHERE user_id=:user_id";
					   $stmt = $db->prepare($sql);
					   $stmt->bindParam("user_id", $userid);
					   $stmt->bindParam("ooh", $ooh);
					   $stmt->execute();
					   echo '{"status":true}';
				} catch(PDOException $e) {
					   echo '{"error":{"text":'. $e->getMessage() .'}}';
				   }
}
function dnd(){
	$postdata = file_get_contents("php://input");
	//print_r($postdata);
	  $request = json_decode($postdata);
	
		$dnd = $request->notify;
		$userid=$request->user_id;		
		//echo $dnd;
		if($dnd=="true"){
			$dnd_chg=1;
			}else{
			$dnd_chg=0;
			}
			//echo $dnd_chg.','.$userid;exit;
	   try {
					   $db = getDB();
					   $sql = "UPDATE user SET do_not_distrub=:dnd WHERE user_id=:user_id";
					   $stmt = $db->prepare($sql);
					   $stmt->bindParam("user_id", $userid);
					   $stmt->bindParam("dnd", $dnd_chg);
					
					   $stmt->execute();
					   echo '{"status":true}';
				} catch(PDOException $e) {
					   echo '{"error":{"text":'. $e->getMessage() .'}}';
				   }
}
   

