import React from "react";
import Chart from "chart.js/auto";

class DoughnutChart extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.title = "Wheel Of Emotions";
    this.dataLength = props.data?.map((values) => values.length);
    this.data = {
      labels: props.labels,
      datasets: [
        {
          label: this.title,
          data: this.dataLength,
          backgroundColor: props.colors,
          hoverOffset: 4,
        },
      ],
    };
  }

  componentDidUpdate() {
    // this.myChart.data.labels = this.props.data.map(d => d.label)
    // this.myChart.data.datasets[0].data = this.props.data.map(d => d.value)
    // this.myChart.update()
  }

  componentDidMount() {
    const _this = this;

    /*
      Custom plugin for chartjs
      Ref: https://www.youtube.com/watch?v=E8pSF9JrEvE
    */
    const counter = {
      id: "counter",
      beforeDraw(chart, args, options) {
        const {
          ctx,
          chartArea: { top, width, height },
        } = chart;
        ctx.save();
        ctx.font = `${options.fontSize} ${options.fontFamily}`;
        ctx.textAlign = options.textAlign;
        ctx.fillStyle = options.color;
        ctx.fillText(
          _this.dataLength?.reduce((a, b) => a + b),
          width / 2,
          top + height / 2
        );
      },
    };

    Chart.defaults.font.family = "Poppins";
    Chart.defaults.font.size = window.innerWidth > 768 ? 13 : 12;
    Chart.defaults.font.color = "#2b2b2b";
    this.myChart = new Chart(this.chartRef.current.getContext("2d"), {
      type: "doughnut",
      plugins: [counter],
      options: {
        animation: false,
        maintainAspectRatio: true,
        responsive: true,
        layout: {
          padding: {
            top: 40,
          },
        },
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: this.title,
            color: "#2b2b2b",
            font: {
              weight: "500",
            },
          },
          counter: {
            fontSize: window.innerWidth > 768 ? "18px" : "16px",
            fontFamily: "Poppins",
            color: "#2b2b2b",
            textAlign: "center",
          },
        },
      },
      data: this.data,
    });
  }

  componentDidUnMount() {
    this.myChart.destroy();
  }

  render() {
    return <canvas id="doughnutChart" ref={this.chartRef} />;
  }
}

export default DoughnutChart;
