/*!
	my awesome JS book reader
	tottaly didn't steal most of the ideas from hpmor.com
*/

var config = {fontsize:16, chapter:0, position:0, invert:false, viewFull:false};
$(function(){
	$.ajax({url:"../deszcz.html",dataType: "binary", processData: false, responseType:"arraybuffer"}).done(function(buffer){
		$('#ldr').html('Transcodeing content...');
		$.cookie.json = true;
		$.cookie.defaults.expires = 365;
		var config_tmp = $.cookie('reader-config');
		if(typeof config_tmp == "object" && Object.keys(config_tmp).length == 5){
			config = config_tmp;
		}
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
		var view = new Uint8Array(buffer);
		for(var i=0; i<view.length; i++)
			story += M[view[i]];
		story = story.replace(/\"([^\"]+)\"/g," <span class=\"quote\">&bdquo;$1&ldquo;</span>");
		story = story.replace(/\n+/g,"\n");
		story = story.replace(/ - /g," &ndash; ");
		story = story.replace(/\n-/g,"\n&mdash;");
		story = story.replace(/[*]{3}/g,"<p class=\"section\"></p>");
		story = story.replace(/!chapter\s+(.+)/g,"</div><div class=\"chapter-div\"><p class=\"chapter\" data-name=\"$1\" ></p>");
		story = story.replace(/!line/g,"<br/>");
		story = story.replace(/\n([^<].+)/g,"<p class=\"line\">$1</p>");
		story = story.replace(/([^\s]+)\s*\[([^\]]+)\]/g,"$1<sup data-alt=\"$2\">*</sup>");
		$("#text").html("<div class=\"chapter-div\">"+story+"</div>");
		$(".chapter-div").first().remove();
		var chapt = 0;
		$('#a_chap').html('');
		$('.chapter').each(function(){
			$(this).parent().attr('id','chapt_'+chapt).append('<a class="next-chapter title="Next chapter" href="">&gt&gt&gt&gt</a>');
			$(this).html('<img src="assets/chaptR.svg"/><span>'+$(this).attr('data-name')+'</span><img src="assets/chaptL.svg"/>');
			$('#a_chap').append('<option value="'+(chapt++)+'">'+$(this).attr('data-name')+'</option>');
		});
		$('sup').each(function(){
			$(this).parent().after('<p class="line footnote"><sup>*</sup> '+$(this).attr('data-alt')+'</p>');
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
			$.cookie('reader-config',config);
		});
		$('#a_less').click(function(e){
			e.preventDefault();
			config.fontsize *= 0.75;
			$('body').css('font-size',config.fontsize+'px');
			$.cookie('reader-config',config);
		});
		$('#a_norm').click(function(e){
			e.preventDefault();
			config.fontsize = 16;
			$('body').css('font-size',config.fontsize+'px');
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
				$('.chapter img, .section img').each(function(){
					$(this).attr('src',$(this).attr('src').replace('.svg','i.svg'));
				});
				$('.section').each(function(){
					$(this).css('background-image',$(this).css('background-image').replace('.svg','i.svg'));
				});
			}else{
				$('body').css('background-color','#F0F0F0').css('color','#222000');
				$('#a_invr').css('color','#DCDCCC').css('background-color','#3F3F3F');
				$('#banner').css('border-bottom-color','#222000');
				$('.chapter img').each(function(){
					$(this).attr('src',$(this).attr('src').replace('i.svg','.svg'));
				});
				$('.section').each(function(){
					$(this).css('background-image',$(this).css('background-image').replace('i.svg','.svg'));
				});
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
	}).fail(function(){
		$('#ldr').html('Fetching failed. Script terminated.');
	});
});