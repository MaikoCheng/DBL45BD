//ARC DIAGRAM

// set the dimensions and margins of the graph
  
  

  // Input data
    var openFile = function(event) {
      if(document.getElementById("tooltipdefid") != null){
        document.getElementById("tooltipdefid").remove();
      }
    var input = event.target;
    let tokeep = ["Employee", "Vice President", "Manager", "Unknown","President","Trader","CEO","Managing Director","Director","In House Lawyer"];
    var reader = new FileReader();
    reader.onload = function(){
      var margin = {top: 100, right: 50, bottom: 160, left: 50},
    width = 1800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
    d3.select('svg').remove();
    d3.select("svg3").remove();
    
    var svg = d3.select("#my_dataviz")
      .append("svg")
        .attr("width", '100%')
        .attr("height", "100%")
        .attr("id", "svg4id")
        .call(d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform)
          }))
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
        d3.select("svg3").remove();
        var dataURL = reader.result;
        document.getElementById("checkbox").style.display = "block";
        document.getElementById("namea").style.display = "block";
        document.getElementById("nameb").style.display = "block";

      //Read the input data
      d3.csv(dataURL, function(data) {
        //data = data.filter(function(d,i){ return i<1000 })
        //data = data.sort(function (a,b) {return d3.ascending(a.fromJobtitle, b.fromJobtitle);});
        tokeep.sort();
        //data = data.filter(function(d,i){ return tokeep.indexOf(d.fromJobtitle) >= 0 })
      

      //Group the data. nestedData is an array with everyone (fromId's) who sent at least 1 email containing the list of people that the person sent the email(s) to. 
      //Each recipient itself (toId's) is a list with all emails received from that specific fromId, totalMails, totalSentiment and avgSentiment.
        var nestedData = d3.nest()
        .key(d => d.fromId)
        .key(d => d.toId)
        .rollup(function(v) { return {
            mails: v,
            totalMails: v.length,
            totalSentiment: d3.sum(v, function(d) { return d.sentiment;}),
            avgSentiment: d3.mean(v, function(d) { return d.sentiment;})};})
        .entries(data);

    //To be able to correctly add all the squares to the adjacency matrix, we have to create seperate objects for each fromId to each distinct toId. 
    //E.g. all emails that 96 sent to 77 in one object.
    var linksArray = [];
    //For each fromId we extract the list of people that they sent emails to (fromId.values).
    nestedData.forEach(function (fromId) {
    //Then for each toId in fromId.values we create a new object called link containing the fromId, toId and some metadata (mails, totalMails, totalSentiment and avgSentiment).
    //We could add more information to this object, or simplify it.
        fromId.values.forEach(function(toId) {
            var link = {
                fromId: fromId.key,
                toId: toId.key,
                fromEmail: toId.value.mails[0].fromEmail.replace(/@enron.com/g, ""),
                toEmail: toId.value.mails[0].toEmail.replace(/@enron.com/g, ""),
                fromJobtitle: toId.value.mails[0].fromJobtitle,
                toJobtitle: toId.value.mails[0].toJobtitle,
                totalMails: toId.value.totalMails,
                totalSentiment: toId.value.totalSentiment,
                avgSentiment: toId.value.avgSentiment
            };
            //Add the object to the links array
            linksArray.push(link);
        })
    })
    //console.log(linksArray);

    //Create an object for each unique employee. Their id corresponds to the index in the nodes array.
    var nodesArray = [];
    data.forEach(function (n) {
        nodesArray[n.toId] = {
          id: n.toId,
          name: n.toEmail.replace(/@enron.com/g, ""),
          jobtitle: n.toJobtitle
        };
    });
    //console.log(nodesArray)

      //Sort the nodes by jobtitle
      var orderByJobtitle = nodesArray.sort(function(a, b){
      return d3.ascending(a.jobtitle, b.jobtitle)});

        // List of node names
        var allNames = nodesArray.map(function(d){return d.name})

        // List of groups
        var allJobtitles = nodesArray.map(function(d){return d.jobtitle})
        allJobtitles = [...new Set(allJobtitles)]
      
        // A color scale for groups:
        var color = d3.scaleOrdinal()
          .domain(tokeep)
          .range(d3.schemeSet3);
      
        // A linear scale for node size
        var size = d3.scaleLinear()
          .domain([1,149])
          .range([20,200]);
      
        // A linear scale to position the nodes on the X axis
        var x = d3.scalePoint()
          .range([0, width + 5000])
          .domain(allNames)

        // Add the links
        var links = svg
          .selectAll('mylinks')
          .data(linksArray)
          .enter()
          .append('path')
          .attr('d', function (d) {
            start = x(d.toEmail)    // X position of start node on the X axis
            let end = x(d.fromEmail)      // X position of end node
            
            return ['M', start, height-30,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
              'A',                            // This means we're gonna build an elliptical arc
              (start - end)/2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
              (start - end)/2, 0, 0, ',',
              start < end ? 1 : 0, end, ',', height-30] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
              .join(' ');
          })
          .style("fill", "none")
          .attr("stroke", "grey")
          .style("stroke-width", 1)

        // Add the circle for the nodes
        var nodes = svg
          .selectAll("mynodes")
          .data(orderByJobtitle)
          .enter()
          .append("circle")
            .attr("cx", function(d){if (d != undefined){ return(x(d.name))} else {return -10000}})
            .attr("cy", height+10)
            .attr("r", function(d){if (d != undefined){ return 50} else {return 0}})
            .style("fill", function(d){if (d != undefined){ return color(d.jobtitle)} else {return "transparent"}})
            .attr("stroke", function(d){if (d != undefined){ return "white"} else {return "transparent"}})
            .style("opacity", 1)
							  
        // Add name labels to the nodes
        var labels = svg
          .selectAll("mylabels")
          .data(orderByJobtitle)
          .enter()
          .append("text")
            .attr("x", "-100px")
            .attr("y", 75)
            .text(function(d){if (d != undefined){ return(d.name)}})
            .style("text-anchor", "end")
            .attr("transform", function(d){if (d != undefined){ return( "translate(" + x(d.name) + "," + (height-15) + ")rotate(-45)")}})
            .style("font-size", 50)
            .style("fill", function(d){if (d != undefined){ return color(d.jobtitle)}});
      
        
        // Add the highlighting functionality
        nodes
          .on('mouseover', function (d) {
            // Highlight the node: all nodes but the selected node get a lower opacity
            nodes
                .style('opacity', "5%")
              d3.select(this)
                .style('opacity', 1)
                .attr('r', 60)

            // Highlight the links
            links
              .style('stroke', function (link_d) {if (d != undefined){ return link_d.fromEmail === d.name || link_d.toEmail === d.name ? color(d.jobtitle) : '#b8b8b8';}})
              .style('stroke-opacity', function (link_d) {if (d != undefined){ return link_d.fromEmail === d.name || link_d.toEmail === d.name ? 5 : .2;}})
              .style('stroke-width', function (link_d) {if (d != undefined){ return link_d.fromEmail === d.name || link_d.toEmail === d.name ? 4 : 1;}})

            //Highlight the label: font-size increases for the selected node, other nodes get smaller font-size
            labels
              .style("font-size", function(label_d){if (d != undefined){ return label_d.name === d.name ? 200 : 20 }} )
              .attr("y", function(label_d){if (d != undefined){ return label_d.name === d.name ? 12 : 0 }} )
              .attr("x", "-180px")
              .style("fill", function(d){if (d != undefined){ return color(d.jobtitle)}})
          })

          //All nodes back to normal when no node is selected
          .on('mouseout', function (d) {
            nodes
              .style('opacity', 1)
              .attr('r', 40)
            links
              .style('stroke', 'grey')
              .style('stroke-opacity', .8)
              .style('stroke-width', '1')
            labels
              .style("font-size", 50 )
          })
          
          //nodes in the legend
          svg.selectAll("nodes")
            .data(tokeep)
            .enter()
            .append('circle')
              .attr("cx",-1230)
              .attr("cy", function(d,i){ return -1100 + i*150})
              .attr("r", 50)
              .style("fill", function(d){ return color(d)})
              .attr("position", "fixed")
          
          //Labels in legend
          svg.selectAll("labels")
            .data(tokeep)
            .enter()
            .append("text")
              .attr("x", -1160)
              .attr("y", function(d,i){ return -1080 + i*150})
              .style("fill", function(d){ return color(d)})
              .text(function(d){ return d})
              .attr("text-anchor", "left")
              .style("alignment-baseline", "middle")
              .style("font-size", "150px");

      
  
      
  //ADJACENCY MATRIX
      
    // set the dimensions and margins of the graph
    var margin2 = {top: 70, right: 10, bottom: 100, left: 70},
    width2 = 1800 - margin2.left - margin2.right,
    height2 = 1800 - margin2.top - margin2.bottom;
    
    // append the svg object to the body of the page
    var svg3 = d3.select("#my_dataviz2")
          .append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
            .attr("id", "svg3id")
            .call(d3.zoom().on("zoom", function () {
              svg3.attr("transform", d3.event.transform)}))
           .style("background-color", "transparent")
          .append("g")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");  
		
		
    // Build color scale
    var colorCell = d3.scaleLinear()
      .range(["yellow", "white", "rgb(61, 149, 179)"])
      .domain([-0.05, 0, 0.05])
	    
    var getTitle = function (a){
      for(i = 0; i < orderByJobtitle.length-1; i++){
        if (a == orderByJobtitle[i].name){
          return orderByJobtitle[i].jobtitle;
        }
      }
    }
      
    //List of groups of jobtitles
    var allGroups = data.map(function(d){return d.fromJobtitle})
    allGroups = [...new Set(allGroups)]
      
    //A color scale for jobtitle groups:
    var colorName = d3.scaleOrdinal()
      .domain(tokeep)
      .range(d3.schemeSet3);
  
    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([ 0, width2 ]) 
        .domain(orderByJobtitle.map(d => d['name']))
        .padding(0.01);

      svg3.append("g")
        .call(d3.axisTop(x))
        .selectAll("text")
      	  .style("fill", function(d){ return colorName(getTitle(d))})
	  .style("font-size", 13)
          .attr("transform", "rotate(-90)")
      	  .attr("text-anchor", "start")
          .attr("x", "10px")
          .attr("y", "3px");

    // Build Y scales and axis:
    var y = d3.scaleBand()
      .range([ 0, height2 ])
      .domain(orderByJobtitle.map(d => d['name']))
      .padding(0.01);
    svg3.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      	.style("fill", function(d){ return colorName(getTitle(d))})
	.style("font-size", 13);
      
    svg3.selectAll("line")
        .style("stroke", "white");

      //d3.selectAll('text').style("font-size", 20);

    //From axis label
    svg3.append("text")
        .attr("class", "x label")
        //.attr("text-anchor", "end")
        .attr("x", width2/2)
        .attr("y", -1.5*margin2.top)
        .text("From")
            .style("font-size" , 40);
    
    //To axis label
    svg3.append("text")
        .attr("class", "y label")
        //.attr("text-anchor", "end")
        .attr("y", -2*margin2.left)
        .attr("x", -height2/2)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("To")
            .style("font-size" , 40);

    //Create a legend
    var legend = d3.legendColor()
    .cells(7)
    .labelFormat(d3.format(".2f"))
    .scale(colorCell)
    .shapeWidth(50)
    .shapeHeight(50)
    .on('cellover',function(d){
      if(d<0){
        tooltip.style("opacity", 1)
            .html("This value means a negative average sentiment")
            .style("left", (d3.mouse(this)[0]+70) + "px")
            .style("top", (d3.mouse(this)[1]) + "px");
      }
      else if(d==0){
        tooltip.style("opacity", 1)
            .html("This value means a neutral average sentiment")
            .style("left", (d3.mouse(this)[0]+70) + "px")
            .style("top", (d3.mouse(this)[1]) + "px");
      }
      else{
        tooltip.style("opacity", 1)
            .html("This value means a positive average sentiment")
            .style("left", (d3.mouse(this)[0]+70) + "px")
            .style("top", (d3.mouse(this)[1]) + "px");
      }
    })
    .on('cellout', function(d){
        tooltip.style("opacity", 0)
    }); 
  
    //Create an actual svg element for the legend
    svg3.append("g")
      .attr("transform", "translate(-300 ,50)")
      .call(legend)
      .selectAll("text")
          .style("font-family", "Helvetica")
          .attr("fill", "white");

    svg3.selectAll("text")
      .style("font-family", "Helvetica")
      .attr("fill", "white");

    // create a tooltip
    var tooltip = d3.select("#my_dataviz2")
          .append("div")
          .style("opacity", 0)
          .attr("id","tooltip")
          .attr("class", "tooltip")
          .style("z-index", 1000)
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "5px")
          .style("padding", "5px")

    // Three functions that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      if(d.avgSentiment > 0){
        tooltip.style("opacity", 1)
            .html("The average sentiment of the e-mails<br>from " + d.fromEmail + " (" + d.fromJobtitle + ") to " + d.toEmail + " (" + d.toJobtitle + ") is: " + d.avgSentiment + " which means that overall the e-mails were positive.")
            .style("left", (d3.mouse(this)[0]+70) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
      }else if(d.avgSentiment < 0){
        tooltip.style("opacity", 1)
            .html("The average sentiment of the e-mails<br>from " + d.fromEmail + " (" + d.fromJobtitle + ") to " + d.toEmail + " (" + d.toJobtitle + ") is: " + d.avgSentiment + " which means that overall the e-mails were negative.")
            .style("left", (d3.mouse(this)[0]+70) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
      }else if(d.avgSentiment == 0){
        tooltip.style("opacity", 1)
            .html("The average sentiment of the e-mails<br>from " + d.fromEmail + " (" + d.fromJobtitle + ") to " + d.toEmail + " (" + d.toJobtitle + ") is: " + d.avgSentiment + " which means that overall the e-mails were neutral.")
            .style("left", (d3.mouse(this)[0]+70) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
      }
    }

    var mouseleave = function(d) {
        tooltip.style("opacity", 0)
    }

    // add the squares
    svg3.selectAll()
        .data(linksArray)
        .enter()      
        .append("rect")
          .attr("stroke", "black")
	  .attr("class", "selectable")
          .attr("data-From", function(d){
	      return d.fromEmail;
	  })
          .attr("data-To", function(d){
	      return d.toEmail;
          })
          .style('stroke-width', '0.5px')
          .style('stroke-opacity', .5)
          .attr("rx", .75)
          .attr("ry", .75)
          .attr("x", d => x(d.fromEmail))
          .attr("y", d => y(d.toEmail))
          .attr("width", x.bandwidth() )
          .attr("height", y.bandwidth() )
          .style("fill", function(d) { return colorCell(d.avgSentiment)})
        .on("mouseover", mouseover)
        //.on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
	      
	var brushedFrom = [] 
        var brushedTo = []
	       //create an array with the actual svg elements of the matrix
        var selectableElements = Array.from(document.querySelectorAll(".selectable"));
              //console.log(selectableElements)

	    svg3.call( d3.brush()                     // Add the brush feature using the d3.brush function
		  .extent([[0,0],[width2, width2]])       // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
		  .on("start brush", doOnBrush)
  	   )
	      
        function doOnBrush(){
     	    extent = d3.event.selection;  
    	    brushedFrom = [] 
       	    brushedTo = []  
      	    var x1 = extent[0][0];
            var x2 = extent[1][0];
            var y1 = extent[0][1];
            var y2 = extent[1][1];
            selectableElements.forEach(function(d){ 
                 if(x1<=d.getAttribute("x")&&d.getAttribute("x")<=x2&&y1<=d.getAttribute("y")&&d.getAttribute("y")<=y2){
                     brushedFrom.push(d.getAttribute("data-From"))
                     brushedTo.push(d.getAttribute("data-To"))
                 }
            })
	      links
		.style('stroke', function (link){ 
		  if(brushedFrom.includes(link.fromEmail) && brushedTo.includes(link.toEmail)){
		     return color(link.fromJobtitle)
		}})
		.style('stroke-opacity', function (link){ 
		  if(brushedFrom.includes(link.fromEmail) && brushedTo.includes(link.toEmail)){
		     return 5
		}})
		.style('stroke-width', function (link){ 
		  if(brushedFrom.includes(link.fromEmail) && brushedTo.includes(link.toEmail)){
		     return 4
		}})

		nodes
		.style('r', function (node){ 
		  if(brushedFrom.includes(node.name) || brushedTo.includes(node.name)){
		     return 60
		}})
		.style('opacity', function (node){ 
		  if(!(brushedFrom.includes(node.name) && brushedTo.includes(node.name))){
		     return "2%"
		}})
		// .style('stroke-width', function (link){ 
		//   if(brushedFrom.includes(link.fromEmail) && brushedTo.includes(link.toEmail)){
		//      return 4
		// }})
	    }      
      })
    };
    reader.readAsDataURL(input.files[0]);
  };
      

  
