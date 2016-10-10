import React, {Component, PropTypes} from 'react';
import styles from './fields.css';
import {Table, Button} from 'react-bootstrap';
import FieldEditModal from './fieldEditModal.js';
// import DatatypeCreateModal from './fieldCreateModal.js';
import {deleteField} from '../../ducks/fieldsDucks.js';
import ToggleDisplay from 'react-toggle-display';

let DeleteButton = React.createClass({
  propTypes: {
    onItemClick: PropTypes.func,
    field: PropTypes.object
  },
  render() {
    return (
      <Button bsStyle="danger" bsSize="xsmall" onClick={this._onClick}>Delete</Button>
    );
  },
  _onClick() {
    this.props.onItemClick(this.props.field.id);
  }
});

export default class Fields extends Component {
  static propTypes = {
    fields: PropTypes.array,
    dispatch: PropTypes.func,
    auth: PropTypes.object
  }

  state = {
    isAuthorized: false
  }

  handleDelete = id => {
    this.props.dispatch(deleteField(id));
  }

  checkPermissions = permissions => {
    if (!permissions) return false;
    if (permissions.indexOf('write') > -1) {
      return true;
    }
    return false;
  }

  componentWillUpdate(nextProps) {
    const self = this;
    if (nextProps.auth.user.permissions !== self.props.auth.user.permissions) {
      this.setState({
        isAuthorized: self.checkPermissions(self.props.auth.user.permissions)
      });
    }
  }

  render() {
    // sort fields by id
    const self = this;
    const fields = this.props.fields.sort((a, b) => {
      return parseFloat(a.id) - parseFloat(b.id);
    });
    // templatize the fields to be placed in Component
    let template = fields.map((field, idx) => {
      return (
        <tr key={idx}>
          <td>{field.id}</td>
          <td>{field.name}</td>
          <td>{field.description}</td>
          <ToggleDisplay show={self.state.isAuthorized} tag="td">
            <DeleteButton field={field} onItemClick={self.handleDelete}></DeleteButton>
          </ToggleDisplay>
        </tr>
    );
    });

    return (
      <div className={styles._container}>
        <h1>Fields</h1>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Description</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {template}
          </tbody>
        </Table>
      </div>
    );
  }
}
