import React, { useState, useEffect } from 'react';
import {
  List, ListItem, Collapse, Checkbox, Typography, ButtonBase, NoSsr,
} from '@material-ui/core';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import SearchBar from '../../components/SearchBar';
import TitleBar from '../../components/TitleBar';
import { MobileComponent, DesktopComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import ServiceMapButton from '../../components/ServiceMapButton';

const ServiceTreeView = ({
  classes, intl, navigator, setTreeState, prevSelected, prevOpened, settings, getLocaleText,
}) => {
  const [services, setServices] = useState(null);
  const [opened, setOpened] = useState([...prevOpened]);
  const [selected, setSelected] = useState([...prevSelected]);
  const [selectedOpen, setSelectedOpen] = useState(false);

  const checkChildNodes = (node, nodes = []) => {
    if (services.find(e => e.id === node.children[0])) {
      const nodeObjects = node.children.map(child => services.find(e => e.id === child));
      nodes.push(...nodeObjects);
      nodeObjects.forEach((i) => {
        if (opened.some(e => e === i.id)) {
          nodes.push(...checkChildNodes(i));
        }
      });
      return (nodes);
    }
    return [];
  };

  const fetchInitialServices = () => {
    Promise.all([
      fetch('https://api.hel.fi/servicemap/v2/service_node/?level=0&page=1&page_size=1000').then(response => response.json()),
      prevOpened.length
      && Promise.all(prevOpened.map(id => fetch(`https://api.hel.fi/servicemap/v2/service_node/?parent=${id}&page=1&page_size=1000`)
        .then(response => response.json())))
        .then((data) => {
          const combinedData = [];
          data.forEach((i) => {
            i.results.forEach((e) => {
              combinedData.push(e);
            });
          });
          return combinedData.map(i => i);
        }),
    ]).then((data) => {
      const fullData = [...data[0].results, ...data[1] ? data[1] : []];
      const serviceData = fullData.map(service => (
        service
      ));
      setServices(serviceData);
    });
  };

  const fetchChildServices = async (service) => {
    fetch(`https://api.hel.fi/servicemap/v2/service_node/?parent=${service.id}&page=1&page_size=1000`)
      .then(response => response.json())
      .then((data) => {
        const newState = [...services, ...data.results];
        setServices(newState);
        setOpened([...opened, service.id]);
        if (selected.find(e => e.id === service.id)) {
          setSelected([...selected, ...data.results]);
        }
      });
  };

  const getSelectedParentNodes = (item, data = []) => {
    if (item.parent) {
      const checkdedParent = selected.find(e => e.id === item.parent && e.name);
      if (checkdedParent) {
        data.push(checkdedParent.id);
        if (checkdedParent.parent) {
          getSelectedParentNodes(checkdedParent, data);
        } else {
          return data;
        }
        return data;
      }
    }
    return null;
  };

  const getSelectedChildNodes = (item, data = []) => {
    let child = item;
    if (typeof item === 'number') {
      child = selected.find(e => e.id === item);
    }
    if (child && child.children) {
      data.push(...child.children);
      child.children.forEach((c) => {
        getSelectedChildNodes(c, data);
      });
    } return data;
  };


  const handleExpand = (service, isOpen) => {
    const isChecked = selected.find(e => e.id === service.id);
    if (isOpen) { // Close expanded item
      setOpened(opened.filter(e => e !== service.id));
    } else if (services.some(e => e.parent === service.id)) { // Expand item without fetching
      setOpened([...opened, service.id]);
      if (isChecked) checkChildNodes(service);
    } else { // Fetch child elements then expand
      fetchChildServices(service);
    }
  };


  const handleCheckboxClick = (e, item) => {
    if (selected.some(element => element.id === item.id)) {
    // Remove checkbox selections
      const parentsToRemove = getSelectedParentNodes(item);
      const childrenToRemove = getSelectedChildNodes(item);
      const nodesToRemove = [...parentsToRemove || [], ...childrenToRemove || []];

      // Remove nodes from selected state
      if (nodesToRemove && nodesToRemove.length) {
        setSelected(
          selected.filter(element => element.id !== item.id && !nodesToRemove.includes(element.id)),
        );
      } else {
        setSelected(selected.filter(element => element.id !== item.id));
      }
    } else {
    // Add checkbox selections
      let newState = [item, ...checkChildNodes(item)];
      // Check duplicates
      newState = newState.filter(e => !selected.some(i => i.id === e.id));

      setSelected([...selected, ...newState]);
      e.stopPropagation();
    }
  };

  useEffect(() => { // On mount
    fetchInitialServices();
  }, []);


  // Render components

  // Expanding list item representing a service node
  const expandingListComponent = (item, level) => {
    const visible = item.level === 0 || opened.includes(item.parent);
    const isOpen = opened.includes(item.id);
    const hasChildren = item.children.length;
    const children = hasChildren ? services.filter(e => e.parent === item.id) : null;
    const icon = isOpen
      ? <ArrowDropDown className={classes.right} />
      : <ArrowDropUp className={classes.right} />;

    const resultCount = (settings.helsinki ? item.unit_count.municipality.helsinki || 0 : 0)
      + (settings.espoo ? item.unit_count.municipality.espoo || 0 : 0)
      + (settings.vantaa ? item.unit_count.municipality.vantaa || 0 : 0)
      + (settings.kauniainen ? item.unit_count.municipality.kauniainen || 0 : 0);

    return (
      <ListItem
        disableGutters
        className={`${classes.listItem} ${classes[`level${level}`]}`}
        role="group"
        aria-label={`${getLocaleText(item.name)} (${resultCount})`}
        key={item.id}
      >
        <div
          key={item.id}
          style={{
            paddingLeft: 8 * level,
            display: 'flex',
            flexDirection: 'row',
            alignSelf: 'center',
            // width: '100%',
            paddingRight: 16,
            height: 60,
          }}
        >
          <Checkbox
            className={classes.checkbox}
            id={`box${item.id}`}
            tabIndex={visible ? '0' : '-1'}
            onClick={e => handleCheckboxClick(e, item)}
            icon={<span className={classes.checkboxIcon} />}
            color="primary"
            checked={selected.some(e => e.id === item.id)}
          />
          <ButtonBase // Item expand click area
            className={classes.clickArea}
            aria-label={`${isOpen ? 'Sulje palvelu' : 'Avaa palvelu'} ${getLocaleText(item.name)}`}
            aria-pressed={isOpen}
            tabIndex={visible ? '0' : '-1'}
            onClick={hasChildren ? () => handleExpand(item, isOpen) : null}
            disabled={!hasChildren}
            disableRipple
            disableTouchRipple
          >
            <Typography align="left" className={`${classes.text} ${classes[`text${level}`]}`}>
              {`${getLocaleText(item.name)} (${resultCount})`}
            </Typography>
            {hasChildren
              ? icon
              : <span className={classes.right} />}
          </ButtonBase>
        </div>

        <Collapse // Expanding area
          aria-hidden={!isOpen}
          in={isOpen}
        >
          <List disablePadding>
            {children && children.length && children.map(child => (
              expandingListComponent(child, level + 1)
            ))}
          </List>
        </Collapse>
      </ListItem>
    );
  };

  const citySettingsInfo = () => {
    let citySettings = [
      ...settings.helsinki ? ['Helsinki'] : [],
      ...settings.espoo ? ['Espoo'] : [],
      ...settings.vantaa ? ['Vantaa'] : [],
      ...settings.kauniainen ? ['Kauniainen'] : [],
    ];
    if (citySettings.length === 4) {
      citySettings = [];
    }

    if (citySettings.length) {
      return (
        <div
          className={classes.infoArea}
          aria-label={`${intl.formatMessage({ id: 'settings.city.info' }, { count: citySettings.length })}: ${citySettings.join(', ')}`}
        >
          <Typography aria-hidden className={`${classes.infoText} ${classes.bold}`}>
            <FormattedMessage id="settings.city.info" values={{ count: citySettings.length }} />
            {':'}
            &nbsp;
          </Typography>
          <Typography aria-hidden className={classes.infoText}>
            {citySettings.join(', ')}
          </Typography>
        </div>
      );
    } return null;
  };

  const selectedItemsInfo = selectedItems => (
    <div className={classes.infoArea}>
      <ButtonBase disabled={!selectedItems.length} onClick={() => setSelectedOpen(!selectedOpen)}>
        <Typography className={`${classes.infoText} ${classes.bold}`} variant="body2">
          <FormattedMessage id="services.selectionAmount" values={{ count: selectedItems.length }} />
        </Typography>
        {selectedOpen
          ? <ArrowDropDown className={classes.infoText} />
          : <ArrowDropUp className={classes.infoText} />}
      </ButtonBase>
      {selectedItems.length ? (
        <ButtonBase
          className={classes.right}
          disabled={!selectedItems.length}
          onClick={() => setSelected([])}
        >
          <Typography className={classes.infoText} variant="body2">
            <FormattedMessage id="services.deleteAll" />
          </Typography>
        </ButtonBase>
      ) : null}
    </div>
  );

  // List of items that the user has selected
  const selectedItemsList = items => (
    <Collapse in={selectedOpen}>
      <List>
        {items.map(item => (
          item.name && (
            <ListItem>
              <Typography className={classes.infoText} variant="body2">
                {getLocaleText(item.name)}
              </Typography>
              <ButtonBase
                className={classes.right}
                tabIndex={selectedOpen ? '0' : '-1'}
                onClick={() => handleCheckboxClick(null, item)}
              >
                <Typography className={classes.infoText} variant="body2">
                  <FormattedMessage id="services.delete" />
                </Typography>
              </ButtonBase>
            </ListItem>
          )
        ))}
      </List>
    </Collapse>
  );

  const TopBar = (
    <div>
      <DesktopComponent>
        <SearchBar placeholder={intl.formatMessage({ id: 'search' })} />
        { /* <TitleBar icon={icon} title={title} primary /> */}
      </DesktopComponent>
      <MobileComponent>
        <TitleBar title={intl.formatMessage({ id: 'home.buttons.services' })} primary backButton />
      </MobileComponent>
    </div>
  );


  // Render

  // Form list of selected services, filtering out services whose parents are already selected.
  const selectedList = selected.filter(e => !selected.some(i => i.id === e.parent));

  return (
    <>
      <div className={classes.topArea}>
        {TopBar}
        <NoSsr>
          {citySettingsInfo()}
          {selectedItemsInfo(selectedList)}
          {selectedItemsList(selectedList)}
        </NoSsr>

        <ServiceMapButton
          className={classes.nodeSearchButton}
          disabled={!selectedList.length}
          onClick={() => {
            setTreeState({ selected: selectedList, opened });
            navigator.push('search', { nodes: selectedList.map(i => i.id) });
          }}
        >
          <FormattedMessage id="services.search" />
        </ServiceMapButton>
      </div>
      <List disablePadding>
        {services && services.map(service => (
          !service.parent && (
            expandingListComponent(service, 1)
          )
        ))}
      </List>
    </>
  );
};

export default ServiceTreeView;
