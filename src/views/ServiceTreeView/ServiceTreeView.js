import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  List, ListItem, Collapse, Checkbox, Typography, ButtonBase, NoSsr, Divider,
} from '@material-ui/core';
import {
  ArrowDropUp, ArrowDropDown, Search, Cancel,
} from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import config from '../../../config';
import SMButton from '../../components/ServiceMapButton';
import { checkParents } from '../../redux/selectors/serviceTree';

const ServiceTreeView = (props) => {
  const {
    classes,
    navigator,
    intl,
    serviceTree,
    settings,
    getLocaleText,
    fetchServiceTreeUnits,
    fetchRootNodes,
    fetchBranchNodes,
    setTreeSelected,
    addOpenedNode,
    removeOpenedNode,
  } = props;

  const { // Service tree state from redux
    services, selected, opened, fetching, fetched,
  } = serviceTree.serviceTree;

  const { isFetching } = serviceTree.serviceTreeUnits;

  const [selectedOpen, setSelectedOpen] = useState(false);
  const prevOpenedNodesRef = useRef([]);

  let citySettings = [];
  config.cities.forEach((city) => {
    citySettings.push(...settings.cities[city] ? [city] : []);
  });

  if (citySettings.length === config.cities.length) {
    citySettings = [];
  }

  const checkChildNodes = (node, nodes = []) => {
    // Find all known child nodes, so they can be selected when the parent checkbox is selected
    if (services.find(service => node.children.includes(service.id))) {
      const nodeObjects = node.children.map(child => services.find(e => e.id === child));
      nodes.push(...node.children);
      // Repeat this on child node childs
      nodeObjects.forEach((i) => {
        nodes.push(...checkChildNodes(i));
      });
      return nodes;
    }
    return [];
  };


  const getSelectedParentNodes = (item, data = []) => {
    if (item.parent) {
      const parentNode = services.find(node => node.id === item.parent);
      if (selected.includes(item.parent) && parentNode.name) {
        data.push(item.parent);
        if (parentNode.parent) {
          getSelectedParentNodes(parentNode, data);
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
      child = services.find(e => e.id === item);
    }
    if (child && child.children) {
      data.push(...child.children);
      child.children.forEach((c) => {
        getSelectedChildNodes(c, data);
      });
    } return data;
  };

  const handleUnitFetch = (item) => {
    if (fetched.includes(item.id) || checkParents(services, fetched, item.id)) return;
    fetchServiceTreeUnits({ service_node: item.id });
  };


  const handleExpand = (service, isOpen) => {
    if (isOpen) { // Close expanded item
      removeOpenedNode(service.id);
    } else if (services.some(e => e.parent === service.id)) { // Expand item without fetching
      addOpenedNode(service.id);
    } else { // Fetch all child nodes then expand
      fetchBranchNodes(service);
    }
  };

  const handleCheckboxClick = (e, item) => {
    // If checbox is already checked, remove checkbox selections
    if (selected.includes(item.id)) {
      const parentsToRemove = getSelectedParentNodes(item);
      const childrenToRemove = getSelectedChildNodes(item);
      const nodesToRemove = [...parentsToRemove, ...childrenToRemove];
      // Remove nodes from selected state
      if (nodesToRemove.length) {
        setTreeSelected(
          selected.filter(element => element !== item.id && !nodesToRemove.includes(element)),
        );
      } else {
        setTreeSelected(selected.filter(element => element !== item.id));
      }

    // If checbox is not checked, add checkbox selections
    } else {
      // Select all visible child nodes as well
      let newState = [item.id, ...checkChildNodes(item)];

      // If all other sibling nodes are selected too, select parent node as well
      const parent = services.find(service => service.id === item.parent);
      if (parent && parent.children.every(child => [...selected, item.id].includes(child))) {
        newState = [...newState, parent.id];
      }

      // Filter duplicates
      newState = newState.filter(e => !selected.includes(e));
      setTreeSelected([...selected, ...newState]);
      e.stopPropagation();
      // Fetch node units to display on map
      handleUnitFetch(item);
    }
  };

  const drawCheckboxLines = (isOpen, level, id) => {
    const paths = [];
    let strokeColor = '#000';

    if (isOpen) {
      paths.push('M 17 38 V 60');
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
      return <path key={`outerPath${id}`} d="M 17 0 V 31 H 26" stroke="black" fill="transparent" />;
    }
    if (bottom && !currentLast) {
      return <path key={`outerPath${id}`} d="M 17 0 V 60 M 17 31 H 26" stroke="black" fill="transparent" />;
    }
    return <path key={`outerPath${id}`} d="M 17 0 V 60" stroke="black" fill="transparent" />;
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
      fetchRootNodes();
    }
  }, []);

  useEffect(() => {
    /* When node is opened, select child node checkboxes if the parent node checkbox is selected */
    // Find opened node by comparing previous opened list to new one from redux
    const openedNodeID = opened.find(node => !prevOpenedNodesRef.current.includes(node));
    if (selected.includes(openedNodeID) || checkParents(services, selected, openedNodeID)) {
      const openedNode = services.find(node => node.id === openedNodeID);
      setTreeSelected([...selected, ...openedNode.children]);
    }
    // Update previous opened list
    prevOpenedNodesRef.current = opened;
  }, [opened]);


  const expandingComponent = (item, level, last = []) => {
    const hasChildren = item.children.length;
    const isOpen = opened.includes(item.id);
    const children = hasChildren ? services.filter(e => e.parent === item.id) : null;
    const icon = isOpen
      ? <ArrowDropUp className={classes.iconRight} />
      : <ArrowDropDown className={classes.iconRight} />;

    let resultCount = 0;

    if (!citySettings.length || citySettings.length === config.cities.length) {
      resultCount = item.unit_count.total;
    } else {
      config.cities.forEach((city) => {
        resultCount += (settings.cities[city] ? item.unit_count.municipality[city] || 0 : 0);
      });
    }

    const checkboxSrTitle = `${intl.formatMessage({ id: 'services.tree.level' })} ${level + 1} ${getLocaleText(item.name)} ${intl.formatMessage({ id: 'services.category.select' })}`;
    const itemSrTitle = `${getLocaleText(item.name)} (${resultCount}) ${intl.formatMessage({ id: 'services.category.open' })}`;

    const isSelected = selected.includes(item.id);

    // Check if any child or grandchild node is checked, so we can display indeterminate mark.
    const childIsSelected = checkChildNodes(item)
      .some(node => selected.includes(node));

    return (
      <React.Fragment key={item.id}>
        <ListItem
          disableGutters
          className={`${classes.listItem} ${classes[`level${level}`]}`}
        >
          {level > 0 && (drawOuterLines(level, last, item.id))}

          <div className={classes.checkBox}>
            {drawCheckboxLines(isOpen, level, item.id)}
            <Checkbox
              disabled={isFetching}
              className={classes.checkboxPadding}
              inputProps={{ title: checkboxSrTitle }}
              onClick={e => (!isFetching ? handleCheckboxClick(e, item) : null)}
              icon={<span className={`${classes.checkBoxIcon} ${isFetching ? classes.checkBoxDisabled : ''}`} />}
              color="primary"
              checked={isSelected}
              indeterminate={childIsSelected && !isSelected}
            />
          </div>

          <ButtonBase
            aria-expanded={!hasChildren ? null : isOpen}
            className={classes.listClickArea}
            disabled={!hasChildren}
            disableRipple
            disableTouchRipple
            onClick={hasChildren ? () => handleExpand(item, isOpen) : null}
            aria-label={itemSrTitle}
          >
            <Typography align="left" className={classes.text}>
              {fetching.includes(item.id)
                ? <FormattedMessage id="general.loading" />
                : `${getLocaleText(item.name)} (${resultCount})`
              }
            </Typography>
            {hasChildren ? icon : <span className={classes.iconRight} />}
          </ButtonBase>

        </ListItem>

        <Collapse aria-hidden={!isOpen} in={isOpen}>
          {isOpen && children && children.length ? children.map((child, i) => (
            expandingComponent(
              child, // child service node
              level + 1, // child node level
              // If this node is last of its level, add to list (this helps the drawing of lines)
              i + 1 === children.length ? [...last, level] : last,
            )
          )) : null}
        </Collapse>
      </React.Fragment>
    );
  };

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
                : &nbsp;
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
          focusVisibleClassName={classes.selectionFocus}
        >
          <Typography className={`${classes.selectionText} ${classes.bold}`}>
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
            onClick={() => setTreeSelected([])}
            focusVisibleClassName={classes.selectionFocus}
          >
            <Typography className={classes.deleteText}>
              <FormattedMessage id="services.selections.delete.all" />
            </Typography>
            <Cancel className={classes.deleteIcon} />
          </ButtonBase>
        ) : null}
      </div>
      <Divider aria-hidden className={classes.whiteDivider} />

      <Collapse aria-hidden={!selectedOpen} in={selectedOpen}>
        {selectedOpen && (
        <List className={classes.seleectionList} disablePadding>
          {selectedList.map(item => (
            item.name && (
              <ListItem dense key={item.id} disableGutters>
                <Typography className={classes.selectionText} aria-hidden variant="body2">
                  {getLocaleText(item.name)}
                </Typography>
                <ButtonBase
                  className={classes.right}
                  aria-label={intl.formatMessage({ id: 'services.selections.delete.sr' }, { service: getLocaleText(item.name) })}
                  onClick={() => handleCheckboxClick(null, item)}
                  focusVisibleClassName={classes.selectionFocus}
                >
                  <Typography className={classes.deleteText} variant="body2">
                    <FormattedMessage id="services.selections.delete" />
                  </Typography>
                  <Cancel className={classes.deleteIcon} />
                </ButtonBase>
              </ListItem>
            )
          ))}
        </List>
        )}
        {selectedList.length ? <Divider aria-hidden className={classes.whiteDivider} /> : null}
      </Collapse>
    </>
  );

  const renderSearchButton = (selectedList) => {
    const ids = selectedList.map(i => i.id);
    const selectedString = selectedList.map(i => getLocaleText(i.name)).join(', ');

    return (
      <SMButton
        aria-label={selectedList.length
          ? intl.formatMessage({ id: 'services.search.sr.selected' }, { services: selectedString })
          : intl.formatMessage({ id: 'services.search.sr' })}
        margin
        className={classes.searchButton}
        disabled={!selectedList.length}
        icon={<Search />}
        messageID="services.search"
        onClick={() => {
          navigator.push('search', { service_node: ids });
        }}
        role="link"
      />
    );
  };


  // If node's parent is also checked, add only parent to list of selected nodes for search
  const selectedList = [];
  selected.forEach((e) => {
    const node = services.find(item => item.id === e);
    if (!selected.includes(node.parent)) {
      selectedList.push(node);
    }
  });

  return (
    <>
      <div className={classes.topArea}>
        <Typography aria-hidden className={classes.title}><FormattedMessage id="services" /></Typography>
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
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  serviceTree: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  fetchServiceTreeUnits: PropTypes.func.isRequired,
  setTreeSelected: PropTypes.func.isRequired,
  fetchRootNodes: PropTypes.func.isRequired,
  fetchBranchNodes: PropTypes.func.isRequired,
  addOpenedNode: PropTypes.func.isRequired,
  removeOpenedNode: PropTypes.func.isRequired,
};

ServiceTreeView.defaultProps = {
  navigator: null,
};

export default ServiceTreeView;
