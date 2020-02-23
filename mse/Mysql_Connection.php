<?php


class Mysql_Connection
{
    protected $connection;

    public function __construct()
    {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding");

        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "mse_db";
        $this->connection = new mysqli($servername, $username, $password, $dbname);


        if ($this->connection->connect_error) {
            die("Connection failed: " . $this->connection->connect_error);
        }
    }
}
