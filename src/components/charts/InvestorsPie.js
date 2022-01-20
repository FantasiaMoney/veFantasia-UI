import React from 'react'
import { Pie } from 'react-chartjs-2'

function InvestorsPie(props) {
  return(
    <Pie data={
      {
        labels:props.chart.labels,
        datasets: [{
        data: props.chart.data,
        hoverBorderWidth:2,
        hoverBorderColor:'rgba(63, 81, 181, 0.8)',
        backgroundColor: [
        '#36A2EB',
        '#00f5d1',
        "#4251b0",
        "#50119e",
        "#10cdeb",
        "#00c0aa",
        "#8b25d2"
        ],
        hoverBackgroundColor: [
        '#36A2EB',
        '#00f5d1',
        "#4251b0",
        "#50119e",
        "#10cdeb",
        "#00c0aa",
        "#8b25d2"
        ]
        }]
      }
    } />
  )
}

export default InvestorsPie
