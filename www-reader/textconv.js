/*!
The MIT License (MIT)

Copyright (c) 2015 Marek Korzeniowski

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var text_path = "../text-data/"
var chapter_count = 7;

function load_files(done,error,bump){
	var deffered_array = [];
	var data = [];
	for(var i=0; i<chapter_count; i++){
		(function(i){
			deffered_array[i] = $.ajax({url:text_path+i+".html",dataType: "binary", processData: false, responseType:"arraybuffer"}).done(function(buffer){
				data[i] = buffer;
				if(typeof(bump) !== 'undefined')
					bump();
			});
		}(i));	
	}
	$.when.apply($, deffered_array).then(function(){
		var M0 = "ĘÓĄŚŁŻŹĆŃęóąśłżźćń-- \"\"".split("");
		var M1 = [0xCA,0xD3,0xA5,0x8C,0xA3,0xAF,0x8F,0xC6,0xD1,0xEA,0xF3,0xB9,0x9C,0xB3,0xBF,0x9F,0xE6,0xF1,0x96,0x97,0xA0,0x84,0x94]; //Windows-1250 charset
		var M = [];
		for(var i=0; i<128; i++)
			M[i] = String.fromCharCode(i);
		for(var i=128; i<256; i++)
			M[i] = ' ';
		for(var k in M1)
			M[M1[k]] = M0[k];
		story = '';
		for(var i=0; i<chapter_count; i++){
			var view = new Uint8Array(data[i]);
			for(var j=0; j<view.length; j++)
				story += M[view[j]];
		}
		done(story);
	},error);
}

function text2html(story){
	var license = story.match(/!license ([^\n]+)/)[1];
	story = story.replace(/\"([^\"]+)\"/g," <span class=\"quote\">&bdquo;$1&ldquo;</span>");
	story = story.replace(/[\n\r]+/g,"\n");
	story = story.replace(/[*]{3}(\s+[^-])/g,"<p class=\"section noindent\">&lowast;&nbsp;&lowast;&nbsp;&lowast;</p>$1");
	story = story.replace(/[*]{3}/g,"<p class=\"section\">&lowast;&nbsp;&lowast;&nbsp;&lowast;</p>");
	story = story.replace(/!chapter\s+(.+)(\n\s*[^-])/g,"</div><div class=\"chapter-div\"><p class=\"chapter noindent\" data-name=\"$1\" ></p>$2");
	story = story.replace(/!chapter\s+(.+)/g,"</div><div class=\"chapter-div\"><p class=\"chapter\" data-name=\"$1\" ></p>");
	story = story.replace(/ - /g," &ndash; ");
	story = story.replace(/\n-/g,"\n&mdash;");	
	story = story.replace(/!line/g,"<br/>");
	story = story.replace(/\n([^<].+)/g,"<p class=\"line\">$1</p>");
	story = story.replace(/([^\s]+)\s*\[([^\]]+)\]/g,'$1 <span class="line footnote">[$2]</span>');
	story = story.replace(/(\s)([zZWwiaoO]) /g,"$1$2&nbsp;");
	wrapper = $('<div>'+story);
	wrapper.first().empty();
	wrapper = wrapper.next();
	console.log(wrapper);
	wrapper.find(".noindent").next().css('text-indent','0px');
	wrapper.find('sup').each(function(){
		$(this).parent().after('<p class="line footnote"> ['+$(this).attr('data-alt')+']</p>');
	});
	return {'license':license,'data':wrapper};
}