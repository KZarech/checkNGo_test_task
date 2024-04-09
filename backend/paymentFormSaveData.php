<?php
require_once 'PaymentFormHandler.php';


$usersPayments = json_decode(file_get_contents('php://input'), true)['usersPayments'];

if (isset($usersPayments) && count($usersPayments) > 0) {
    return PaymentFormHandler::savePayment($usersPayments);
}
