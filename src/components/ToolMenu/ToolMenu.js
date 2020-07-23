import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Build, Code } from '@material-ui/icons';
import { useLocation } from 'react-router-dom';
import URI from 'URIjs';
import { intlShape } from 'react-intl';
import PaperButton from '../PaperButton';
import SimpleListItem from '../ListItems/SimpleListItem';
import DrawerButton from '../DrawerMenu/DrawerButton';

const ToolMenu = ({
  classes, drawer, intl, mapUtility, navigator,
}) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Open embedderView
  const openEmbedder = () => {
    if (!navigator || !mapUtility) {
      return;
    }
    const pathname = location.pathname.split('/');
    pathname.splice(2, 0, 'embedder');

    const uri = URI(window.location);
    const search = uri.search(true);
    if (!search.bbox) {
      search.bbox = mapUtility.getBbox();
    }
    uri.search(search);

    const newLocation = {
      ...location,
      pathname: pathname.join('/'),
      search: uri.search(),
    };

    navigator.push(newLocation);
  };

  const menuItems = [
    {
      key: 'embedder.title',
      text: intl.formatMessage({ id: 'embedder.title' }),
      icon: <Code />,
      onClick: () => {
        openEmbedder();
      },
      srText: intl.formatMessage({ id: 'general.open' }),
    },
  ];

  const openToolMenu = () => {
    setOpen(!open);
  };

  const renderMenu = () => {
    if (!open) {
      return null;
    }

    const listClass = `${drawer ? classes.menuContainerDrawer : classes.menuContainer} ${drawer ? classes.fullWidth : ''}`;

    return (
      <div>
        <ul className={listClass}>
          {
            menuItems.map(v => (
              <SimpleListItem
                key={v.key}
                dark={drawer}
                icon={v.icon}
                button
                handleItemClick={v.onClick}
                srText={v.srText}
                text={v.text}
              />
            ))
          }
        </ul>
      </div>
    );
  };

  return (
    <>
      {
        drawer ? (
          <DrawerButton
            active={open}
            disableRipple
            icon={<Build />}
            isOpen
            text={intl.formatMessage({ id: 'general.tools' })}
            onClick={openToolMenu}
          />
        ) : (
          <PaperButton
            messageID="general.tools"
            icon={<Build />}
            noBorder
            onClick={openToolMenu}
          />
        )
      }
      {
        renderMenu()
      }
    </>
  );
};

ToolMenu.propTypes = {
  classes: PropTypes.shape({
    menuContainer: PropTypes.string,
  }).isRequired,
  drawer: PropTypes.bool,
  intl: intlShape.isRequired,
  mapUtility: PropTypes.shape({
    getBbox: PropTypes.func,
  }),
  navigator: PropTypes.shape({
    push: PropTypes.func,
  }),
};

ToolMenu.defaultProps = {
  drawer: false,
  mapUtility: null,
  navigator: null,
};

export default ToolMenu;
