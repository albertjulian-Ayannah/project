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
    searchFurniture:'',
    dataProduct: [],
    dataChoosenStyles: [],
    dataListProduct: [],
    furnitureStyle:[],
    deliveryTime:'delivery',
    dataListDeliveryTime: [
      {
        id:'delivery',
        label: 'Delivery Time'
      },
      {
        id:'7',
        label: '1 Week'
      },
      {
        id:'14',
        label: '2 Weeks'
      },
      {
        id:'30',
        label: '1 Month'
      },
      {
        id:'more',
        label: 'More'
      }
    ]
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

        const dataFurnitureStyles = [];
        const newDataStyles = dataFurniture && dataFurniture.furniture_styles
        const dataProduct = dataFurniture && dataFurniture.products;

        if(newDataStyles) {
          for(const key in newDataStyles) {
            dataFurnitureStyles.push({
              id: newDataStyles[key],
              label: newDataStyles[key]
            })
          }
        }

        this.setState({dataFurnitureStyles, dataProduct}, () => {
          this.refreshDataFurniture()
        })
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
        dataProduct[key].name.toString().toLowerCase().includes(searchFurniture.toString().toLowerCase().trim())
      ) {
        let flagStyle = false;
        let flagDeliveryTime = false;

        if(furnitureStyle && furnitureStyle.length && furnitureStyle.length > 0) {
          let internalStyle = dataProduct[key].furniture_style;
          
          for(const keyFurniture in furnitureStyle) {
            
            for(const keyInternalStyle in internalStyle) {
              if(furnitureStyle[keyFurniture].id.toString().toLowerCase().trim() === internalStyle[keyInternalStyle].toString().toLowerCase().trim()) {
                flagStyle = true;
                break;
              } 
            }

            if(flagStyle) {
              break;
            }
          }
        } else {
          flagStyle = true;
        }

        if(deliveryTime !== 'delivery') {
          const dataListDeliveryTime = this.state.dataListDeliveryTime;
          let minRange = 0;
          let maxRange = 0;

          if(deliveryTime === 'more') {
            minRange = 31;
          } else {
            for(const key in dataListDeliveryTime) {
              if(dataListDeliveryTime[key].id.toString() === deliveryTime.toString()) {
                minRange = (parseInt(key) - 1) === 0 ? 0 : parseInt(dataListDeliveryTime[parseInt(key) - 1].id);
                maxRange = parseInt(dataListDeliveryTime[key].id);
                break;
              }
            }
          }

          if(
            minRange < maxRange &&
            minRange < parseInt(dataProduct[key].delivery_time) && maxRange >= parseInt(dataProduct[key].delivery_time)
          ) {
            flagDeliveryTime = true;
          } else if( 
            minRange > maxRange && 
            minRange <= parseInt(dataProduct[key].delivery_time)
          ) {
            flagDeliveryTime = true;
          }

        } else {
          flagDeliveryTime = true;
        }

        if(flagStyle && flagDeliveryTime) {
          dataListProduct.push(dataProduct[key])
        }
        
      }
    }

    this.setState({dataListProduct})
  }

  changeTextField = (e) => {
    this.setState({searchFurniture:e.target.value},() => {
      this.refreshDataFurniture()
    })
  }

  onChangeDropDownMultiple = (e) => {
    const dataFurnitureStyles = this.state.dataFurnitureStyles;
    const lastStyle = this.state.furnitureStyle;
    const newStyle = e.target.value[e.target.value.length - 1];
    const newListStyle = [];
    let flag = true;

    for(const key in lastStyle) {
      if(lastStyle[key].id.toString().toLowerCase() !== newStyle.toString().toLowerCase()) {
        newListStyle.push(lastStyle[key])
      } else {
        flag = false;
      }
    }

    if(flag) {
      for(const key in dataFurnitureStyles) {
        if(
          dataFurnitureStyles[key].id.toString().toLowerCase() === newStyle.toString().toLowerCase() 
        ) {
          newListStyle.push(dataFurnitureStyles[key])
          break;
        } 
      }
    }

    this.setState({furnitureStyle : newListStyle}, () => {
      this.refreshDataFurniture()
    })
  }

  onChangeDropDown = (e) => {
    this.setState({deliveryTime: e.target.value}, () => {
      this.refreshDataFurniture();
    })
  }

  destructStyle = (furnitureStyle) => {
    let stringStyle = '';

    for(const key in furnitureStyle) {
      if(stringStyle.length !== 0) {
        stringStyle += ', '
      }

      stringStyle += furnitureStyle[key]
    }

    return stringStyle
  }

  deleteSeparator = (number, separator) => {
    while(number.includes(separator)){
      number = number.replace(separator,"")
    }
    return number
  }
  
  isNumeric = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  destructPrice = (number, money) => {
    
    number = (number && number.toString().trim()) || ''
    number = this.deleteSeparator(number,".")
    let floatingNumber = false;
    
    if(number.includes('.')) {
      const numberSplit = number.split('.')
      floatingNumber = numberSplit[1];
      number = numberSplit[0];
      
      floatingNumber = floatingNumber.substr(0,2);
    }
    
    let pjg = number.length
    if(!this.isNumeric(number)){
      pjg = pjg-1
      number = number.substr(0,pjg)
    }
    let tmp = ""
    if(pjg>3){
      while(pjg>3){
        pjg -= 3
        tmp = number.substr(pjg,3) + "." + tmp
      }
      if(pjg<=3){
        tmp = number.substr(0,pjg) + "." + tmp
      }
      tmp = tmp.substr(0, tmp.length-1)
    }else{
      tmp = number
    }
  
    if(money && tmp.length !== 0) {
      tmp = `Rp ${tmp},00`;
    } 
  
    return tmp.toString().length !== 0 ? `${tmp}${floatingNumber ? `,${floatingNumber}` : ''}` : '-'
    
  }

  render() {
    const {classes} = this.props;
    
    return (
      
      <Grid container style={{display:'flex', justifyContent:'center'}}>
        <Grid item xs={7} sm={7} >
          <Grid container style={{backgroundColor:'#4E57E4', padding:'20px', color:'white'}}>
            <Grid item xs={6} sm={6} style={{marginBottom:'10px', paddingRight: '20px'}}>
              <TextField 
                value={this.state.searchFurniture}
                onChange={this.changeTextField}
                placeholder={'Search Furniture'}
                InputProps={{ classes: {input: classes.input}, disableUnderline:true}}
                fullWidth
              />
            </Grid>

            <Grid item xs={6} sm={6} style={{marginBottom:'10px'}}>
            </Grid>

            <Grid item xs={6} sm={6} style={{paddingRight:'20px'}}>
              <DropDownComponent
                id={'id'}
                label={'label'}
                labelName={'label'}
                placeholder={'Furniture Style'}
                data={this.state.dataFurnitureStyles}
                multiple
                fullWidth
                value={this.state.furnitureStyle}
                onChange={this.onChangeDropDownMultiple}
              />
            </Grid>

            <Grid item xs={6} sm={6} style={{paddingRight:'20px'}}>
              <DropDownComponent
                id={'id'}
                label={'label'}
                labelName={'label'}
                data={this.state.dataListDeliveryTime}
                value={this.state.deliveryTime}
                onChange={this.onChangeDropDown}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={7} sm={7} >
          <Grid container style={{padding:20, display:'flex', justifyContent:'space-between'}}>

            {
              this.state.dataListProduct && 
              this.state.dataListProduct.map((dataProduct, index) => {
                return(
                  <Grid item xs={5} sm={5} 
                    key={`${dataProduct.name}-${index}`}
                    style={{padding:20, marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}
                  >
                    <Grid container>
                      <Grid item xs={6} sm={6}>
                        <h4> {dataProduct.name} </h4>
                      </Grid>

                      <Grid item xs={6} sm={6} style={{fontWeight:'bold', display:'flex', justifyContent:'flex-end', color:'orange'}}>
                        {this.destructPrice(dataProduct.price, true)}
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        {`${dataProduct.description.toString().substr(0,114)}${dataProduct.description.toString().length >= 114 ? '....' : ''}`}
                      </Grid>

                      <Grid item xs={12} sm={12} style={{display:'flex', justifyContent:'flex-start', color:'blue'}}>
                        {this.destructStyle(dataProduct.furniture_style)}
                      </Grid>

                      <Grid item xs={12} sm={12} style={{fontWeight:'bold', display:'flex', justifyContent:'flex-end', color:'blue'}}>
                        <u>{`${dataProduct.delivery_time} ${dataProduct.delivery_time > 1 ? 'Days' : 'Day'}`}</u>
                      </Grid>
                    </Grid>
                  </Grid>
                )
              }, this)
            }
            
            


          </Grid>
        </Grid>

      </Grid>
    )
 
  }
}

export default withStyles(styles)(App);


