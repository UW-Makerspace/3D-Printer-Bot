<?php 
$usernames = array('f76c5e86b6d9d76c40faad6e6293b895','4d4bfd56efb7c9c3c7ed056d95a6b969','0b3c93581e3d1d8ff80e812913abb3eb','5ca8f7b083ef2a244fff2872dca05c7a','6285a7e74fa817ad464265fd68842ab5','fca9a485c11c38acf03853a8721d66a6','49a7db3892ccc151057e82637dd7e54b','1c92ac150720689a5fa92aea3b3848f1','447bd6c4e5423e20cc8c7511bbb309eb','d591e9c2fc94a12b71ec54c3d81f8e1f','blah','987647e910ea61a116358a7549f109e8','d0e3ab9cccb87357af2fdd9e7969b368');
$passwords = array('f114574f1bd5b993c82507017952ce309892cd96879f59fe2ec4964882a3d6aa','7d5872e3d57a5cb47a90c710cb4ff2b2a209e7eb3e3361ead10af3a4ab917a50','9254e63a3f5108ed8fd6a71127863991cbbf288a24c6ab8c2d1eeaf37239a6ea','ba361f171cd866eb709fea0dfe71d16cef30de0a529fdd6d39350b84ca0e9299','91b174779461dbb5ec255ecb46cd46bafa7cf0049a58457592e88d8f68059a4f','60b1a3b222a4d5b2dc197f4b8aff2ef29c70a9151ef245bdcc2fb011341b7e23','6396c8b61e4c4d6f558db23e16d4d5ed4f6e37cbedc0755ea42052c9ff3a2721','e7480f55a81b5dc6346a66f7a4e7b00d1abfbd09675eee97d978545438188ae0','bcd44b713357818fe37e04651ac47fe0a1ce91a5a9c5197c80802acb9374bddb','f5f11b600dddb66a1b3959e75bdf299a4517c13ffc8cc3885d24c33c06ae65f1','blah','2fb65ba45299af4f5f39117c3a63c45d9c429005d34d7a4b6452d181cba9500c','a477a1627f7b427790f951c4cba8718d6f15cfd9284b3bdc4ea8791f0f2fc999');
for ($x = 10; $x < 23; $x++) {
if($x == 20) {
$x++;
}
$URL='http://10.130.207.' . (string)$x . '/api/v1/printer/led';
$ch = curl_init('http://10.130.207.' . (string)$x . '/api/v1/printer/led');
$username = $usernames[$x - 10];
$password = $passwords[$x - 10];
$data = array($usernames[$x - 10],$passwords[$x - 10]);
$data = array(
  'hue' => rand(0,260),
  'saturation' => rand(90,100),
  'value' => 100,
  );
$data_json = json_encode($data);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_URL,$URL);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_TIMEOUT, 30); //timeout after 30 seconds
curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
curl_setopt($ch, CURLOPT_POSTFIELDS,$data_json);

$response = curl_exec($ch);
}
curl_close($ch);
echo $response;
    if(!$response) {
        return false;
    }
 ?>
