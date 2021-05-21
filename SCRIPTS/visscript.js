
  // set the dimensions and margins of the graph
  var margin = {top: 100, right: 50, bottom: 160, left: 50},
    width = 1800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", '100%')
      .attr("height", "100%")
      .call(d3.zoom().on("zoom", function () {
       svg.attr("transform", d3.event.transform)
        }))
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  
  // Read dummy data

  // Input data

    var openFile = function(event) {
    var input = event.target;
    let tokeep = ["Employee", "Vice President", "Manager", "Unknown","President","Trader","CEO","Managing Director","Director","In House Lawyer"];
    var reader = new FileReader();
    reader.onload = function(){
      var dataURL = reader.result;
      document.getElementById("checkbox").style.display = "block";
      document.getElementById("namea").style.display = "block";
      document.getElementById("nameb").style.display = "block";
      d3.csv(dataURL, function( data) {
        //data = data.filter(function(d,i){ return i<1000 })
        data = data.sort(function (a,b) {return d3.ascending(a.fromJobtitle, b.fromJobtitle);});
        tokeep.sort();
        data = data.filter(function(d,i){ return tokeep.indexOf(d.fromJobtitle) >= 0 })
        const ceobutton = document.getElementById("CEO");
        ceobutton.addEventListener("click", function(){
        if (!ceobutton.checked){
          tokeep.splice(tokeep.indexOf("CEO"), 1)
        }else{
          tokeep.push("CEO");
        }
          tokeep.sort();
        });
    
        const vpbutton = document.getElementById("Vice President");
        vpbutton.addEventListener("click", function(){
            if (!vpbutton.checked){
                tokeep.splice(tokeep.indexOf("Vice President"), 1)
            }else{
                tokeep.push("Vice President");
            }
            tokeep.sort();
        });
        const empbutton = document.getElementById("Employee");
        empbutton.addEventListener("click", function(){
            if (!empbutton.checked){
                tokeep.splice(tokeep.indexOf("Employee"), 1)
            }else{
                tokeep.push("Employee");
            }
            tokeep.sort();
        });
    
        const manbutton = document.getElementById("Manager");
        manbutton.addEventListener("click", function(){
            if (!manbutton.checked){
                tokeep.splice(tokeep.indexOf("Manager"), 1)
            }else{
                tokeep.push("Manager");
            }
            tokeep.sort();
        });
    
        const unkbutton = document.getElementById("Unknown");
        unkbutton.addEventListener("click", function(){
            if (!unkbutton.checked){
                tokeep.splice(tokeep.indexOf("Unknown"), 1)
            }else{
                tokeep.push("Unknown");
            }
            tokeep.sort();
        });
    
        const prebutton = document.getElementById("President");
        prebutton.addEventListener("click", function(){
            if (!prebutton.checked){
                tokeep.splice(tokeep.indexOf("President"), 1)
            }else{
                tokeep.push("President");
            }
            tokeep.sort();
        });
    
        const trabutton = document.getElementById("Trader");
        trabutton.addEventListener("click", function(){
            if (!trabutton.checked){
                tokeep.splice(tokeep.indexOf("Trader"), 1)
            }else{
                tokeep.push("Trader");
            }
            tokeep.sort();
        });
    
        const madbutton = document.getElementById("Managing Director");
        madbutton.addEventListener("click", function(){
            if (madbutton.checked == false){
                tokeep.splice(tokeep.indexOf("Managing Director"), 1)
            }else{
                tokeep.push("Managing Director");
            }
            tokeep.sort();
        });
    
        const dirbutton = document.getElementById("Director");
        dirbutton.addEventListener("click", function(){
            if (dirbutton.checked == false){
                tokeep.splice(tokeep.indexOf("Director"), 1)
            }else{
                tokeep.push("Director");
            }
            tokeep.sort();
        });
    
        const ihlbutton = document.getElementById("In House Lawyer");
        ihlbutton.addEventListener("click", function(){
            if (ihlbutton.checked == false){
                tokeep.splice(tokeep.indexOf("In House Lawyer"), 1)
                svg.selectAll(".CEO").remove()
            }else{
                tokeep.push("In House Lawyer");
            }
            tokeep.sort();
        });

        // List of node names
        var allNodes = data.map(function(d){return d.fromEmail.replace(/@enron.com/g, "")})
      
        // List of groups
        var allGroups = data.map(function(d){return d.fromJobtitle})
        allGroups = [...new Set(allGroups)]
      
        // A color scale for groups:
        var color = d3.scaleOrdinal()
          .domain(allGroups)
          .range(d3.schemeSet3);
      
        // A linear scale for node size
        var size = d3.scaleLinear()
          .domain([1,10])
          .range([2,10]);
      
        // A linear scale to position the nodes on the X axis
        var x = d3.scalePoint()
          .range([0, width + 5000])
          .domain(allNodes)
      
        // In my input data, links are provided between nodes -id-, NOT between node names.
        // So I have to do a link between this id and the name
        var idToNode = {};
        data.forEach(function (n) {
          idToNode[n.fromId] = n;
        });
        var idToNode2 = {};
        data.forEach(function (n) {
          idToNode2[n.toId] = n;
        });
        console.log(idToNode)
        // Add the links
        var links = svg
          .selectAll('mylinks')
          .data(data)
          .enter()
          .append('path')
          .attr('d', function (d) {
            start = x(idToNode[d.fromId].fromEmail.replace(/@enron.com/g, ""))    // X position of start node on the X axis
            let end = x(idToNode2[d.toId].toEmail.replace(/@enron.com/g, ""))      // X position of end node
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
          .data(data.sort(function(a,b) { return +b.fromId - +a.fromId }))
          .enter()
          .append("circle")
            .attr("cx", function(d){ return(x(d.fromEmail.replace(/@enron.com/g, "").replace(/@enron.com/g, "")))})
            .attr("cy", height-30)
            .attr("r", function(d){ return(size(d.fromId)/3)})
            .style("fill", function(d){ return color(d.fromJobtitle)})
            .attr("stroke", "white")
            .style("opacity", 1)
      
        // And give them a label
        var labels = svg
          .selectAll("mylabels")
          .data(data)
          .enter()
          .append("text")
            .attr("x", "0px")
            .attr("y", 0)
            .text(function(d){ return(d.fromEmail.replace(/@enron.com/g, ""))} )
            .style("text-anchor", "end")
            .attr("transform", function(d){ return( "translate(" + (x(d.fromEmail.replace(/@enron.com/g, ""))) + "," + (height-15) + ")rotate(-45)")})
            .style("font-size", 50)
            .style("fill","white")
      
        // Add the highlighting functionality
        nodes
          .on('mouseover', function (d) {
            // Highlight the nodes: every node is green except of him
            nodes
                .style('opacity', "2%")
              d3.select(this)
                .style('opacity', 1)
            // Highlight the connections
            links
              .style('stroke', function (link_d) { return link_d.fromEmail === d.fromEmail || link_d.toEmail === d.fromEmail ? color(d.fromJobtitle) : '#b8b8b8';})
              .style('stroke-opacity', function (link_d) { return link_d.fromEmail === d.fromEmail || link_d.toEmail === d.fromEmail ? 5 : .2;})
              .style('stroke-width', function (link_d) { return link_d.fromEmail === d.fromEmail || link_d.toEmail === d.fromEmail ? 4 : 1;})
            labels
              .style("font-size", function(label_d){ return label_d.fromEmail === d.fromEmail ? 200 : 2 } )
              .attr("y", function(label_d){ return label_d.fromEmail === d.fromEmail ? 12 : 0 } )
              .attr("x", "-30px")
              .style("fill", function(d){ return color(d.fromJobtitle)})

      
          })
          .on('mouseout', function (d) {
            nodes.style('opacity', 1)
            links
              .style('stroke', 'grey')
              .style('stroke-opacity', .8)
              .style('stroke-width', '1')
            labels
              .style("font-size", 50 )
      
          })
          svg.selectAll("nodes")
            .data(tokeep)
            .enter()
            .append('circle')
              .attr("cx",-1230)
              .attr("cy", function(d,i){ return -1100 + i*150}) // 100 is where the first dot appears. 25 is the distance between dots
              .attr("r", 50)
              .style("fill", function(d){ return color(d)})
              .attr("position", "fixed")
            .on('mouseout', function(d){
              nodes.style("opacity", .2)
              d3.select(this)
                .style("opacity",1)
            })
              
          svg.selectAll("labels")
            .data(tokeep)
            .enter()
            .append("text")
              .attr("x", -1160)
              .attr("y", function(d,i){ return -1080 + i*150}) // 100 is where the first dot appears. 25 is the distance between dots
              .style("fill", function(d){ return color(d)})
              .text(function(d){ return d})
              .attr("text-anchor", "left")
              .style("alignment-baseline", "middle")
              .style("font-size", "150px");

      })
      const nrOfIds = 149

      // set the dimensions and margins of the graph
      var margin2 = {top: 35, right: 10, bottom: 5, left: 35},
        width2 = 600 - margin2.left - margin2.right,
        height2 = 600 - margin2.top - margin2.bottom;

      // append the svg object to the body of the page
      var svg2 = d3.select("#my_dataviz2")
      .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .call(d3.zoom().on("zoom", function () {
       svg2.attr("transform", d3.event.transform)
        }))
      .style("background-color", "transparent")
      .append("g")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

      //Creates array with ID's
      function range(start, end) {
          return Array(end - start + 1).fill().map((_, idx) => start + idx)
          }

      //Array of ID's (1 to 149)
      var Ids = range(1, nrOfIds);
      console.log(Ids);

      // Build X scales and axis:
      var x = d3.scaleBand()
        .range([ 0, width2+1200 ])
        .domain(Ids)
        .padding(0.01);

      svg2.append("g")
        .style("stroke", "white")
        .call(d3.axisTop(x))
        .selectAll("text")
          .attr("transform", "rotate(-90)")
          .attr("x", "14px")
          .attr("y", "3px");
          

      // Build Y scales and axis:
      var y = d3.scaleBand()
        .range([ 0, height2+1200 ])
        .domain(Ids)
        //.style("fill", "white")
        .padding(0.01);
      svg2.append("g")
        .style("stroke", "white")
        .call(d3.axisLeft(y));
        
      
      svg2.selectAll("line")
        .style("stroke", "white");


      //From text
      svg2.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "end")
          .attr("x", (width2+1200)/2)
          .attr("y", -margin2.top/0.8)
          .text("From")
              .style("font-size" , 40);
      //To text
      svg2.append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("y", -(margin2.left)/(0.8))
          .attr("x", -(height2+1200)/2)
          .attr("dy", "20px")
          .attr("transform", "rotate(-90)")
          .text("To")
              .style("font-size" , 40);
        
     svg2.selectAll("text")
            .style("font-family", "Helvetica")
            .attr("fill", "white");

        

      // Build color scale
      var myColor = d3.scaleLinear()
          .range(["yellow", "white", "rgb(61, 149, 179)"])
          .domain([-0.03, 0, 0.03])

      //Read the data
      d3.csv(dataURL, function(data) {
          //Group the data. nestedData is an array with everyone (fromId's) who sent at least 1 email containing the list of people that the person sent the email(s) to. Each recipient itself (toId's) is a list with all emails received from that specific fromId, totalMails, totalSentiment and avgSentiment.
        var nestedData = d3.nest()
            .key(d => d.fromId)
            .key(d => d.toId)
            .rollup(function(v) { return {
                mails: v,
                totalMails: v.length,
                totalSentiment: d3.sum(v, function(d) { return d.sentiment;                                }),
                avgSentiment: d3.mean(v, function(d) { return d.sentiment;})};})
            .entries(data);

        //Look at the console to get a better understanding of nestedData.
        console.log(nestedData);

        //To be able to correctly add all the squares to the adjacency matrix, we have to create seperate objects for each fromId to each distinct toId. E.g. all emails that 96 sent to 77 in one object.
        var groupedData = [];
        //For each fromId we extract the list of people that they sent emails to (fromId.values).
        nestedData.forEach(function (fromId) {
        //Then for each toId in fromId.values we create a new object called groupedMails containing the fromId, toId and some metadata (mails, totalMails, totalSentiment and avgSentiment).
        //We could add more information to this object, or simplify it.
            fromId.values.forEach(function(toId) {
                var groupedMails = {
                    fromId: fromId.key,
                    toId: toId.key,
                    fromEmail: toId.value.mails[0].fromEmail,
                    toEmail: toId.value.mails[0].toEmail,
                    metadata: toId
                };
                //Add the object to the groupedData array
                groupedData.push(groupedMails);
            })
        })
        //Look at the console to get a better understanding of all objects in groupedData.
        console.log(groupedData);
        
        
        
        //Create a legend
        var legend = d3.legendColor()
          .cells(7)
          .labelFormat(d3.format(".2f"))
          .scale(myColor)
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
        
      //Create an actual svg el. for the legend
      svg2.append("g")
        .attr("transform", "translate(-200 ,50)")
        .call(legend)
        .selectAll("text")
            .style("font-family", "Helvetica")
            .attr("fill", "white");
            

      


        // create a tooltip
        var tooltip = d3.select("#my_dataviz2")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three functions that change the tooltip when user hover / move / leave a cell
        var mouseover = function(d) {
          if(d.metadata.value.avgSentiment > 0){
            tooltip.style("opacity", 1)
                .html("The average sentiment of the e-mails<br>from " + d.fromEmail.replace(/@enron.com/g, "") + " (" + d.fromId + ") to " + d.toEmail.replace(/@enron.com/g, "") + " (" + d.toId + ") is: " + d.metadata.value.avgSentiment+ " which means that the e-mail was positive.")
                .style("left", (d3.mouse(this)[0]+70) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
          }else if(d.metadata.value.avgSentiment < 0){
            tooltip.style("opacity", 1)
                .html("The average sentiment of the e-mails<br>from " + d.fromEmail.replace(/@enron.com/g, "") + " (" + d.fromId + ") to " + d.toEmail.replace(/@enron.com/g, "") + " (" + d.toId + ") is: " + d.metadata.value.avgSentiment+ " which means that the e-mail was negative.")
                .style("left", (d3.mouse(this)[0]+70) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
          }else if(d.metadata.value.avgSentiment == 0){
            tooltip.style("opacity", 1)
                .html("The average sentiment of the e-mails<br>from " + d.fromEmail.replace(/@enron.com/g, "") + " (" + d.fromId + ") to " + d.toEmail.replace(/@enron.com/g, "") + " (" + d.toId + ") is: " + d.metadata.value.avgSentiment+ " which means that the e-mail was neutral.")
                .style("left", (d3.mouse(this)[0]+70) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
          }

        }

        //var mousemove = function(d) {
            //tooltip
            //  .html("The average sentiment of the e-mails<br>from " + d.fromEmail + " (" + d.fromId + ") to " + d.toEmail + " (" + d.toId + ") is: " + d.metadata.value.avgSentiment)
            //	.style("left", (d3.mouse(this)[0]+70) + "px")
            // 	.style("top", (d3.mouse(this)[1]) + "px")
        //}

        var mouseleave = function(d) {
            tooltip.style("opacity", 0)
        }

        // add the squares
        svg2.selectAll()
            .data(groupedData)//, function(d) {return d.key + d.values.key;})
            .enter()      
            .append("rect")
              //.attr("stroke", "black")
              //.style('stroke-width', '0.5px')
              .style('stroke-opacity', .5)
              .attr("rx", .75)
              .attr("ry", .75)
              .attr("x", d => x(d.fromId))
              .attr("y", d => y(d.toId))
              .attr("width", x.bandwidth() )
              .attr("height", y.bandwidth() )
              .style("fill", function(d) { return myColor(d.metadata.value.avgSentiment)})
            .on("mouseover", mouseover)
            //.on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
      })
    };
    reader.readAsDataURL(input.files[0]);
  };


  
