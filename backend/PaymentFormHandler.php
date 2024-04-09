<?php
require 'DBConnection.php';

use DBConnection\DBConnection;

class PaymentFormHandler
{
    private static string $tableName = "users_payments";

    public static function savePayment($payments): string {
        $database = new DBConnection();
        $table = self::$tableName;

        if (is_array($payments) && count($payments) > 0) {
            try {
                $sql = "START TRANSACTION; ";
                $database->execQuery($sql);

                foreach ($payments as $payment) {
                    $stmt = $database->conn->prepare("INSERT INTO $table (name, email, amount) VALUES (?, ?, ?)");
                    $stmt->bind_param("sss", $payment["name"], $payment["email"], $payment["amount"]);
                    $stmt->execute();
                    $stmt->close();
                }
                $sql = "COMMIT";
                $database->execQuery($sql);

                return 'status200';
            } catch (PDOException $e) {
                $sql = "ROLLBACK";
                $database->execQuery($sql);
                echo "Ошибка при сохранении: " . $e->getMessage();
                return 'status500';
            }
        }
        return 'status500';
    }
}
