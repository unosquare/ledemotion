import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Axios from 'axios';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar'; 

export default class SettingsDialog extends React.Component {
  static snackbarMessages = {
    Success: "Settings Updated correctly",
    Error: "An error ocurred while updating settings"
  };
  state = {
    settings:{      
      LedCount:240,
      FramesPerSecond: 30,
      SpiChannel: 1,
      SpiFrequency: 1000000,
    },
    savingSettings: false,
    isSnackbarOpen: false,
    snackbarMessage: SettingsDialog.snackbarMessages.Success
  };
  componentDidMount = () => {
    Axios.get("api/settings")
    .then( response => {
      this.setState({
        settings : {
          ...response.data
        }
      });
    });
  }
  saveSettings = () => {
    this.setState({saveSettings:true});
    Axios.post("api/settings", {
      ...this.state.settings
    })
    .then( response => {
      if(response.data.Status === 'ok')
      {
        this.props.handleClose();
        this.showSnackbar(SettingsDialog.snackbarMessages.Success);  
      }
      else
      this.showSnackbar(SettingsDialog.snackbarMessages.Error);

      this.setState({savingSettings:false});
    });
  }

  showSnackbar = (message) => {
    this.setState({ 
      isSnackbarOpen: true,
      snackbarMessage : message
    });
  };

  hideSnackbar = () => {
    this.setState({ isSnackbarOpen: false });
  };

  render() {
    const {LedCount, FramesPerSecond, SpiChannel, SpiFrequency} = this.state.settings;
    const {snackbarMessage, isSnackbarOpen, savingSettings} = this.state;
    return (
      <div>
        <Dialog
          open={this.props.open}
          onRequestClose={this.props.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="xs"
        >
          <DialogTitle id="form-dialog-title">Settings</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              id="LedCount"
              label="Led Count"
              type="number"
              helperText="The amount of LEDs of the strip"
              fullWidth
              value={LedCount}
            />
             <TextField
              margin="dense"
              id="FramesPerSecond"
              label="Frames Per Second"
              type="number"
              helperText="The number of frames per second"
              fullWidth
              value={FramesPerSecond}
            />
             <TextField
              margin="dense"
              id="SpiChannel"
              label="SPI channel"
              type="number"
              helperText="The Raspberry's SPI channel"
              fullWidth
              value={SpiChannel}
            />
             <TextField
              margin="dense"
              id="SpiFrequency"
              label="SPI Frequency"
              type="number"
              helperText="The SPI frequency"
              fullWidth
              value={SpiFrequency}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
              Cancel
            </Button>
            <Button disabled={savingSettings} onClick={this.saveSettings} color="primary">
              Save
            </Button>
          </DialogActions> 
        </Dialog>   
        
        <Snackbar
          open={isSnackbarOpen}
          onRequestClose={this.hideSnackbar}
          autoHideDuration={1500}
          message={<span id="message-id">{snackbarMessage}</span>}
          anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
          }}
        />    
      </div>      
    );
  }
}