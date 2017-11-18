<?php
$to      = 'testmailhostingserver@gmail.com';
$subject = 'Test subject';
$message = 'Hello Test';
$headers = 'From:mail@rayi.in' . "\r\n" .  
    'Reply-To: info@loopinmedia.com' . "\r\n" .        
    'X-Mailer: PHP/' . phpversion();
 
if(mail($to, $subject, $message, $headers))
{
    echo "test mail success";
}else
{
    echo "test mail not success";
}
?>