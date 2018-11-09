import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import Input from "antd/lib/input";
import 'antd/lib/input/style';
import Icon from "antd/lib/icon";
import 'antd/lib/icon/style';
import Card from "antd/lib/card";
import 'antd/lib/card/style';
import Form from "antd/lib/form";
import 'antd/lib/form/style';
import Button from "antd/lib/button";
import 'antd/lib/button/style';
import Tooltip from "antd/lib/tooltip";
import 'antd/lib/tooltip/style';
import Spin from "antd/lib/spin";
import 'antd/lib/spin/style'
import Modal from "antd/lib/modal";
import 'antd/lib/modal/style'

import "./styles.css";
import "antd/dist/antd.css";

const FormItem = Form.Item;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loadingOpacity: 0,
      getResp: false,
      appointments: [{"appointfromdate":"T", "appointtodate":"T",}],
    };
  }

  requestAppointments = (values) => {
    let api = "/api/userAppointment/userid/" + values.userid + "?userid=" + values.userid
    axios.get(api).then(response => {
      // console.log("response", response.data );
      let unjson = "";
      let json = {}
      try{
        unjson = response.data.replace(/\\/g, '')
        unjson = unjson.replace(/"{/g, '{')
        unjson = unjson.replace(/"}/g, '}')
        unjson = unjson.replace(/"\[/g, '[')
        unjson = unjson.replace(/\]"/g, ']')
        // console.log("unjson", unjson );
        json = JSON.parse(unjson);
      }catch(error){
        console.log("no valid response", error)
        this.setState({loadingOpacity:0})
        Modal.info({
          title: "错误信息",
          content: "无用户"+values.userid+"预约记录"
        });
        return
      }
      // console.log("keys", json );
      let respItems = [];
      let respNum = json.value.length;
      if(respNum){
        for (let i=0; i < respNum; i++){
          console.log("item.userid1", json.value[i].majorsymptoms)
          respItems.push(json.value[i])
        }
      }else{
        console.log("item.userid2", json.value.majorsymptoms)
        respItems.push(json.value)
      }
      this.setState({
        getResp: true,
        appointments: respItems,
      })

    });
  }

  showAppointment = (appointment) =>{
    // console.log("appointment", appointment)
    let styles={
      textAlign:"left",
    }
    return(
      <div style={{ padding:"5% 5% 0% 5%" }}>
        <Card style={{ width: "100%"}} >
          <p sytle={styles}>用户ID: {appointment.userid}</p>
          <p sytle={styles}>预约日期: {appointment.appointfromdate.split("T")[0]}
          ~{appointment.appointtodate.split("T")[0]}</p>
          <p sytle={styles}>症状描述: {appointment.majorsymptoms}</p>
          <p sytle={styles}>期望疗效: {appointment.treatmentgoals}</p>
        </Card>
      </div>
      )
    
  }

  listAppointments = () => {
    return(
      <div className="App">
        {this.state.appointments.map( (appointment, i) =>
          <div key={i}> {this.showAppointment(appointment)} </div> )}
      </div>
      )
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.setState({loadingOpacity:1})
      // Should format date value before submit.
      const values = {
        ...fieldsValue,
      };
      this.requestAppointments(values);
    });
  };

  inputForm = () => {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 8 },
        sm: { span: 8 }, //box width
      }
    };
    const configUserID = { rules: [{ type: "string", required: true, message: "请输入用户ID" }] };
    return (
      <div style={{padding:24}}>
      <h3 style={{ textAlign: "center"}} >预约查询</h3>
      <Form  onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout}
          label={
            <span>
              用户ID&nbsp;
              <Tooltip title="用户注册时分配的ID">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          } >
          {getFieldDecorator("userid", configUserID)(<Input />)}
        </FormItem>

        <FormItem 
          wrapperCol={{ 
            xs: { span: 24, offset: 10 }, 
            sm: { span: 12, offset: 11 } }} >
          <Button type="primary" htmlType="submit"> 查询 </Button>
          <Spin
            style={{
              opacity: this.state.loadingOpacity,
              position: "relative",
              padding: "7px 0px 0px 15px"
            }}
          />
        </FormItem>
      </Form>
      </div>
    );
  }

  render() {
    if(this.state.getResp){
      return ( this.listAppointments() );
    }else{
      return ( this.inputForm() );
    }
    
  }
}
const WrappedForm = Form.create()(App);
const rootElement = document.getElementById("root");
ReactDOM.render(<WrappedForm />, rootElement);
