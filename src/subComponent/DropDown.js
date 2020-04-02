import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Checkbox, Grid, InputLabel } from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const styles = (theme) => ({
  selectField: {
    backgroundColor:'white',
    minWidth: 120,
    display: 'flex',
    flexWrap: 'wrap', 
    marginTop: '1em',
    padding:'none',
  },

  formControl: {
    '&:hover': {
      border:'1px solid rgba(0, 0, 0, 1)',
    },
    border:'1px solid rgba(0, 0, 0, .3)', 
    borderRadius:'5px', 
    margin: theme.spacing * 1,
    maxWidth: 300,
    backgroundColor:'white'
  },
  // formControl: {
  //   // backgroundColor:'white',
  //   minWidth: 120,
  //   display: 'flex',
  //   flexWrap: 'wrap',
  //   // marginTop: '1em',
  // },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    marginRight: '10px',
  },

  multipleDropDown: {
    // '&:hover': {
    //   border:'1px solid rgba(0, 0, 0, 1)',
    // },
    minHeight:'40px',
    // border:'1px solid rgba(0, 0, 0, .3)', 
    // borderRadius:'5px', 
    padding:'2px 0px 0px 2px', 
  }
});

class DropDownComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: '',
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.error !== this.props.error) {
      this.setState({
        error: nextProps.error,
      });
    }
  }

  getColor = (id, dataValue) => {
    let flag = false;

    for(const key in dataValue) {
      if(dataValue[key][this.props.id].toString().toLowerCase() === id.toString().toLowerCase() ) {
        flag = true;
        break;
      }
    }
    
    return flag ? '#d3d3d3' : 'white';
  }

  getChecked = (id, dataValue) => {
    let flag = false;

    for(const key in dataValue) {
      if(dataValue[key][this.props.id].toString().toLowerCase() === id.toString().toLowerCase() ) {
        flag = true;
        break;
      }
    }
    
    return flag;
  }


  render() {
    const {
      classes,
      fullWidth,
      label,
      data,
      id,
      labelName,
      value,
      onChange,
      disabled,
      multiple,
    } = this.props;
    
    if(multiple) {
      return (
        <FormControl className={classes.formControl} error={!!this.state.error} fullWidth>
          <InputLabel id="demo-mutiple-checkbox-label" style={{marginLeft:'10px', marginTop:'5px'}}>{this.props.placeholder}</InputLabel>
          <Select
            multiple
            fullWidth
            value={value}
            onChange={onChange}
            // style={{backgroundColor:'white'}}
            input={
              <Input 
                className={classes.multipleDropDown}
                placeholder={'Furniture Styles'}
                disableUnderline 
                multiline
                id="select-multiple-chip" 
              />
            }
            renderValue={value => (
              <div className={classes.chips}>
                {value.map(dataChip => (
                  <Chip 
                    key={dataChip[id]} 
                    label={dataChip[labelName]} 
                    className={classes.chip} 
                    style={{marginRight: '10px', marginBottom: '5px'}}
                  />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {data.map(data => (
              <MenuItem key={data[id]} value={data[id]} style={{backgroundColor: this.getColor(data[id], value)}}>
                <Grid container>
                  <Grid item xs={6} sm={6} style={{paddingTop:'8px'}}>
                    {data[labelName]}
                  </Grid>
                  
                  <Grid item xs={6} sm={6} style={{display:'flex',justifyContent: 'flex-end' }}>
                    <Checkbox       
                      style={{visibility:'none'}}
                      checkedIcon={<CheckBoxIcon style={{color:'green'}} />}
                      checked={this.getChecked(data[id], value)}
                    />
                  </Grid>
                </Grid>
                
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ); 
    } else {
      return (
        <FormControl variant="outlined" className={classes.selectField} error={!!this.state.error}>
          <Select
            native
            value={value}
            onChange={onChange}
            fullWidth={fullWidth}
            // labelWidth={labelWidth}
            inputProps={{
              name: label,
              id: 'outlined-age-native-simple',
              style:{padding:'10px'}
            }}
            disabled={disabled}
          >
            {data &&
              Object.keys(data).length &&
              data.map((object) => {
                const idObject = object[id];
                const labelNames = labelName.split('-');
                let labelObject = '';
                if (labelNames.length > 1) {
                  for (let i = 0; i < labelNames.length; i++) {
                    labelObject = `${labelObject } - ${ object[labelNames[i]]}`;
                  }
                  labelObject = labelObject.substr(3);
                } else {
                  labelObject = object[labelNames];
                }
  
                return (
                  <option value={idObject} key={idObject}>
                    {labelObject}
                  </option>
                );
              })} 
          </Select>
          {this.state.error && (
            <FormHelperText>{this.state.error}</FormHelperText>
          )}
        </FormControl>
      );
    }
    
    
  }
}

DropDownComponent.propTypes = {
  fullWidth: PropTypes.bool,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  labelName: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.string,
};

export default withStyles(styles)(DropDownComponent);
