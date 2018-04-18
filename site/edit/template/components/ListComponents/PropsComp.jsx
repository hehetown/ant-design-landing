import React from 'react';
import Collapse from 'antd/lib/collapse';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Tooltip from 'antd/lib/tooltip';
import Icon from 'antd/lib/icon';
import Switch from 'antd/lib/switch';
import Select from 'antd/lib/select';
import InputNumber from 'antd/lib/input-number';
import InputGroup from './InputGroup';
import tempData from '../../../../templates/template/element/template.config';
import compConfig from '../../component.config';
import { mergeEditDataToDefault } from '../../../../utils';
import { getDataSourceValue } from '../../utils';
import CheckboxGroup from './CheckboxGroup';

const Panel = Collapse.Panel;

export default class PropsComp extends React.PureComponent {
  getCompChild = (defaultValue, v, key) => {
    const { type, value, props } = defaultValue;
    const currentValue = typeof v !== 'undefined' ? v : value;
    switch (type) {
      case 'switch':
        return (<Switch
          {...props}
          size="small"
          checked={currentValue}
          onChange={(data) => { this.props.onChange(key, data); }}
        />);
      case 'inputGroup':
        return (<InputGroup
          {...props}
          value={currentValue}
          onChange={(data) => { this.props.onChange(key, data); }}
        />);
      case 'select':
        return (
          <Select
            {...props}
            value={currentValue}
            onChange={(data) => { this.props.onChange(key, data); }}
            size="small"
            getPopupContainer={node => node.parentNode.parentNode.parentNode.parentNode.parentNode}
          >
            {props.children.map((k) => {
              return (<Select.Option key={k}>{k}</Select.Option>);
            })}
          </Select>);
      case 'checkbox':
        return (
          <CheckboxGroup
            {...props}
            value={currentValue}
            size="small"
            onChange={(data) => { this.props.onChange(key, data); }}
          />);
      case 'inputNumber':
        return (
          <InputNumber
            {...props}
            size="small"
            value={currentValue}
            onChange={(data) => { this.props.onChange(key, data); }}
          />);
      default:
        break;
    }
  }
  getChildrenToRender = (config, template) => {
    const t = Object.keys(config).filter(key => key !== 'apiLink').map((key) => {
      const defaultData = config[key];
      const templateData = template[key];
      const compChild = this.getCompChild(defaultData, templateData, key);
      const tip = defaultData.remark && (
        <Tooltip
          placement="topRight"
          arrowPointAtCenter
          title={<span>{defaultData.remark}</span>}
        >
          <Icon type="question-circle" style={{ marginLeft: 8 }} />
        </Tooltip>
      );
      return [
        <Row gutter={8} key={`${defaultData.name}-1`}>
          <Col>
            {defaultData.name} - {key}
            {tip}
          </Col>
        </Row>,
        <Row gutter={8} key={`${defaultData.name}-2`}>
          <Col>
            {compChild}
          </Col>
        </Row>,
      ];
    });
    return t;
  }
  render() {
    const { edit, currentEditData, templateData } = this.props;
    const editArray = edit ? edit.split(',').filter(c => c !== 'text' && c !== 'image') : [];
    if (!edit || !editArray.length) {
      return null;
    }
    const { id } = currentEditData;
    const ids = id.split('-');
    const cid = ids[0].split('_')[0];
    const tempDataSource = tempData[cid];
    const newTempDataSource = mergeEditDataToDefault(templateData.data.config[ids[0]],
      tempDataSource);
    const currentEditTemplateData = getDataSourceValue(ids[1], newTempDataSource);
    const childToRender = this.getChildrenToRender(compConfig[editArray[0]], currentEditTemplateData);
    return (
      <Collapse bordered={false} defaultActiveKey={['1']}>
        <Panel
          header={
            <p>{editArray[0]} 编辑 {
              compConfig[editArray[0]].apiLink && (
                <a target="_blank" href={compConfig[editArray[0]].apiLink}>查看 API</a>
              )}
            </p>
          }
          key="1"
        >
          {childToRender}
        </Panel>
      </Collapse>
    );
  }
}