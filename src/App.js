import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

const previousOp = /[+*/-]/,
      decimalZeros = /\.0+$|\.$/, 
      numberZeros = /[1-9]0+$/,
      decimalCheck = /\d+\.\d+$/ 

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      displayed: [],
      result: 0,
      previous: 0,
      colourResult: { color: "#FFFFFF" , fontSize: "23px"},
      equal: false,
      alert: []
    }
    this.clear = this.clear.bind(this)
    this.number = this.number.bind(this)
    this.operation = this.operation.bind(this)
    this.handleZero = this.handleZero.bind(this)
    this.handleDecimal = this.handleDecimal.bind(this)
    this.handleEqual = this.handleEqual.bind(this)
    this.displayRender = this.displayRender.bind(this)
    this.handleSubstract = this.handleSubstract.bind(this)
    this.ifEqual = this.ifEqual.bind(this)
  }
  
  ifEqual(){
   if(this.state.equal == true){
     this.setState(state =>({
      colourResult: { color: "#FFFFFF" , fontSize: "23px"}, 
      equal: false,
      alert: []
     }))
   }
  }
  clear(){
    this.setState(state =>({
      displayed: [],
      result: 0,
      previous: 0,
      colourResult: { color: "#FFFFFF" , fontSize: "23px"},
      equal: false,
      alert: []
    }))
  }
  number(e){
    this.ifEqual()
    let actual = e.target.value
    let total = this.state.displayed.join("")
    
    this.setState(state =>({
      result: e.target.value,
      previous: e.target.value,
    }))
     
     if(this.state.displayed.length == 0){
       this.setState(state =>({
         displayed: [actual]
       }))
     }else if(/0\-$/.test(total) || numberZeros.test(total)){
       this.setState(state =>({
         displayed: [...this.state.displayed, actual]
       }))
     }else if(this.state.previous == 0){
       let counter = this.state.displayed
       counter.pop()
       this.setState(state =>({
         displayed: [...counter, actual]
       }))
     }else{
       this.setState(state =>({
         displayed: [...this.state.displayed, actual]
       }))
     }
  }
  handleZero(e){
     let actual = e.target.value
     let total = this.state.displayed.join("")
     
     this.setState(state =>({
      result: e.target.value,
      previous: e.target.value
     }))
     
     if(/\./.test(total)){
       this.setState(state =>({
         displayed: [...this.state.displayed, actual]
       }))
     }else if(this.state.displayed.length == 0 || this.state.displayed[0] == 0){
       this.setState(state =>({
         displayed: [0]
       }))
     }else if(decimalZeros.test(total) || numberZeros.test(total)){
       this.setState(state =>({
         displayed: [...this.state.displayed, actual]
       }))
     }else if(/\-0$/.test(total) || this.state.previous == 0){
       this.setState(state =>({
         displayed: [...this.state.displayed]
       }))
     }else{
       this.setState(state =>({
         displayed: [...this.state.displayed, actual]
       }))
     }
  }
  operation(e){
    let actual = e.target.value
    this.setState(state =>({
     result: e.target.value,
     previous: e.target.value
    }))
    
    if(this.state.displayed.length == 0 || this.state.displayed.length == 1 && previousOp.test(this.state.previous)){
      this.setState(state =>({
        displayed: []
      }))
    }else if(previousOp.test(this.state.previous) || this.state.previous == "."){
      let list = this.state.displayed
      list.pop()
      list.push(actual)
      
      this.setState(state =>({
        displayed: list
      }))      
    }else{
      this.setState(state =>({
        displayed: [...this.state.displayed, actual]
      }))
    }
  } 
  handleSubstract(e){
    let actual = e.target.value
    
    this.setState(state =>({
     result: e.target.value,
     previous: e.target.value
    }))
    
    if(this.state.previous == "-" || this.state.previous == "."){
      let list = this.state.displayed
      list.pop()
      list.push(actual)
      this.setState(state =>({
        displayed: list
      }))      
    }else{
      this.setState(state =>({
        displayed: [...this.state.displayed, actual]
      }))
    }
  }
  handleDecimal(e){
    let actual = e.target.value
    let displayed = this.state.displayed.join("")
    
    this.setState(state =>({
     result: e.target.value,
     previous: e.target.value
    }))
    
    if(this.state.displayed.length == 0){
      this.setState(state =>({
        displayed: ["0."]
      }))
    }else if(previousOp.test(this.state.previous)){
      this.setState(state =>({
        displayed: [...this.state.displayed, "0."]
      }))
    }else if(decimalCheck.test(displayed) || /\.$/.test(displayed)){
      this.setState(state =>({
        displayed: [...this.state.displayed]
      }))
    }else{
      this.setState(state =>({
        displayed: [...this.state.displayed, actual]
      }))
    }
  }
  handleEqual(){
    let result = this.state.displayed
    
    if(previousOp.test(this.state.previous)){
      result.pop()
    }
    
    this.setState(state =>({
        displayed: [],
        colourResult: { color: "#FF2E00", fontSize: "30px" },
        equal: true
    }))
    
    if( (eval(result.join(""))) % 1 == 0){
       this.setState(state =>({
         result: eval(result.join(""))
       }))
     }else{
       this.setState(state =>({
         result: eval(result.join("")).toFixed(4)
       }))
     }    
  }
  displayRender(){
    let displayed = this.state.displayed.join("")
    
    if(this.state.displayed.length >= 29){
      this.setState(state =>({
        alert: ["limit reached!"],
      }))
      return this.handleEqual()
    }
    
    return displayed
  }
  render(){
    return(
      <div id="container">
        <div id="screen">
          <div id="alert">{this.state.alert}</div>
          <div id="display">{this.displayRender()}</div>
          <div id="result" style={this.state.colourResult}>{this.state.result}</div>
        </div>
        <div id="buttons">
          <button id="clear" onClick={this.clear}>clear</button>
          <button value="+" class="op" id="add" onClick={this.operation}>+</button>
            <button value="1"class="numbers" id="one" onClick={this.number}>1</button>
            <button value="2" class="numbers" id="two" onClick={this.number}>2</button>
            <button value="3" class="numbers" id="three" onClick={this.number}>3</button>
          <button value="-" class="op" id="subtract" onClick={this.handleSubstract}>-</button>
            <button value="4" class="numbers" id="four" onClick={this.number}>4</button>
            <button value="5" class="numbers" id="five" onClick={this.number}>5</button>
            <button value="6" class="numbers" id="six" onClick={this.number}>6</button>
          <button value="*" class="op" id="multiply" onClick={this.operation}>x</button>
            <button value="7" class="numbers" id="seven" onClick={this.number}>7</button>
            <button value="8" class="numbers" id="eight" onClick={this.number}>8</button>
            <button value="9" class="numbers" id="nine" onClick={this.number}>9</button>
          <button value="/"class="op" id="divide" onClick={this.operation}>/</button>
            <button value="0" class="numbers" id="zero" onClick={this.handleZero}>0</button>
          <button value="." class="numbers" id="decimal" onClick={this.handleDecimal}>.</button>
          <button id="equals" onClick={this.handleEqual}>=</button>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById("root"))

export default App;
