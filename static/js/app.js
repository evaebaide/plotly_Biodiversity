function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
    
  // Use `d3.json` to fetch the metadata for a sample
  
    d3.json(`/metadata/${sample}`).then(function (data) {
    console.log(data);

  // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
    panel.html("")
  
    // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  
    
    Object.entries(data).forEach(([key, value]) => {
    
    d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
      
    });
  
  
  // BONUS: Build the Gauge Chart
  //buildGauge(data.WFREQ);

  
  });

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function (data) {
    console.log(data);

    var trace1 = [{
      type: "scatter",
      mode: "markers",
      name: "Bubble Chart - Belly Button",
      text: data["otu_labels"],
      x: data["data.otu_ids"],
      y: data["sample_values"],
      marker: {
        color: data["otu_ids"],
        size: data["sample_values"],
        colorscale: 'Rainbow'
      },
    }];

    var chart_layout = {
      title: "Bubble Chart for Belly Button",
      xaxis: {
        title: "OTU ID",
      },

      yaxis: {
        title: "Value",
      }
    };


    var BUBBLE = document.getElementById("bubble");
    Plotly.newPlot(BUBBLE, trace1, chart_layout);
 

   // Build a Pie Chart
    // Use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var trace2 = [{
      values: data.sample_values.slice(0, 10),
      labels: data.otu_ids.slice(0, 10),
      hovertext: data.otu_labels.slice(0, 10),
      type: "pie",
      mode:'markers',
      hoverinfo: 'hovertext',
      colorscale: 'rainbow',
      // marker: {
      //   colorscale: "Earth"
      // }
    }];
    var pie_layout = {
      showlegend: true,
      height: 400,
      width: 500
    };
    Plotly.newPlot("pie", trace2, pie_layout);


  });


}    


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
