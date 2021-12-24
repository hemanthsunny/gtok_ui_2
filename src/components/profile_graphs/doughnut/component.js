import React from 'react'
import Chart from 'chart.js/auto'

class DoughnutChart extends React.Component {
  constructor (props) {
    super(props)
    this.chartRef = React.createRef()
    this.data = {
      labels: props.labels,
      datasets: [{
        label: props.title,
        data: props.data,
        backgroundColor: props.colors,
        hoverOffset: 4
      }]
    }
  }

  componentDidUpdate () {
    // this.myChart.data.labels = this.props.data.map(d => d.label)
    // this.myChart.data.datasets[0].data = this.props.data.map(d => d.value)
    // this.myChart.update()
  }

  componentDidMount () {
    this.myChart = new Chart(this.chartRef.current.getContext('2d'), {
      type: 'doughnut',
      options: {
        animation: false,
        maintainAspectRatio: true,
        responsive: true,
        layout: {
          padding: {
            top: 40
          }
        },
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: this.props.title
          }
        }
      },
      data: this.data
    })
  }

  componentDidUnMount () {
    this.myChart.destroy()
  }

  render () {
    return <canvas id='doughnutChart' ref={this.chartRef} />
  }
}

export default DoughnutChart
