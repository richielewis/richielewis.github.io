

function swingAdjustment(prevLocalPercentage,swing)
{
	//return prevLocalPercentage*(1-pollFactor) + currentRating*pollFactor;
	var newPercentage = prevLocalPercentage + swing;
	if(newPercentage < 0){
		return 0;
	}
	else{
		return newPercentage;
	}	
}

function calculateSwing(currentRating,prevRating,pollFactor)
{
	return (currentRating - prevRating)*pollFactor;
}

function updatePollProjection()
{
	var tacticalVoteParticipationPerc = $("#tacticalVotePerc").val();
	var pollFactor = $("#pollFactor").val();
	var pollSource = $("#pollster").val();
	
	//NATIONAL LEVEL SEAT COUNTS
	var torySeats = 0;
	var labourSeats = 0;
	var libSeats = 0;
	var greenSeats = 0;
	var snpSeats = 0;
	var ukipSeats = 0;
	var otherSeats = 0;
	
	//PREVIOUS NATIONAL LEVEL RATINGS BASED ON 2015 VOTES
	var toryPrevRating = 0.368;
	var labourPrevRating = 0.305;
	var libPrevRating = 0.079;
	var greenPrevRating = 0.038;
	var ukipPrevRating = 0.127;
	var snpPrevRating = 0.047;
	
	//GET CURRENT RATINGS FROM SELECTED POLL 
	poll = pollData[pollSource][pollData[pollSource].length-1];
	var toryRating = poll.Con;
	var ukipRating = poll.UKIP;
	var labourRating = poll.Lab;
	var libRating = poll.LD;
	var greenRating = poll.Green;		
	var snpRating = poll.SNP;		
	
	//CALCULATE NATIONAL SWING
	var torySwing = calculateSwing(toryRating/100,toryPrevRating,pollFactor);
	//alert("Tory Swing "+torySwing);
	var ukipSwing = 0;
	if(ukipRating != ""){
		ukipSwing = calculateSwing(ukipRating/100,ukipPrevRating,pollFactor);		
	}	
	var labourSwing = calculateSwing(labourRating/100,labourPrevRating,pollFactor);
	//alert("Labour Swing "+labourSwing);
	var libSwing = calculateSwing(libRating/100,libPrevRating,pollFactor);
	var greenSwing = 0;
	if(greenRating != ""){
		greenSwing = calculateSwing(greenRating/100,greenPrevRating,pollFactor);		
	}
	var snpSwing = 0;
	if(snpRating != ""){
		snpSwing = calculateSwing(snpRating/100,snpPrevRating,pollFactor);		
	}
	
	
	//FOR EACH CONSTITUENCY
	for (i in cons) 
	{
		
		var con = cons[i];
		
		
		
		//RESET/INIT CONSTITUENCY LEVEL VARIABLES
		var toryVote = 0;
		var labourVote = 0;
		var libVote = 0;
		var greenVote = 0;
		var snpVote = 0;
		var ukipVote = 0;
		var conTotalVotes = 0;
		var biggestVote = 0;
		var biggestVoteParty = "";
					
					
		
		//FOR EACH PARTY CANDIDATE IN LAST ELECTION FOR THIS CONSTITUENCY
		for (j in con.results) 
		{
			var result = con.results[j];
			
			
			//ADD PARTY VOTES TO CONSTITUENCY TOTAL VOTE COUNT
			conTotalVotes += result.votes;
			
			//INCREMENT PARTY VOTE COUNTS
			if(result.party == "Conservative Party"){
				toryVote += result.votes;
			}
			else if(result.party == "United Kingdom Independence Party"){
				ukipVote += result.votes;
			}					
			else if(result.party == "Labour Party"){
				labourVote  += result.votes;
			}
			else if(result.party == "Liberal Democrat"){
				libVote  += result.votes;
			}
			else if(result.party == "Green Party"){
				greenVote  += result.votes;
			}
			else if(result.party == "Scottish National Party"){
				snpVote += result.votes;
			}					
			else
			{
				//FOR PARTIES IN THE "OTHER" CATEGORY 								
				//DETERMINE IF "OTHER" PARTY VOTES IS LARGEST VOTE
				if(result.votes > biggestVote)
				{
					biggestVote	= result.votes;
					biggestVoteParty = result.party;
				
				}
				
			}
			
		}
		//END OF LOOPING PARTY CANDIDATES

			
		//ADJUST VOTE COUNTS DUE TO UNIFORM NATIONAL SWING		
		toryVote = Math.round(swingAdjustment(toryVote/conTotalVotes,torySwing)*conTotalVotes);
		ukipVote = Math.round(swingAdjustment(ukipVote/conTotalVotes,ukipSwing)*conTotalVotes);
		labourVote = Math.round(swingAdjustment(labourVote/conTotalVotes,labourSwing)*conTotalVotes);
		libVote = Math.round(swingAdjustment(libVote/conTotalVotes,libSwing)*conTotalVotes);			
		greenVote = Math.round(swingAdjustment(greenVote/conTotalVotes,greenSwing)*conTotalVotes);			
		snpVote = Math.round(swingAdjustment(snpVote/conTotalVotes,snpSwing)*conTotalVotes);		
							
		
		
		//COMPARE VOTE COUNTS TO DETERMINE SEAT WINNER
		if(toryVote > biggestVote)
		{
			biggestVote = toryVote;
			biggestVoteParty = "Conservative Party";
		}	
		if(ukipVote > biggestVote)
		{
			biggestVote = ukipVote;
			biggestVoteParty = "United Kingdom Independence Party";
		}				
		if(labourVote > biggestVote)
		{
			biggestVote = labourVote;
			biggestVoteParty = "Labour Party";
		}
		if(libVote > biggestVote)
		{
			biggestVote = libVote;
			biggestVoteParty = "Liberal Democrat";
		}				
		if(greenVote > biggestVote)
		{
			biggestVote = greenVote;
			biggestVoteParty = "Green Party";
		}
		if(snpVote > biggestVote)
		{
			biggestVote = snpVote;
			biggestVoteParty = "Scottish National Party";
		}								
		
					
		//GIVE SEAT TO PARTY WITH MOST VOTES
		if(biggestVoteParty == "Conservative Party")
		{
			torySeats += 1;
		}
		else if(biggestVoteParty == "United Kingdom Independence Party")
		{
			ukipSeats += 1;
		}				
		else if(biggestVoteParty == "Labour Party")
		{
			labourSeats += 1;
		}
		else if(biggestVoteParty == "Liberal Democrat")
		{
			libSeats += 1;
		}
		else if(biggestVoteParty == "Green Party")
		{
			greenSeats += 1;
		}
		else if(biggestVoteParty == "Scottish National Party")
		{
			snpSeats += 1;
		}			
		else
		{
			otherSeats += 1;
		}	
	
	}
	//END LOOPING THROUGH CONSTITUENCIES
	
	//ADD NATIONAL LEVEL SEAT COUNTS TO TABLE
	$("#newTory").text(torySeats);
	$("#newLabour").text(labourSeats);
	$("#newLib").text(libSeats);
	$("#newSNP").text(snpSeats);
	$("#newGreen").text(greenSeats);
	$("#newUKIP").text(ukipSeats);
	$("#newOther").text(otherSeats);	
	
		
}


function updatePollProjectionAndTacticalVote()
{
	$("#cons").html("");

	var tacticalVoteParticipationPerc = $("#tacticalVotePerc").val();
	var pollFactor = $("#pollFactor").val();
	var pollSource = $("#pollster").val();
	
	//NATIONAL LEVEL SEAT COUNTS
	var torySeats = 0;
	var labourSeats = 0;
	var libSeats = 0;
	var greenSeats = 0;
	var snpSeats = 0;
	var ukipSeats = 0;
	var otherSeats = 0;
	
	//PREVIOUS NATIONAL LEVEL RATINGS BASED ON 2015 VOTES
	var toryPrevRating = 0.368;
	var labourPrevRating = 0.305;
	var libPrevRating = 0.079;
	var greenPrevRating = 0.038;
	var ukipPrevRating = 0.127;
	var snpPrevRating = 0.047;
	
	//GET CURRENT RATINGS FROM SELECTED POLL 
	poll = pollData[pollSource][pollData[pollSource].length-1];
	var toryRating = poll.Con;
	var ukipRating = poll.UKIP;
	var labourRating = poll.Lab;
	var libRating = poll.LD;
	var greenRating = poll.Green;		
	var snpRating = poll.SNP;		
	
	//CALCULATE NATIONAL SWING
	var torySwing = calculateSwing(toryRating/100,toryPrevRating,pollFactor);
	//alert("Tory Swing "+torySwing);
	var ukipSwing = 0;
	if(ukipRating != ""){
		ukipSwing = calculateSwing(ukipRating/100,ukipPrevRating,pollFactor);		
	}	
	var labourSwing = calculateSwing(labourRating/100,labourPrevRating,pollFactor);
	//alert("Labour Swing "+labourSwing);
	var libSwing = calculateSwing(libRating/100,libPrevRating,pollFactor);
	var greenSwing = 0;
	if(greenRating != ""){
		greenSwing = calculateSwing(greenRating/100,greenPrevRating,pollFactor);		
	}
	var snpSwing = 0;
	if(snpRating != ""){
		snpSwing = calculateSwing(snpRating/100,snpPrevRating,pollFactor);		
	}
	
	
	//FOR EACH CONSTITUENCY
	for (i in cons) {
		
		var con = cons[i];
		
		//GET CONSTITUENCY DETAILS
		var constituency = con.name;
		var conId = con.id;
		
		
		//RESET/INIT CONSTITUENCY LEVEL VARIABLES
		var lastWinner = "";
		var toryVote = 0;
		var labourVote = 0;
		var libVote = 0;
		var greenVote = 0;
		var snpVote = 0;
		var ukipVote = 0;
		var otherRecommendedPartyVotes = 0;
		var otherRecommendedParty = "";
		var conTotalVotes = 0;
		var tacticalVote = 0;
		var biggestVote = 0;
		var biggestVoteParty = "";
					
		
		//GET TACTICAL VOTE RECOMMENDATION FOR THIS CONSITUENCY
		var recommendedTacticalVote = recommendations[conId];
		//MAP RECOMMENDATION TO A SINGLE FORMAL PARTY NAME
		var recommendedParty = recommendatonMapping[recommendedTacticalVote];
		
		//IF RECOMMENDED PARTY IS UNKNOWN THEN ASSUME 0 TACTICAL VOTE PARTICIPATION
		var tacticalVoteParticipation = tacticalVoteParticipationPerc/100;
		if(recommendedParty == "Unknown")
		{
			tacticalVoteParticipation = 0;
		}
					
		
		//FOR EACH PARTY CANDIDATE IN LAST ELECTION FOR THIS CONSTITUENCY
		for (j in con.results) 
		{
			var result = con.results[j];
			
			//WAS THIS PARTY THE WINNER?
			if(result.elected == true){
				lastWinner = result.party;
			}
			
			//ADD PARTY VOTES TO CONSTITUENCY TOTAL VOTE COUNT
			conTotalVotes += result.votes;

			
			//INCREMENT PARTY VOTE COUNTS
			if(result.party == "Conservative Party"){
				toryVote += result.votes;
			}
			else if(result.party == "United Kingdom Independence Party"){
				ukipVote += result.votes;
			}					
			else if(result.party == "Labour Party"){
				labourVote  += result.votes;
			}
			else if(result.party == "Liberal Democrat"){
				libVote  += result.votes;
			}
			else if(result.party == "Green Party"){
				greenVote  += result.votes;
			}
			else if(result.party == "Scottish National Party"){
				snpVote += result.votes;
			}					
			else
			{
				//FOR PARTIES IN THE "OTHER" CATEGORY 
				
				//COUNT VOTES IF "OTHER" PARTY IS A TACTICAL VOTE RECOMMENDATION
				if(result.party == recommendedParty)
				{
					otherRecommendedPartyVotes += result.votes;
					otherRecommendedParty = result.party;
				}
				
				//DETERMINE IF "OTHER" PARTY VOTES IS LARGEST VOTE
				if(result.votes > biggestVote)
				{
					biggestVote	= result.votes;
					biggestVoteParty = result.party;
				
				}
				
			}
			
		}
		//END OF LOOPING PARTY CANDIDATES

		
		
		
		//ADJUST VOTE COUNTS DUE TO UNIFORM NATIONAL SWING		
		toryVote = Math.round(swingAdjustment(toryVote/conTotalVotes,torySwing)*conTotalVotes);
		ukipVote = Math.round(swingAdjustment(ukipVote/conTotalVotes,ukipSwing)*conTotalVotes);
		labourVote = swingAdjustment(labourVote/conTotalVotes,labourSwing)*conTotalVotes;
		libVote = swingAdjustment(libVote/conTotalVotes,libSwing)*conTotalVotes;			
		greenVote = swingAdjustment(greenVote/conTotalVotes,greenSwing)*conTotalVotes;			
		snpVote = Math.round(swingAdjustment(snpVote/conTotalVotes,snpSwing)*conTotalVotes);		
		

		//CALCULATE TACTICAL VOTES BASED ON PARTICIPATION 
		tacticalVote += Math.round(labourVote * tacticalVoteParticipation);
		labourVote  = Math.round(labourVote * (1-tacticalVoteParticipation));
		
		tacticalVote += Math.round(libVote * tacticalVoteParticipation);
		libVote  = Math.round(libVote * (1-tacticalVoteParticipation));
		
		tacticalVote += Math.round(greenVote * tacticalVoteParticipation);
		greenVote  = Math.round(greenVote * (1-tacticalVoteParticipation));
			
					
		
		//ALLOCATE TACTICAL VOTES TO RECOMMENDED PARTY
		if(recommendedParty == "Labour Party")
		{
			labourVote += tacticalVote;
		}
		else if(recommendedParty == "Liberal Democrat")
		{
			libVote += tacticalVote;					
		}
		else if(recommendedParty == "Green Party")
		{
			greenVote += tacticalVote;					
		}
		else if(recommendedParty == "Scottish National Party")
		{
			snpVote += tacticalVote;					
		}				
		else
		{
			otherRecommendedPartyVotes += tacticalVote;					
		}
			

		
		//COMPARE VOTE COUNTS TO DETERMINE SEAT WINNER
		if(toryVote > biggestVote)
		{
			biggestVote = toryVote;
			biggestVoteParty = "Conservative Party";
		}	
		if(ukipVote > biggestVote)
		{
			biggestVote = ukipVote;
			biggestVoteParty = "United Kingdom Independence Party";
		}				
		if(labourVote > biggestVote)
		{
			biggestVote = labourVote;
			biggestVoteParty = "Labour Party";
		}
		if(libVote > biggestVote)
		{
			biggestVote = libVote;
			biggestVoteParty = "Liberal Democrat";
		}				
		if(greenVote > biggestVote)
		{
			biggestVote = greenVote;
			biggestVoteParty = "Green Party";
		}
		if(snpVote > biggestVote)
		{
			biggestVote = snpVote;
			biggestVoteParty = "Scottish National Party";
		}				
		if(otherRecommendedPartyVotes > biggestVote)
		{
			biggestVote = otherRecommendedPartyVotes;
			biggestVoteParty = otherRecommendedParty;
		}				
		
		var textStyle = "";
		//GIVE SEAT TO PARTY WITH MOST VOTES
		if(biggestVoteParty == "Conservative Party")
		{
			torySeats += 1;
			textStyle = "tory";
		}
		else if(biggestVoteParty == "United Kingdom Independence Party")
		{
			ukipSeats += 1;
			textStyle = "ukip";
		}				
		else if(biggestVoteParty == "Labour Party")
		{
			labourSeats += 1;
			textStyle = "labour";
		}
		else if(biggestVoteParty == "Liberal Democrat")
		{
			libSeats += 1;
			textStyle = "libdem";
		}
		else if(biggestVoteParty == "Green Party")
		{
			greenSeats += 1;
			textStyle = "green-party";
		}
		else if(biggestVoteParty == "Scottish National Party")
		{
			snpSeats += 1;
			textStyle = "snp";
		}			
		else
		{
			otherSeats += 1;
			textStyle = "other-party";
		}
		
		//ADD CONSTITUENCY TO TABLE
		$("#cons").append("<tr><td>"+constituency+"</td><td class=\"tory\">"+toryVote+"</td><td class=\"labour\">"+labourVote+"</td><td class=\"libdem\">"+libVote+"</td><td class=\"snp\">"+snpVote+"</td><td class=\"green-party\">"+greenVote+"</td><td class=\"ukip\">"+ukipVote+"</td><td class=\"tactical-vote\">"+recommendedParty+"</td><td>"+lastWinner+"</td><td class=\""+textStyle+"\">"+biggestVoteParty+"</td><td class=\""+textStyle+"\">"+biggestVote+"</td></tr>");
	}
	//END LOOPING THROUGH CONSTITUENCIES
	
	
	
	//ADD NATIONAL LEVEL SEAT COUNTS TO TABLE
	$("#newTory2").text(torySeats);
	$("#newLabour2").text(labourSeats);
	$("#newLib2").text(libSeats);
	$("#newSNP2").text(snpSeats);
	$("#newGreen2").text(greenSeats);
	$("#newUKIP2").text(ukipSeats);
	$("#newOther2").text(otherSeats);
	
	
	
	
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
	

	//LOAD TACTICAL2017 RECOMMENDATIONS
	recommendations = {};
	$.getJSON("data/tactical2017-recommendations.json", function(data, status)
	{
		for (c in data) {
			recommendations[data[c].id] = data[c].VoteFor;
		}
	});
	
	
	//LOAD MY CUSTOM RECOMMENDATION MAPPING
	recommendatonMapping = {};
	$.getJSON("data/recommendationMapping.json", function(data, status)
	{
		recommendatonMapping = data;
	});
	
	
	//LOAD 2015 ELECTION RESULTS
	cons = {};
	$.getJSON("data/2015-election-results.json", function(data, status)
	{
		cons = data.elections[0].constituencies;
	});	
	
	
	//LOAD POLL DATA
	pollData = {};
	poll = {};
	$.getJSON("data/bbc-2017-election-poll-data.json", function(data, status)
	{
		pollData = data;
		pollsters = Object.keys(data);
		
		defaultPollster = "YouGov"
		for(i in pollsters)
		{
			if(pollsters[i] == defaultPollster)
			{
				$("#pollster").append("<option selected value=\""+pollsters[i]+"\">"+pollsters[i]+"</option>");
			}
			else
			{
				$("#pollster").append("<option value=\""+pollsters[i]+"\">"+pollsters[i]+"</option>");
			}
		}
		poll = pollData[defaultPollster][pollData[defaultPollster].length-1];
		var pollDate = poll["Fieldwork end"];
		$("#pollDate").text(pollDate);

		updatePollProjection();
		//updatePollProjectionAndTacticalVote();
		
	});	
	
	
	//UPDATE POLL DATE IF POLLSTER SELECTION CHANGED
	$("#pollster").change(function()
	{
		var pollSource = $("#pollster").val();
		poll = pollData[pollSource][pollData[pollSource].length-1];
		var pollDate = poll["Fieldwork end"];
		$("#pollDate").text(pollDate);
		updatePollProjection();
		//updatePollProjectionAndTacticalVote();
	});	
	
	$("#pollFactor").change(function()
	{
		updatePollProjection();
		//updatePollProjectionAndTacticalVote();
	});		
	
	$("#tacticalVotePerc").change(function()
	{
		//updatePollProjection();
		//updatePollProjectionAndTacticalVote();
	});		
	
	//TACTICAL VOTE PROJECTION
	$("#tacticalButton").click(function()
	{
		updatePollProjectionAndTacticalVote();		
		//alert("done");
    });
	
});