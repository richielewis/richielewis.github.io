
$(document).ready(function(){
	

	
	recommendations = {};
	$.getJSON("data/tacticalvote2017-recommendations.json", function(data, status)
	{
		for (c in data) {
			recommendations[data[c].id] = data[c].VoteFor;
		}
		recommendatonMapping = {};
		recommendatonMapping["Alliance"] = "Alliance";
		recommendatonMapping["Green"] = "Green Party";
		recommendatonMapping["Green or Labour TBC"] = "Labour Party";
		recommendatonMapping["Independent Claire Wright"] = "Independent Claire Wright";
		recommendatonMapping["It's complicated"] = "Unknown";
		recommendatonMapping["Labour"] = "Labour Party";
		recommendatonMapping["Labour or Lib Dem TBC"] = "Labour Party";
		recommendatonMapping["Labour, Green or Lib Dem TBC"] = "Labour Party";
		recommendatonMapping["Lib Dem"] = "Liberal Democrat";
		recommendatonMapping["National Health Action"] = "National Health Action";
		recommendatonMapping["Plaid Cymru"] = "Plaid Cymru";
		recommendatonMapping["SDLP"] = "Social Democratic & Labour Party";
		recommendatonMapping["SNP"] = "Scottish National Party";
		recommendatonMapping["SNP or Labour TBC"] = "Labour Party";
		recommendatonMapping["SNP or Lib Dem TBC"] = "Liberal Democrat";
		recommendatonMapping["TBC"] = "Labour Party";
		recommendatonMapping["TBC too soon to call"] = "Labour Party";
		
	});
	
	cons = {};
	$.getJSON("data/2015-election-results.json", function(data, status)
	{
		cons = data.elections[0].constituencies;
	});	
	
	pollData = {};
	poll = {};
	$.getJSON("data/bbc-2017-election-poll-data.json", function(data, status)
	{
		pollData = data;
		pollsters = Object.keys(data);
		//alert("Pollsters are "+pollsters);
		
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
		
		//alert("Conservatives: "+poll.Ukip);
	});	
	
	$("#pollster").change(function()
	{
		var pollSource = $("#pollster").val();
		poll = pollData[pollSource][pollData[pollSource].length-1];
		var pollDate = poll["Fieldwork end"];
		$("#pollDate").text(pollDate);
	});	
	
	
	$("#predictButton").click(function()
	{

		$("#cons").html("");
	
		var tacticalVoteParticipationPerc = $("#tacticalVotePerc").val();
		hardmode = false;
		var pollFactor = $("#pollFactor").val();
		var pollSource = $("#pollster").val();
	
		poll = pollData[pollSource][pollData[pollSource].length-1];
	
		//NATIONAL LEVEL SEAT COUNTS
		var torySeats = 0;
		var labourSeats = 0;
		var libSeats = 0;
		var greenSeats = 0;
		var snpSeats = 0;
		var ukipSeats = 0;
		var otherSeats = 0;
		
		
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

			
			if(hardmode){
				toryVote += Math.round(ukipVote*0.5);
				ukipVote = Math.round(ukipVote*0.5);				
			}
			
			
			
			//ADJUST VOTE COUNTS BASED ON POLL SCORE AND POLL FACTOR
			var toryRating = poll.Con/100;
			toryVote = Math.round(((toryVote/conTotalVotes)*(1-pollFactor) + toryRating*pollFactor)*conTotalVotes);

			var ukipRating = poll.UKIP;
			if(ukipRating != ""){
				ukipRating = ukipRating/100;;
				ukipVote = Math.round(((ukipVote/conTotalVotes)*(1-pollFactor) + ukipRating*pollFactor)*conTotalVotes);
			}

			var labRating = poll.Lab/100;
			labourVote = ((labourVote/conTotalVotes)*(1-pollFactor) + labRating*pollFactor)*conTotalVotes;

			var libRating = poll.LD/100;
			libVote = ((libVote/conTotalVotes)*(1-pollFactor) + libRating*pollFactor)*conTotalVotes;
						
			var greenRating = poll.Green;
			if(greenRating != ""){
				greenRating = greenRating/100;
				greenVote = ((greenVote/conTotalVotes)*(1-pollFactor) + greenRating*pollFactor)*conTotalVotes;
			}
			

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
			
			//ADD CONSTITUENCY TO TABLE
			$("#cons").append("<tr><td>"+constituency+"</td><td>"+toryVote+"</td><td>"+labourVote+"</td><td>"+libVote+"</td><td>"+greenVote+"</td><td>"+ukipVote+"</td><td>"+recommendedParty+"</td><td>"+lastWinner+"</td><td>"+biggestVoteParty+"</td><td>"+biggestVote+"</td></tr>");
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
		
		//alert("done");

    });
});