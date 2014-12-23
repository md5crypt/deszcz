<?php
/*!
	my-awsome-markup -> latex converter
	aka fu*k-load-of-regular-expresions-app
*/

define('TEX_HEAD',	'tex_head.tex');	//tex file header
define('INPUT',		'../deszcz.html');	//file with input text
define('OUTPUT',	'deszcz.tex');		//file with input text
define('TEX_CMD',	'pdflatex %s'); 	//command to excute

$T=	[['[  ]+',' '],
	["[\r\t]",''],
	['^ +',''],
	['[„”]','"'],
	['"([^"]+)"',"\\textit{,,\\1''}"],
	['!line', '\\\\'],
	["\n+","\n"],
	['[-–—]','-'],
	[' - ',' -- '],
	["\n-","\n---"],
	['[*]{3}','\makespacer'],
	["!chapter\s+([^\n]+)",'\chapter{\1}'],
	['([^\s])\s*\[([^\]]+)\]','\1\footnote{\2}'],
	["\n","\n\n"],
	["(\s)([zZWwiaoO])(\s)",'\1\2~']];
$data = file_get_contents(INPUT);
$data = iconv('Windows-1250','UTF-8',$data);
foreach($T as $t)
	$data = mb_ereg_replace($t[0],$t[1],$data);
$tex = file_get_contents(TEX_HEAD).$data."\\end{document}\n";
file_put_contents(OUTPUT,$tex);
passthru(sprintf(TEX_CMD,OUTPUT));
?>