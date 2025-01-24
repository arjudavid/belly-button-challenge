const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Initialize the dashboard
function init() {
  d3.json(url).then(data => {
    const names = data.names;

    // Populate dropdown menu
    const dropdown = d3.select("#selDataset");
    names.forEach(name => {
      dropdown.append("option").text(name).property("value", name);
    });

    // Initialize charts and metadata with the first sample
    const firstSample = names[0];
    updateCharts(firstSample);
    updateMetadata(firstSample);
  });
}

// Update charts when a new sample is selected
function optionChanged(newSample) {
  updateCharts(newSample);
  updateMetadata(newSample);
}

// Update the bar and bubble charts
function updateCharts(sample) {
  d3.json(url).then(data => {
    const samples = data.samples;
    const selectedSample = samples.find(s => s.id === sample);

    // Bar chart
    const barData = [{
      x: selectedSample.sample_values.slice(0, 10).reverse(),
      y: selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: selectedSample.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];
    const barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
      margin: { t: 30, l: 150 }
    };
    Plotly.newPlot("bar", barData, barLayout);

    // Bubble chart
    const bubbleData = [{
      x: selectedSample.otu_ids,
      y: selectedSample.sample_values,
      text: selectedSample.otu_labels,
      mode: "markers",
      marker: {
        size: selectedSample.sample_values,
        color: selectedSample.otu_ids,
        colorscale: "Earth"
      }
    }];
    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
      margin: { t: 30 }
    };
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// Update demographic info
function updateMetadata(sample) {
  d3.json(url).then(data => {
    const metadata = data.metadata;
    const selectedMetadata = metadata.find(m => m.id === parseInt(sample));

    // Clear existing metadata
    const metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");

    // Add key-value pairs to the panel
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  });
}

// Initialize the dashboard
init();

