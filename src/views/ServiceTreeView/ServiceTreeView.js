import React, { useState, useEffect } from 'react';
import {
  List, ListItem, Collapse, Checkbox, Typography, ButtonBase,
} from '@material-ui/core';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import SearchBar from '../../components/SearchBar';
import TitleBar from '../../components/TitleBar';
import { MobileComponent, DesktopComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import SMButton from '../../components/ServiceMapButton';

const ServiceTreeView = ({
  classes, intl, navigator, setTreeState, prevSelected, prevOpened, settings,
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
    // console.log('handling item: ', item);
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
    } else { // Add checkbox selections
      let newState = [item, ...checkChildNodes(item)];
      // Check duplicates
      newState = newState.filter(e => !selected.some(i => i.id === e.id));

      setSelected([...selected, ...newState]);
      e.stopPropagation();
    }
  };

  useEffect(() => {
    fetchInitialServices();
  }, []);

  const expandingComponent = (item, level) => {
    const hasChildren = item.children.length;
    const isOpen = opened.includes(item.id);
    const children = hasChildren ? services.filter(e => e.parent === item.id) : null;
    const icon = isOpen
      ? <ArrowDropDown className={classes.iconRight} />
      : <ArrowDropUp className={classes.iconRight} />;

    const resultCount = (settings.helsinki ? item.unit_count.municipality.helsinki || 0 : 0)
      + (settings.espoo ? item.unit_count.municipality.espoo || 0 : 0)
      + (settings.vantaa ? item.unit_count.municipality.vantaa || 0 : 0)
      + (settings.kauniainen ? item.unit_count.municipality.kauniainen || 0 : 0);

    return (
      <div key={item.id}>
        <ListItem
          style={{ paddingLeft: 8 * level }}
          key={item.id}
          disableGutters
          className={`${classes.listItem} ${classes[`level${level}`]}`}
        >
          <Checkbox
            onClick={e => handleCheckboxClick(e, item)}
            icon={<span className={classes.checkBoxIcon} />}
            color="primary"
            className={classes.checkBox}
            checked={selected.some(e => e.id === item.id)}
          />
          <ButtonBase
            style={{ width: '100%', paddingTop: 8, paddingBottom: 8 }}
            disabled={!hasChildren}
            disableRipple
            disableTouchRipple
            onClick={hasChildren ? () => handleExpand(item, isOpen) : null}
          >
            <Typography align="left" className={`${classes.text} ${classes[`text${level}`]}`}>
              {`${item.name.fi} (${resultCount})`}
            </Typography>
            {hasChildren ? icon : <span className={classes.iconRight} />}
          </ButtonBase>
        </ListItem>

        <Collapse aria-hidden={!isOpen} tabIndex={isOpen ? '0' : '-1'} in={isOpen}>
          {children && children.length && children.map(child => (
            expandingComponent(child, level + 1)
          ))}
        </Collapse>
      </div>
    );
  };

  const TopBar = (
    <div>
      <DesktopComponent>
        <SearchBar />
        { /* <TitleBar icon={icon} title={title} primary /> */}
      </DesktopComponent>
      <MobileComponent>
        <TitleBar title="Kaikki palvelut" primary backButton />
      </MobileComponent>
    </div>
  );

  const selectedList = [];
  selected.forEach((e) => {
    if (!selected.some(i => i.id === e.parent)) {
      selectedList.push(e);
    }
  });
  const ids = selectedList.map(i => i.id);

  let citySettings = [
    ...settings.helsinki ? ['Helsinki'] : [],
    ...settings.espoo ? ['Espoo'] : [],
    ...settings.vantaa ? ['Vantaa'] : [],
    ...settings.kauniainen ? ['Kauniainen'] : [],
  ];

  if (citySettings.length === 4) {
    citySettings = [];
  }

  const cityString = citySettings.join(', ');

  return (
    <>
      <div className={classes.topArea}>
        {TopBar}
        <>
          <div style={{ color: '#fff', display: 'flex', paddingLeft: 16 }}>
            {citySettings.length ? (
              <>
                {/* <div aria-label={`${intl.formatMessage({ id: 'settings.city.info' }, { count: citySettings.length })}: ${cityString}`} className={classes.infoContainer}> */}
                <Typography aria-hidden className={`${classes.infoText} ${classes.bold}`}>
                  <FormattedMessage id="settings.city.info" values={{ count: citySettings.length }} />
                  {':'}
                &nbsp;
                </Typography>
                <Typography aria-hidden className={classes.infoText}>
                  {cityString}
                </Typography>
                {/* </div> */}
              </>
            ) : null}
          </div>
          <div style={{ display: 'flex' }}>
            <ButtonBase disabled={!selectedList.length} onClick={() => setSelectedOpen(!selectedOpen)} style={{ display: 'flex' }}>
              <Typography
                style={{
                  paddingLeft: 16, paddingRight: 8, fontWeight: 'bold', color: '#fff',
                }}
                variant="body2"
              >
                {`Olet tehnyt (${selectedList.length}) valintaa`}
              </Typography>
              {selectedOpen ? <ArrowDropDown style={{ color: '#fff' }} /> : <ArrowDropUp style={{ color: '#fff' }} />}
            </ButtonBase>
            {selectedList.length ? (
              <ButtonBase disabled={!selectedList.length} onClick={() => setSelected([])} style={{ display: 'flex', marginLeft: 'auto' }}>
                <Typography style={{ paddingRight: 16, color: '#fff' }} variant="body2">
                Poista kaikki valinnat
                </Typography>
              </ButtonBase>
            ) : null}
          </div>
        </>
        <Collapse in={selectedOpen}>
          <List>
            {selectedList.map(item => (
              item.name && (
              <ListItem>
                <Typography style={{ color: '#fff' }} variant="body2">
                  {item.name.fi}
                </Typography>
                <ButtonBase onClick={() => handleCheckboxClick(null, item)} style={{ marginLeft: 'auto' }}>
                  <Typography style={{ color: '#fff' }} variant="body2">
                  Poista
                  </Typography>
                </ButtonBase>
              </ListItem>
              )
            ))}
          </List>
        </Collapse>
        <SMButton
          disabled={!selectedList.length}
          onClick={() => {
            setTreeState({ selected: selectedList, opened });
            navigator.push('search', { nodes: ids });
          }}
          style={{
            width: 250,
            height: 46,
            borderRadius: 5,
          }}
          margin
        >
          Tee haku
        </SMButton>
      </div>
      <List disablePadding>
        {services && services.map(service => (
          !service.parent && (
            expandingComponent(service, 1)
          )
        ))}
      </List>
    </>
  );
};

export default ServiceTreeView;
