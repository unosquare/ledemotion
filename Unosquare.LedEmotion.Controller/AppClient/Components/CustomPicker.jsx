import React from 'react'
import PropTypes from 'prop-types'
import reactCSS from 'reactcss'
import { ColorWrap, Saturation, Hue, Alpha, Checkboard } from 'react-color/lib/components/common'
import SketchFields from 'react-color/lib/components/sketch/SketchFields'
import SketchPresetColors from 'react-color/lib/components/sketch/SketchPresetColors'
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import DeleteIcon from 'material-ui-icons/Delete';

export const CustomPicker = ({ width, rgb, hex, hsv, hsl, onChange, onSwatchHover,
  disableAlpha, presetColors, renderers, addAction, deleteAction, className = '', fields = true }) => {
  const styles = reactCSS({
    'default': {
      picker: {
        width,
        padding: '10px 10px 0',
        boxSizing: 'initial',
        background: '#fff',
        borderRadius: '4px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15)'
      },
      saturation: {
        width: '100%',
        paddingBottom: '75%',
        position: 'relative',
        overflow: 'hidden'
      },
      Saturation: {
        radius: '3px',
        shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)'
      },
      controls: {
        display: 'flex'
      },
      sliders: {
        padding: '4px 0',
        flex: '1'
      },
      color: {
        width: '24px',
        height: '24px',
        position: 'relative',
        marginTop: '4px',
        marginLeft: '4px',
        borderRadius: '3px'
      },
      activeColor: {
        absolute: '0px 0px 0px 0px',
        borderRadius: '2px',
        background: `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`,
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)'
      },
      hueDiv: {
        position: 'relative',
        height: '10px',
        overflow: 'hidden'
      },
      hue: {
        radius: '2px',
        shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)'
      },
      alphaDiv: {
        position: 'relative',
        height: '10px',
        marginTop: '4px',
        overflow: 'hidden'
      },
      alpha: {
        radius: '2px',
        shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)'
      },
      cardStyle: {
        boxShadow: 'none'
      },
      buttonStyle: {
        margin: 'auto'
      }
    },
    'disableAlpha': {
      color: {
        height: '10px'
      },
      hueDiv: {
        height: '10px'
      },
      alphaDiv: {
        display: 'none'
      },
    },
  }, { disableAlpha })

  return (
    <div style={styles.picker} className={`sketch-picker ${className}`}>
      <div style={styles.saturation}>
        <Saturation style = { styles.Saturation } hsl = { hsl } hsv = { hsv } onChange = { onChange } />
      </div>
      <div style={styles.controls} className="flexbox-fix">
        <div style={styles.sliders}>
          <div style={styles.hueDiv}>
            <Hue style = { styles.hue } hsl = { hsl } onChange = { onChange } />
          </div>
          <div style={styles.alphaDiv}>
            <Alpha style = { styles.alpha } rgb = { rgb } hsl = { hsl } renderers = { renderers } onChange = { onChange} />
          </div>
        </div>
        <div style={styles.color}>
          <Checkboard />
          <div style={styles.activeColor} />
        </div>
      </div>

      <Fields
        rgb={rgb}
        hsl={hsl}
        hex={hex}
        onChange={onChange}
        disableAlpha={disableAlpha}
        fields={fields}
      />

      <SketchPresetColors
        colors={presetColors}
        onClick={onChange}
        onSwatchHover={onSwatchHover}
      />

      <CardComp
        addAction={addAction}
        deleteAction={deleteAction}
        rgb={rgb}
        styles={styles}
      />
    </div>
  )
}

function CardComp(props) {
  if (props.addAction != null || props.deleteAction != null) {
    return (
      <Card style={props.styles.cardStyle}>
        <CardActions>
          <AddButton rgb = { props.rgb } action = { props.addAction } styles = { props.styles } />
          <DeleteButton action = { props.deleteAction } styles = { props.styles } />
        </CardActions>
      </Card>
    )
  }

  return (
    <div />
  );
}

function DeleteButton(props) {
  if (props.action != null) {
    return (
      <div style={props.styles.buttonStyle}>
        <Button fab mini onClick = { () => props.action() } color = 'default' style = {{ background : '#FF0000' }}>
          <DeleteIcon />
        </Button>
      </div>
    );
  }

  return (
    <div />
  );
}

function AddButton(props) {
  if (props.action != null) {
    return (
      <div style={props.styles.buttonStyle}>
        <Button fab mini onClick = { () => props.action(props.rgb) } color = 'primary'>
          <AddIcon />
        </Button>
      </div>
    );
  }

  return (
    <div />
  );
}

function Fields(props) {
  if (props.fields === true) {
    return (
      <SketchFields
        rgb={props.rgb}
        hsl={props.hsl}
        hex={props.hex}
        onChange={props.onChange}
        disableAlpha={props.disableAlpha}
      />
    );
  }

  return (
    <div />
  );
}

CustomPicker.propTypes = {
  disableAlpha: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

CustomPicker.defaultProps = {
  disableAlpha: false,
  width: 200,
  presetColors: ['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505',
    '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000',
    '#4A4A4A', '#9B9B9B', '#FFFFFF']
}

export default ColorWrap(CustomPicker)