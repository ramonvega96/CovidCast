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

class LGACardMiniChart extends React.Component {
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
                  radius: 0
              }
            },
            plugins: {
                legend: {
                    display: false
                },
                labels: {
                    display: false
                },
                title: {
                  display: true,
                  text: 'Reported COVID-19 Cases',
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

        const labels = Array(this.props.data.length).join(".").split(".");;

		const data = {
            labels,
            datasets: [
              {
                label: 'Covid Cases',
                lineTension: 0.4,
                borderWidth: 1,
                data: this.props.data,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
              },
            ],
          };
          
          return <Line options={options} data={data} />;
	}
}

export default LGACardMiniChart;