import React from 'react';
import './App.css';
import { getDataFurnitureSaga } from './saga';
import { Grid, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import DropDownComponent  from './subComponent/DropDown' 

const styles = {

  'input': {
    paddingBottom: '5px',
    borderBottom: '1px solid white',
    color:'white',
    '&::placeholder': {
      textOverflow: 'ellipsis !important',
      color: 'white',
      opacity: '100%',
      fontWeight: 'bold',
      
    }
  }
};

class App extends React.Component {
  _isMounted = false;
  state = {
    loading : true,
    errorMessage: '',
    dataFurnitureStyles: [],
    dataProduct: [],
    dataChoosenStyles: [],
    dataListProduct: [],
  }

  componentDidMount(){
    this._isMounted = true;
    this.getDataFurniture();
  }

  

  getDataFurniture = async function() {
    const param = {}

    const data = await getDataFurnitureSaga(param)
    
    if(data){
      
      if(!data.error){
        const dataFurniture = data.furniture;

        const dataFurnitureStyles = dataFurniture && dataFurniture.furniture_styles;
        const dataProduct = dataFurniture && dataFurniture.products;

        this.setState({dataFurnitureStyles, dataProduct})
      }else{
        this.setState({errorMessage:data.error, loading:false})
      }
    }
  }

  refreshDataFurniture = () => {
    const dataListProduct = [];
    const dataProduct = this.state.dataProduct;
    const deliveryTime = this.state.deliveryTime;
    const searchFurniture = this.state.searchFurniture;
    const furnitureStyle = this.state.furnitureStyle;

    for(const key in dataProduct) {
      if(
        dataProduct[key].name.toString().toLowerCase().includes(searchFurniture.toString().toLowerCase())
      ) {
        dataListProduct.push(dataProduct[key])
      }
    }

    this.setState({dataListProduct})
  }

  changeTextField = (e) => {
    this.setState({searchFurniture:e.target.value},() => {
      this.refreshDataFurniture()
    })
  }

  render() {
    const {classes} = this.props;
    
    return (
      
      <Grid container>
        <Grid item xs={6} sm={6} >
          <Grid container style={{backgroundColor:'#4E57E4', padding:'20px', color:'white'}}>
            <Grid item xs={12} sm={12} style={{marginBottom:'10px'}}>
              <TextField 
                value={this.state.searchFurniture}
                onChange={this.changeTextField}
                placeholder={'Search Furniture'}
                InputProps={{ classes: {input: classes.input}, disableUnderline:true}}
              />
            </Grid>

            <Grid item xs={6} sm={6} style={{paddingRight:'20px'}}>
              <DropDownComponent
                id={'id'}
                label={'label'}
                labelName={'label'}
                data={this.state.dataFurnitureStyles}
                value={this.state.furnitureStyle}
              />
            </Grid>

            <Grid item xs={6} sm={6} style={{paddingRight:'20px'}}>
              <DropDownComponent
                id={'id'}
                label={'label'}
                labelName={'label'}
                data={this.state.dataFurnitureStyles}
                value={this.state.furnitureStyle}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
 
  }
}

export default withStyles(styles)(App);


