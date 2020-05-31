function init() {
  var selector = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    optionChanged(sampleNames[0]);
 })}
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result);
    var PANEL = d3.select("#sample-metadata");
    // clear any existing metadata
    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}:${value}`);
    });
  });
  }
  function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      // first isolate the top 10 species
      //var samples = data.samples;
      //var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      //var result = resultArray[0];
      //var otu_ids = result.otu_ids;
      //var otu_labels = result.otu_labels;
      //var sample_values = result.sample_values;
      
      var samples = data.samples;
      console.log(samples);
      console.log(data);
      var filterData = samples.filter(sampleObj => sampleObj.id === sample);
      // var filterData = samples.filter(sampleObj => sampleObj.id === id);
      // var result = resultArray[0];
      console.log(filterData);
      var result = filterData[0];
      
      console.log(result)
      var trace = [{
        x: result.sample_values.slice(0,10),
        y: result.otu_ids.map(sample => "OTU " + sample.toString()).slice(0,10),
        text: result.otu_labels,
        name: "otu",
        type: "bar",
        orientation: "h"
      }];
      var layoutBar = {
          yaxis: {
            autorange:"reversed"
          }
      }
      Plotly.newPlot("bar", trace, layoutBar);


      var trace2 = {
        x: result.otu_ids,
        y: result.sample_values,
        mode: 'markers',
        marker: {
          size: result.sample_values,
          color: result.otu_ids
        }
      };
      var data = [trace2];
      var layout = {
        title: 'Marker Size',
        showlegend: false,
        height: 600,
        width: 1200
      };
        
      Plotly.newPlot('bubble', data, layout,);
    });
  };    

init();