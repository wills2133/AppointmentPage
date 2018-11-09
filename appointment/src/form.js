import 'babel-polyfill';
import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";


import Input from "antd/lib/input";
import 'antd/lib/input/style';
import Icon from "antd/lib/icon";
import 'antd/lib/icon/style';
import Tooltip from "antd/lib/tooltip";
import 'antd/lib/tooltip/style';
import Col from "antd/lib/col";
import 'antd/lib/col/style';
import Form from "antd/lib/form";
import 'antd/lib/form/style';
import DatePicker from "antd/lib/date-picker";
import 'antd/lib/date-picker/style';
import Button from "antd/lib/button";
import 'antd/lib/button/style';
import Spin from "antd/lib/spin";
import 'antd/lib/spin/style'
import Modal from "antd/lib/modal";
import 'antd/lib/modal/style'

import moment from 'moment-timezone'
import axios from 'axios'
const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
class AppintForm extends React.Component {
  constructor() {
    super();
    this.state = {
      loadingOpacity: 0,
      getResp: false,
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      const rangeTimeValue = fieldsValue['range-time-picker'];
      if (err) {
        return;
      }
      this.setState({loadingOpacity:1})
      // Should format date value before submit.
      const values = {
        ...fieldsValue,
        "appointfromdate": fieldsValue["appointfromdate"].format("YYYY-MM-DD HH:MM"),
        "appointtodate": fieldsValue["appointtodate"].format("YYYY-MM-DD HH:MM"),
        // 'range-time-picker': [
        //   rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
        //   rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
        // ],
      };
      console.log("values", values)
      this.setState({
        fromDate:values.appointfromdate,
        toDate:values.appointtodate,
      })
      let tzDateTime = moment().tz("Canada/Pacific").format("YYYY-MM-DD HH:MM");
      const appointment = {
        created: tzDateTime,
        userid: values.userid,
        UUID:"",
        ctrParm: "",
        value: JSON.stringify(values),
      }
      this.props.postAppointment(appointment);
    });
  };

  inputForm = (getFieldDecorator) => {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 8 }, //box width
      }
    };
    const configRange = {rules: [{ type: "object", required: true, message: "请选择预约起止时间" }] };
    const configFrom = {rules: [{ type: "object", required: true, message: "请选择预约起始时间" }] };
    const configTo = {rules: [{ type: "object", required: true, message: "请选择预约终止时间" }] };
    const configUserID = { rules: [{ type: "string", required: true, message: "请输入用户ID" }] };
    const configSymptom = {rules: [{ type: "string", required: true, message: "请输入用户症状" }] };
    const configGoal = { rules: [{ type: "string", required: true, message: "请输入用户期望" }] };


    return (
      <div style = {{padding:"5%"}}>
      <h2 style={{ textAlign: "center"}} >预约信息</h2>
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

        <FormItem label={<span>用户症状</span>} {...formItemLayout}>
          {getFieldDecorator("majorsymptoms", configSymptom)(<TextArea rows={4} />)}
        </FormItem>

        <FormItem label={<span>用户期望</span>} {...formItemLayout}>
          {getFieldDecorator("treatmentgoals", configGoal)(<TextArea rows={4} />)}
        </FormItem>
   
        {/*<FormItem
          {...formItemLayout}
          label="预约日期"
        >
          {getFieldDecorator('range-time-picker', configRange)(
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          )}
        </FormItem>*/}


          <FormItem label={<span> <span></span>  预约日期</span>} {...formItemLayout}>
          <Col span={11}>
            <FormItem>
              {getFieldDecorator("appointfromdate", configFrom)(
                <DatePicker showTime format="YY-MM-DD HH:mm" style={{width:150}}/>)}
            </FormItem>
          </Col>
          <Col span={2}>
            <span style={{ display: "inline-block", width: "100%", textAlign: "center" }} >
              -
            </span>
          </Col>
          <Col span={11}>
            <FormItem>
              {getFieldDecorator("appointtodate", configTo)(
                <DatePicker showTime format="YY-MM-DD HH:mm" style={{width:150}}/>)}
            </FormItem>
          </Col>
        </FormItem>

        <FormItem 
        wrapperCol={{ xs: { span: 24, offset: 10 }, sm: { span: 16, offset: 11 } }} >
          <Button type="primary" htmlType="submit"> 提交 </Button>
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
    const { getFieldDecorator } = this.props.form;
    if(this.state.getResp){
      return( this.inputForm(getFieldDecorator) )
    }else{
      return( <div>{this.inputForm(getFieldDecorator)}</div> )
    }
    
  }
}

const WrappedForm = Form.create()(AppintForm);

export default WrappedForm;
