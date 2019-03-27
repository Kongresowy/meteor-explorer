import React from 'react';
import axios from 'axios';

import { Icon, Table, Pagination, Button } from 'semantic-ui-react';
import moment from 'moment';

import AddMeteor from './AddMeteor';

const maxNum = 10;

class Main extends React.Component {
  state = {
    direction: 1,
    important: {},
    sortKey: undefined,
    onlyFound: false,
    onlyImportant: false,
    activePage: 1
  };

  columns = [
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: date => moment(date).format('DD.MM.YYYY')
    },
    { key: 'name', header: 'Name', sortable: true, render: name => name },
    {
      key: 'mass',
      header: 'Mass [g]',
      sortable: true,
      render: mass =>
        Number(mass)
          .toFixed(3)
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') // this RegExp formatting string to american number format with commas separated every three counts.
    },
    {
      key: 'fall',
      header: 'Found',
      sortable: true,
      render: fall => (
        <Table.Cell
          className={`${fall === 'Found' ? 'ballotV' : 'ballotX'} centerCell`}
          key="fall"
        >
          <Icon name={fall === 'Found' ? 'check' : 'times'} />
        </Table.Cell>
      )
    },
    {
      key: 'location',
      header: 'Location',
      sortable: false,
      render: (_, { latitude, longitude }) => (
        <Table.Cell className="centerCell locationCell" key="location">
          <pre>
            <code>{latitude.padStart(12)},</code>
            <code>{longitude}</code>
          </pre>
        </Table.Cell>
      )
    },
    {
      key: 'important',
      header: 'Important',
      sortable: true,
      render: (_, { id }) => (
        <Table.Cell
          className="pointed centerCell"
          key="important"
          onClick={() => this.handleImportantClick(id)}
        >
          <Icon
            className="star"
            name={this.state.important[id] ? 'star' : 'star outline'}
          />
        </Table.Cell>
      )
    },
    {
      key: 'delete',
      header: 'Delete',
      sortable: false,
      render: (_, { id }) => (
        <Table.Cell
          className="pointed centerCell"
          key="delete"
          onClick={() => this.handleDeleteClick(id)}
        >
          <Icon
            className="trash"
          />
        </Table.Cell>
      )
    }
  ];

  sortMethod(event, sortKey) {
    this.setState({
      direction: this.state.direction * -1,
      sortKey,
      activePage: 1
    });
  }

  sortRender = data => {
    const { sortKey, direction, activePage, important } = this.state;

    return data
      .sort((a, b) =>
        sortKey === undefined
          ? 0
          : sortKey === 'important'
            ? direction * (!!important[a.id] - !!important[b.id])
            : sortKey === 'mass'
              ? direction * (a[sortKey] - b[sortKey])
              : direction * a[sortKey].localeCompare(b[sortKey])
      )
      .slice((activePage - 1) * maxNum, activePage * maxNum);
  };

  handleImportantClick = id => {
    const isImportant = this.state.important[id];
    this.setState({
      important: {
        ...this.state.important,
        [id]: !isImportant
      }
    });
  };

  handleDeleteClick = id => {
    let objIdToDelete = null;
    this.props.data.forEach(meteor => {
      if (meteor.id === id) {
        objIdToDelete = meteor._id;
      }
    });
    axios.delete('https://meteor-explorer.herokuapp.com/delete', {
      data: { id: objIdToDelete }
    }).then(this.props.reloadData)
      .catch(error => console.error(error));
  }

  toggleFell = () => {
    this.setState({
      onlyFound: !this.state.onlyFound,
      activePage: 1
    });
  };

  toggleImportant = () => {
    this.setState({
      onlyImportant: !this.state.onlyImportant,
      activePage: 1
    });
  };

  handlePaginationChange = (e, { activePage }) => {
    this.setState({
      activePage
    });
  };

  render() {
    const data = this.props.data;

    const {
      onlyFound,
      onlyImportant,
      important,
      sortKey,
      direction,
      activePage,
    } = this.state;

    const activeHeaderCell = {
      backgroundColor: 'rgba(211,211,211, .8)',
      color: "#282828"
    };

    const filteredData = data
      .filter(meteorite => (onlyFound ? meteorite.fall === 'Found' : true))
      .filter(meteorite => (onlyImportant ? important[meteorite.id] : true));

    return (
      <div className="main-div">
        <h1>Meteor Explorer</h1>
        <div className="toggles">
          <Button animated='vertical' onClick={this.toggleFell}>
            <Button.Content hidden><Icon name={onlyFound ? "check" : "times"} /></Button.Content>
            <Button.Content visible>
              Only found
            </Button.Content>
          </Button>
          <Button animated='vertical' onClick={this.toggleImportant}>
            <Button.Content hidden><Icon name={onlyImportant ? "star" : "star outline"} /></Button.Content>
            <Button.Content visible>
              Only important
            </Button.Content>
          </Button>
          <Button animated='vertical' onClick={() => this.child.handleOpen()}>
            <Button.Content hidden>Add meteor</Button.Content>
            <Button.Content visible>
              <Icon name='add' />
            </Button.Content>
          </Button>
        </div>

        <Table celled>
          <Table.Header>
            <Table.Row>
              {this.columns.map(column => (
                <Table.HeaderCell
                  key={column.key}
                  style={
                    column.sortable && sortKey === column.key
                      ? activeHeaderCell
                      : null
                  }
                  onClick={
                    column.sortable
                      ? e => this.sortMethod(e, column.key)
                      : undefined
                  }
                >
                  {column.sortable && (
                    <Icon
                      name={
                        sortKey === column.key
                          ? direction === 1
                            ? 'sort up'
                            : 'sort down'
                          : 'sort'
                      }
                    />
                  )}
                  {column.header}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.sortRender(filteredData).map(item => (
              <Table.Row key={item.id}>
                {this.columns.map(column => {
                  const rendered = column.render(item[column.key], item);
                  return typeof rendered !== 'string' ? (
                    rendered
                  ) : (
                      <Table.Cell key={column.key}>{rendered}</Table.Cell>
                    );
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <Pagination
          ellipsisItem={undefined}
          firstItem={null}
          lastItem={null}
          prevItem={
            filteredData.length < 11
              ? null
              : { content: <Icon name="angle left" />, icon: true }
          }
          nextItem={
            filteredData.length < 11
              ? null
              : { content: <Icon name="angle right" />, icon: true }
          }
          pointing
          secondary
          activePage={activePage}
          onPageChange={this.handlePaginationChange}
          totalPages={Math.ceil(filteredData.length / 10)}
        />

        <AddMeteor ref={instance => { this.child = instance; }} reloadData={this.props.reloadData} />

        <div className="videoBcg">
          <video playsInline muted loop autoPlay>
            <source src="https://www.stormfors.se/sites/default/kundprojekt/apsis/apsisTWO-76-v2_small-1mpbs.mp4"></source>
          </video>
        </div>
      </div>
    );
  }
}

export default Main;
