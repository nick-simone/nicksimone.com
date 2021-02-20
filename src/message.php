<html>
<body>
<?php
$name = $_POST['name'];
$visEmail = $_POST['email'];
$message = $_POST['message'];

if (empty($name)){
    echo "<script type='text/javascript'>alert('Please enter your name.')</script>";
    exit;
}
else if (empty($visEmail)){
    echo "<script type='text/javascript'>alert('Please enter your email.')</script>";
    exit;
}
else if (empty($message)){
    echo "<script type='text/javascript'>alert('Please enter your message.')</script>";
    exit;
}

$email_from = "nick.simone100@gmail.com";
$email_subject = "New Message From Website";
$email_body = "New message from $name.\n".
    "email address: $visEmail\n".
    "message: \n $message";

$to = "nick.simone100@gmail.com";
$headers = "From: $email_from \r\n";

mail($to, $email_subject, $email_body, $headers);
echo "<script type=text/javascript>alert(Thank you for getting in touch!)</script>";

?>
</html>
</body>