import React from 'react';
import axios from 'axios';
import uuid from 'uuid';
import { Icon, Form, Button, Segment, Dimmer, Header } from 'semantic-ui-react';

const addFormOptions = [
  { key: "y", text: "Yes", value: "Found" },
  { key: "n", text: "No", value: "Fell" }
];

let defaultState = {
  // inputs
  date: '',
  name: '',
  mass: '',
  fall: undefined,
  latitude: '',
  longitude: '',
  // checkers
  dateChecked: false,
  nameChecked: false,
  massChecked: false,
  fallChecked: false,
  latChecked: false,
  lonChecked: false,
  // dimmer
  activeDimmer: false,
  confirmAdd: false,
}

class AddMeteor extends React.Component {
  state = defaultState;

  handleChangeDate = (e) => {
    let formDate = (new Date(e.target.value)).toJSON();
    if (formDate === null || e.target.value.length !== 10) {
      this.setState({ dateChecked: false });
    } else {
      this.setState({ date: formDate, dateChecked: true });
    }
  }

  handleChangeName = name => (e) => {
    let formName = e.target.value.toLowerCase();
    let invalid = formName.length > 20 || formName.length < 1;
    this.setState({ [`${name}Checked`]: !invalid, [name]: invalid ? '' : formName });
  }

  handleChangeMass = (e) => {
    let formMass = Number(e.target.value).toFixed(3);
    if (formMass > 9999999999 || formMass <= 0) {
      this.setState({ massChecked: false });
    } else {
      this.setState({ mass: formMass, massChecked: true });
    }
  }

  handleChangeFall = (e, { value }) => {
    this.setState({ fall: value, fallChecked: true });
  }

  handleChangeLat = (e) => {
    let formLatitude = Number(e.target.value).toFixed(6);
    if (formLatitude < -90 || formLatitude > 90 || e.target.value.length > 15 ||  e.target.value.length < 1) {
      this.setState({ latChecked: false });
    } else {
      this.setState({ latitude: formLatitude, latChecked: true });
    }
  }

  handleChangeLon = (e) => {
    let formLongitude = Number(e.target.value).toFixed(6);
    if (formLongitude < -180 || formLongitude > 180 || e.target.value.length > 15 || e.target.value.length < 1) {
      this.setState({ lonChecked: false });
    } else {
      this.setState({ longitude: formLongitude, lonChecked: true });
    }
  }

  handleAddMeteor = (e) => {
    e.preventDefault();
    const { date, name, mass, fall, latitude, longitude } = this.state;
    const newMeteorite = { date, name, mass, fall, latitude, longitude, id: uuid() };
    axios.post('https://meteor-explorer.herokuapp.com/add', newMeteorite)
      .then(this.props.reloadData)
      .catch(error => console.error(error));

    this.setState({ confirmAdd: true });
    setTimeout(() => { this.setState({ confirmAdd: false, activeDimmer: false }); }, 1200);
  }

  handleOpen = () => this.setState({ activeDimmer: true });

  handleClose = () => this.setState(defaultState);

  render() {

    const { confirmAdd, activeDimmer, dateChecked, nameChecked, massChecked, fallChecked, latChecked, lonChecked } = this.state;

    const enabled =
      dateChecked &&
      nameChecked &&
      massChecked &&
      fallChecked &&
      latChecked &&
      lonChecked;

    return (
      <Dimmer active={activeDimmer} onClickOutside={this.handleClose} page>
        {confirmAdd ? <Header as='h1' icon inverted>
          <Icon name='check circle outline' />
          New meteor added successfully!
          </Header>
          :
          <Segment inverted>
            <Form inverted>
              <Form.Group>
                <Form.Input name="date" type="date" fluid label='Date' placeholder='DD.MM.YYYY' onChange={this.handleChangeDate} />
                <Form.Input name="name" type="text" fluid label='Name' placeholder='Name' onChange={this.handleChangeName('name')} />
                <Form.Input type="number" fluid label='Mass [g]' placeholder='Mass [g]' onChange={this.handleChangeMass} />
                <Form.Select fluid label='Found' options={addFormOptions} placeholder='-' onChange={this.handleChangeFall} />
                <Form.Input type="number" fluid label='Location Latitude' placeholder='Location Latitude' onChange={this.handleChangeLat} />
                <Form.Input type="number" fluid label='Location Longitude' placeholder='Location Longitude' onChange={this.handleChangeLon} />
              </Form.Group>
              <Button disabled={!enabled} type='submit' onClick={this.handleAddMeteor}>Add meteor</Button>
            </Form>
          </Segment>
        }
      </Dimmer>
    );
  }
}

export default AddMeteor;