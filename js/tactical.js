function dhondt(originalPercs,seats)
{
	seatsWon = {};
	remainingSeats = seats;
	
	partyPercs = copyDict(originalPercs)
	
	while(remainingSeats > 0)
	{
	
		winningParty = "";
		winningPartyPerc = 0;
		
		for (party in partyPercs)
		{
			if (partyPercs[party] > winningPartyPerc)
			{
				winningParty = party;
				winningPartyPerc = partyPercs[party];
			}
		}
				
		if(seatsWon[winningParty])
		{
			seatsWon[winningParty] = seatsWon[winningParty] + 1;
		}
		else
		{
			seatsWon[winningParty] = 1;
		}
		
		partyPercs[winningParty] = originalPercs[winningParty]/ (1.0 + seatsWon[winningParty]);
		
		remainingSeats = remainingSeats - 1;
			
	}
	
	return seatsWon
	
}

function copyDict(dict)
{
	newDict = {}
	for (k in dict)
	{
		newDict[k] = dict[k]
	}	
	return newDict
}

function safeGet(dict,key,def)
{
	if(dict[key])
	{
		return dict[key]
	}
	else
	{
		return def
	}
}

function safeGetDictArray(dict,key,index,def)
{
	if(dict[key])
	{
		if(dict[key].length > index)
		{
			return dict[key][index]
		}
		else
		{
			return def
		}
	}
	else
	{
		return def
	}
}


function buildBarChart(polledResult,partyPercentages,partySeats,remainLeaveResult,regionSeats)
{
	var chart1;
	
	partyBarNames = []
	partyBarColours0 = []
	partyBarColours1 = []
	partyBarColours2 = []
	partyBarPercs = []
	partyBarOrigSeats = []
	partyBarNewSeats = []
	for (party in partyPercentages)
	{
		//alert(party);
		partyBarNames.push(party);
		partyBarColours0.push(safeGetDictArray(partyColours,party,0,"white"))
		partyBarColours1.push(safeGetDictArray(partyColours,party,1,"white"))
		partyBarColours2.push(safeGetDictArray(partyColours,party,2,"white"))
		partyBarPercs.push(Math.round(partyPercentages[party]))
		partyBarOrigSeats.push(safeGet(polledResult,party,0))
		partyBarNewSeats.push(safeGet(partySeats,party,0))
	}
	for (partyGroup in remainLeaveResult)
	{
		partyGroupResult = remainLeaveResult[partyGroup]
		partyBarNames.push(partyGroup);
		partyBarColours0.push(safeGetDictArray(partyColours,partyGroup,0,"white"))
		partyBarColours1.push(safeGetDictArray(partyColours,partyGroup,1,"white"))
		partyBarColours2.push(safeGetDictArray(partyColours,partyGroup,2,"white"))
		partyBarPercs.push(0)
		partyBarOrigSeats.push(partyGroupResult[0])
		partyBarNewSeats.push(partyGroupResult[1])
	}
	

	var barChartData = {
		labels: partyBarNames,
		datasets: [
		{
			label: 'Percentage of Votes with Tactical Vote',
			backgroundColor: partyBarColours0,
			yAxisID: 'y-axis-1',
			data: partyBarPercs
		}, 
		{
			label: 'Original Estimated Seats',
			backgroundColor: partyBarColours1,
			yAxisID: 'y-axis-2',
			data: partyBarOrigSeats
		},
		{
			label: 'Estimated Seats with Tactical Vote',
			backgroundColor: partyBarColours2,
			yAxisID: 'y-axis-2',
			data: partyBarNewSeats
		}
		]

	};

	var ctx = document.getElementById('canvas').getContext('2d');
	config = {
		type: 'bar',
		data: barChartData,
		options: {
			responsive: true,
			title: {
				display: false,
				text: 'Chart.js Bar Chart - Multi Axis'
			},
			tooltips: {
				mode: 'index',
				intersect: true
			},
			tooltips: {enabled:false},
			hover: {enabled:false},			
			scales: {
				yAxes: [{
					type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
					display: true,
					position: 'left',
					id: 'y-axis-1',
					gridLines : {display:false}
				}, {
					//type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
					display: true,
					position: 'right',
					id: 'y-axis-2',
					ticks: {
                                beginAtZero: true,
                                max: regionSeats,
								fixedStepSize: 1,
								stepSize: 1,
								precision:0
                            }
					//,
					//gridLines: {
					//	drawOnChartArea: false
					//}
				}],
			},
			animation: {duration: 0}
				
		}
	};
	
	
	window.myBar && window.myBar.destroy(); // destroy previous chart
	window.myBar = new Chart(ctx, config);
	//window.myBar
}


function buildLineGraph(remainResults,regionSeats)
{

	var chart2;
	
	datasetData = []
	partyBarNames = []
	
	
	partyBarColours0 = []
	partyBarRemainSeats = []
	
	dataLabels = []
	for (j = 0; j <= 100; j++)
	{
		dataLabels.push(j);
	}
	
	for (party in remainResults)
	{
		newDataset = {}
		newDataset["label"] = "Tactically voting for "+party
		newDataset["backgroundColor"] = safeGetDictArray(partyColours,party,0,"white");
		newDataset["borderColor"] = safeGetDictArray(partyColours,party,0,"white");
		newDataset["data"] = remainResults[party];
		newDataset["fill"] = false;
		datasetData.push(newDataset);
	}

	var config = {
		type: 'line',
		data: {
			labels: dataLabels,
			datasets: datasetData
		},
		options: {
			responsive: true,
			title: {
				display: false,
				text: 'Chart.js Line Chart'
			},
			//tooltips: {enabled:false},
			hover: {enabled:false},
			//	mode: 'index',
			//	intersect: false,
			//},
			//hover: {
			//	mode: 'nearest',
			//	intersect: true
			//},
			scales: {
				xAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Percentage of Tactical Voters'
					},
					gridLines : {display:false}
				}],
				yAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Remain Seats'
					},
					ticks: {
                        beginAtZero: true,
                        max: regionSeats,
						fixedStepSize: 1,
						stepSize: 1,
						precision:0
                    },
					gridLines : {display:false}
				}]
			}
			
			
		}
	};
	
	var ctx2 = document.getElementById('canvas2').getContext('2d');
	
	window.myLine && window.myLine.destroy(); // destroy previous chart
	window.myLine = new Chart(ctx2, config);
	//window.myLine = new Chart(ctx2, config);
	
}





function simulateRemainSeats()
{
	
	var allSimulationResults = {}
	
	var selectedRegion = $("#region").val();
	var regionalPollData = pollData[selectedRegion]
		
	//alert(tacticalVoteParticipation);
	
	var regionSeats = seats[selectedRegion]
	
	//alert("PERCENTAGES: "+JSON.stringify(pollData["London"]));
	polledResult = dhondt(regionalPollData,regionSeats);
	//alert("SEATS: "+JSON.stringify(lonRes));
	
	regionalRemainParties = []
	for (party in regionalPollData)
	{
		if(regionalPollData[party] > 0 && remainParties.includes(party) )
		{
			regionalRemainParties.push(party)
		}
	}	
	
	for (i in regionalRemainParties)
	{
		var tacticalVoteParty = regionalRemainParties[i]
		var tacticalRemainSeats = []
		for (j = 0; j <= 100; j++)
		{
			var tacticalVoteParticipation = j/100.00;
			
			tacticalPartyPerc = 0
			newPollData = copyDict(regionalPollData)
			for (party in regionalPollData)
			{
				if(party == tacticalVoteParty)
				{
					tacticalPartyPerc += newPollData[party]
				}
				else if(regionalRemainParties.includes(party))
				{
					tacticalPartyPerc +=  newPollData[party] * tacticalVoteParticipation
					newPollData[party] = newPollData[party] * (1-tacticalVoteParticipation)
				}
			}
			newPollData[tacticalVoteParty] = tacticalPartyPerc
			newResult = dhondt(newPollData,regionSeats);
			
			remainNewSeats = 0
			
			for (party in regionalPollData)
			{
				newSeats = safeGet(newResult,party,0)				
				if(remainParties.includes(party))
				{
					remainNewSeats += newSeats			
				}

			}
			tacticalRemainSeats.push(remainNewSeats)
		}
		allSimulationResults[tacticalVoteParty] = tacticalRemainSeats
						
			
	}
	//alert(JSON.stringify(allSimulationResults));
	
	buildLineGraph(allSimulationResults,regionSeats);
}
	

function simulateVote()
{	

	//$("#parties").html("");
	
	var selectedRegion = $("#region").val();
	var regionalPollData = pollData[selectedRegion]
	
	var tacticalVoteParty = $("#party").val();
	var tacticalVoteParticipationPerc = $("#tacticalVotePerc").val();
	var tacticalVoteParticipation = tacticalVoteParticipationPerc/100.00;
	
	//alert(tacticalVoteParticipation);
	
	var regionSeats = seats[selectedRegion]
	
	//alert("PERCENTAGES: "+JSON.stringify(pollData["London"]));
	polledResult = dhondt(regionalPollData,regionSeats);
	//alert("SEATS: "+JSON.stringify(lonRes));
	
	regionalRemainParties = []
	for (party in regionalPollData)
	{
		if(regionalPollData[party] > 0 && remainParties.includes(party) )
		{
			regionalRemainParties.push(party)
		}
	}	
	
	tacticalPartyPerc = 0
	//alert("TACTICAL VOTE "+tacticalParty)
	newPollData = copyDict(regionalPollData)
	for (party in regionalPollData)
	{
		if(party == tacticalVoteParty)
		{
			tacticalPartyPerc += newPollData[party]
			//alert(tacticalPartyPerc)
		}
		else if(regionalRemainParties.includes(party))
		{
			tacticalPartyPerc +=  newPollData[party] * tacticalVoteParticipation
			newPollData[party] = newPollData[party] * (1-tacticalVoteParticipation)
			//alert(tacticalPartyPerc)
		}
	}
	newPollData[tacticalVoteParty] = tacticalPartyPerc
	
	//alert("PERCENTAGES: "+JSON.stringify(newPollData));
	newResult = dhondt(newPollData,regionSeats);
	//alert("SEATS: "+JSON.stringify(newLonRes));

	
	leaveOrigSeats = 0
	leaveNewSeats = 0
	remainOrigSeats = 0
	remainNewSeats = 0
	fenceOrigSeats = 0
	fenceNewSeats = 0
	
	for (party in regionalPollData)
	{
		partyName = party
		originalPercentage = Math.round(regionalPollData[party])
		originalSeats = safeGet(polledResult,party,0)
		newPercentage = Math.round(newPollData[party])
		newSeats = safeGet(newResult,party,0)
		
		
		//$("#parties").append("<tr><td class=\""+party+"\">"+party+"</td><td class=\"orig\">"+originalPercentage+"</td><td class=\"orig\">"+originalSeats+"</td><td class=\"new\">"+newPercentage+"</td><td class=\"new\">"+newSeats+"</td></tr>");
	
		if(leaveParties.includes(party))
		{
			leaveOrigSeats += originalSeats
			leaveNewSeats += newSeats
		}
		else if(remainParties.includes(party))
		{
			remainOrigSeats += originalSeats
			remainNewSeats += newSeats			
		}
		else
		{
			fenceOrigSeats += originalSeats
			fenceNewSeats += newSeats			
		}
	}
	
	remainLeaveResult = {"Leave":[leaveOrigSeats,leaveNewSeats],"Remain":[remainOrigSeats,remainNewSeats],"Neither":[fenceOrigSeats,fenceNewSeats]}
	
	//$("#parties").append("<tr><td class=\"leave\">Leave Parties</td><td class=\"orig\"></td><td class=\"orig\">"+leaveOrigSeats+"</td><td class=\"new\"></td><td class=\"new\">"+leaveNewSeats+"</td></tr>");
	//$("#parties").append("<tr><td class=\"remain\">Remain Parties</td><td class=\"orig\"></td><td class=\"orig\">"+remainOrigSeats+"</td><td class=\"new\"></td><td class=\"new\">"+remainNewSeats+"</td></tr>");
	//$("#parties").append("<tr><td class=\"fence\">Fence Parties</td><td class=\"orig\"></td><td class=\"orig\">"+fenceOrigSeats+"</td><td class=\"new\"></td><td class=\"new\">"+fenceNewSeats+"</td></tr>");
	
	buildBarChart(polledResult,newPollData,newResult,remainLeaveResult,regionSeats);
}

$(document).ready(function(){
	


	seats = {};
	regions = [];
	pollData = {};
	poll = {};
	
	leaveParties = ["UKIP","BrexitParty"]
	remainParties = ["LibDem","SNP","PlaidCymru","Green","ChangeUK"]
	
	partyColours = {}
	partyColours["Lab"] = ["red","crimson","darkred"];
	partyColours["Con"] = ["deepskyblue","dodgerblue","blue"];
	partyColours["BrexitParty"] = ["cyan","darkturquoise","darkcyan"];
	partyColours["UKIP"] = ["darkviolet","darkorchid","darkmagenta"];
	partyColours["Green"] = ["yellowgreen","limegreen","green"];
	partyColours["ChangeUK"] = ["silver","slategrey","black"];
	partyColours["LibDem"] = ["orange","darkorange","coral"];
	partyColours["SNP"] = ["yellow","gold","goldenrod"];
	partyColours["PlaidCymru"] = ["greenyellow","chartreuse","lawngreen"];
	partyColours["Leave"] = ["cyan","darkturquoise","darkcyan"];
	partyColours["Remain"] = ["silver","slategrey","black"];
	partyColours["Fence"] = ["beige","cornsilk","bisque"];
	

	polls = ["YouGov"];
	defaultPoll = "YouGov";
	
	allPollData = {}

	for(i in polls)
	{
		if(polls[i] == defaultPoll)
		{
			$("#poll").append("<option selected value=\""+polls[i]+"\">"+polls[i]+"</option>");
		}
		else
		{
			$("#poll").append("<option value=\""+polls[i]+"\">"+polls[i]+"</option>");
		}
	}
	
	var chart1;
	var chart2;
	
	defaultRegion = "London"
	defaultParty = "LibDem"
	
	selectedRegion = defaultRegion;
	
	//LOAD TACTICAL2017 RECOMMENDATIONS	
	
	$.ajaxSetup({beforeSend: function(xhr){
	  if (xhr.overrideMimeType)
	  {
		xhr.overrideMimeType("application/json");
	  }
	}
	});

	$.getJSON("data/seats.json", function(data, status)
	{
		for (region in data) {
			seats[region] = data[region];
		}
		
		$.getJSON("data/yougov-poll.json", function(data, status)
		{
			yougovPollData = {}
			//alert(JSON.stringify(data));
			for (region in data) {
				//alert(region);
				//alert(JSON.stringify(data[region]));
				yougovPollData[region] = data[region];
			}
			
			allPollData["YouGov"] = yougovPollData
			pollData = allPollData["YouGov"]
			
			for (region in pollData)
			{
				if(region == defaultRegion)
				{
					$("#region").append("<option selected value=\""+region+"\">"+region+"</option>");
				}
				else
				{
					$("#region").append("<option value=\""+region+"\">"+region+"</option>");
				}			
			}			
			
			selectedRegion = defaultRegion;
			
			regionalRemainParties = []
			for (party in pollData[selectedRegion])
			{
				if(pollData[selectedRegion][party] > 0 && remainParties.includes(party) )
				{
					regionalRemainParties.push(party)
				}
			}
			
			for (i in regionalRemainParties)
			{
				party = regionalRemainParties[i]
				if(party == defaultParty)
				{
					$("#party").append("<option selected value=\""+party+"\">"+party+"</option>");
				}
				else
				{
					$("#party").append("<option value=\""+party+"\">"+party+"</option>");
				}			
			}

			simulateVote();	
			simulateRemainSeats();
			
		});
		
	});
	
	
	$("#poll").change(function()
	{
		var pollSource = $("#poll").val();
		
		pollData = allPollData[pollSource]
		
		for (region in pollData)
		{
			if(region == defaultRegion)
			{
				$("#region").append("<option selected value=\""+region+"\">"+region+"</option>");
			}
			else
			{
				$("#region").append("<option value=\""+region+"\">"+region+"</option>");
			}			
		}
		
		simulateVote();
		simulateRemainSeats();
		
	});
	
	$("#region").change(function()
	{
		selectedRegion = $("#region").val();
		
		regionalRemainParties = []
		for (party in pollData[selectedRegion])
		{
			if(pollData[selectedRegion][party] > 0 && remainParties.includes(party) )
			{
				regionalRemainParties.push(party)
			}
		}
		
		$("#party").html("");
		for (i in regionalRemainParties)
		{
			party = regionalRemainParties[i]
			if(party == defaultParty)
			{
				$("#party").append("<option selected value=\""+party+"\">"+party+"</option>");
			}
			else
			{
				$("#party").append("<option value=\""+party+"\">"+party+"</option>");
			}			
		}
		
		simulateVote();
		simulateRemainSeats();
	});
	
	//UPDATE TACTICAL RESULTS WHEN RED BUTTON CLICKED 
	$("#tacticalButton").click(function()
	{
		simulateVote();
		simulateRemainSeats();		
		//alert("done");
    });
	
	$("#tacticalVotePerc").change(function()
	{
		simulateVote();
		
	});	
	
	$("#party").change(function()
	{
		simulateVote();
		
	});	
	

	//FOR SMALL DEVICES THE NAVBAR BUTTON CHANGES
	$(".my-nav-element").click(function()
	{
		$("#navbar").attr("aria-expanded","false");
		$("#navbar").removeClass("in");
		//alert("done");
    });		

});