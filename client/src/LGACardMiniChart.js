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
import faker from 'faker';

class LGACardMiniChart extends React.Component {
	render() {

        ChartJS.register(
            CategoryScale,
            LinearScale,
            PointElement,
            LineElement,
            Tooltip,
            Legend
        );

        const options = {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                labels: {
                    display: false
                }
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

        const labels = ['', '', '', '', '', '', '', '', '', ''];

		const data = {
            labels,
            datasets: [
              {
                label: 'Dataset 2',
                data: this.props.data.split(","),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
              },
            ],
          };
          
          return <Line options={options} data={data} />;
	}
}

export default LGACardMiniChart;