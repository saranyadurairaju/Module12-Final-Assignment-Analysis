function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples; 
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(samplesArray)

    // (3) 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var sampleOne = samplesArray[0];

    // (3) 2. Create a variable that holds the first sample in the metadata array.
    var metadata = metadataArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleOtuID = sampleOne.otu_ids;
    
    var sampleOtuLabel = sampleOne.otu_labels;
    
    var sampleValues = sampleOne.sample_values;
    
    // (3) 3. Create a variable that holds the washing frequency.
    var washfreq = (metadata.wfreq).toFixed(2);
    console.log(washfreq);

    // ************BAR CHART**************

          
    // //Another way to create a x axis values:::
    // sort = sampleValues.sort((a, b) => b - a);
    // data = sort.slice(0, 10);
    // xticks = data.reverse(); 
    // OTU stands for Operational Taxonomic Unit 
    // Slice the first 10 objects and Reverse the array due to Plotly's defaults

    var xticks = sampleValues.slice(0, 10).reverse();

    // 7. Create the yticks for the bar chart.

    var yticks= sampleOtuID.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
 
    // Bar chart data details
    var barData = [{
      x: xticks,
      y: yticks,
      text: sampleOtuLabel,
      name: "OTU",
      type: "bar",
      orientation: "h"
    }];
  
    // Apply the group bar mode to the layout
    var barLayout = {
      title: {text: "Top 10 Bacteria Cultures Found", align: "Left"},
      margin: {
        l: 120,
        r: 120,
        t: 50,
        b: 30
      }
    };
    Plotly.newPlot("bar", barData, barLayout);
    
    
    // ************BUBBLE CHART**************
    
    // (2) 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: sampleOtuID,
      y: sampleValues,
      text: sampleOtuLabel,
      mode: 'markers',
      marker: {
          size: sampleValues,
          color: sampleOtuID,
          colorscale: "Earth"       
      }}
    ];

    // (2) 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title : 'OTU ID'},
      hovermode: 'closest'
    };

    // (2) 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 


    // ************GUAGE CHART**************

    // (3) 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: washfreq,
        title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
        gauge: {
          axis: { range: [null, 10] },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "yellowgreen" },
            { range: [8, 10], color: "green" }
          ]
        }
      }
    ];

    // (3) 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, 
      height: 500
      // margin: { t: 2, b: 2 }
    };

    // (3) 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot(gauge, gaugeData,gaugeLayout); 

  });
}
