import React from "react";
import Chart from "chart.js/auto";
import moment from "moment";
import _ from "lodash";
import "./style.css";

import { dateFormat } from "constants/localization";

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();

    this.currentMonth = 0;
    this.totalMonths = window.innerWidth > 768 ? 12 : 6;
    this.data = {
      labels: this.labels(),
      datasets: this.formatDatasetValues(),
    };

    this.options = {
      radius: 2,
      responsive: true,
      aspectRatio: 1.75,
      plugins: {
        legend: {
          display: false
        }
      },
      tooltips: {
        mode: "label",
      },
      hover: {
        mode: "dataset",
      },
      scales: {
        x: {
          ticks: {
            padding: 10
          }
        }
      }
    };
  }

  componentDidUpdate() {
    // this.myChart.data.labels = this.props.data.map(d => d.label)
    // this.myChart.data.datasets[0].data = this.props.data.map(d => d.value)
    // this.myChart.update()
  }

  componentDidMount() {
    Chart.defaults.font.family = "Poppins";
    Chart.defaults.font.size = window.innerWidth > 768 ? 13 : 12;
    Chart.defaults.font.color = "#2b2b2b";
    this.lineChart = new Chart(this.chartRef.current.getContext("2d"), {
      type: "line",
      data: this.data,
      options: this.options,
    });
  }

  componentDidUnMount() {
    this.lineChart.destroy();
  }

  labels() {
    const months = [];
    for (let i = this.currentMonth; i < this.totalMonths; i++) {
      months.push(moment().subtract(i, "months").format(dateFormat));
    }
    return months;
  }

  skipped(ctx, value) {
    return ctx.p0.skip || ctx.p1.skip ? value : undefined;
  }

  down(ctx, value) {
    return ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
  }

  formatDatasetValues() {
    return this.props?.labels?.map((label, idx) => ({
      label: label,
      data: this.getLastYearData(this.props.data[idx]),
      fill: false,
      borderWidth: 2,
      borderColor: this.props.colors[idx],
      tension: 0.1,
      segment: {
        borderColor: (ctx) =>
          this.skipped(ctx, "rgb(0,0,0,0.2)") ||
          this.down(ctx, this.props.colors[idx]),
        borderDash: (ctx) => this.skipped(ctx, [6, 6]),
      },
      spanGaps: true,
      yAxisID: "currency",
    }));
  }

  getLastYearData(categoryData) {
    const timeFormat = (asset) => moment(asset.createdAt).format(dateFormat);
    const groupCategoryData = _.groupBy(categoryData, timeFormat);
    const chartLabels = this.labels();

    return chartLabels.map((label, idx) =>
      groupCategoryData[label]
        ? groupCategoryData[label].length
        : 0
    );
  }

  render() {
    return <canvas id="lineChart" ref={this.chartRef} />;
  }
}

export default LineChart;
