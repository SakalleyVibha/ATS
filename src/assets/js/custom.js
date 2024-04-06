// var stringifyObject = require('stringify-object')
// var createKeyframe = require('create-keyframe')
// var insertCSS = require('insert-styles')

// function generateKeyframe () {


//   var shakeDistance = Number(
//    (Math.random() * 70).toFixed(0)
//   ) + 30

//   var cssKeyframe
//   cssKeyframe = {
//     0: {
//       transform: 0+'deg'
//     },
//     100: { transform: 30+'deg' }
//   }
//   var keyframeObj = createKeyframe(cssKeyframe)
//   insertCSS(keyframeObj.css, {id: 'animaton-tutorial-keyframe'})

//   jsonDisplay.innerHTML = `@keyframe ${keyframeObj.name} ` +
//    stringifyObject(cssKeyframe, {indent: '  '})
//   userMessage.style.animation = keyframeObj.name + ' ease 3s infinite'
// }

// generateKeyframe();


/*aside js*/
function toggleAside() {
  var aside = document.querySelector('aside');
  aside.style.left = (aside.style.left === '0px') ? '-260px' : '0px';
}


/*apax chart*/
$(document).ready(function () {
  var chart = null;

  function generateData(selection) {
    var data = [];

    switch (selection) {
      case 'week':
        data = [8, 7, 6, 8, 9, 7, 6]; // Example data for a week
        break;
      case 'month':
        data = Array.from({ length: 30 }, () => Math.floor(Math.random() * 8) + 1); // Random data for 30 days
        break;
      case 'day':
        data = [8]; // Example data for a day
        break;
      default:
        break;
    }

    return data;
  }

  // function updateChart() {
  //   var selection = $('#select-option').val();

  //   if (chart) {
  //     chart.updateSeries([{ data: generateData(selection) }]);
  //   } else {
  //     chart = new ApexCharts($('#chart')[0], {
  //       chart: {
  //         type: 'bar',
  //         height: 350
  //       },
  //       series: [{
  //         name: 'Working Hours',
  //         data: generateData(selection)
  //       }],
  //       xaxis: {
  //         categories: selection === 'day' ? ['Today'] : Array.from({ length: 30 }, (_, i) => i + 1)
  //       }
  //     });
  //     chart.render();
  //   }
  // }

  // Update chart when option changes
  // $('#select-option').change(updateChart);

  // Initial chart rendering
  // updateChart();
});



/**********donat**************/
function chunkSize(dataNum, dataTotal) {
  return (dataNum / dataTotal) * 360;
}

function addChunk(chunkSize, donutElement, offset, chunkID, color) {
  $(donutElement).append("<div class='chunk " + chunkID + "'><span></span></div>");
  var offset = offset - 1;
  var sizeRotation = -179 + chunkSize;
  $("." + chunkID).css({
    "transform": "rotate(" + offset + "deg) translate3d(0,0,0)"
  });
  $("." + chunkID + " span").css({
    "transform": "rotate(" + sizeRotation + "deg) translate3d(0,0,0)",
    "background-color": color
  });
}

function iterateChunks(chunkSize, donutElement, offset, dataCount, chunkCount, color) {
  var chunkID = "s" + dataCount + "-" + chunkCount;
  var maxSize = 179;
  if (chunkSize <= maxSize) {
    addChunk(chunkSize, donutElement, offset, chunkID, color);
  } else {
    addChunk(maxSize, donutElement, offset, chunkID, color);
    iterateChunks(chunkSize - maxSize, donutElement, offset + maxSize, dataCount, chunkCount + 1, color);
  }
}

function createDonut(dataElement, donutElement) {
  var listData = [];
  $(dataElement + " span").each(function () {
    listData.push(Number($(this).html()));
  });
  var listTotal = listData.reduce((acc, curr) => acc + curr, 0); // Using reduce to calculate total
  var offset = 0;
  var color = [
    "#0075DE",
    "#2D9DFF",
    "#52B2FE",
    "#71C8FE",
    "#8EDEFF",
  ];

  for (var i = 0; i < listData.length; i++) {
    var size = chunkSize(listData[i], listTotal);
    iterateChunks(size, donutElement, offset, i, 0, color[i]);

    // Change background color of color-box-list
    $(dataElement + " li:nth-child(" + (i + 1) + ") .color-box-list").css("background-color", color[i]); // Set color box background

    offset += size;
  }
}

createDonut(".donutTarget.legend", ".donutTarget.donut");
/********************************************/
const progress = document.querySelector('.progress-done');

progress.style?.width = progress.getAttribute('data-done') + '%';
progress.style?.opacity = 1;

/*****************line js**************/

// Sample data with continuous increase and downward trends
const years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];
const values = [1, 5, 8, 3, 10, 5, 20, 4, 22, 40]; // Adjust values for upward and downward trends

// Create the chart
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: years,
    datasets: [{
      label: 'Value',
      data: values,
      borderColor: '#206BC4',
      backgroundColor: '#71C8FE', // Light blue background
      fill: true,
      tension: 0.8, // Adjust tension for smoother zigzag effect
      cubicInterpolationMode: 'monotone' // Smooth curve mode
    }]
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          // text: 'Year'
        },
        grid: {
          display: false, // Hide x-axis grid lines
        },
      },
      y: {
        title: {
          display: true,
          // text: 'Value'
        },
        grid: {
          display: false, // Hide y-axis grid lines
        },
        min: 0 // Ensure y-axis starts from 0 for continuous increase
      }
    },
    elements: {
      line: {
        borderJoinStyle: 'miter', // Zigzag style
        borderWidth: 1 // Border width for zigzag effect
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        // text: 'Continuous Increase Line Chart with Zigzag Downward Trends'
      }
    }
  }
});
