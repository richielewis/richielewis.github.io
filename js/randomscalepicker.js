


function loadScales()
{
	var examgrade = $("#examgrade").val();
	syllabus = syllabusData[examgrade]
	majorScales = syllabus["scales"]["majors"]
	minorScales = syllabus["scales"]["minors"]
	majorCMScales = syllabus["contrary_motion_tonic"]["majors"]
	minorCMScales = syllabus["contrary_motion_tonic"]["minors"]
	majorArpeggios = syllabus["arpeggios"]["majors"]
	minorArpeggios = syllabus["arpeggios"]["minors"]
	majorBrokenChords = syllabus["broken_chords"]["majors"]
	minorBrokenChords = syllabus["broken_chords"]["minors"]
	dominantSevenths = syllabus["dominant_sevenths"]["keys"]
	diminishedSevenths = syllabus["diminished_sevenths"]["startnotes"]
	
	includeScales = $("#includeScales:checked").val();
	includeArpeggios = $("#includeArpeggios:checked").val();
	includeContraryMotion = $("#includeContraryMotion:checked").val();
	includeBrokenChords = $("#includeBrokenChords:checked").val();
	includeDominantSevenths = $("#includeDominantSevenths:checked").val();
	includeDiminishedSevenths = $("#includeDiminishedSevenths:checked").val();
	includeMajors = $("#includeMajors:checked").val();
	includeMinors = $("#includeMinors:checked").val();
	
	
	var includedScales = []
	
	if(includeScales && includeMajors)
	{
		includedScales = addScales(includedScales,majorScales,"major Scale")
	}
	if(includeScales && includeMinors)
	{
		includedScales = addScales(includedScales,minorScales,"minor Scale")
	}
	if(includeArpeggios && includeMajors)
	{
		includedScales = addScales(includedScales,majorArpeggios,"major Arpeggio")
	}
	if(includeArpeggios && includeMinors)
	{
		includedScales = addScales(includedScales,minorArpeggios,"minor Arpeggio")
	}
	if(includeContraryMotion && includeMajors)
	{
		includedScales = addScales(includedScales,majorCMScales,"major Contrary-Motion Scale")
	}
	if(includeContraryMotion && includeMinors)
	{
		includedScales = addScales(includedScales,minorCMScales,"minor Contrary-Motion Scale")
	}	
	if(includeBrokenChords && includeMajors)
	{
		includedScales = addScales(includedScales,majorBrokenChords,"major Broken Chord")
	}
	if(includeBrokenChords && includeMinors)
	{
		includedScales = addScales(includedScales,minorBrokenChords,"minor Broken Chord")
	}
	if(includeDominantSevenths)
	{
		includedScales = addScales(includedScales,dominantSevenths,"Dominant Seventh")
	}
	if(includeDiminishedSevenths)
	{
		includedScales = addScales(includedScales,diminishedSevenths,"Diminished Seventh")
	}
	
	return includedScales
}
	
function addScales(mainList,newScales,description)
{
	for(i in newScales)
	{
		mainList.push(newScales[i]+" "+description)
	}
	return mainList
}

function checkSettings()
{
	
	includeScales = $("#includeScales:checked").val();
	includeArpeggios = $("#includeArpeggios:checked").val();
	includeContraryMotion = $("#includeContraryMotion:checked").val();
	includeBrokenChords = $("#includeBrokenChords:checked").val();
	includeDominantSevenths = $("#includeDominantSevenths:checked").val();
	includeDiminishedSevenths = $("#includeDiminishedSevenths:checked").val();
	includeMajors = $("#includeMajors:checked").val();
	includeMinors = $("#includeMinors:checked").val();
	
	if(!includeScales && !includeArpeggios && !includeContraryMotion && !includeBrokenChords && !includeDominantSevenths && !includeDiminishedSevenths)
	{
		return "You must select at least one scale type"
	}
	else if((includeScales || includeArpeggios || includeContraryMotion || includeBrokenChords) && !includeMajors && !includeMinors)
	{
		return "You must includes majors and/or minors for this scale type"
	}
	else
	{
		return ""
	}
}

//-----------------------------------------------------
//-----------------------------------------------------
//-----------------------------------------------------
//-----------------------------------------------------
//MAIN JAVASCRIPT CODE
//-----------------------------------------------------
//-----------------------------------------------------
//-----------------------------------------------------
//-----------------------------------------------------
//-----------------------------------------------------
//-----------------------------------------------------

$(document).ready(function(){
	
	$.ajaxSetup(
	{
		beforeSend: function(xhr){
			if (xhr.overrideMimeType)
			{
				xhr.overrideMimeType("application/json");
			}
		}
	});

	syllabusData = {};
	
	var includedScales = []
	
	
	//LOAD ABRSM SYLLABUS INFORMATION	
	$.getJSON("data/syllabus.json", function(data, status)
	{
		
		syllabusData = data;
		grades = Object.keys(syllabusData);
		
		defaultGrade = "Grade 1"
		for(i in grades)
		{
			if(grades[i] == defaultGrade)
			{
				$("#examgrade").append("<option selected value=\""+grades[i]+"\">"+grades[i]+"</option>");
			}
			else
			{
				$("#examgrade").append("<option value=\""+grades[i]+"\">"+grades[i]+"</option>");
			}
		}
		
		includedScales = loadScales()
						
		
	});
	
	$(".scales-filter").change(function()
	{
		includedScales = loadScales()
		//updatePollProjectionAndTacticalVote();
	});		
		
	
	//UPDATE TACTICAL RESULTS WHEN RED BUTTON CLICKED 
	$("#pickascale").click(function()
	{
		
		checkResponse = checkSettings()
		if(checkResponse != "")
		{
			$("#displayscale").addClass("display-text-red")
			$("#displayscale").text(checkResponse);						
		}
		else if(includedScales.length == 0)
		{
			$("#displayscale").addClass("display-text-green")
			$("#displayscale").text("End of the list - Well Done!");
			includedScales = loadScales()
		}
		else
		{		
			$("#displayscale").removeClass("display-text-green")
			$("#displayscale").removeClass("display-text-red")
			randomIndex = Math.floor(Math.random() * includedScales.length)
					
			var randomScale = includedScales[randomIndex];
			
			includedScales.splice(randomIndex, 1);
						
			$("#displayscale").text(randomScale);
		}


    });
	

	//FOR SMALL DEVICES THE NAVBAR BUTTON CHANGES
	$(".nav-item").click(function()
	{
		$("#navbar").attr("aria-expanded","false");
		$("#navbar").removeClass("in");
		
		//alert("done");
    });	
	
});