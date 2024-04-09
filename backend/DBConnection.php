<?php

namespace DBConnection;

class DBConnection
{
    private string $servername = "localhost";
    private string $username = "root";
    private string $password = "root";
    private string $dbname = "check_n_go_task";
    public \mysqli $conn;

    public function __construct()
    {
        $this->conn = mysqli_connect($this->servername, $this->username, $this->password, $this->dbname);

        if (!$this->conn) {
            throw new \Exception("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function execQuery($sql) {
        if($this->conn->query($sql) === FALSE) {
            echo "Ошибка: " .$sql . "<br>" . $this->conn->error;
        }
    }

    public function __destruct() {
        mysqli_close($this->conn);
    }
}