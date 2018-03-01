import AddIcon from 'material-ui-icons/Add';
import Button from 'material-ui/Button';
import Card, { CardActions} from 'material-ui/Card';
import React from 'react';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    root: {
        flexgrow: 1,
        height: 'auto'
    },
    buttonStyle: {
      margin: 'auto'
    },
    cardStyle: {
      boxShadow: 'none'
    },
    canvas: {
        width: '100%',
        height: '260px'
    }
});

class CustomPicker extends React.Component {
    constructor() {
        super();
        this.drawingContext = null;
        this.styles = {
            previewColorCanvas: {
                width: null,
                height: null
            },
            previewColorHovered: {
                backgroundColor: '#ffffff'
            },
            previewColorSelected: {
                backgroundColor: '#ffffff'
            },
            marker: {
                width: null,
                height: null
            }
        };
        this.state = {
            selectedColor: {
                rgb: {
                    r: 0,
                    g: 0,
                    b: 0
                },
                hex: '#ffffff'
            },
            hoveredColor: {
                rgb: {
                    r: 0,
                    g: 0,
                    b: 0
                },
                hex: '#ffffff'
            },
            mouse: 'MouseUp',
            textColor: 'Black'
        };
    }
    
    getDrawingContex() {
        if(this.refs.previewColorCanvas)
            this.drawingContext = this.refs.previewColorCanvas.getContext('2d');
    }

    componentToHex(color) {
        var hex = color.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }

    rgbToHex(r, g, b) {
        return `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;
    }

    createColorPalette() {
        this.drawingContext.canvas.width= this.styles.previewColorCanvas.width
        this.drawingContext.canvas.height= this.styles.previewColorCanvas.height

        let gradient = this.drawingContext.createLinearGradient(0, 0, this.styles.previewColorCanvas.width, 0);
        gradient.addColorStop(0, 'rgb(255, 0, 0)');
        gradient.addColorStop(0.15, 'rgb(255, 0, 255)');
        gradient.addColorStop(0.33, 'rgb(0, 0, 255)');
        gradient.addColorStop(0.49, 'rgb(0, 255, 255)');
        gradient.addColorStop(0.67, 'rgb(0, 255, 0)');
        gradient.addColorStop(0.84, 'rgb(255, 255, 0)');
        gradient.addColorStop(1, 'rgb(255, 0, 0)');
        this.drawingContext.fillStyle = gradient;
        this.drawingContext.fillRect(0, 0, this.drawingContext.canvas.width, this.styles.previewColorCanvas.height);
        gradient = this.drawingContext.createLinearGradient(0, 0, 0, this.styles.previewColorCanvas.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        this.drawingContext.fillStyle = gradient;
        this.drawingContext.fillRect(0, 0, this.drawingContext.canvas.width, this.styles.previewColorCanvas.height);
    }

    selectColor(event, handler) {
        let canvasRect = this.drawingContext.canvas.getBoundingClientRect(),
            imageData;

        if(handler === 'TouchMove') {
            this.colorEventX = event.changedTouches[0].pageX - canvasRect.left;
            this.colorEventY = event.changedTouches[0].pageY - canvasRect.top;
        } else {
            this.colorEventX = event.pageX - canvasRect.left;
            this.colorEventY = event.pageY - canvasRect.top;
        }

        imageData = this.drawingContext.getImageData(this.colorEventX, this.colorEventY, 1, 1);
        
        const rgb = {
            r: imageData.data[0],
            g: imageData.data[1],
            b: imageData.data[2]
        };

        this.changeTextColor(rgb);

        return rgb;
    }

    changeTextColor = (rgb) => {
        var luma = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;

        if (luma < 170) {
            this.setState({ textColor: 'White' });
        }
        else {
            this.setState({ textColor: 'Black' });
        }
    }
    
    handlePaletteTouchMove(event) {
        const rgb = this.selectColor(event, 'TouchMove');
        this.setState({
            hoveredColor: {
                rgb: rgb,
                hex: this.rgbToHex(rgb.r, rgb.g, rgb.b)
            }
        }, () =>{
            this.props.onChangeComplete({ rgb: this.state.hoveredColor.rgb, hex: this.state.hoveredColor.hex })
            this.setState({
                selectedColor: this.state.hoveredColor
            });
        });
    }

    handlePaletteMouseMove(event) {
        if(this.state.mouse === 'MouseUp')
            return
        
        const rgb = this.selectColor(event, 'MouseMove');
        this.setState({
            hoveredColor: {
                rgb: rgb,
                hex: this.rgbToHex(rgb.r, rgb.g, rgb.b)
            }
        }, () =>{
            this.props.onChangeComplete({ rgb: this.state.hoveredColor.rgb, hex: this.state.hoveredColor.hex })
            this.setState({
                selectedColor: this.state.hoveredColor
            });
        });
    }

    handlePaletteMouseClick(event) {
        const rgb = this.selectColor(event, 'Click');
        
        this.setState({
            hoveredColor: {
                rgb: rgb,
                hex: this.rgbToHex(rgb.r, rgb.g, rgb.b)
            }
        }, () =>{
            this.props.onChangeComplete({ rgb: this.state.hoveredColor.rgb, hex: this.state.hoveredColor.hex })
            this.setState({
                selectedColor: this.state.hoveredColor
            });
        });
    }

    getDimensionsPalette() {
        if(this.refs.previewColorCanvas){
            var canvas = this.refs.previewColorCanvas.getBoundingClientRect();
            this.styles.previewColorCanvas.width = canvas.width;
            this.styles.previewColorCanvas.height = canvas.height;
        }
    }

    handleMouseDown() {
        if (this.refs.previewColorCanvas)
            this.setState({ mouse: 'MouseDown' });
    }

    handleMouseUp() {
        if (this.refs.previewColorCanvas)
            this.setState({ mouse: 'MouseUp' });
    }
    
    logic() {
        this.getDimensionsPalette();
        this.getDrawingContex();
        this.createColorPalette();
    }

    componentDidMount() {
        this.logic();
        
        window.onresize = ()=> {
            this.logic();
        }

        document.addEventListener('mousedown', () => this.handleMouseDown());
        document.addEventListener('mouseup', () => this.handleMouseUp());
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', () => this.handleMouseDown());
        document.removeEventListener('mouseup', () => this.handleMouseUp());
    }

    render() {
        let id = this.props.id,
            colorPickerId = `colorpicker-${id}`,
            previewColorMarkerId = `preview-color-marker-${id}`,
            previewColorCanvasId = `preview-color-canvas-${id}`;

        return (
            <div
                ref='colorPicker'
                id={colorPickerId}
                className="colorPickerPalette">
                <div
                    ref='previewColorMarker'
                    id={previewColorMarkerId}
                    className="colorPickerPalette--previewColorMarker"
                    >
                </div>

                <canvas
                    ref='previewColorCanvas'
                    id={previewColorCanvasId}
                    className={this.props.classes.canvas}
                    onMouseMove={this.handlePaletteMouseMove.bind(this)}
                    onTouchMove={this.handlePaletteTouchMove.bind(this)}
                    onClick={this.handlePaletteMouseClick.bind(this)}
                    >
                </canvas>

                <Card className={this.props.classes.cardStyle}>
                    <CardActions style = {{ float : 'right' }}>
                        <div className={this.props.classes.buttonStyle}>
                            <Button 
                                fab 
                                mini 
                                style = {{ color: this.state.textColor, background : this.state.hoveredColor.hex }}
                                onClick = { () => this.props.action(this.state.hoveredColor.rgb) }
                            >
                                <AddIcon />
                            </Button>
                        </div>
                    </CardActions>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(CustomPicker);