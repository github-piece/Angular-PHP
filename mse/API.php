<?php

require_once 'Mysql_Connection.php';
class API extends Mysql_Connection
{
    public function create($data)
    {
        // Validate.
        if (trim($data->name) == '') {
            return http_response_code(400);
        }

        // Sanitize.
        $name = mysqli_real_escape_string($this->connection, (string)($data->name));
        $surname = mysqli_real_escape_string($this->connection, (string)$data->surname);
        $imgurl = mysqli_real_escape_string($this->connection, (string)$data->imgurl);
        $short_bio = mysqli_real_escape_string($this->connection, (string)$data->short_bio);


        // Create.
        $sql = "INSERT INTO `tbl_superuser_about_us`(`id`, `name`,`surname`, `imgurl`, `short_bio`) VALUES (null,'{$name}','{$surname}', '{$imgurl}', '{$short_bio}')";

        if (mysqli_query($this->connection, $sql)) {
            http_response_code(201);
            $response = [
                'name' => $name,
                'surname' => $surname,
                'imgurl' => $imgurl,
                'short_bio' => $short_bio,
                'id' => mysqli_insert_id($this->connection)
            ];
            return array('status' => 'success', 'card' => $response);
        } else {
            http_response_code(422);
            return array('status' => 'failed');
        }
    }
    public function update($data)
    {
        // Validate.
        if (trim($data->name) == '') {
            return http_response_code(400);
        }

        // Sanitize.
        $id = mysqli_real_escape_string($this->connection, (string)($data->id));
        $name = mysqli_real_escape_string($this->connection, (string)($data->name));
        $surname = mysqli_real_escape_string($this->connection, (string)$data->surname);
        $imgurl = mysqli_real_escape_string($this->connection, (string)$data->imgurl);
        $short_bio = mysqli_real_escape_string($this->connection, (string)$data->short_bio);


        // Create.
        $sql = "UPDATE `tbl_superuser_about_us`(`name`,`surname`, `imgurl`, `short_bio`) SET ('{$name}','{$surname}', '{$imgurl}', '{$short_bio}') WHERE `id` = '{$id}'";

        if(mysqli_query($this->connection, $sql))
        {
            http_response_code(204);
        }
        else
        {
            return http_response_code(422);
        }
    }
    public function delete($data)
    {
        // Validate.
        if (trim($data->name) == '') {
            return http_response_code(400);
        }
        $id = ($_GET['id'] !==null && (int)$_GET['id'] > 0)? mysqli_real_escape_string($this->connection, (int)$_GET['id']) : false;

        if(!$id) {
            return http_response_code(400);
        }
        // Sanitize.


        // Create.
        $sql = "DELETE FROM `tbl_superuser_about_us` WHERE `id` = '{$id}' LIMIT 1";

        if(mysqli_query($this->connection, $sql))
        {
            http_response_code(204);
        }
        else
        {
            return http_response_code(422);
        }
    }
    public function read()
    {
        // Validate.

        $response = [];
        $sql = "SELECT id, name, surname, imgurl, short_bio FROM tbl_superuser_about_us";

        if($result = mysqli_query($this->connection,$sql))
        {
            $i = 0;
            while($row = mysqli_fetch_assoc($result))
            {
                $response[$i]['id']    = $row['id'];
                $response[$i]['name'] = $row['name'];
                $response[$i]['surname'] = $row['surname'];
                $response[$i]['imgurl'] = $row['imgurl'];
                $response[$i]['short_bio'] = $row['short_bio'];
                $i++;
            }

            echo json_encode($response);
        }
        else
        {
            http_response_code(404);
        }

    }
}
