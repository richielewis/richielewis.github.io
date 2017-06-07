

//VERY BASIC
function swingAdjustment(prevLocalPercentage,swing)
{
	var newPercentage = prevLocalPercentage + swing;
	if(newPercentage < 0){
		return 0;
	}
	else{
		return newPercentage;
	}	
}

//VERY BASIC
function calculateSwing(currentRating,prevRating,pollFactor)
{
	return (currentRating - prevRating)*pollFactor;
}


//CURRENTLY USING BBC METHOD OF TAKING MEDIAN OF LAST 7 POLLS
function getPollOfPolls_MedianMethod(pollData)
{
	var medianSize = 7;
	
	var newPoll = {};
	newPoll.Con = getPollMedianForParty(pollData,medianSize,3);
	newPoll.UKIP = getPollMedianForParty(pollData,medianSize,6);
	newPoll.Lab = getPollMedianForParty(pollData,medianSize,4);
	newPoll.LD = getPollMedianForParty(pollData,medianSize,5);
	newPoll.Green = getPollMedianForParty(pollData,medianSize,7);
	newPoll.SNP = getPollMedianForParty(pollData,medianSize,8);
	
	var dateFrom = pollData[pollData.length-medianSize][2];
	var dateTo = pollData[pollData.length-1][2];
	newPoll["Fieldwork end"] = dateFrom + " - " + dateTo;
	
	return newPoll;
}

//FOR NOW ONLY CONCERNS LABOUR, GREEN, LIB DEM COALITIONS
function formCoalitions(torySeats,ukipSeats,labourSeats,libSeats,greenSeats,snpSeats,otherSeats)
{
		var labour = "<span class=\"labour\">Labour</span>";
		var libdems = "<span class=\"libdem\">Lib Dems</span>";
		var greens = "<span class=\"green-party\">Greens</span>";
		var snp = "<span class=\"snp\">SNP</span>";
		var coalitionText = "<span class=\"coalition\">MAJORITY COALITION</span>"
		
		if(labourSeats+greenSeats >= 326)
		{
			return coalitionText+" can be formed between "+labour+" and "+greens+" with "+(labourSeats+greenSeats)+" seats";
		}
		else if(libSeats+greenSeats >= 326)
		{
			return "MAJORITY COALITION can be formed between "+libdems+" and "+greens+" with "+(libSeats+greenSeats)+" seats";
		}
		else if(labourSeats+libSeats >= 326)
		{
			return coalitionText+" can be formed between "+labour+" and "+libdems+" with "+(labourSeats+libSeats)+" seats";
		}
		else if(labourSeats+libSeats+greenSeats >= 326)
		{
			return coalitionText+" can be formed between "+labour+", "+libdems+" and "+greens+" with "+(labourSeats+libSeats+greenSeats)+" seats";
		}
		else if(labourSeats+snpSeats >= 326)
		{
			return coalitionText+" can be formed between "+labour+" and "+snp+" with "+(labourSeats+snpSeats)+" seats";
		}
		else if(libSeats+snpSeats >= 326)
		{
			return coalitionText+" can be formed between "+libdems+" and "+snp+" with "+(libSeats+snpSeats)+" seats";
		}
		else if(labourSeats+libSeats+snpSeats >= 326)
		{
			return coalitionText+" can be formed between "+labour+", "+libdems+" and "+snp+" with "+(labourSeats+libSeats+snpSeats)+" seats";
		}
		else if(labourSeats+libSeats+snpSeats+greenSeats >= 326)
		{
			return coalitionText+" can be formed between "+labour+", "+libdems+", "+greens+" and "+snp+" with "+(labourSeats+libSeats+greenSeats+snpSeats)+" seats";
		}			
		else
		{
			return "";
		}

}

//GETTING THE MEDIAN INVOLVES THE FOLLOWING UGLY FUNCTION, AVERAGE WOULD BE SO SIMPLE AND MUCH NICER
function getPollMedianForParty(pollData,medianSize,partyIndex)
{
		var partyRatings = [];
		for(count = 1; count <= medianSize; count++)
		{
			var rating = pollData[pollData.length-count][partyIndex];
			if(rating != "")
			{
				partyRatings.push(rating);
			}
		}
		partyRatings.sort();

		//CHECK IF NO RATINGS FOUND FOR PARTY IN LAST N POLLS
		if(partyRatings.length == 0)
		{
			return "";
		}
		//CHECK IF EVEN OR ODD NUMBER OF RATINGS FOUND
		else if(partyRatings.length % 2 == 0)
		{
			var lowerMiddleIndex = partyRatings.length/2 - 1;
			return (partyRatings[lowerMiddleIndex] + partyRatings[lowerMiddleIndex+1])/2;
		}
		else
		{
			var middleIndex = Math.floor(partyRatings.length/2);
			return partyRatings[middleIndex];
		}
}


//UPDATES TACTICAL VOTE RESULTS , NEEDS TO ALSO CALCULATE POLL SWING PROJECTION AS PART OF CALCULATION
function simulateTacticalVote()
{
	$("#cons").html("");
	$("#newWinner2").html("");

	//GET PARAMETERS
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
	
	
	
	//DETERMINE WHICH PARTY HAS THE MOST SEATS
	var winningSeats = torySeats;
	var winningParty = "Tories";
	var winnerStyle = "tory";
	
	if(labourSeats >= winningSeats)
	{
		winningSeats = labourSeats;
		winningParty = "Labour";
		winnerStyle = "labour";
	}
	if(libSeats >= winningSeats)
	{
		winningSeats = libSeats;
		winningParty = "Lib Dems";
		winnerStyle = "libdem";
	}
	
	
	//WRITE SUMMARY ON WHETHER WINNING PARTY HAS MAJORITY
	var summary = "";
	if(winningSeats >= 326)
	{
		summary = winningParty +" to win with a majority of "+(winningSeats-325)+" seats";
	}
	else
	{
		//WRITE SUMMARY ON HUNG PARLIAMENT AND WHETHER COALITIONS CAN BE FORMED
		var coalitionText = formCoalitions(torySeats,ukipSeats,labourSeats,libSeats,greenSeats,snpSeats,otherSeats);
		if(coalitionText == "")
		{
			summary = "<span class=\"hung-parliament\">HUNG PARLIAMENT</span> "+winningParty+" need "+(326-winningSeats)+" more seats for majority";
		}
		else
		{
			winnerStyle = "other-party";
			summary = coalitionText;
		}
	}
	$("#newWinner2").attr("class", winnerStyle);
	$("#newWinner2").append(summary);
	
	
}




//UPDATES SWING PROJECTION RESULTS
function updatePollProjection()
{
	$("#newWinner").html("");
	
	//GET PARAMETERS
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
	
	
	
	
	//DETERMINE WHICH PARTY HAS THE MOST SEATS
	var winningSeats = torySeats;
	var winningParty = "Tories";
	var winnerStyle = "tory";
	
	if(labourSeats >= winningSeats)
	{
		winningSeats = labourSeats;
		winningParty = "Labour";
		winnerStyle = "labour";
	}
	if(libSeats >= winningSeats)
	{
		winningSeats = libSeats;
		winningParty = "Lib Dems";
		winnerStyle = "libdem";
	}
	
	
	//WRITE SUMMARY ON WHETHER WINNING PARTY HAS MAJORITY
	var summary = "";
	if(winningSeats >= 326)
	{
		summary = winningParty +" to win with a majority of "+(winningSeats-325)+" seats";
	}
	else
	{
		//WRITE SUMMARY ON HUNG PARLIAMENT AND WHETHER COALITIONS CAN BE FORMED
		var coalitionText = formCoalitions(torySeats,ukipSeats,labourSeats,libSeats,greenSeats,snpSeats,otherSeats);
		if(coalitionText == "")
		{
			summary = "<span class=\"hung-parliament\">HUNG PARLIAMENT</span> "+winningParty+" need "+(326-winningSeats)+" more seats for majority";
		}
		else
		{
			winnerStyle = "other-party";
			summary = coalitionText;
		}
	}
	$("#newWinner").attr("class", winnerStyle);
	$("#newWinner").append(summary);	
	
		
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
	


	recommendations = {};
	recommendatonMapping = {};
	cons = {};
	pollData = {};
	poll = {};
	
	
	//LOAD TACTICAL2017 RECOMMENDATIONS	
	$.getJSON("data/tactical2017-recommendations.json", function(data, status)
	{
		for (c in data) {
			recommendations[data[c].id] = data[c].VoteFor;
		}
		
		//LOAD MY CUSTOM RECOMMENDATION MAPPING
		$.getJSON("data/recommendationMapping.json", function(data, status)
		{
			recommendatonMapping = data;
			
			//LOAD 2015 ELECTION RESULTS
			$.getJSON("data/2015-election-results.json", function(data, status)
			{
				cons = data.elections[0].constituencies;
				
				
				//LOAD POLL DATA GROUPED BY POLLSTER
				$.getJSON("data/bbc-2017-election-poll-data-pollsters.json", function(data, status)
				{
					pollData = data;
					pollsters = Object.keys(pollData);
					
					//LOAD POLL DATA FLATTENED AND SORTED BY POLL DATE
					$.getJSON("data/bbc-2017-election-poll-data.json", function(data, status)
					{
					
						var pollOfPolls = getPollOfPolls_MedianMethod(data);
						
						var newPollster = [];
						newPollster.push(pollOfPolls);
						pollData["Poll of Polls"] = newPollster;
						
						pollsters.unshift("Poll of Polls");
						
						defaultPollster = "Poll of Polls";
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
					
					
					
					
				});					
				
				
			});			
						
			
		});
		
		
	});
	
	
	
	
	//UPDATE POLL DATE AND SWING PROJECTION IF POLLSTER SELECTION CHANGED
	$("#pollster").change(function()
	{
		var pollSource = $("#pollster").val();
		poll = pollData[pollSource][pollData[pollSource].length-1];
		var pollDate = poll["Fieldwork end"];
		$("#pollDate").text(pollDate);
		updatePollProjection();
		//updatePollProjectionAndTacticalVote();
	});	
	
	
	//UPDATE SWING PROJECTION IF POLLSTER SELECTION CHANGED
	$("#pollFactor").change(function()
	{
		updatePollProjection();
		//updatePollProjectionAndTacticalVote();
	});		
	
	//UPDATE TACTICAL RESULTS IF PERCENTAGE CHANGED -- REMOVED AS MADE BROWSER SLOW
	$("#tacticalVotePerc").change(function()
	{
		//updatePollProjection();
		//updatePollProjectionAndTacticalVote();
	});		
	
	//UPDATE TACTICAL RESULTS WHEN RED BUTTON CLICKED 
	$("#tacticalButton").click(function()
	{
		simulateTacticalVote();		
		//alert("done");
    });
	

	//FOR SMALL DEVICES THE NAVBAR BUTTON CHANGES
	$(".my-nav-element").click(function()
	{
		$("#navbar").attr("aria-expanded","false");
		$("#navbar").removeClass("in");
		//alert("done");
    });	
	
});