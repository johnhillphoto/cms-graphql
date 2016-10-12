import React, {Component, PropTypes} from 'react';
// import keydown from 'react-keydown';
import stylesToo from './datatypes.css';
import {Dialog, FlatButton, TextField, Divider, SelectField, MenuItem} from 'material-ui';
import {blue300, indigo900, green200} from 'material-ui/styles/colors';
import {createDatatype} from '../../ducks/datatypesDucks.js';
import {Button, ListGroup, ListGroupItem} from 'react-bootstrap';
import {styles} from './modalStyles.js';
import {DeletableChip, AddableChip} from './subComponents/subComponents.js';

const chosenChecker = (item, checkAgainst) => {
  let res = false;
  let count = 0;
  checkAgainst.forEach(check => {
    if (check.id === item.id) {
      count++;
      res = true;
    }
  });
  return {result: res, count};
};

const idsFromFields = fields => {
  let ids = [];
  for (let i = 0; i < fields.length; i++) {
    ids.push(fields[i].id);
  }
  return ids;
};

export default class DatatypeCreateModal extends Component {
  static propTypes = {
    datatype: PropTypes.object,
    datatypes: PropTypes.array,
    fields: PropTypes.array,
    dispatch: PropTypes.func
  }
  state = {
    open: false,
    name: '',
    description: '',
    visible: true,
    fields: this.props.fields,
    errorText: ''
  };

// this handles any changes to the inputs
  handleChange = event => {
    const lineKey = event.target.id;
    this.setState({
      [lineKey]: event.target.value
    });
  };

  handleRequestChipDelete = id => {
    let newFields = [];
    newFields = this.state.fields.filter(field => field.id !== id);
    this.setState({fields: newFields});
  }
  handleChipAdd = field => {
    this.setState({fields: this.state.fields.concat([field])});
  }

  handleChangeVisible = (event, index, value) => this.setState({visible: value});

  handleOpen = () => {
    this.setState({open: true});
  };

  handleSubmit = () => {
    this.setState({open: false});

    let newDatatypeInfo = {
      name: this.state.name,
      description: this.state.description,
      visible: this.state.visible,
      fields: idsFromFields(this.state.fields)
    };
    JSON.stringify(newDatatypeInfo);
    this.props.dispatch(createDatatype(newDatatypeInfo));
  };
// this handles the closing of the modal/dialog
  handleClose = () => {
    this.setState({
      open: false,
      name: '',
      description: '',
      visible: true,
      fields: this.props.fields,
      errorText: ''
    });
  };

  render() {
    // these are used by the modal
    const actions = [
      <FlatButton
        label="Cancel"
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        onTouchTap={this.handleSubmit}
      />
    ];
    // templatize the fields to be chips in Component
    const self = this;
    let allFields = this.props.fields;
    let fields = this.state.fields;
    let templateStoredFields = fields.map((field, idx) => {
      return (
        <ListGroupItem key={idx}>
          <DeletableChip field={field} onDeleteClick={self.handleRequestChipDelete}></DeletableChip>
        </ListGroupItem>
      );
    });
    // templatize all available fields to be chips in Component
    let templateAllFields = allFields.map((field, idx) => {
      let backgroundColor = blue300;
      let check = chosenChecker(field, this.state.fields);
      if (check.result === true) {
        backgroundColor = green200;
      }
      return (
        <ListGroupItem key={idx}>
          <AddableChip
            backgroundColor={backgroundColor}
            field={field}
            count={check.count}
            onAddClick={self.handleChipAdd}>
          </AddableChip>
        </ListGroupItem>
      );
    });

    return (
      <div>
        <Button bsStyle="success" bsSize="xsmall" onTouchTap={this.handleOpen}>Create Datatype</Button>
        <Dialog
          title="Create Datatype"
          contentStyle={{width: "80%", height: "100%", maxHeight: "none", maxWidth: "none", fontSize: "10px"}}
          actions={actions} open={this.state.open} >
          <div>
            <div style={styles.wrapper}>
              <TextField
                floatingLabelText="Name"
                id="name"
                value={this.state.name}
                onChange={this.handleChange}
                name="Name"
                />
              <TextField
                floatingLabelText="Description"
                id="description"
                value={this.state.description}
                onChange={this.handleChange}
                />
              <SelectField value={this.state.visible} id="visibleSel" onChange={this.handleChangeVisible} floatingLabelText="Visible Status">
                <MenuItem key={1} value={true} primaryText={'Visible'}/>
                <MenuItem key={2} value={false} primaryText={'Hidden'}/>
              </SelectField>
            </div>
            <Divider/>
          </div>
          {/* diplay fields */}
          <h4>Fields</h4>
          <div style={styles.wrapper}>
            <ListGroup>
              {templateAllFields}
            </ListGroup>
            <ListGroup>
              {templateStoredFields}
            </ListGroup>
          </div>
        </Dialog>
      </div>
    );
  }
}
