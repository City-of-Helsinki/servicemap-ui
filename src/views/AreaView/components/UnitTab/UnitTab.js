import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Typography } from '@material-ui/core';
import AddressItem from '../../../../components/ListItems/AddressItem/AddressItem';
import { AreaIcon } from '../../../../components/SMIcon';


const UnitTab = ({ address, districtData, classes }) => (
  <List>
    {address && (
      <>
        <AddressItem className={classes.addressItem} address={address} />

        <ListItem>
          <div className={classes.subtitle}>
            <AreaIcon className={classes.rightPadding} />
            <Typography className={classes.bold}>Oman alueesi palvelut</Typography>
          </div>
        </ListItem>

        <ListItem>
          <div className={classes.subtitle}>
            <AreaIcon className={classes.rightPadding} />
            <Typography className={classes.bold}>Lähialueeiden palvelut</Typography>
          </div>
        </ListItem>

      </>
    )}
    {districtData && districtData.map(item => (
      item.unit && (
      <ListItem><Typography>{item.unit.name.fi}</Typography></ListItem>
      )
    ))}
  </List>
);

UnitTab.propTypes = {
  address: PropTypes.objectOf(PropTypes.any),
  districtData: PropTypes.arrayOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

UnitTab.defaultProps = {
  address: null,
  districtData: null,
};

export default UnitTab;
