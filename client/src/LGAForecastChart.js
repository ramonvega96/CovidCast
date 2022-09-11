import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
import { Line } from 'react-chartjs-2';

class LGAForecastChart extends React.Component {
	render() {

        ChartJS.register(
            CategoryScale,
            LinearScale,
            PointElement,
            LineElement,
            Tooltip,
            Legend,
            Title
        );



        const options = {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                labels: {
                    display: false
                },
                title: {
                  display: true,
                  text: 'Next '+ Object.keys(this.props.data).length + ' days',
                  font: {
                    size: 20
                  },
                  padding: {
                      top: 10,
                      bottom: 10,
                  },
                },
            },
            scales: {
                x: {
                  grid: {
                    display: false
                  }
                },
                y: {
                  grid: {
                    display: false
                  }
                }
              }
          };

        const tempLabels = Object.keys(this.props.data);
        let labels = [];
        let dataPoints = [];

        for (let i = 0; i < tempLabels.length; i++) { 
          dataPoints.push(this.props.data[tempLabels[i]]["yhat"]);
          if(i === 0 || i === tempLabels.length - 1) labels.push(tempLabels[i].split(" ")[0]);
          else labels.push("");
        }

        const data = {
                labels,
                datasets: [
                  {
                    label: 'Covid Cases',
                    data: dataPoints,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                  },
                ],
              };
          
          return <Line options={options} data={data} />;
	}
}

export default LGAForecastChart;