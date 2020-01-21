import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  List, ListItem, Collapse, Checkbox, Typography, ButtonBase, NoSsr,
} from '@material-ui/core';
import { ArrowDropUp, ArrowDropDown, Search } from '@material-ui/icons';
import { FormattedMessage, intlShape } from 'react-intl';
import { MobileComponent, DesktopComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import SMButton from '../../components/ServiceMapButton';

const ServiceTreeView = (props) => {
  const {
    classes,
    navigator,
    intl,
    setTreeState,
    prevServices,
    prevSelected,
    prevOpened,
    settings,
    getLocaleText,
  } = props;

  // State
  const [services, setServices] = useState(prevServices);
  const [opened, setOpened] = useState(prevOpened);
  const [selected, setSelected] = useState(prevSelected);
  const [selectedOpen, setSelectedOpen] = useState(false);

  let citySettings = [
    ...settings.helsinki ? ['Helsinki'] : [],
    ...settings.espoo ? ['Espoo'] : [],
    ...settings.vantaa ? ['Vantaa'] : [],
    ...settings.kauniainen ? ['Kauniainen'] : [],
  ];

  if (citySettings.length === 4) {
    citySettings = [];
  }

  const checkChildNodes = (node, nodes = []) => {
    // Find all visible child nodes, so they can be selected when the parent checkbox is selected
    if (services.find(e => e.id === node.children[0])) {
      const nodeObjects = node.children.map(child => services.find(e => e.id === child));
      nodes.push(...nodeObjects);
      // Check if any child nodes are opened to repeat this function on them
      nodeObjects.forEach((i) => {
        if (opened.some(e => e === i.id)) {
          nodes.push(...checkChildNodes(i));
        }
      });
      return nodes;
    }
    return [];
  };

  const fetchRootNodes = () => (
    // Fetch all top level 0 nodes (root nodes)
    fetch('https://api.hel.fi/servicemap/v2/service_node/?level=0&page=1&page_size=100')
      .then(response => response.json())
      .then(data => data.results)
  );

  const setInitialServices = () => {
    // Fetch initially shown service nodes when first entering the pag
    fetchRootNodes()
      .then(data => setServices(data));
  };

  const fetchChildServices = async (service) => {
    // Fetch and set to state the child nodes of the opened node
    fetch(`https://api.hel.fi/servicemap/v2/service_node/?parent=${service}&page=1&page_size=1000`)
      .then(response => response.json())
      .then((data) => {
        setServices([...services, ...data.results]);
        // Expand the opened parent node once the child nodes have been fetched
        setOpened([...opened, service]);
        if (selected.find(e => e.id === service)) {
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
    return [];
  };

  const getSelectedChildNodes = (item, data = []) => {
    // Loop through each checked child node and their checked childs
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
    if (isOpen) { // Close expanded item
      setOpened(opened.filter(e => e !== service.id));
    } else if (services.some(e => e.parent === service.id)) { // Expand item without fetching
      setOpened([...opened, service.id]);
    } else { // Fetch child nodes then expand
      fetchChildServices(service.id);
    }
  };

  const handleCheckboxClick = (e, item) => {
    // If checbox is already checked, remove checkbox selections
    if (selected.some(element => element.id === item.id)) {
      const parentsToRemove = getSelectedParentNodes(item);
      const childrenToRemove = getSelectedChildNodes(item);
      const nodesToRemove = [...parentsToRemove, ...childrenToRemove];
      // Remove nodes from selected state
      if (nodesToRemove.length) {
        setSelected(
          selected.filter(element => element.id !== item.id && !nodesToRemove.includes(element.id)),
        );
      } else {
        setSelected(selected.filter(element => element.id !== item.id));
      }

    // If checbox is not checked, add checkbox selections
    } else {
      // Select all visible child nodes as well
      let newState = [item, ...checkChildNodes(item)];
      // Filter duplicates
      newState = newState.filter(e => !selected.some(i => i.id === e.id));
      setSelected([...selected, ...newState]);
      e.stopPropagation();
    }
  };

  const drawCheckboxLines = (isOpen, level, id) => {
    const paths = [];
    let strokeColor = '#000';

    if (isOpen) {
      paths.push('M 20 38 V 60');
    }
    if (level > 0) {
      strokeColor = '#323232';
      paths.push('M 0 30 H 12');
    }

    const line = paths.join(' ');

    return (
      <svg key={`innerLine${id}`} className={classes.checkBoxLines}>
        <path d={line} stroke={strokeColor} fill="transparent" />
      </svg>
    );
  };

  const generateDrawPath = (last, bottom, i, id) => {
    const currentLast = last.includes(i);
    if (!bottom && currentLast) {
      return null;
    }
    if (bottom && currentLast) {
      return <path key={`outerPath${id}`} d="M 20 0 V 30 H 26" stroke="black" fill="transparent" />;
    }
    if (bottom && !currentLast) {
      return <path key={`outerPath${id}`} d="M 20 0 V 60 M 20 30 H 26" stroke="black" fill="transparent" />;
    }
    return <path key={`outerPath${id}`} d="M 20 0 V 60" stroke="black" fill="transparent" />;
  };

  const drawOuterLines = (level, last, id) => (
    [...Array(level)].map((none, i) => (
      <svg key={`outerLine${level + i}`} className={classes.outerLines}>
        {generateDrawPath(last, level === i + 1, i, id)}
      </svg>
    ))
  );

  useEffect(() => {
    if (!services.length) {
      setInitialServices();
    }
  }, []);

  const expandingComponent = (item, level, last = []) => {
    const hasChildren = item.children.length;
    const isOpen = opened.includes(item.id);
    const children = hasChildren ? services.filter(e => e.parent === item.id) : null;
    const icon = isOpen
      ? <ArrowDropUp className={classes.iconRight} />
      : <ArrowDropDown className={classes.iconRight} />;

    let resultCount;

    if (!citySettings.length || citySettings.length === 4) {
      resultCount = item.unit_count.municipality.helsinki || 0
        + item.unit_count.municipality.espoo || 0
        + item.unit_count.municipality.vantaa || 0
        + item.unit_count.municipality.kauniainen || 0;
    } else {
      resultCount = (settings.helsinki ? item.unit_count.municipality.helsinki || 0 : 0)
      + (settings.espoo ? item.unit_count.municipality.espoo || 0 : 0)
      + (settings.vantaa ? item.unit_count.municipality.vantaa || 0 : 0)
      + (settings.kauniainen ? item.unit_count.municipality.kauniainen || 0 : 0);
    }

    return (
      <div role="listitem" aria-label={getLocaleText(item.name)} key={item.id}>
        <ListItem
          disableGutters
          className={`${classes.listItem} ${classes[`level${level}`]}`}
        >
          {level > 0 && (drawOuterLines(level, last, item.id))}

          <div className={classes.checkBox}>
            {drawCheckboxLines(isOpen, level, item.id)}
            <Checkbox
              onClick={e => handleCheckboxClick(e, item)}
              icon={<span className={classes.checkBoxIcon} />}
              color="primary"
              checked={selected.some(e => e.id === item.id)}
            />
          </div>

          <ButtonBase
            aria-expanded={!hasChildren ? null : isOpen}
            className={classes.listClickArea}
            disabled={!hasChildren}
            disableRipple
            disableTouchRipple
            onClick={hasChildren ? () => handleExpand(item, isOpen) : null}
          >
            <Typography align="left" className={classes.text}>
              {`${getLocaleText(item.name)} (${resultCount})`}
            </Typography>
            {hasChildren ? icon : <span className={classes.iconRight} />}
          </ButtonBase>

        </ListItem>

        <Collapse role="list" aria-hidden={!isOpen} tabIndex={isOpen ? '0' : '-1'} in={isOpen}>
          {children && children.length && children.map((child, i) => (
            expandingComponent(
              child, // child service node
              level + 1, // child node level
              // If this node is last of its level, add to list (this helps the drawing of lines)
              i + 1 === children.length ? [...last, level] : last,
            )
          ))}
        </Collapse>
      </div>
    );
  };

  const TopBar = (
    <div>
      <DesktopComponent>
        <Typography className={classes.title}><FormattedMessage id="services" /></Typography>
      </DesktopComponent>
      <MobileComponent>
        <Typography className={classes.title}><FormattedMessage id="services" /></Typography>
      </MobileComponent>
    </div>
  );


  // Render components:

  const renderServiceNodeList = () => (
    <List role="list" disablePadding>
      {services && services.map(service => (
        !service.parent && (
          expandingComponent(service, 0)
        )
      ))}
    </List>
  );

  const renderSelectedCities = () => {
    const cityString = citySettings.join(', ');
    return (
      <NoSsr>
        <div className={classes.infoContainer}>
          {citySettings.length ? (
            <>
              <Typography className={`${classes.infoText} ${classes.bold}`}>
                <FormattedMessage id="settings.city.info" values={{ count: citySettings.length }} />
                {':'}
                &nbsp;
              </Typography>
              <Typography className={classes.infoText}>
                {cityString}
              </Typography>
            </>
          ) : null}
        </div>
      </NoSsr>
    );
  };

  const renderSelectionList = selectedList => (
    <>
      <div className={classes.infoContainer}>
        <ButtonBase
          aria-expanded={selectedOpen}
          disabled={!selectedList.length}
          onClick={() => setSelectedOpen(!selectedOpen)}
          className={classes.selectionsButton}
        >
          <Typography className={`${classes.selectionText} ${classes.bold}`} variant="body2">
            <FormattedMessage id="services.selections" values={{ count: selectedList.length }} />
          </Typography>
          {selectedOpen
            ? <ArrowDropUp className={classes.white} />
            : <ArrowDropDown className={classes.white} />}
        </ButtonBase>

        {selectedList.length ? (
          <ButtonBase
            className={classes.right}
            disabled={!selectedList.length}
            onClick={() => setSelected([])}
          >
            <Typography className={classes.deleteText} variant="body2">
              <FormattedMessage id="services.selections.delete.all" />
            </Typography>
          </ButtonBase>
        ) : null}
      </div>

      <Collapse aria-hidden={!selectedOpen} tabIndex={selectedOpen ? '0' : '-1'} in={selectedOpen}>
        <List disablePadding>
          {selectedList.map(item => (
            item.name && (
              <ListItem key={item.id} disableGutters>
                <Typography className={classes.selectionText} aria-hidden variant="body2">
                  {getLocaleText(item.name)}
                </Typography>
                <ButtonBase
                  className={classes.right}
                  aria-label={intl.formatMessage({ id: 'services.selections.delete.sr' }, { service: getLocaleText(item.name) })}
                  onClick={() => handleCheckboxClick(null, item)}
                >
                  <Typography className={classes.deleteText} variant="body2">
                    <FormattedMessage id="services.selections.delete" />
                  </Typography>
                </ButtonBase>
              </ListItem>
            )
          ))}
        </List>
      </Collapse>
    </>
  );

  const renderSearchButton = (selectedList) => {
    const ids = selectedList.map(i => i.id);
    const selectedString = selectedList.map(i => getLocaleText(i.name)).join(', ');
    return (
      <SMButton
        margin
        className={classes.searchButton}
        disabled={!selectedList.length}
        icon={<Search />}
        messageID="services.search"
        srText={selectedList.length
          ? intl.formatMessage({ id: 'services.search.sr.selected' }, { services: selectedString })
          : intl.formatMessage({ id: 'services.search.sr' })}
        onClick={() => {
          setTreeState({ services, selected, opened });
          navigator.push('search', { nodes: ids });
        }}
      />
    );
  };


  // If node's parent is also checked, add only parent to list of selected nodes for search
  const selectedList = [];
  selected.forEach((e) => {
    if (!selected.some(i => i.id === e.parent)) {
      selectedList.push(e);
    }
  });

  return (
    <>
      <div className={classes.topArea}>
        {TopBar}
        {renderSelectedCities()}
        {renderSelectionList(selectedList)}
      </div>
      <div className={classes.mainContent}>
        {renderSearchButton(selectedList)}
        {renderServiceNodeList()}
      </div>
    </>
  );
};

ServiceTreeView.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  intl: intlShape.isRequired,
  setTreeState: PropTypes.func.isRequired,
  prevServices: PropTypes.arrayOf(PropTypes.any),
  prevSelected: PropTypes.arrayOf(PropTypes.any),
  prevOpened: PropTypes.arrayOf(PropTypes.any),
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
};

ServiceTreeView.defaultProps = {
  navigator: null,
  prevServices: [],
  prevSelected: [],
  prevOpened: [],
};

export default ServiceTreeView;
