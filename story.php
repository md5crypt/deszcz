<!DOCTYPE HTML>
<html>
<head>
	<meta charset="utf-8" />
	<style>
		body{
			background-color: #F0F0F0;
		}
		div{
			max-width:600px;
			margin: 0 auto;
			font: 16px Calibri;
			text-align: justify;
		}
		h1{
			text-align:center;
			margin:0px;
			height: 100px;
		}
		h1 img{
			height: 100px;
			vertical-align:middle;
		}
	</style>
</head>
<body>
<div>
<?php
$a = file_get_contents('https://raw.github.com/md5crypt/deszcz/master/deszcz.txt');
$a = iconv('Windows-1250','UTF-8',$a);
$a = str_replace(array("\r","\n",'–',"\t"),array('','<br/>','-','&nbsp;&nbsp;&nbsp;&nbsp;'),$a);
$a = str_replace('<br/>***<br/>','<br/><center><img src="para.png"/></center>',$a);
$a = str_replace('<br/>---<br/>','<hr/>',$a);
$pos = 0;
while(($pos=strpos($a,'!chapter',$pos))!==false){
	$a = substr_replace($a,'<h1><img src="left.gif"/>',$pos,strlen('!chapter '));
	$pos = strpos($a,'<br/>',$pos);
	$a = substr_replace($a,'<img src="right.gif"/></h1>',$pos,strlen('<br/>'));
}
echo $a;
?>
</div>
</body>
</html>