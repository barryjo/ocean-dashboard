
import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { getAllStats } from '../data'
import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import {
  dataPie,
  legendPie,
  defaultTxData,
  optionsSales,
  responsiveSales,
  legendTxHistory,
  thArray
} from "variables/Variables.jsx";

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      totalApps: '-',
      totalTxs: '-',
      totalUsers: '-',
      uniqueUsers: '-',
      dataPie,
      legendPie,
      txChartData: defaultTxData,
      apps: null,
      txs: '-',
      inProgress: true
    }
  }

  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
      legend.push(" ");
    }
    return legend;
  }

  async componentDidMount() {
    let stats = await getAllStats()
    console.log(stats)
    stats.apps.sort((a, b) => (a.txs < b.txs) ? 1 : -1)

    let top1 = (stats.apps[0].txs / stats.totalTxs) * 100,
      top2 = (stats.apps[1].txs / stats.totalTxs) * 100,
      top3 = (stats.apps[2].txs / stats.totalTxs) * 100

    let newDataPie = {
      labels: [stats.apps[0].name, stats.apps[1].name, stats.apps[2].name],
      series: [Math.round(top1), Math.round(top2), Math.round(top3)]
    };

    let newLegendPie = {
      names: [stats.apps[0].name, stats.apps[1].name, stats.apps[2].name],
      types: ["info", "danger", "warning", "secondary"]
    };

    this.setState({
      totalApps: stats.totalApps,
      inProgress: false,
      apps: stats.apps.slice(),
      totalTxs: stats.totalTxs,
      totalUsers: stats.totalUsers,
      uniqueUsers: stats.uniqueUsers,
      txChartData: stats.txChartData,
      dataPie: newDataPie,
      legendPie: newLegendPie

    })
  }
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-keypad text-primary" />}
                statsText="Total Apps"
                statsValue={this.state.totalApps}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText={this.state.inProgress ? "Updating..." : "Updated now"}
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-users text-success" />}
                statsText="Total Users"
                statsValue={this.state.totalUsers}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText={this.state.inProgress ? "Updating..." : "Updated now"}
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-gleam text-danger" />}
                statsText="Total Txs"
                statsValue={this.state.totalTxs}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText={this.state.inProgress ? "Updating..." : "Updated now"}
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-user text-info" />}
                statsText="Unique Users"
                statsValue={this.state.uniqueUsers}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText={this.state.inProgress ? "Updating..." : "Updated now"}
              />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Transaction History"
                category="In last 24 Hours"
                stats={this.state.inProgress ? "Updating..." : "Updated now"}
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={this.state.txChartData}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendTxHistory)}</div>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                statsIcon="fa fa-clock-o"
                title="Most Active Apps"
                category="based on transaction volume"
                stats="Updated now"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={this.state.dataPie} type="Pie" />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(this.state.legendPie)}</div>
                }
              />
            </Col>
          </Row>

          <Row>

            <Col md={12}>
              <Card
                title="App List"
                category="List of Apps on Ocean Protocol"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {thArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.apps ? (this.state.apps.map((app, key) => {
                        return (
                          <tr key={key}>
                            <td key={key}>{key + 1}</td>
                            <td key={key}>{app.name}</td>
                            <td key={key}>{app.txs}</td>
                            <td key={key}><a target="_blank" href={app.homepage}>{app.homepage}</a></td>

                          </tr>
                        );
                      })) : ""}
                    </tbody>
                  </Table>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
