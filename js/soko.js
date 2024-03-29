var lng="en";
var vars=getUrlVars();

if(vars["lng"]) lng=vars["lng"];
else
	if(localStorage["soko_web_lng"])
		lng=localStorage["soko_web_lng"];

function getUrlVars() 
{
	var vars = {};
	var parts = window.location.href.replace(/[?&#]+([^=&#]+)=([^&#]*)/gi, function(m,key,value) 
	{
		vars[key] = value;
	});
	return(vars);
}

function translate_page(lang)
{
	$(".lng").hide();
	$(".lng_"+lang).show();	
	var place=$("[placeholder_"+lang+"]");
	for(a=0;a<place.length;a++)
			$(place[a]).attr("placeholder",$(place[a]).attr("placeholder_"+lang));
}

function loadDone()
{
	translate_page(lng);
	
	if($(".service_tab").length)
	{
		$(".service_tab").click(function()
		{
			$(".service_tab.selected").removeClass("selected");
			$(this).addClass("selected");
			$(".service_tab_content.tab_active").removeClass("tab_active");
			$("."+$(this).attr("aria-tab")).addClass("tab_active");;

			return(false);
		});
	}	
	
	$(".test_landing_text").click(function()
   {
   	$(".header_text").removeClass("header_text_white");
   	$(".header_text").removeClass("header_text_dark");
   	$(".header_text").addClass("header_"+$(this).attr("data-class"));	
   	return(false);
	});	
   $(".test_landing").click(function()
   {
   	$(".header").removeClass("header_white");
   	$(".header").removeClass("header_dark");
   	$(".header").removeClass("header_white_gradient");
   	$(".header").removeClass("header_dark_gradient");
   	$(".header").addClass("header_"+$(this).attr("data-class"));	
   	return(false);
	});	
	
	
	$("a[data-lng]").click(function()
	{
		lng=$(this).attr("data-lng");
		localStorage["soko_web_lng"]=lng;
		translate_page(lng);
		return(false);
	});
	
	$(window).scroll(function(){
        if($(window).scrollTop()<=10)
            $("nav").removeClass("navbar_background");   
        else
            $("nav").addClass("navbar_background");   
    });

	 if($("#contact").length)
	 {
	 	$("#check_subscription").click(function()
    	{
    			if($(this).prop("disabled")) return(false);
    			
				var checked=$(this).find("input").prop('checked');	
			   $(".btn_lbl").removeClass("hidden");
				if(checked)
				{
			    	$(this).find("input").prop('checked', false)
			    	$("#contact_form .no_subscription").prop("disabled",false);
			    	$(".btn_lbl_subscribe").addClass("hidden");
			    	$(".subscription_options").addClass("disabled");
				}else{
			    	$(this).find("input").prop('checked', true)
			    	$("#contact_form .no_subscription").prop("disabled",true);
			    	$(".btn_lbl_send").addClass("hidden");
			    	$(".subscription_options").removeClass("disabled");
			    }	
				return(false);
   	});
   	if($(".subscription_option").length)
		{
		 	$(".subscription_option").click(function()
    		{
    			if(!$("#check_subscription input").prop("checked")) return(false);
    			if($("#check_subscription").prop("disabled")) return(false);
    			
				var checked=$(this).find("input").prop('checked');	
				if(checked)
			    	$(this).find("input").prop('checked', false)
				else
			    	$(this).find("input").prop('checked', true)
				return(false);
   		});
  		}
	   
	   $("#contact input, #contact textarea").on('input',function()
	   {
   		$(".contact_result").hide();   
  		});
   
   	$("#btn_contact").click(function()
   	{	     		
   		$(".contact_result").hide();
			var name=$("#contact_name").val().trim();
			var email=$("#contact_email").val().trim();
			var remail=$("#contact_remail").val().trim();
			var msg=$("#contact_message").val().trim();
			var comment=$("#contact_comment").val();
			if((((email.length==0) || (remail.length==0)) || (name.length==0)) ||
					((msg.length==0) && (!$("#check_subscription").find("input").prop('checked')))) 
			{
				$(".error_empty").show();
				return(false);
	      }		
			if(!email_isvalid(email))
			{
				$(".error_email").show();
				return(false);
			}
			if(email!=remail)
			{
				$(".error_remail").show();
				return(false);
			}
		
			$(this).addClass("hidden");
			$(".sending").removeClass("hidden");
					
 			var params={"function": "contact", "name":name, "email":email,"text":msg, "lng": lng,
 							 "comment":comment,"config":"soko"};		
 		   if($("#check_subscription").find("input").prop('checked'))
 		   {
 		   	params["tags"]=new Array();
 		   	params["subscribe"]=1;
 		   	var ops=$("[aria-mergetag]"); //.subscription_option");
 		   	for(m=0;m<ops.length;m++)
 		   	{
 		   		var val=$(ops[m]).find("input").prop("checked");
 		   		if(val)
 		   		{
 		   			params["tags"].push($(ops[m]).attr("aria-mergetag"));
 		   		}	
 		   	}
 		   }
 		   
			$.post("https://2017.steamconf.com/soko/email.php",params)
			//$.post("http://localhost/gandi/email.php",params)
				   .done(function(data)
				   {
				   	//alert(data); 
				   	var res=JSON.parse($.trim(data));
			   	
						if(res.result=="ok") 
						{
				   		$(".sending").addClass("hidden");
							$(".result_ok").show();	
						
							$("#contact input, #contact textarea").prop('disabled', true);   						
   						$("#check_subscription").prop('disabled', true);
 										
						}else{				
							$("#btn_contact").removeClass("hidden");
				   		$(".sending").addClass("hidden");
							$(".error_server").show();
   			   	}
				   }).fail(function(xhr, status, error)
				     {
							$("#btn_contact").removeClass("hidden");
				   		$(".sending").addClass("hidden");
							$(".error_server").show();
   			     });
   		return(false); 	     
   	});
		if(vars["subscription"]==1)	   	
	   	$("#check_subscription").trigger("click");
    	
	}
}

function loadHTML(items, i)
{
	fetch($(items[i]).attr("include-HTML")+"?"+new Date().getTime())
		.then(function(response) {
   				 return response.text();
		}).then(function(text) {
    			$(items[i]).html(text);
				i++;
				if(i<items.length)
					loadHTML(items,i);
				else 
					loadDone();
		});
}

function loadHTML_get(items, i)
{
	$.get($(items[i]).attr("include-HTML")+"?"+new Date().getTime(), function(text){
		$(items[i]).html(text);
		i++;
		if(i<items.length)
			loadHTML(items,i);
		else 
			loadDone();		
	},"text");
}
function includeHTML()
{
  var imports=$("[include-HTML]");
  if(imports.length>1) loadHTML(imports,0); 
}

function email_isvalid(email)
{
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{2,4})+$/;
  return(regex.test(email));
}


function show_team(grid, data, func)
{
	$(grid).html("");
   
   var preload=data.length;
   
	for(a=0;a<data.length;a++) 
	{
		
		var member=$("#dummy .team_item").clone();
		member.find(".team_name").text(data[a].name);
		var work="<span class='lng lng_en'>"+data[a].work_en+"</span>";
		work+="<span class='lng lng_es'>"+data[a].work_es+"</span>";
		work+="<span class='lng lng_ca'>"+data[a].work_ca+"</span>";
		member.find(".team_work").html(work);
		var bio="<span class='lng lng_en'>"+data[a].bio_en+"</span>";
		bio+="<span class='lng lng_es'>"+data[a].bio_es+"</span>";
		bio+="<span class='lng lng_ca'>"+data[a].bio_ca+"</span>";
		member.find(".team_bio").html(bio);
		
		var img=member.find(".team_img");
		$(img).hide();
		img[0].onload=function()
		{
			$(this).fadeIn();
			preload--;
			if(preload==0) func();
		};
		
		img.attr("src",data[a].img);
		
		$(grid).append(member);
		
	}
}

function show_more_projects(data)
{
	show_projects("#projects_grid",data,function()
 			{
 				//alert("fin carga");
 			});
}


function show_projects(grid,data,func)
{
   
   var start=0;
   var tag="all";
 
   if(($(grid).attr("aria-home")==0))
   {
	   start=parseInt($(grid).attr("aria-start"));
	   tag=$(".project_tag.selected").attr("aria-tag");
	}
	if(start==0)
	{ 
		$(grid).html("");
		$("#btn_more_projects").show();
   }

	var last_prj=0;
	var count=0;	
	var last_count=0;
	
	var lngs=Array("en","es","ca");
	
	for(a=start;a<data.length;a++) 
	{
		if(($(grid).attr("aria-home")==1) && (data[a].gsx$home.$t==0)) break;

		if((tag=="all") || (data[a].gsx$tags.$t.indexOf(tag)!=-1))
		{
			var prj=$("#dummy .project_item").clone();			
			
			$(prj).attr("aria-width",data[a].gsx$width.$t);	
					
			prj.addClass("project_width_"+data[a].gsx$width.$t);				
			prj.find(".project_title").text(data[a].gsx$title.$t);
			
			var desc="";
			for(l=0;l<lngs.length;l++)
			{
				desc+="<span class='lng lng_"+lngs[l]+"' style='display:";
				if(lng!=lngs[l]) desc+="none' ";
				else desc+="block' ";
				desc+=">"+data[a]["gsx$info"+lngs[l]].$t+"</span>";
				
			}			
			prj.find(".project_desc").html(desc);
			//prj.find(".project_info").css("background","rgba("+data[a].gsx$darkness.$t+")");
			
			var link=data[a]["gsx$url"].$t;
			if(link.length)
			{	   
			   prj.find(".project_link").attr("href",link);
			   prj.css("cursor","pointer");
			   prj.click(function()
			   {
			   	window.open(link,"_blank");
			   	return(false);
			   });	
			}else 
				prj.find(".project_link").hide();	
				
				
			var image=data[a].gsx$image.$t.replace("open","uc");

			$(prj).css("background","url("+image+")");
			$(prj).css("background-position",data[a].gsx$position.$t);
			

			last_prj=$(grid).children().last();			
			
			$(grid).append(prj);
			
			last_count=count;
			count+=parseInt(data[a].gsx$width.$t);

			if((parseInt(count%4)!=0) && (parseInt(last_count/4)!=parseInt(count/4)))
			{
				var w=parseInt($(last_prj).attr("aria-width"));
				var adjust=(4-parseInt(last_count%4))+w; //count-last_count; //5-parseInt(last_count%4);
				last_prj.removeClass("project_width_"+w);
				last_prj.addClass("project_width_"+adjust);				 
				count-=w;
				count+=adjust;
				
				last_count-=w;
				last_count+=adjust;		
			}
				
			if(count>=12)
			{
				//alert(a);
				$(grid).attr("aria-start",a+1);
				break;
			}			
		}
	}
	//$(grid).attr("aria-start",a+1);
	
	if(parseInt(count%4)!=0)
	{ 
		var w=parseInt($(prj).attr("aria-width"));
		prj.removeClass("project_width_"+w);
		prj.addClass("project_width_"+(w+(4-parseInt(count%4))));				 
	}
	
 	if($(grid).attr("aria-home")==0)
 	{
 		if(a>=data.length)
 	 		$("#btn_more_projects").hide();
 		else
 	 		$("#btn_more_projects").show();
	}
}

function load_json(file,func)
{
	 fetch(file)
     .then(function(response){
			 return response.json().then(function(data)
			 {
			 		func(data);	 
		    });
     }).catch(function(error){ 
   		console.log(error); 
     		});   
}

var iword=0;
var header_text={
	"en":"digital,social,innovation,projects,programs,events,arts,science,technology",
	"es":"proyectos,digitales,innovación,social,programas,eventos,artes,ciencia,tecnología",
	"ca":"projectes,digitals,innovació,social,programes,events,arts,ciencia,tecnologia"
	};

function change_text()
{
	var words=header_text[lng].split(",");   		
	$("#header_word").text("#"+words[iword]);
	iword++;
	if(iword>=words.length) iword=0;	
}

$(document).ready(function()
{	
	// home animation
	if($("#header_word").length)
	{
		var back=$(".header").attr("aria-background");
		var img=new Image();
		img.onload=function()
		{
			$(".header").css("background-image","url('"+back+"')");
			$(".header_dark_gradient").css("opacity",1);
		};
		img.src=back;	
			
   	change_text();
		setInterval(change_text,1000);
	}
	
	// events and projects
	if($("#projects_grid").length)
	{
		
		if($("#projects_grid").attr("aria-home")==0)
		{
			var tag="all";
   		if(vars["tag"])
   		{
				$(".project_tag.selected").removeClass("selected");   		
   			tag=vars["tag"];
   		}
   		$(".project_tag[aria-tag="+tag+"]").addClass("selected");	
		}	
		
		var spreadsheetID = "1_5d26geyYz14Y-TUr6CQ1XIjT-4T1VEGUo-on083uHY";
 		var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";
 		load_json(url,function (data) {
 			show_projects("#projects_grid",data.feed.entry,function()
 			{
 				//alert("fin carga");
 			});
	 		if($("#btn_more_projects").length)
	 		{
 				$("#btn_more_projects").click(function()
 				{
 					show_more_projects(data.feed.entry);
 					return(false);
 				});
 			}
			$(".project_tag").click(function()
			{
				$(".project_tag").removeClass("selected");
				$(this).addClass("selected");	
				$("#projects_grid").attr("aria-start",0);
				show_projects("#projects_grid",data.feed.entry,function()
 				{
 				//alert("fin carga");
 				});
				return(false);
			}); 			

 		});
 	}
 
	// about page
   if($("#team_grid").length)
   {
   	load_json("data/team.json"+"?"+new Date().getTime(),function(data)
   	{
   		show_team($("#team_grid"),data,function()
   		{
   			//alert("ya");	
   		});
   	});
   	
   }

	$("#contact_comment").hide();	
	
});
