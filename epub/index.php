<?php

function content_opf($chapters){
	for($i=0; $i<count($chapters); $i++){
		$a .= '<item href="part'.$i.'.html" id="part'.$i.'" media-type="application/xhtml+xml"/>';
		$b .= '<itemref idref="part'.$i.'"/>';
	}
	return <<<HER
<?xml version='1.0' encoding='utf-8'?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uuid_id" version="2.0">
  <metadata xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:opf="http://www.idpf.org/2007/opf" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:calibre="http://calibre.kovidgoyal.net/2009/metadata" xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:language>pl</dc:language>
    <dc:creator>Marek Korzeniowski</dc:creator>
    <dc:title>Deszcz</dc:title>
    <dc:identifier id="uuid_id" opf:scheme="uuid">some-random-string</dc:identifier>
  </metadata>
  <manifest>
    {$a}
    <item href="left.gif" id="left" media-type="image/gif"/>
	<item href="right.gif" id="right" media-type="image/gif"/>
	<item href="para.png" id="para" media-type="image/png"/>
    <item href="stylesheet.css" id="css" media-type="text/css"/>
    <item href="toc.ncx" id="ncx" media-type="application/x-dtbncx+xml"/>
  </manifest>
  <spine toc="ncx">
	{$b}
  </spine>
  <guide/>
</package>
HER;
}

function toc_ncx($chapters){
	$i = 0;
	foreach($chapters as $c){
		$a.= '<navPoint id="part'.$i.'_nav" playOrder="'.($i+1).'"><navLabel><text>'.$c.'</text></navLabel><content src="part'.$i.'.html"/></navPoint>';
		$i++;
	}
	return <<<HER
<?xml version='1.0' encoding='utf-8'?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="en-US">
  <head>
    <meta name="dtb:uid" content="some-random-string"/>
    <meta name="dtb:depth" content="1" />
    <meta name="dtb:totalPageCount" content="0" />
    <meta name="dtb:maxPageNumber" content="0" />
  </head>
  <docTitle>
    <text>Deszcz</text>
  </docTitle>
  <navMap>
    {$a}
  </navMap>
</ncx>
HER;
}

echo "fetching source text...<br/>";
$a = file_get_contents('https://raw.github.com/md5crypt/deszcz/master/deszcz.html');
$a = iconv('Windows-1250','UTF-8',$a);
$a = str_replace(array("\r","\n",'–',"\t"),array('','<br/>','-','&nbsp;&nbsp;&nbsp;&nbsp;'),$a);
$a = str_replace('<br/>***<br/>','<div><img src="para.png"/></div>',$a);
$a = str_replace('<br/>---<br/>','<hr/>',$a);
$a = preg_replace('/(<br\/>)+<div>/', '<div>', $a);
$a = preg_replace('/<\/div>(<br\/>)+/','</div>', $a);

$pos = strpos($a,'!chapter');
if($pos === false)
	die('error');
	
if(file_exists('deszcz.epub'))
	unlink('deszcz.epub');
echo "creating zip file...<br/>";
$zip = new ZipArchive();
if($zip->open('deszcz.epub', ZipArchive::CREATE) !== true)
	die('error');

$chapters = [];
$i = 0;
do{
	$p = $pos+strlen('!chapter ');
	$chapters[] = substr($a,$p,strpos($a,'<br/>',$p)-$p);
	$a = substr_replace($a,'<h1><img src="left.gif"/>',$pos,strlen('!chapter '));
	$p = strpos($a,'<br/>',$pos);
	$a = substr_replace($a,'<img src="right.gif"/></h1>',$p,strlen('<br/>'));
	$p = strpos($a,'!chapter',$p);
	$tmp = ($p===false?substr($a,$pos):substr($a,$pos,$p-$pos));
	$tmp = preg_replace('/<\/h1>(<br\/>;)+/','</h1>', $tmp);
	echo "adding chapter {$i}...<br/>";
	$zip->addFromString('part'.($i++).'.html','<!DOCTYPE HTML><html><head><meta charset="utf-8" /><link rel="stylesheet" type="text/css" href="stylesheet.css" /></head><body>'.$tmp.'</body></html>');
	$pos = $p;
}while($pos !== false);
echo "generating xml files...<br/>";
$zip->addFromString('toc.ncx',toc_ncx($chapters));
$zip->addFromString('content.opf',content_opf($chapters));
echo "adding static files...<br/>";
foreach(glob('epub_root/*.*') as $f)
	$zip->addFile($f,substr($f,strlen('epub_root/')));
$zip->addFile('epub_root/META-INF/container.xml','META-INF/container.xml');
$zip->addFile('epub_root/mimetype','mimetype');
$zip->close();
echo 'done. download here: <a href="deszcz.epub">deszcz.epub</a>';

?>