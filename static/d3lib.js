var app = angular.module("Crime", []); 
app.controller("myApp", function($scope) {
        $scope.getJsonResponse = function() {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "static/data.json", true);
            xmlhttp.send();
            xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var myObj = JSON.parse(this.responseText);
                var flags = [];
                
                myObj.forEach(function(item){ 

                    if(flags[item.OFFENSE_CODE_GROUP]){
                        
                    }
                    else{
                        flags[item.OFFENSE_CODE_GROUP] = true;
                        $scope.output.push(item.OFFENSE_CODE_GROUP);
                    }   
                }); 
                $scope.$apply(function(){$scope.message = $scope.output;});

                $scope.datasetDoNut = $scope.doNutDataSet(myObj,$scope.output);

                $scope.path = svg.selectAll("path")
                    .data(pie($scope.datasetDoNut[Object.keys($scope.datasetDoNut).reverse()[0]]))
                    .enter().append("path")
                    .attr("fill", function(d, i) { return color(i); })
                    .attr("d", arc)
                    .each(function(d) { this._current = d; }); // store the initial values
                
                console.log("$scope.getDateLegend",$scope.datasetDoNut);
                $scope.$apply(function(){$scope.getWeekValue = $scope.datasetDoNut[Object.keys($scope.datasetDoNut).reverse()[0]]});
                //$scope.$apply(function(){$scope.getWeekValue = $scope.datasetDoNut["Other"]});
                

                    var newData = [{
                        count: 1,
                        emote: "OneTwoThree"
                      }, {
                        count: 1,
                        emote: "FourFiveSix"
                      }, {
                        count: 1,
                        emote: "SevenEightNine"
                      }, {
                        count: 15,
                        emote: "TenElevenTwelve"
                      },
                
                    ]
                return $scope.output;
            }
        }
        
      };

      $scope.doNutDataSet = function(myObj,key) {
        var dataSet = {};
        var bardataSet = {};
        var barData = [];
        
        key.forEach(function(id){ 
            var Mon=0, Tue=0, Wed=0, Thu=0, Fri=0, Sat=0, Sun=0;
        myObj.forEach(function(item){     
            if(item.OFFENSE_CODE_GROUP == id && item.DAY_OF_WEEK == "Monday"){
                Mon++
            }
            if(item.OFFENSE_CODE_GROUP == id && item.DAY_OF_WEEK == "Tuesday"){
                Tue++
            }
            if(item.OFFENSE_CODE_GROUP == id && item.DAY_OF_WEEK == "Wednesday"){
                Wed++
            }
            if(item.OFFENSE_CODE_GROUP == id && item.DAY_OF_WEEK == "Thursday"){
                Thu++
            }
            if(item.OFFENSE_CODE_GROUP == id && item.DAY_OF_WEEK == "Friday"){
                Fri++
            }
            if(item.OFFENSE_CODE_GROUP == id && item.DAY_OF_WEEK == "Saturday"){
                Sat++
            }
            if(item.OFFENSE_CODE_GROUP == id && item.DAY_OF_WEEK == "Sunday"){
                Sun++
            }
        });
            var day_of_week = [Mon,Tue,Wed,Thu,Fri,Sat,Sun];
            var sumofDayOfWeek = Mon+Tue+Wed+Thu+Fri+Sat+Sun;
            dataSet[id] = day_of_week;
            bardataSet[id] = sumofDayOfWeek;
            barData.push({"name":id,"value":sumofDayOfWeek,"label":id});
        });

    
          var pie = new d3pie("pie", {
            data: {
              content: barData
            }
          });  


            return dataSet;
      };


   
        $scope.readCSV = function() {
                    
            $scope.output = [];
            
            $scope.getDate = $scope.getJsonResponse();
        
        };
    
        $scope.processData = function(allText) {
            // split content based on new line
            var allTextLines = allText.split(/\r\n|\n/);
            var headers = allTextLines[0].split(',');
            var lines = [];
    
            for ( var i = 0; i < allTextLines.length; i++) {
                // split content based on comma
                var data = allTextLines[i].split(',');
                if (data.length == headers.length) {
                    var tarr = [];
                    for ( var j = 0; j < headers.length; j++) {
                        tarr.push(data[j]);
                    }
                    lines.push(tarr);
                }
            }
            $scope.data = lines;
        };

    
    var width = 400,
      height = 400,
      radius = Math.min(width, height) / 2;
      
    
    var enterAntiClockwise = {
      startAngle: Math.PI * 2,
      endAngle: Math.PI * 2
    };
    
    var color = d3.scale.category20();
    
    var pie = d3.layout.pie()
      .sort(null);
    
    var arc = d3.svg.arc()
      .innerRadius(radius - 100)
      .outerRadius(radius - 20);
    
    var svg = d3.select("#chartDiv").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
    
    
    d3.selectAll("input").on("change", change);
    
    var timeout = setTimeout(function() {
      d3.select("input[value=\"oranges\"]").property("checked", true).each(change);
    }, 2000);


    $scope.radioButtonChange = function(value) {
        change(value);
   }

    function change(value) {
      clearTimeout(timeout);
      $scope.getWeekValue = $scope.datasetDoNut[value]
      path = $scope.path.data(pie($scope.datasetDoNut[value])); // update the data
      // set the start and end angles to Math.PI * 2 so we can transition
      // anticlockwise to the actual values later
      path.enter().append("path")
          .attr("fill", function (d, i) {
            return color(i);
          })
          .attr("d", arc(enterAntiClockwise))
          .each(function (d) {
            this._current = {
              data: d.data,
              value: d.value,
              startAngle: enterAntiClockwise.startAngle,
              endAngle: enterAntiClockwise.endAngle
            };
          }); // store the initial values
    
      path.exit()
          .transition()
          .duration(500)
          .attrTween('d', arcTweenOut)
          .remove() // now remove the exiting arcs
    
      path.transition().duration(500).attrTween("d", arcTween); // redraw the arcs
    }
    
    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.
    function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
      return arc(i(t));
      };
    }
    // Interpolate exiting arcs start and end angles to Math.PI * 2
    // so that they 'exit' at the end of the data
    function arcTweenOut(a) {
      var i = d3.interpolate(this._current, {startAngle: Math.PI * 2, endAngle: Math.PI * 2, value: 0});
      this._current = i(0);
      return function (t) {
        return arc(i(t));
      };
    }
});

app.controller("myPie", function($scope) {
  
});