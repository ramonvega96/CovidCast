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
            maintainAspectRatio: false,
            elements: {
              point:{
                  radius: 2
              }
            },          
            plugins: {
              legend: {
                  display: false
              },
              title: {
                display: true,
                text: 'Last 30 Days Infections + Next '+ Object.keys(this.props.data.forecast).length + ' Days Forecast',
                position: 'bottom',
                font: {
                  size: 20
                },
                padding: {
                    top: 5,
                    bottom: 10,
                },
              },
            },
            interaction: {
              intersect: false,
              mode: 'index',
            },
            scales: {
              x: {
                grid: {
                  display: false
                }
              },
            }
          };

        
        let labels = [];
        let dataPoints = [];

        let tempLabels = Object.keys(this.props.data.last_100);
        for (let i = 0; i < tempLabels.length; i++) { 
          dataPoints.push(this.props.data.last_100[tempLabels[i]]);
          labels.push("");
        }

        tempLabels = Object.keys(this.props.data.forecast);
        for (let i = 0; i < tempLabels.length; i++) {
          if(this.props.data.forecast[tempLabels[i]]["yhat"] > 0) dataPoints.push(Math.round(this.props.data.forecast[tempLabels[i]]["yhat"]));
          else dataPoints.push(0);
          labels.push("");
        }

        const data = {
                labels,
                datasets: [
                  {
                    label: 'Covid Cases',
                    lineTension: 0.4,
                    data: dataPoints,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    segment: {
                      borderColor: (ctx) => {
                        return ctx.p1DataIndex >= 30 ? 'rgb(0,0,0,0.2)' : undefined
                      },
                      borderDash: (ctx) => {
                        return ctx.p1DataIndex >= 30 ? [6, 3] : undefined
                      }
                    }
                  },
                ],
              };
          
          return <Line options={options} data={data} />;
	}
}

export default LGAForecastChart;