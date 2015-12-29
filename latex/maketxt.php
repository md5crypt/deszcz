<?php
/*!
	my-awsome-markup -> latex converter
	aka fu*k-load-of-regular-expresions-app
*/

$T=	[['[  ]+',' '],
	["[\r\t]",''],
	['^ +',''],
	['[„”]','"'],
	//['"([^"]+)"',"\\textit{,,\\1''}"],
	['!line', ''],
	["\n+","\n"],
	['[-–—]','-'],
	[' - ',' - '],
	["\n-","\n--"],
	['[*]{3}',""],
	["!license[^\n]+",''],
	["!chapter\s+([^\n]+)","\n--- \\1 ---\n"]];
	//["(\\\\makespacer\n+)([^-])",'\1\noindent \2'],
	//["(\\\\chapter[^\n]+\n+)---",'\1\indent\indent ---'],
	//['([^\s])\s*\[([^\]]+)\]','\1\footnote{\2}'],
	//["\n","\n\n"],
	//["(\s)([zZWwiaoO])(\s)",'\1\2~']];
$ls = glob('../text-data/*');
$data = "";
natsort($ls);
foreach($ls as $file)
	$data .= file_get_contents($file);
$data = iconv('Windows-1250','UTF-8',$data);
foreach($T as $t)
	$data = mb_ereg_replace($t[0],$t[1],$data);
//$tex = file_get_contents(TEX_HEAD).$data."\\end{document}\n";
file_put_contents('out.txt',$data);
?>