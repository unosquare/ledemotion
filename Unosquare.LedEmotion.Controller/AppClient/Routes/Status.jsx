import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Axios from 'axios';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 20,
    paddingLeft: 50,
    paddingRight: 50
  }
});

class Status extends Component {
  state = {
    ConnectionType: [],
    LocalIPs: [],
    PublicIP: ""
  };

  componentDidMount = () => {
    Axios.get("api/status")
      .then(response => {
        this.setState({
          ConnectionType: response.data.ConnectionType,
          LocalIPs: response.data.LocalIPs,
          PublicIP: response.data.PublicIP
        });
      });
  }

  render() {
    const { classes } = this.props;
    const { LocalIPs, PublicIP, ConnectionType } = this.state;

    return (
      <div className={classes.root}>
        <Typography type="headline" component="h3">Network LED Controller Status</Typography>
        <br/>
        <div>
          <Table>
            <TableHead>
              {<TableRow>
                <TableCell></TableCell>
                <TableCell>Value</TableCell>
              </TableRow>}
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Connection Type</TableCell>
                <TableCell>{ConnectionType.join(", ")}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Local IP Addresses</TableCell>
                <TableCell>{LocalIPs.join(", ")}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Public IP Address</TableCell>
                <TableCell>{PublicIP}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
}

Status.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Status);