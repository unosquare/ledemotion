import React, { Component } from 'react';
import Axios from 'axios';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions } from 'material-ui/Card';
import CustomPicker from '../Components/CustomPicker.jsx';
import Grid from 'material-ui/Grid';
import Dialog, { DialogActions, DialogContent } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import AddIcon from 'material-ui-icons/Add';
import Tooltip from 'material-ui/Tooltip';

const styles = theme => ({
    root: {
        flexgrow: 1
    },
    roote: {
        height: 'auto'
    },
    divStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto'
    },
    cardStyle: {
        width: 50,
        height: 50,
        borderRadius: '50%',
        boxShadow: '2px 4px 15px #c2bebe'
    },
    iconButtonStyle: {
        height: '100%',
        width: '100%',
        margin: '0px 0px 2px 0px',
        color: 'Black'
    },
    colorPicker: {
        position: 'relative',
        width: '40%'
    },
    presetColorStyle: {
        paddingTop: 10,
        position: 'relative',
        width: '60%'
    },
    fabButtonAbsoluteStyle: {
        flip: false,
        position: 'absolute',
        bottom: 32,
        right: 32,
        transition: 'none'
    }
});

const mql = window.matchMedia(`(min-width: 800px)`);

class SingleColor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mql: mql,
            docked: false,
            textColor: 'White',
            colors: [],
            addOpen: false,
            background: '#7ED321',
            presetName: '',
            color: [],
            displayColorPicker: false,
            presetColors: [{ color: '#D0021B', title: 'Red', origin: 'Array' }, { color: '#F5A623', title: 'Orange', origin: 'Array' }, { color: '#F8E71C', title: 'Yellow', origin: 'Array' },
            { color: '#8B572A', title: 'Brown', origin: 'Array' }, { color: '#7ED321', title: 'Green', origin: 'Array' }, { color: '#CC4AE2', title: 'Pink', origin: 'Array' },
            { color: '#9013FE', title: 'Purple', origin: 'Array' }, { color: '#4A90E2', title: 'Blue ', origin: 'Array' }, { color: '#000000', title: 'Off ', origin: 'Array' },
            { color: '#FFFFFF', title: 'Full Brightness ', origin: 'Array' }]
        };
    }

    componentDidMount = () => {
        this.getColors();
    };

    componentWillMount() {
        mql.addListener(this.mediaQueryChanged);
        this.setState({ mql: mql, docked: mql.matches });
        this.stopAnimateImage();
    }

    componentWillUnmount() {
        this.state.mql.removeListener(this.mediaQueryChanged);
    }

    mediaQueryChanged() {
        this.setState({
            mql: mql,
            docked: this.state.mql.matches
        });
    }

    stopAnimateImage = () => {
        Axios.put('/api/stop');
    }

    getColors = () => {
        Axios.get('/api/appstate')
            .then(response => {
                this.setState({ colors: this.state.presetColors });
                response.data.SolidColorPresets.forEach(element => {
                    var hexColor = '#' + this.byteToHex(element.R) + this.byteToHex(element.G) + this.byteToHex(element.B);

                    this.setState({
                        colors: this.state.colors.concat({ color: hexColor, title: element.Name, origin: 'Json' })
                    });

                });
                this.setState({
                    colors: this.state.colors.concat({ color: 'White', title: 'Add Color' })
                });
            });
    }

    byteToHex = (c) => {
        var hex = c.toString(16);

        return hex.length === 1 ? `0${hex}` : hex;
    };

    changeTextColor = (rgb) => {
        var luma = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b; // per ITU-R BT.709

        if (luma < 170) {
            this.setState({ textColor: 'White' });
        }
        else {
            this.setState({ textColor: 'Black' });
        }
    }

    changeBackgroundColor = (color) => {
        this.setState(prevState => ({
            background: color
        }));
    }

    handleChange = (color, event) => {
        this.changeTextColor(color.rgb);
        this.changeBackgroundColor(color.hex);
        this.setState({ origin: 'Json' });
    }

    selectColor = (color) => {
        var rgb = this.hexToRGB(color.color);
        this.setState({ presetName: color.title });
        this.setState({ origin: color.origin });
        this.changeTextColor(rgb);
        this.changeBackgroundColor(color.color);
        this.setColor(rgb, true);
    }

    handleClose = () => {
        this.setState({ displayColorPicker: false });
        this.resetValues();
    };

    setColor = (color, sendToApi) => {
        if (sendToApi !== true)
            return;

        Axios.put('/api/color', {
            F: 6,
            R: color.r,
            G: color.g,
            B: color.b
        }).then(() => { this.getColors() });
    }

    hexToRGB = (a) => {
        var first = a[1] + a[2];
        var second = a[3] + a[4];
        var third = a[5] + a[6];
        var res = [first, second, third];

        for (var i = 0; i < res.length; i++) {
            res[i] = parseInt(res[i], 16);
        }

        var rgbColor = {
            r: res[0],
            g: res[1],
            b: res[2]
        };

        return rgbColor;
    }

    resetValues = () => {
        this.setState({ presetName: '', color: [], origin: '' });
    }

    handleAddDialogOpen = (rgb) => {
        this.setState({ addOpen: true, color: rgb });
    };

    handleAddDialogClose = () => {
        this.setState({ addOpen: false, displayColorPicker: false });
    };

    deleteColor = () => {
        Axios.delete('/api/preset', {
            data: { Name: this.state.presetName }
        }).then(() => { this.getColors(), this.resetValues() });
    }

    addColor = () => {
        if (this.state.presetName == null || this.state.presetName == '' || this.state.presetName == 'Add Color') {
            return;
        }

        Axios.post('/api/preset', {
            Name: this.state.presetName,
            R: this.state.color.r,
            G: this.state.color.g,
            B: this.state.color.b
        }).then(() => { this.getColors() }, this.handleAddDialogClose(), this.setState({ origin: 'Json' }));
    }

    colorCard = (props) => {
        if (props.color.title != 'Add Color') {
            return (
                <div>
                    <Card aria-label="Recipe" className={props.classes.cardStyle} style={{ backgroundColor: props.color.color }} title={props.color.title}>
                        <CardActions style={{ padding: '0px' }}>
                            <IconButton className={props.classes.iconButtonStyle} aria-label="Select" onClick={() => props.action(props.color)} />
                        </CardActions>
                    </Card>
                </div>
            );
        }
        else {
            return (
                <Card aria-label="Recipe" className={props.classes.cardStyle} style={{ backgroundColor: 'white' }} title="Add Color">
                    <IconButton className={props.classes.iconButtonStyle} aria-label="Select" onClick={() => this.setState({ displayColorPicker: true })} >
                        <AddIcon />
                    </IconButton>
                </Card>
            );
        }
    }

    colorPickerCom = (props) => {
        var display = '';
        var colorPickerWidth = '';
        var presetColorWidth = '';

        if (this.state.docked == false) {
            display = 'grid';
            colorPickerWidth = '100%';
            presetColorWidth = '100%';
        }
        else {
            display = 'flex';
            colorPickerWidth = '40%';
            presetColorWidth = '60%';
        }

        return (
            <div style={{ display: display, alignItems: 'center', justifyContent: 'center', width: '80%', margin: '0 auto' }} >
                <Dialog open={this.state.displayColorPicker} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <CustomPicker
                        addAction={this.handleAddDialogOpen.bind(this)}
                        presetColors={[]}
                        disableAlpha
                        fields={false}
                        width={250}
                        color={props.background}
                        onChangeComplete={this.handleChange.bind(this)}
                    />
                </Dialog>

                <div className={props.classes.colorPicker} style={{ width: colorPickerWidth, marginBottom: '40px' }}>
                    <Typography style={{ color: props.textColor, textAlign: 'center' }} type="headline" component="h3">
                        Pick to set a solid color. You can save a color as a preset
                    </Typography>
                    <br />
                </div>

                <div className={props.classes.presetColorStyle} style={{ width: presetColorWidth, marginBottom: '40px' }}>
                    <Grid container className={props.classes.root}>
                        <Grid item xs={8} className={props.classes.divStyle}>
                            <Grid container justify="center" spacing={Number(8)}>
                                {
                                    this.state.colors.map((color, key) =>
                                        <Grid key={key} item>
                                            <this.colorCard classes={props.classes} color={color} action={this.selectColor} />
                                        </Grid>
                                    )
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }

    fab = (props) => {
        if (props.origin == "Json") {
            return (
                <div>
                    <Tooltip placement="bottom" title={'Delete Selected Color'}>
                        <IconButton
                            className={props.classes.fabButtonAbsoluteStyle}
                            onClick={props.DeleteColor}
                            style={{ color: props.textColor, backgroundColor: props.background }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            )
        }
        return (
            <div />
        )
    }

    render() {
        const { classes } = this.props;
        const { textColor, background } = this.state;

        return (
            <div className={classes.root}  >
                <div className={classes.roote} style={{ backgroundColor: this.state.background }} >

                    <Dialog
                        open={this.state.addOpen}
                        onClose={this.handleAddDialogClose}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Preset Name"
                                type="text"
                                fullWidth
                                onChange={(event) => this.setState({ presetName: event.target.value })}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleAddDialogClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.addColor} color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <br />
                    <br />

                    { /* Color picker */}
                    <this.colorPickerCom classes={classes} background={background} textColor={textColor} />

                    { /* Tooltip */}
                    <this.fab
                        classes={classes}
                        textColor={textColor}
                        background={background}
                        DeleteColor={this.deleteColor}
                        origin={this.state.origin}
                    />

                    <br />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(SingleColor);;