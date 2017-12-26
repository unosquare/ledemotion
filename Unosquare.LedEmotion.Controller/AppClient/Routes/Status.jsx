import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Axios from 'axios';
const styles = theme => ({
  root : {
    flexGrow : 1,
    marginTop: 20,
    paddingLeft : 50,
    paddingRight: 50
  },
  tableStyle : {
    minWidth : 700,
  },
  responsiveTableStyle : {
    overflowX : 'auto',
  }
});

class Status extends Component {
  state = {
    LocalIPs : [],
    PublicIP: ""
  }
  componentDidMount = () => {
    Axios.get("api/status")
    .then(response =>{
      this.setState({
        LocalIPs : response.data.LocalIPs,
        PublicIP : response.data.PublicIP
      });
    });
  } 
  render() {

    const { classes } = this.props;
    const { LocalIPs, PublicIP } = this.state;

    return (
      <div className = { classes.root }>
        <Typography type = "headline" component = "h3">Network LED Controller Status</Typography>
        <div className = { classes.responsiveTableStyle }>
          <Table className = { classes.tableStyle }>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Connection Type</TableCell>
                <TableCell>Wireless</TableCell>
                <TableCell>Could be wired or wireless</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Local IP Addresses</TableCell>
                <TableCell>{LocalIPs.join(",")}</TableCell>
                <TableCell>The network IPv4 addresses of this controller</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Public IP Address</TableCell>
                <TableCell>{PublicIP}</TableCell>
                <TableCell>The public network IPv4 address of this controller</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
}

Status.propTypes = {
  classes : PropTypes.object.isRequired,
};

export default withStyles(styles)(Status);