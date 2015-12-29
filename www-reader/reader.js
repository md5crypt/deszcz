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

/*
	my awesome JS book reader
	tottaly didn't steal most of the ideas from hpmor.com *sorry for that guys*
*/

var config = {fontsize:16, chapter:0, position:0, invert:false, viewFull:false};
$(function(){
	var loaded = 0;
	$('#ldr').html("Fetching content... "+loaded+"/"+chapter_count);
	load_files(function(story){
		$('#ldr').html('Transcodeing content...');
		$.cookie.json = true;
		$.cookie.defaults.expires = 365;
		var config_tmp = $.cookie('reader-config');
		if(typeof config_tmp == "object" && Object.keys(config_tmp).length == 5){
			config = config_tmp;
		}
		o = text2html(story);
		$("#footer").html(o.license);
		$("#text").html(o.data);
		var chapt = 0;
		$('#a_chap').html('');
		$('.chapter').each(function(){
			$(this).parent().attr('id','chapt_'+chapt).append('<a class="next-chapter title="Next chapter" href="">&gt&gt&gt&gt</a>');
			$(this).html('<span>'+$(this).attr('data-name')+'</span>');
			$('#a_chap').append('<option value="'+(chapt++)+'">'+$(this).attr('data-name')+'</option>');
		});

		$('.line').addClass('hyphenate').attr('lang','pl');
		$('#a_full').click(function(e){
			e.preventDefault();
			config.viewFull = true;
			$('#text').css('max-width','none');
			$.cookie('reader-config',config);
			$(window).scroll();
		});
		$('#a_colu').click(function(e){
			e.preventDefault();
			config.viewFull = false;
			$('#text').css('max-width','42em');
			$.cookie('reader-config',config);
			$(window).scroll();
		});
		$('#a_more').click(function(e){
			e.preventDefault();
			config.fontsize *= 1.25;
			$('body').css('font-size',config.fontsize+'px');
			$('#footer').css('font-size',(config.fontsize*0.625)+'px');
			$.cookie('reader-config',config);
		});
		$('#a_less').click(function(e){
			e.preventDefault();
			config.fontsize *= 0.75;
			$('body').css('font-size',config.fontsize+'px');
			$('#footer').css('font-size',(config.fontsize*0.625)+'px');
			$.cookie('reader-config',config);
		});
		$('#a_norm').click(function(e){
			e.preventDefault();
			config.fontsize = 16;
			$('body').css('font-size',config.fontsize+'px');
			$('#footer').css('font-size',(config.fontsize*0.625)+'px');
			$.cookie('reader-config',config);
		});
		$('.next-chapter').click(function(e){
			e.preventDefault();
			var id = $(this).parent().attr('id').split('_')[1];
			$('#a_chap').val(Number(id)+1).change();
		});
		$('#a_invr').click(function(e){
			e.preventDefault();
			config.invert ^= 1;
			if(config.invert){
				$('body').css('background-color','#3F3F3F').css('color','#DCDCCC');
				$('#a_invr').css('color','#222000').css('background-color','#F0F0F0');
				$('#banner').css('border-bottom-color','#DCDCCC');
			}else{
				$('body').css('background-color','#F0F0F0').css('color','#222000');
				$('#a_invr').css('color','#DCDCCC').css('background-color','#3F3F3F');
				$('#banner').css('border-bottom-color','#222000');
			}
			$.cookie('reader-config',config);
		});
		$('#a_chap').change(function(){
			$(".chapter-div").hide();
			config.chapter = $(this).val();
			config.position = 0;
			$('#chapt_'+config.chapter).show();
			$(window).scrollTop(0);
			$(window).scroll();
			$.cookie('reader-config',config);
		});
		$(window).scroll(function(){
			var p = $(document).height() - $(window).height() == 0?1:Math.min(1.0,$(document).scrollTop()/($(document).height() - $(window).height()));
			$('#a_perc').html(Math.round(p*100,1)+'%');
			config.position = p;
			$.cookie('reader-config',config);
		});
		
		$('body').css('font-size',config.fontsize+'px');
		if(config.viewFull)
			$('#text').css('max-width','none');
		$('#a_chap').val(config.chapter);
		$('#chapt_'+config.chapter).show();
		$(window).scrollTop(config.position*($(document).height() - $(window).height()));
		$(window).scroll();
		config.invert ^= 1;
		$('#a_invr').click();
		
		Hyphenator.run();
	},function(){
		$('#ldr').html('Fetching failed. Script terminated.');
	},function(){
		$('#ldr').html("Fetching content... "+(++loaded)+"/"+chapter_count);
	});
});