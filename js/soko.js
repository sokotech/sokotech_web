var projects;
var authors;

var vars=getUrlVars();
var lng="en";
//if(vars["lng"]) lng=vars["lng"];

function getUrlVars() 
{
	var vars = {};
	var parts = window.location.href.replace(/[?&#]+([^=&#]+)=([^&#]*)/gi, function(m,key,value) 
	{
		vars[key] = value;
	});
	return(vars);
}

function loadDone()
{
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
		$(".lng").hide();
		$(".lng_"+lng).show();
		return(false);
	});
	$(window).scroll(function(){
        if($(window).scrollTop()<=10)
            $("nav").removeClass("navbar_background");   
        else
            $("nav").addClass("navbar_background");   
    });

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
function includeHTML()
{
  var imports=$("[include-HTML]");
  if(imports.length>1) loadHTML(imports,0); 
}
  
/*function loadHTML(elem)
{
	fetch($(elem).attr("include-HTML"))
		.then(function(response) {
   				 return response.text();
		}).then(function(text) {
    			$(elem).html(text);
		});
}
function includeHTML()
{
  var imports=$("[include-HTML]");
  for(a=0;a<imports.length;a++)
  {
  		loadHTML(imports[a]);
		$(imports[a]).removeAttr("include-HTML");  	
  }  
}
*/

function email_isvalid(email)
{
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{2,4})+$/;
  return(regex.test(email));
}

function show_project_info(prj)
{
	$(".project_title").text(projects[prj].title);
	$(".project_video iframe").attr("src","https://player.vimeo.com/video/"+projects[prj].video+
											  "?title=0&byline=0&portrait=0");
	$(".project_dossier").attr("href","data/projects/dossiers/"+projects[prj].dossier);
   fetch("data/projects/info/"+projects[prj].info)
     .then(function(response){
			 return response.text().then(function(text){
			 		$(".project_description").html(text); 
		    });
     })
     .catch(function(error){ 
   	console.log(error); 
     });   
   									     
	$(".author_name").text(authors[projects[prj].author].name);
	$(".author_bio").html(authors[projects[prj].author].bio);
	
	$(".author_picture").attr("src","data/authors/pictures/"+authors[projects[prj].author].picture);
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

function show_projects(grid,data,func)
{
	$(grid).html("");
   
   var preload=data.length;
   
	for(a=0;a<data.length;a++) 
	{
		if(data[a].gsx$home.$t==1)
		{
			var prj=$("#dummy .project_item").clone();
			prj.find(".new_info").find("h4").text(data[a].gsx$title.$t);
			prj.find(".new_info").find("h5").text(data[a].gsx$date.$t+" - "+data[a].gsx$place.$t);
			prj.find(".new_info").find("h6").text(data[a]["gsx$info"+lng].$t);
			var desc="<span class='lng lng_en'>"+data[a]["gsx$infoen"].$t+"</span>";
			desc+="<span class='lng lng_es'>"+data[a]["gsx$infoes"].$t+"</span>";
			desc+="<span class='lng lng_ca'>"+data[a]["gsx$infoca"].$t+"</span>";
			prj.find(".new_info").find("h6").html(desc);
			prj.find(".new_info").css("background","rgba("+data[a].gsx$darkness.$t+")");
			
			
			//prj.find(".project_link").attr("data-project",key);
			//prj.find(".project_link").attr("href","project.html?id="+key);	

			var image=data[a].gsx$image.$t.replace("open","uc");

			$(prj).css("background","url("+image+")");
			$(prj).css("background-position",data[a].gsx$position.$t);
			
			var img=prj.find(".new_img_container").find("img");
			$(img).hide();
			/*img[0].onload=function()
			{
				$(this).fadeIn();
				preload--;
				if(preload==0) func();
			};
		
			img.attr("src",image);		*/
			$(grid).append(prj);
		}
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
	"ca":"proyectos,digitales,innovación,social,programas,eventos,artes,ciencia,tecnología"
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
   	change_text();
		setInterval(change_text,1000);
	}
	
	// events and projects
	if($("#projects_grid").length)
	{
		var spreadsheetID = "1_5d26geyYz14Y-TUr6CQ1XIjT-4T1VEGUo-on083uHY";
 		var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";
 		load_json(url,function (data) {
 			show_projects("#projects_grid",data.feed.entry,function()
 			{
 				//alert("fin carga");
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

	return;
	
	$("#contact_comment").hide();	
	
	if($(".projects_grid").length>0)
		load_data(function()
			{
				show_projects($(".projects_grid"),function(){
						setTimeout(function(){
							$(".projects_grid").removeClass("hidden");
							$(".projects_grid").parent().find(".loading").remove();
						},1000);				
				});
			});
	
   if($(".project_info").length>0)
   {
   	if(vars["id"])
   	{
   		load_data(function(){
				if(!projects[vars["id"]]) window.location.href=".";
   			else show_project_info(vars["id"]);
				});
   	}else{
   		window.location.href=".";
   	}
   }	
   
   /*$(".nav-link").click(function(event){
			var parts = $(this).attr("href").split("#");   		
			if(parts.length==1) return;
			
   		var target = $("#"+parts[1]);   		
   		if($(target).length) 
			{
				if($(target).length)
				{
					event.preventDefault();
			   	$('html, body').stop().animate({
            		scrollTop: $(target).offset().top
        			},500);
        		}
        	}
   });*/

   $("#check_subscription").click(function()
    {
    			if($(this).prop("disabled")) return(false);
    			
				var checked=$(this).find("input").prop('checked');	
			   $(".btn_lbl").removeClass("hidden");
				if(checked)
				{
			    	$(this).find("input").prop('checked', false)
			    	$("#contact_form").find(".no_subscription").prop("disabled",false);
			    	$(".btn_lbl_subscribe").addClass("hidden");
				}else{
			    	$(this).find("input").prop('checked', true)
			    	$("#contact_form").find(".no_subscription").prop("disabled",true);
			    	$(".btn_lbl_send").addClass("hidden");
			    }	
				return(false);
   	});

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
 						 "comment":comment};		
 	   if($("#check_subscription").find("input").prop('checked')) params["subscribe"]=1;
		$.post("https://2017.steamconf.com/mesh/email.php",params)
		//$.post("gandi/mesh/email.php",params)
			   .done(function(data)
			   {
			   	//alert(data);
			   	var res=JSON.parse($.trim(data));
			   	//console.log(res);
			   	
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

   var svg_mesh=document.getElementById("mesh-hero-bg-graphic");
   if(svg_mesh)
   {
   	svg_mesh.onload=function()
   	{
   		animate_mesh($(this.contentDocument));
   	};
   	$("#mesh-hero-bg-graphic").attr("data",$("#mesh-hero-bg-graphic").attr("data-svg"));
   }
});
