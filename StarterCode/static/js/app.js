function Metadata(sample){
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");

        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key}: ${value}`);
        });

    });
} 



function Charts(sample) {
    d3.json("samples.json").then((data) => {
      var samples=data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
      
      
      let bubbleLayout = {
        margin: { t: 0 },
        xaxis: { title: "OTU ID"}
      }
  
      let bubbleData = [
        {
          x: otu_ids,
          y: sample_values,

          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
          }
        }
      ]
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
      
      var yTicks= otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData = [{
          y: yTicks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }];
      
      var barLayout = {
        title: "Top 10 bacteria found",
        margin: { t: 30, l: 100 }
      };
  
      Plotly.newPlot("bar", barData, barLayout);
  });
  }


  function init() {
    var selector = d3.select("#selDataset");
  
    // Use the List of Sample Names to Populate the Select Options
    d3.json("samples.json").then((data) => {
      var sampleNames=data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the First Sample from the List to Build Initial Plots
      var dataSample = sampleNames[0];
      Charts(dataSample);
      Metadata(dataSample);
    });
  }
  
  function optionChanged(testSample) {
    // Fetch New Data Each Time a New Sample is Selected
    Charts(testSample);
    Metadata(testSample);
  }

init();